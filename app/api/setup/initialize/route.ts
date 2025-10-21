import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createServerClient()

    // Create leads table
    await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS leads (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL,
          name TEXT NOT NULL,
          company TEXT,
          phone TEXT,
          source TEXT DEFAULT 'manual',
          status TEXT DEFAULT 'new',
          priority TEXT DEFAULT 'medium',
          notes TEXT,
          metadata JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
    })

    // Create workflows table
    await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS workflows (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
          status TEXT DEFAULT 'pending',
          current_step INTEGER DEFAULT 0,
          total_steps INTEGER DEFAULT 5,
          steps JSONB,
          error TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          completed_at TIMESTAMPTZ
        );
      `,
    })

    // Create activities table
    await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS activities (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
          workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          description TEXT NOT NULL,
          metadata JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
    })

    // Create integrations table
    await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS integrations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL UNIQUE,
          type TEXT NOT NULL,
          status TEXT DEFAULT 'disconnected',
          config JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
    })

    // Insert sample data
    const { data: existingLeads } = await supabase.from("leads").select("id").limit(1)

    if (!existingLeads || existingLeads.length === 0) {
      // Insert sample leads
      await supabase.from("leads").insert([
        {
          email: "john@techcorp.com",
          name: "John Smith",
          company: "TechCorp Inc",
          phone: "+1-555-0123",
          source: "email",
          status: "new",
          priority: "high",
          notes: "Interested in enterprise plan",
        },
        {
          email: "sarah@startup.io",
          name: "Sarah Johnson",
          company: "Startup.io",
          source: "website",
          status: "contacted",
          priority: "medium",
        },
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error initializing database:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
