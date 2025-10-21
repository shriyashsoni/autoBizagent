// Mock data for development (replace with real database calls later)

import type { Lead, Workflow, Integration, Activity } from "./schema"

export const mockLeads: Lead[] = [
  {
    id: "1",
    email: "john.doe@techstartup.com",
    name: "John Doe",
    company: "TechStartup Inc",
    phone: "+1 (555) 123-4567",
    source: "gmail",
    status: "scheduled",
    intent: "Interested in enterprise plan for team of 50",
    raw_email_content: "Hi, I am interested in your enterprise solution...",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    email: "sarah.johnson@designco.com",
    name: "Sarah Johnson",
    company: "DesignCo",
    phone: null,
    source: "gmail",
    status: "contacted",
    intent: "Looking for pricing information",
    raw_email_content: "Could you send me your pricing details?",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    email: "mike.chen@retailplus.com",
    name: "Mike Chen",
    company: "RetailPlus",
    phone: "+1 (555) 987-6543",
    source: "gmail",
    status: "new",
    intent: "Demo request for inventory management",
    raw_email_content: "We need a demo of your inventory system...",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
]

export const mockWorkflows: Workflow[] = [
  {
    id: "wf-1",
    lead_id: "1",
    status: "completed",
    current_step: 5,
    total_steps: 5,
    steps: [
      {
        name: "Parse Email",
        status: "completed",
        service: "gmail",
        action: "extract_lead_data",
        result: { success: true },
        error: null,
        started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5000).toISOString(),
      },
      {
        name: "Update CRM",
        status: "completed",
        service: "hubspot",
        action: "create_contact",
        result: { contact_id: "hs-12345" },
        error: null,
        started_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5000).toISOString(),
        completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 8000).toISOString(),
      },
      {
        name: "Schedule Meeting",
        status: "completed",
        service: "calendar",
        action: "create_event",
        result: { event_id: "cal-789" },
        error: null,
        started_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 8000).toISOString(),
        completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 11000).toISOString(),
      },
      {
        name: "Create Notion Note",
        status: "completed",
        service: "notion",
        action: "create_page",
        result: { page_id: "notion-456" },
        error: null,
        started_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 11000).toISOString(),
        completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 14000).toISOString(),
      },
      {
        name: "Notify Team",
        status: "completed",
        service: "slack",
        action: "post_message",
        result: { message_ts: "1234567890.123456" },
        error: null,
        started_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 14000).toISOString(),
        completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 16000).toISOString(),
      },
    ],
    error_message: null,
    started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 16000).toISOString(),
  },
  {
    id: "wf-3",
    lead_id: "3",
    status: "in_progress",
    current_step: 2,
    total_steps: 5,
    steps: [
      {
        name: "Parse Email",
        status: "completed",
        service: "gmail",
        action: "extract_lead_data",
        result: { success: true },
        error: null,
        started_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - 5 * 60 * 1000 + 3000).toISOString(),
      },
      {
        name: "Update CRM",
        status: "in_progress",
        service: "hubspot",
        action: "create_contact",
        result: null,
        error: null,
        started_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        completed_at: null,
      },
      {
        name: "Schedule Meeting",
        status: "pending",
        service: "calendar",
        action: "create_event",
        result: null,
        error: null,
        started_at: null,
        completed_at: null,
      },
      {
        name: "Create Notion Note",
        status: "pending",
        service: "notion",
        action: "create_page",
        result: null,
        error: null,
        started_at: null,
        completed_at: null,
      },
      {
        name: "Notify Team",
        status: "pending",
        service: "slack",
        action: "post_message",
        result: null,
        error: null,
        started_at: null,
        completed_at: null,
      },
    ],
    error_message: null,
    started_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    completed_at: null,
  },
]

export const mockIntegrations: Integration[] = [
  {
    id: "int-1",
    service: "gmail",
    name: "Gmail",
    is_connected: true,
    config: { email: "business@company.com" },
    last_sync: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "int-2",
    service: "hubspot",
    name: "HubSpot CRM",
    is_connected: true,
    config: { portal_id: "12345" },
    last_sync: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "int-3",
    service: "calendar",
    name: "Google Calendar",
    is_connected: true,
    config: { calendar_id: "primary" },
    last_sync: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "int-4",
    service: "notion",
    name: "Notion",
    is_connected: false,
    config: {},
    last_sync: null,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "int-5",
    service: "slack",
    name: "Slack",
    is_connected: true,
    config: { channel: "#sales" },
    last_sync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockActivities: Activity[] = [
  {
    id: "act-1",
    lead_id: "3",
    workflow_id: "wf-3",
    type: "workflow_started",
    title: "Workflow Started",
    description: "Processing new lead from Mike Chen",
    metadata: { lead_name: "Mike Chen" },
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "act-2",
    lead_id: "3",
    workflow_id: null,
    type: "lead_created",
    title: "New Lead",
    description: "Mike Chen from RetailPlus",
    metadata: { source: "gmail" },
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "act-3",
    lead_id: "1",
    workflow_id: "wf-1",
    type: "workflow_completed",
    title: "Workflow Completed",
    description: "Successfully processed lead from John Doe",
    metadata: { lead_name: "John Doe", duration: "16s" },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock API functions (replace with real API calls later)
export async function getLeads(): Promise<Lead[]> {
  return mockLeads
}

export async function getLead(id: string): Promise<Lead | null> {
  return mockLeads.find((lead) => lead.id === id) || null
}

export async function getWorkflows(): Promise<Workflow[]> {
  return mockWorkflows
}

export async function getWorkflow(id: string): Promise<Workflow | null> {
  return mockWorkflows.find((wf) => wf.id === id) || null
}

export async function getIntegrations(): Promise<Integration[]> {
  return mockIntegrations
}

export async function getActivities(): Promise<Activity[]> {
  return mockActivities
}
