import { GmailIntegration } from "./gmail"
import { HubSpotIntegration } from "./hubspot"
import { GoogleCalendarIntegration } from "./calendar"
import { NotionIntegration } from "./notion"
import { SlackIntegration } from "./slack"
import type { IntegrationService, IntegrationConfig, BaseIntegration } from "./base"

export class IntegrationFactory {
  static create(service: IntegrationService, config: IntegrationConfig): BaseIntegration {
    switch (service) {
      case "gmail":
        return new GmailIntegration(config)
      case "hubspot":
        return new HubSpotIntegration(config)
      case "calendar":
        return new GoogleCalendarIntegration(config)
      case "notion":
        return new NotionIntegration(config)
      case "slack":
        return new SlackIntegration(config)
      default:
        throw new Error(`Unknown integration service: ${service}`)
    }
  }

  static async testIntegration(service: IntegrationService, config: IntegrationConfig): Promise<boolean> {
    try {
      const integration = IntegrationFactory.create(service, config)
      const result = await integration.testConnection()
      return result.success
    } catch (error) {
      console.error(`[v0] Error testing ${service} integration:`, error)
      return false
    }
  }
}
