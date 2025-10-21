import { NextResponse } from "next/server"
import { getAgent } from "@/lib/agent/autonomous-agent"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { checkInterval = 5, autoExecuteWorkflows = true } = body

    // Get agent config from database or use defaults
    const supabase = await createServerClient()
    const { data: config } = await supabase.from("integrations").select("*").eq("service", "agent_config").single()

    const agentConfig = {
      enabled: true,
      checkInterval,
      autoExecuteWorkflows,
      emailFilters: config?.settings?.emailFilters || {},
    }

    const agent = getAgent(agentConfig)
    await agent.start()

    // Log activity
    await supabase.from("activities").insert({
      type: "agent_started",
      description: "Autonomous AI Agent started",
      metadata: { config: agentConfig },
    })

    return NextResponse.json({
      success: true,
      message: "Agent started successfully",
      status: agent.getStatus(),
    })
  } catch (error) {
    console.error("[v0] Error starting agent:", error)
    return NextResponse.json({ success: false, error: "Failed to start agent" }, { status: 500 })
  }
}
