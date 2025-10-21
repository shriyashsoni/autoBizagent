import { NextResponse } from "next/server"
import { getAgent } from "@/lib/agent/autonomous-agent"

export async function POST() {
  try {
    const agent = getAgent()

    if (!agent) {
      return NextResponse.json({ success: false, error: "Agent not initialized" }, { status: 400 })
    }

    // Manually trigger a cycle
    await agent.runCycle()

    return NextResponse.json({
      success: true,
      message: "Agent cycle triggered successfully",
    })
  } catch (error) {
    console.error("[v0] Error triggering agent:", error)
    return NextResponse.json({ success: false, error: "Failed to trigger agent" }, { status: 500 })
  }
}
