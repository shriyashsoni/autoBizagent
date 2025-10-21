import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import type { Workflow, WorkflowStep } from "@/lib/db/types"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data: workflows, error } = await supabase
      .from("workflows")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    return NextResponse.json({ workflows: workflows as Workflow[] })
  } catch (error) {
    console.error("[v0] Error fetching workflows:", error)
    return NextResponse.json({ error: "Failed to fetch workflows" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()
    const { leadId } = body

    if (!leadId) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 })
    }

    const initialSteps: WorkflowStep[] = [
      {
        name: "Parse Email",
        status: "pending",
        message: "Waiting to extract lead data from email",
        timestamp: new Date().toISOString(),
      },
      {
        name: "Update CRM",
        status: "pending",
        message: "Waiting to create contact in HubSpot",
        timestamp: new Date().toISOString(),
      },
      {
        name: "Schedule Meeting",
        status: "pending",
        message: "Waiting to create calendar event",
        timestamp: new Date().toISOString(),
      },
      {
        name: "Create Notion Note",
        status: "pending",
        message: "Waiting to create meeting notes",
        timestamp: new Date().toISOString(),
      },
      {
        name: "Notify Team",
        status: "pending",
        message: "Waiting to post Slack notification",
        timestamp: new Date().toISOString(),
      },
    ]

    const { data: newWorkflow, error } = await supabase
      .from("workflows")
      .insert({
        lead_id: leadId,
        status: "pending",
        current_step: 0,
        total_steps: 5,
        steps: initialSteps,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    await supabase.from("activities").insert({
      lead_id: leadId,
      workflow_id: newWorkflow.id,
      type: "workflow_created",
      description: "Workflow created and queued for execution",
    })

    console.log("[v0] Created new workflow:", newWorkflow)

    return NextResponse.json({ workflow: newWorkflow as Workflow }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating workflow:", error)
    return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 })
  }
}
