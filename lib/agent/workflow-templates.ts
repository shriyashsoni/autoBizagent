import type { WorkflowStep } from "@/lib/db/types"

export interface WorkflowTemplate {
  name: string
  description: string
  steps: Omit<WorkflowStep, "status" | "started_at" | "completed_at" | "result" | "error">[]
}

export const workflowTemplates: Record<string, WorkflowTemplate> = {
  standard: {
    name: "Standard Lead Processing",
    description: "Complete workflow for new leads: CRM, Calendar, Notion, Slack",
    steps: [
      {
        name: "Parse Email with AI",
        service: "gmail",
        action: "extract_lead_data",
        order: 1,
      },
      {
        name: "Create CRM Contact",
        service: "hubspot",
        action: "create_contact",
        order: 2,
      },
      {
        name: "Schedule Discovery Call",
        service: "calendar",
        action: "create_event",
        order: 3,
      },
      {
        name: "Create Meeting Notes",
        service: "notion",
        action: "create_page",
        order: 4,
      },
      {
        name: "Send Intro Email",
        service: "gmail",
        action: "send_intro_email",
        order: 5,
      },
      {
        name: "Notify Sales Team",
        service: "slack",
        action: "post_message",
        order: 6,
      },
    ],
  },
  quick: {
    name: "Quick Response",
    description: "Fast workflow for urgent leads: Email + Slack only",
    steps: [
      {
        name: "Parse Email with AI",
        service: "gmail",
        action: "extract_lead_data",
        order: 1,
      },
      {
        name: "Send Intro Email",
        service: "gmail",
        action: "send_intro_email",
        order: 2,
      },
      {
        name: "Notify Sales Team",
        service: "slack",
        action: "post_message",
        order: 3,
      },
    ],
  },
  enterprise: {
    name: "Enterprise Lead",
    description: "Full workflow for high-value enterprise leads",
    steps: [
      {
        name: "Parse Email with AI",
        service: "gmail",
        action: "extract_lead_data",
        order: 1,
      },
      {
        name: "Create CRM Contact",
        service: "hubspot",
        action: "create_contact",
        order: 2,
      },
      {
        name: "Schedule Executive Meeting",
        service: "calendar",
        action: "create_event",
        order: 3,
      },
      {
        name: "Create Detailed Notes",
        service: "notion",
        action: "create_page",
        order: 4,
      },
      {
        name: "Send Personalized Email",
        service: "gmail",
        action: "send_intro_email",
        order: 5,
      },
      {
        name: "Alert Leadership Team",
        service: "slack",
        action: "post_message",
        order: 6,
      },
    ],
  },
}

export function getWorkflowTemplate(urgency: string, company?: string): WorkflowTemplate {
  // Select template based on lead characteristics
  if (urgency === "high" || (company && company.length > 20)) {
    return workflowTemplates.enterprise
  } else if (urgency === "low") {
    return workflowTemplates.quick
  }
  return workflowTemplates.standard
}
