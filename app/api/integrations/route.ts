import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Integration } from "@/lib/db/types"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: integrations, error } = await supabase.from("integrations").select("*").order("name")

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    return NextResponse.json({ integrations: integrations as Integration[] })
  } catch (error) {
    console.error("[v0] Error fetching integrations:", error)
    return NextResponse.json({ error: "Failed to fetch integrations" }, { status: 500 })
  }
}
