import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import type { Activity } from "@/lib/db/types"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data: activities, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    return NextResponse.json({ activities: activities as Activity[] })
  } catch (error) {
    console.error("[v0] Error fetching activities:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}
