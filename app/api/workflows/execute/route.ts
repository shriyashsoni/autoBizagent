import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { executeWorkflow } from "@/lib/workflow/orchestrator"
import type { Workflow, Lead } from "@/lib/db/types"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { workflowId, leadId } = body

    if (!workflowId || !leadId) {
      return NextResponse.json({ error: "Workflow ID and Lead ID are required" }, { status: 400 })
    }

    console.log("[v0] Executing workflow:", workflowId, "for lead:", leadId)

    const { data: lead, error: leadError } = await supabase.from("leads").select("*").eq("id", leadId).single()

    if (leadError || !lead) {
      console.error("[v0] Lead not found:", leadError)
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    const { data: workflow, error: workflowError } = await supabase
      .from("workflows")
      .select("*")
      .eq("id", workflowId)
      .single()

    if (workflowError || !workflow) {
      console.error("[v0] Workflow not found:", workflowError)
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    const completedWorkflow = await executeWorkflow(workflow as Workflow, lead as Lead, supabase)

    return NextResponse.json({ workflow: completedWorkflow })
  } catch (error) {
    console.error("[v0] Error executing workflow:", error)
    return NextResponse.json({ error: "Failed to execute workflow" }, { status: 500 })
  }
}
