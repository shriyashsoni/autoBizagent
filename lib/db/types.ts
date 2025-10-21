export interface Lead {
  id: string
  email: string
  name: string | null
  company: string | null
  phone: string | null
  source: string
  status: "new" | "contacted" | "qualified" | "converted" | "lost"
  priority: "low" | "medium" | "high"
  notes: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface Workflow {
  id: string
  lead_id: string
  status: "pending" | "in_progress" | "completed" | "failed"
  current_step: number
  total_steps: number
  steps: WorkflowStep[]
  error_message: string | null
  started_at: string
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface WorkflowStep {
  name: string
  status: "pending" | "in_progress" | "completed" | "failed"
  message: string
  timestamp: string
}

export interface Activity {
  id: string
  lead_id: string | null
  workflow_id: string | null
  type: string
  description: string
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface Integration {
  id: string
  name: string
  type: string
  status: "connected" | "disconnected" | "error"
  config: Record<string, unknown> | null
  last_synced_at: string | null
  created_at: string
  updated_at: string
}
