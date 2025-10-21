import { createServerClient } from "@/lib/supabase/server"
import { parseEmailWithAI } from "@/lib/ai/email-parser"
import { EmailMonitor } from "@/lib/agent/email-monitor"
import { getWorkflowTemplate } from "@/lib/agent/workflow-templates"
import { executeWorkflow } from "@/lib/workflow/orchestrator"
import type { Lead } from "@/lib/db/types"

export interface AgentConfig {
  enabled: boolean
  checkInterval: number
  autoExecuteWorkflows: boolean
  emailFilters: {
    includeLabels?: string[]
    excludeLabels?: string[]
    fromDomains?: string[]
  }
}

export class AutonomousAgent {
  private config: AgentConfig
  private isRunning = false
  private lastCheckTime: Date | null = null
  private intervalId: NodeJS.Timeout | null = null

  constructor(config: AgentConfig) {
    this.config = config
  }

  async start() {
    if (this.isRunning) {
      console.log("[v0] Agent is already running")
      return
    }

    console.log("[v0] Starting Autonomous AI Agent...")
    this.isRunning = true

    // Run immediately on start
    await this.runCycle()

    // Then run on interval
    const intervalMs = this.config.checkInterval * 60 * 1000
    this.intervalId = setInterval(() => {
      if (this.isRunning) {
        this.runCycle()
      }
    }, intervalMs)
  }

  stop() {
    console.log("[v0] Stopping Autonomous AI Agent...")
    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  async runCycle() {
    console.log("[v0] Agent cycle starting at", new Date().toISOString())

    try {
      const supabase = await createServerClient()

      // Step 1: Get Gmail integration config
      const { data: gmailIntegration } = await supabase
        .from("integrations")
        .select("*")
        .eq("service", "gmail")
        .eq("status", "connected")
        .single()

      if (!gmailIntegration) {
        console.log("[v0] Gmail integration not configured, skipping cycle")
        return
      }

      // Step 2: Check for new emails
      const emailMonitor = new EmailMonitor({
        gmailApiKey: gmailIntegration.api_key || "",
        gmailAccessToken: gmailIntegration.access_token || "",
        checkInterval: this.config.checkInterval,
        filters: this.config.emailFilters,
      })

      const newEmails = await emailMonitor.fetchNewEmails()
      console.log(`[v0] Found ${newEmails.length} new emails`)

      // Step 3: Process each email
      let processedCount = 0
      for (const email of newEmails) {
        const success = await this.processEmail(email)
        if (success) {
          processedCount++
          await emailMonitor.markAsProcessed(email.id)
        }
      }

      // Step 4: Log activity
      await supabase.from("activities").insert({
        type: "agent_activity",
        description: `Agent cycle complete: ${processedCount}/${newEmails.length} emails processed`,
        metadata: {
          action: "cycle_complete",
          emailsFound: newEmails.length,
          emailsProcessed: processedCount,
          timestamp: new Date().toISOString(),
        },
      })

      this.lastCheckTime = new Date()
      console.log("[v0] Agent cycle complete")
    } catch (error) {
      console.error("[v0] Error in agent cycle:", error)

      const supabase = await createServerClient()
      await supabase.from("activities").insert({
        type: "agent_activity",
        description: "Agent cycle error",
        metadata: {
          action: "cycle_error",
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      })
    }
  }

  private async processEmail(email: any): Promise<boolean> {
    console.log("[v0] Processing email:", email.id)

    try {
      const supabase = await createServerClient()

      // Step 1: Parse email with AI
      const parsedLead = await parseEmailWithAI(email.body, email.from)
      console.log("[v0] Parsed lead:", parsedLead)

      // Step 2: Check if lead already exists
      const { data: existingLead } = await supabase.from("leads").select("*").eq("email", parsedLead.email).single()

      if (existingLead) {
        console.log("[v0] Lead already exists, skipping")
        return false
      }

      // Step 3: Create lead in database
      const { data: newLead, error: leadError } = await supabase
        .from("leads")
        .insert({
          name: parsedLead.name,
          email: parsedLead.email,
          company: parsedLead.company,
          phone: parsedLead.phone,
          status: "new",
          source: "email",
          intent: parsedLead.intent,
          raw_email_content: email.body,
        })
        .select()
        .single()

      if (leadError || !newLead) {
        console.error("[v0] Failed to create lead:", leadError)
        return false
      }

      console.log("[v0] Created new lead:", newLead.id)

      // Step 4: Log lead creation activity
      await supabase.from("activities").insert({
        lead_id: newLead.id,
        type: "lead_created",
        description: `New lead created from email: ${parsedLead.name}`,
        metadata: {
          email_id: email.id,
          source: "autonomous_agent",
          urgency: parsedLead.urgency,
        },
      })

      // Step 5: Create and execute workflow if auto-execute is enabled
      if (this.config.autoExecuteWorkflows) {
        await this.createAndExecuteWorkflow(newLead, parsedLead.urgency)
      }

      return true
    } catch (error) {
      console.error("[v0] Error processing email:", error)
      return false
    }
  }

  private async createAndExecuteWorkflow(lead: Lead, urgency: string) {
    console.log("[v0] Creating workflow for lead:", lead.id)

    const supabase = await createServerClient()

    // Get appropriate workflow template based on lead characteristics
    const template = getWorkflowTemplate(urgency, lead.company || undefined)

    const steps = template.steps.map((step) => ({
      ...step,
      status: "pending" as const,
    }))

    // Create workflow in database
    const { data: workflow, error: workflowError } = await supabase
      .from("workflows")
      .insert({
        lead_id: lead.id,
        name: `${template.name} - ${lead.name}`,
        status: "pending",
        steps: steps,
        current_step: 0,
        triggered_by: "autonomous_agent",
      })
      .select()
      .single()

    if (workflowError || !workflow) {
      console.error("[v0] Failed to create workflow:", workflowError)
      return
    }

    console.log("[v0] Executing workflow:", workflow.id)

    // Execute workflow
    const updatedWorkflow = await executeWorkflow(workflow, lead)

    // Update workflow in database
    await supabase
      .from("workflows")
      .update({
        status: updatedWorkflow.status,
        steps: updatedWorkflow.steps,
        current_step: updatedWorkflow.current_step,
        started_at: updatedWorkflow.started_at,
        completed_at: updatedWorkflow.completed_at,
      })
      .eq("id", workflow.id)

    console.log("[v0] Workflow execution complete:", updatedWorkflow.status)

    // Log workflow completion
    await supabase.from("activities").insert({
      lead_id: lead.id,
      workflow_id: workflow.id,
      type: "workflow_completed",
      description: `Workflow "${template.name}" completed for ${lead.name}`,
      metadata: {
        workflow_status: updatedWorkflow.status,
        steps_completed: updatedWorkflow.steps.filter((s) => s.status === "completed").length,
        total_steps: updatedWorkflow.steps.length,
      },
    })
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastCheckTime: this.lastCheckTime,
      config: this.config,
    }
  }
}

// Singleton instance
let agentInstance: AutonomousAgent | null = null

export function getAgent(config?: AgentConfig): AutonomousAgent {
  if (!agentInstance && config) {
    agentInstance = new AutonomousAgent(config)
  }
  return agentInstance!
}
