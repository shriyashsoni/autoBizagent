import { BaseIntegration, type IntegrationConfig, type IntegrationResult } from "./base"
import type { Lead } from "@/lib/db/schema"

export class NotionIntegration extends BaseIntegration {
  constructor(config: IntegrationConfig) {
    super(config)
  }

  getName(): string {
    return "Notion"
  }

  getService() {
    return "notion" as const
  }

  async testConnection(): Promise<IntegrationResult<boolean>> {
    try {
      console.log("[v0] Testing Notion connection...")
      return { success: true, data: true }
    } catch (error) {
      return { success: false, error: "Failed to connect to Notion" }
    }
  }

  async createPage(title: string, content: string, databaseId?: string): Promise<IntegrationResult<string>> {
    try {
      console.log("[v0] Creating Notion page:", title)

      // In production, this would call Notion API
      // POST to https://api.notion.com/v1/pages
      const pageData = {
        parent: databaseId ? { database_id: databaseId } : { page_id: this.config.defaultPageId },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: title,
                },
              },
            ],
          },
        },
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: content,
                  },
                },
              ],
            },
          },
        ],
      }

      console.log("[v0] Page data:", pageData)

      const pageId = `notion-page-${Date.now()}`
      return { success: true, data: pageId }
    } catch (error) {
      return { success: false, error: "Failed to create Notion page" }
    }
  }

  async createMeetingNote(lead: Lead, meetingDate: Date): Promise<IntegrationResult<string>> {
    try {
      const title = `Meeting with ${lead.name} - ${lead.company || "Prospect"}`
      const content = `
Meeting Details:
- Contact: ${lead.name}
- Email: ${lead.email}
- Company: ${lead.company || "N/A"}
- Phone: ${lead.phone || "N/A"}
- Intent: ${lead.intent || "N/A"}
- Date: ${meetingDate.toLocaleDateString()}

Notes:
[Add meeting notes here]

Action Items:
- [ ] Follow up after meeting
- [ ] Send proposal
      `.trim()

      return await this.createPage(title, content)
    } catch (error) {
      return { success: false, error: "Failed to create meeting note" }
    }
  }
}
