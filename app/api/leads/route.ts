import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import type { Lead } from "@/lib/db/types"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data: leads, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    return NextResponse.json({ leads: leads as Lead[] })
  } catch (error) {
    console.error("[v0] Error fetching leads:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()
    const { email, name, company, phone, source, priority, notes, metadata } = body

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    const { data: newLead, error } = await supabase
      .from("leads")
      .insert({
        email,
        name,
        company: company || null,
        phone: phone || null,
        source: source || "manual",
        status: "new",
        priority: priority || "medium",
        notes: notes || null,
        metadata: metadata || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    await supabase.from("activities").insert({
      lead_id: newLead.id,
      type: "lead_created",
      description: `New lead created: ${name}`,
      metadata: { source },
    })

    console.log("[v0] Created new lead:", newLead)

    return NextResponse.json({ lead: newLead as Lead }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating lead:", error)
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 })
  }
}
