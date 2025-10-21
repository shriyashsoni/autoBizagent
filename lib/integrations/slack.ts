import { BaseIntegration, type IntegrationConfig, type IntegrationResult } from "./base"
import type { Lead } from "@/lib/db/schema"

export class SlackIntegration extends BaseIntegration {
  constructor(config: IntegrationConfig) {
    super(config)
  }

  getName(): string {
    return "Slack"
  }

  getService() {
    return "slack" as const
  }

  async testConnection(): Promise<IntegrationResult<boolean>> {
    try {
      console.log("[v0] Testing Slack connection...")
      return { success: true, data: true }
    } catch (error) {
      return { success: false, error: "Failed to connect to Slack" }
    }
  }

  async postMessage(channel: string, text: string, blocks?: any[]): Promise<IntegrationResult<string>> {
    try {
      console.log("[v0] Posting to Slack channel:", channel)
      console.log("[v0] Message:", text)

      // In production, this would call Slack API
      // POST to https://slack.com/api/chat.postMessage
      const messageData = {
        channel,
        text,
        blocks,
      }

      console.log("[v0] Message data:", messageData)

      const messageTs = `${Date.now()}.123456`
      return { success: true, data: messageTs }
    } catch (error) {
      return { success: false, error: "Failed to post Slack message" }
    }
  }

  async notifyNewLead(lead: Lead, channel = "#sales"): Promise<IntegrationResult<string>> {
    try {
      const blocks = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "New Lead Alert",
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Name:*\n${lead.name}`,
            },
            {
              type: "mrkdwn",
              text: `*Company:*\n${lead.company || "N/A"}`,
            },
            {
              type: "mrkdwn",
              text: `*Email:*\n${lead.email}`,
            },
            {
              type: "mrkdwn",
              text: `*Status:*\n${lead.status}`,
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Intent:* ${lead.intent || "N/A"}`,
          },
        },
      ]

      return await this.postMessage(channel, `New lead: ${lead.name} from ${lead.company || "unknown company"}`, blocks)
    } catch (error) {
      return { success: false, error: "Failed to notify about new lead" }
    }
  }

  async notifyWorkflowComplete(leadName: string, channel = "#sales"): Promise<IntegrationResult<string>> {
    try {
      const text = `Workflow completed for ${leadName}. All steps executed successfully!`
      return await this.postMessage(channel, text)
    } catch (error) {
      return { success: false, error: "Failed to notify about workflow completion" }
    }
  }
}
