import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import type { Workflow } from "@/lib/db/types"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerClient()

    const { data: workflow, error } = await supabase.from("workflows").select("*").eq("id", id).single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ workflow: workflow as Workflow })
  } catch (error) {
    console.error("[v0] Error fetching workflow:", error)
    return NextResponse.json({ error: "Failed to fetch workflow" }, { status: 500 })
  }
}
