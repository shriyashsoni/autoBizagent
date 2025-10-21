import type { Workflow, WorkflowStep, Lead } from "@/lib/db/schema"
import { GmailIntegration } from "@/lib/integrations/gmail"
import { HubSpotIntegration } from "@/lib/integrations/hubspot"
import { GoogleCalendarIntegration } from "@/lib/integrations/calendar"
import { NotionIntegration } from "@/lib/integrations/notion"
import { SlackIntegration } from "@/lib/integrations/slack"
import { parseEmailWithAI, generateIntroEmail } from "@/lib/ai/email-parser"

export class WorkflowOrchestrator {
  private workflow: Workflow
  private lead: Lead

  constructor(workflow: Workflow, lead: Lead) {
    this.workflow = workflow
    this.lead = lead
  }

  async execute(): Promise<Workflow> {
    console.log("[v0] Starting workflow execution for lead:", this.lead.id)

    this.workflow.status = "in_progress"
    this.workflow.started_at = new Date().toISOString()

    for (let i = 0; i < this.workflow.steps.length; i++) {
      const step = this.workflow.steps[i]

      try {
        console.log(`[v0] Executing step ${i + 1}/${this.workflow.steps.length}: ${step.name}`)

        step.status = "in_progress"
        step.started_at = new Date().toISOString()
        this.workflow.current_step = i + 1

        const result = await this.executeStep(step)

        if (result.success) {
          step.status = "completed"
          step.result = result.data
          step.completed_at = new Date().toISOString()
          console.log(`[v0] Step ${step.name} completed successfully`)
        } else {
          step.status = "failed"
          step.error = result.error || "Unknown error"
          console.error(`[v0] Step ${step.name} failed:`, result.error)

          // Continue with other steps even if one fails
          // In production, you might want to implement retry logic or stop execution
        }
      } catch (error) {
        step.status = "failed"
        step.error = error instanceof Error ? error.message : "Unknown error"
        console.error(`[v0] Error executing step ${step.name}:`, error)
      }

      // Small delay between steps
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // Check if all steps completed successfully
    const allCompleted = this.workflow.steps.every((s) => s.status === "completed")
    this.workflow.status = allCompleted ? "completed" : "failed"
    this.workflow.completed_at = new Date().toISOString()

    console.log("[v0] Workflow execution finished. Status:", this.workflow.status)

    return this.workflow
  }

  private async executeStep(step: WorkflowStep): Promise<{ success: boolean; data?: any; error?: string }> {
    // Mock config - in production, fetch from database
    const mockConfig = {
      apiKey: "mock-api-key",
      accessToken: "mock-access-token",
    }

    switch (step.service) {
      case "gmail":
        return await this.executeGmailStep(step, mockConfig)

      case "hubspot":
        return await this.executeHubSpotStep(step, mockConfig)

      case "calendar":
        return await this.executeCalendarStep(step, mockConfig)

      case "notion":
        return await this.executeNotionStep(step, mockConfig)

      case "slack":
        return await this.executeSlackStep(step, mockConfig)

      default:
        return { success: false, error: `Unknown service: ${step.service}` }
    }
  }

  private async executeGmailStep(step: WorkflowStep, config: any) {
    const gmail = new GmailIntegration(config)

    switch (step.action) {
      case "extract_lead_data":
        if (this.lead.raw_email_content) {
          const parsed = await parseEmailWithAI(this.lead.raw_email_content, this.lead.email)
          return { success: true, data: parsed }
        }
        return { success: true, data: { message: "No email content to parse" } }

      case "send_intro_email":
        const emailBody = await generateIntroEmail({
          name: this.lead.name,
          email: this.lead.email,
          company: this.lead.company,
          phone: this.lead.phone,
          intent: this.lead.intent || "general inquiry",
          urgency: "medium",
        })

        const result = await gmail.sendEmail(this.lead.email, "Thanks for reaching out!", emailBody)
        return result

      default:
        return { success: false, error: `Unknown Gmail action: ${step.action}` }
    }
  }

  private async executeHubSpotStep(step: WorkflowStep, config: any) {
    const hubspot = new HubSpotIntegration(config)

    switch (step.action) {
      case "create_contact":
        return await hubspot.createContact(this.lead)

      case "update_contact":
        if (step.result?.contactId) {
          return await hubspot.updateContact(step.result.contactId, this.lead)
        }
        return { success: false, error: "No contact ID available" }

      default:
        return { success: false, error: `Unknown HubSpot action: ${step.action}` }
    }
  }

  private async executeCalendarStep(step: WorkflowStep, config: any) {
    const calendar = new GoogleCalendarIntegration(config)

    switch (step.action) {
      case "create_event":
        // Find next available slot (tomorrow at 10 AM for demo)
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(10, 0, 0, 0)

        const endTime = new Date(tomorrow)
        endTime.setMinutes(endTime.getMinutes() + 30)

        return await calendar.createEvent({
          title: `Meeting with ${this.lead.name}`,
          description: `Discussion about: ${this.lead.intent || "general inquiry"}`,
          startTime: tomorrow,
          endTime: endTime,
          attendees: [this.lead.email],
          location: "Google Meet",
        })

      default:
        return { success: false, error: `Unknown Calendar action: ${step.action}` }
    }
  }

  private async executeNotionStep(step: WorkflowStep, config: any) {
    const notion = new NotionIntegration(config)

    switch (step.action) {
      case "create_page":
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return await notion.createMeetingNote(this.lead, tomorrow)

      default:
        return { success: false, error: `Unknown Notion action: ${step.action}` }
    }
  }

  private async executeSlackStep(step: WorkflowStep, config: any) {
    const slack = new SlackIntegration(config)

    switch (step.action) {
      case "post_message":
        return await slack.notifyNewLead(this.lead, "#sales")

      case "notify_completion":
        return await slack.notifyWorkflowComplete(this.lead.name, "#sales")

      default:
        return { success: false, error: `Unknown Slack action: ${step.action}` }
    }
  }
}

export async function executeWorkflow(workflow: Workflow, lead: Lead): Promise<Workflow> {
  const orchestrator = new WorkflowOrchestrator(workflow, lead)
  return await orchestrator.execute()
}
