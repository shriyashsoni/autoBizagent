// Database schema types for the AI Business Manager

export type Lead = {
  id: string
  email: string
  name: string
  company: string | null
  phone: string | null
  source: "gmail" | "manual" | "api"
  status: "new" | "contacted" | "scheduled" | "converted" | "lost"
  intent: string | null
  raw_email_content: string | null
  created_at: string
  updated_at: string
}

export type Workflow = {
  id: string
  lead_id: string
  status: "pending" | "in_progress" | "completed" | "failed"
  current_step: number
  total_steps: number
  steps: WorkflowStep[]
  error_message: string | null
  started_at: string
  completed_at: string | null
}

export type WorkflowStep = {
  name: string
  status: "pending" | "in_progress" | "completed" | "failed" | "skipped"
  service: "gmail" | "hubspot" | "calendar" | "notion" | "slack"
  action: string
  result: any
  error: string | null
  started_at: string | null
  completed_at: string | null
}

export type Integration = {
  id: string
  service: "gmail" | "hubspot" | "calendar" | "notion" | "slack"
  name: string
  is_connected: boolean
  config: Record<string, any>
  last_sync: string | null
  created_at: string
}

export type Activity = {
  id: string
  lead_id: string | null
  workflow_id: string | null
  type: "lead_created" | "workflow_started" | "workflow_completed" | "integration_connected" | "error"
  title: string
  description: string
  metadata: Record<string, any>
  created_at: string
}
