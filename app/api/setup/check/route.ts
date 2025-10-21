import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Try to query the leads table to check if it exists
    const { error } = await supabase.from("leads").select("id").limit(1)

    if (error) {
      // Table doesn't exist or there's a permission issue
      console.log("[v0] Database not set up:", error.message)
      return NextResponse.json({ isSetup: false, error: error.message })
    }

    return NextResponse.json({ isSetup: true })
  } catch (error) {
    console.error("[v0] Error checking database setup:", error)
    return NextResponse.json({ isSetup: false }, { status: 500 })
  }
}
