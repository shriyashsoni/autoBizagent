// Constants for the AI Business Manager

export const WORKFLOW_STEPS = [
  {
    name: "Parse Email",
    service: "gmail" as const,
    description: "Extract lead data from email using AI",
    icon: "Mail",
  },
  {
    name: "Update CRM",
    service: "hubspot" as const,
    description: "Create or update contact in HubSpot",
    icon: "Database",
  },
  {
    name: "Schedule Meeting",
    service: "calendar" as const,
    description: "Create calendar event for follow-up",
    icon: "Calendar",
  },
  {
    name: "Create Notion Note",
    service: "notion" as const,
    description: "Add meeting notes to Notion",
    icon: "FileText",
  },
  {
    name: "Notify Team",
    service: "slack" as const,
    description: "Post update to Slack channel",
    icon: "MessageSquare",
  },
]

export const INTEGRATION_CONFIGS = {
  gmail: {
    name: "Gmail",
    description: "Read and parse incoming emails",
    icon: "Mail",
    color: "bg-red-500",
    fields: [
      { name: "email", label: "Email Address", type: "email" },
      { name: "api_key", label: "API Key", type: "password" },
    ],
  },
  hubspot: {
    name: "HubSpot CRM",
    description: "Manage contacts and deals",
    icon: "Database",
    color: "bg-orange-500",
    fields: [
      { name: "portal_id", label: "Portal ID", type: "text" },
      { name: "api_key", label: "API Key", type: "password" },
    ],
  },
  calendar: {
    name: "Google Calendar",
    description: "Schedule meetings automatically",
    icon: "Calendar",
    color: "bg-blue-500",
    fields: [
      { name: "calendar_id", label: "Calendar ID", type: "text" },
      { name: "api_key", label: "API Key", type: "password" },
    ],
  },
  notion: {
    name: "Notion",
    description: "Create meeting notes and docs",
    icon: "FileText",
    color: "bg-gray-700",
    fields: [
      { name: "workspace_id", label: "Workspace ID", type: "text" },
      { name: "api_key", label: "API Key", type: "password" },
    ],
  },
  slack: {
    name: "Slack",
    description: "Send team notifications",
    icon: "MessageSquare",
    color: "bg-purple-500",
    fields: [
      { name: "channel", label: "Channel", type: "text" },
      { name: "webhook_url", label: "Webhook URL", type: "password" },
    ],
  },
} as const

export const LEAD_STATUS_CONFIG = {
  new: { label: "New", color: "bg-blue-500" },
  contacted: { label: "Contacted", color: "bg-yellow-500" },
  scheduled: { label: "Scheduled", color: "bg-purple-500" },
  converted: { label: "Converted", color: "bg-green-500" },
  lost: { label: "Lost", color: "bg-gray-500" },
} as const

export const WORKFLOW_STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-gray-500" },
  in_progress: { label: "In Progress", color: "bg-blue-500" },
  completed: { label: "Completed", color: "bg-green-500" },
  failed: { label: "Failed", color: "bg-red-500" },
} as const
