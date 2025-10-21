// Base integration interface and types

export type IntegrationService = "gmail" | "hubspot" | "calendar" | "notion" | "slack"

export type IntegrationConfig = {
  apiKey?: string
  apiSecret?: string
  accessToken?: string
  refreshToken?: string
  [key: string]: any
}

export type IntegrationResult<T = any> = {
  success: boolean
  data?: T
  error?: string
}

export abstract class BaseIntegration {
  protected config: IntegrationConfig

  constructor(config: IntegrationConfig) {
    this.config = config
  }

  abstract testConnection(): Promise<IntegrationResult<boolean>>
  abstract getName(): string
  abstract getService(): IntegrationService
}
