import { NextResponse } from "next/server"
import { parseEmailWithAI } from "@/lib/ai/email-parser"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { emailContent, senderEmail } = body

    if (!emailContent || !senderEmail) {
      return NextResponse.json({ error: "Email content and sender email are required" }, { status: 400 })
    }

    console.log("[v0] Parsing email from:", senderEmail)

    const parsedLead = await parseEmailWithAI(emailContent, senderEmail)

    const { data: newLead, error } = await supabase
      .from("leads")
      .insert({
        email: parsedLead.email,
        name: parsedLead.name,
        company: parsedLead.company || null,
        phone: parsedLead.phone || null,
        source: "email",
        status: "new",
        priority: parsedLead.urgency || "medium",
        notes: parsedLead.intent || null,
        metadata: { raw_email: emailContent },
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    await supabase.from("activities").insert({
      lead_id: newLead.id,
      type: "email_parsed",
      description: `Email parsed and lead created from ${senderEmail}`,
      metadata: { parsed_data: parsedLead },
    })

    console.log("[v0] Parsed and saved lead:", newLead)

    return NextResponse.json({ lead: newLead })
  } catch (error) {
    console.error("[v0] Error parsing email:", error)
    return NextResponse.json({ error: "Failed to parse email" }, { status: 500 })
  }
}
