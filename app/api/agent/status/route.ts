import { NextResponse } from "next/server"
import { getAgent } from "@/lib/agent/autonomous-agent"

export async function GET() {
  try {
    const agent = getAgent()

    if (!agent) {
      return NextResponse.json({
        success: true,
        status: {
          isRunning: false,
          lastCheckTime: null,
          config: null,
        },
      })
    }

    return NextResponse.json({
      success: true,
      status: agent.getStatus(),
    })
  } catch (error) {
    console.error("[v0] Error getting agent status:", error)
    return NextResponse.json({ success: false, error: "Failed to get agent status" }, { status: 500 })
  }
}
