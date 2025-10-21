import { NextResponse } from "next/server"
import { getAgent } from "@/lib/agent/autonomous-agent"
import { createServerClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const agent = getAgent()

    if (!agent) {
      return NextResponse.json({ success: false, error: "Agent not initialized" }, { status: 400 })
    }

    agent.stop()

    // Log activity
    const supabase = await createServerClient()
    await supabase.from("activities").insert({
      type: "agent_stopped",
      description: "Autonomous AI Agent stopped",
    })

    return NextResponse.json({
      success: true,
      message: "Agent stopped successfully",
    })
  } catch (error) {
    console.error("[v0] Error stopping agent:", error)
    return NextResponse.json({ success: false, error: "Failed to stop agent" }, { status: 500 })
  }
}
