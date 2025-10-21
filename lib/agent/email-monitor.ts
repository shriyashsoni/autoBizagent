import { createServerClient } from "@/lib/supabase/server"

export interface EmailMonitorConfig {
  gmailApiKey: string
  gmailAccessToken: string
  checkInterval: number
  filters: {
    labels?: string[]
    fromDomains?: string[]
    keywords?: string[]
  }
}

export class EmailMonitor {
  private config: EmailMonitorConfig

  constructor(config: EmailMonitorConfig) {
    this.config = config
  }

  async fetchNewEmails(): Promise<any[]> {
    console.log("[v0] Fetching new emails from Gmail API...")

    try {
      // In production, this would use the Gmail API
      // For now, we'll simulate email fetching

      const supabase = await createServerClient()

      // Get the last check time from database
      const { data: lastCheck } = await supabase
        .from("activities")
        .select("created_at")
        .eq("type", "agent_activity")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      const lastCheckTime = lastCheck?.created_at || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

      console.log("[v0] Last check time:", lastCheckTime)

      // Simulate Gmail API response
      // In production, you would call:
      // const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
      //   headers: { Authorization: `Bearer ${this.config.gmailAccessToken}` }
      // })

      const mockEmails = this.generateMockEmails()

      return mockEmails
    } catch (error) {
      console.error("[v0] Error fetching emails:", error)
      return []
    }
  }

  private generateMockEmails() {
    // Generate realistic mock emails for testing
    const templates = [
      {
        from: "john.smith@techcorp.com",
        subject: "Interested in Enterprise Plan",
        body: `Hi there,

I'm John Smith, CTO at TechCorp. We're a 200-person company looking for a business management solution.

We're particularly interested in your enterprise plan and would love to schedule a demo. Our team needs:
- Multi-user access
- Advanced reporting
- API integration
- Priority support

Could we schedule a call this week?

Best regards,
John Smith
CTO, TechCorp
john.smith@techcorp.com
+1 (555) 123-4567`,
      },
      {
        from: "sarah.johnson@startup.io",
        subject: "Quick question about pricing",
        body: `Hello,

I'm Sarah Johnson from Startup.io. We're a small team of 10 looking to streamline our operations.

What's the best plan for a growing startup? We need basic CRM and workflow automation.

Thanks!
Sarah`,
      },
      {
        from: "mike.chen@bigcompany.com",
        subject: "Partnership Opportunity",
        body: `Hi,

I'm Mike Chen, Head of Partnerships at BigCompany. We have 5000+ employees and are looking for solutions to recommend to our clients.

This seems urgent as we're finalizing our partner list next week. Can we talk ASAP?

Mike Chen
Head of Partnerships
BigCompany Inc.
mike.chen@bigcompany.com`,
      },
    ]

    // Randomly select one template
    const template = templates[Math.floor(Math.random() * templates.length)]

    return [
      {
        id: `email-${Date.now()}`,
        from: template.from,
        subject: template.subject,
        body: template.body,
        receivedAt: new Date().toISOString(),
        labels: ["INBOX", "UNREAD"],
      },
    ]
  }

  async markAsProcessed(emailId: string) {
    console.log("[v0] Marking email as processed:", emailId)

    // In production, this would update Gmail labels
    // await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`, {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${this.config.gmailAccessToken}` },
    //   body: JSON.stringify({ addLabelIds: ['PROCESSED'] })
    // })
  }
}
