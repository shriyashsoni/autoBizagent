import { AgentControlPanel } from "@/components/agent/agent-control-panel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Mail, Zap, CheckCircle2, Clock } from "lucide-react"

export default function AgentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Agent</h1>
        <p className="text-muted-foreground">
          Autonomous AI agent that monitors emails and automates your business workflows
        </p>
      </div>

      <AgentControlPanel />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Mail className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Email Monitoring</CardTitle>
            <CardDescription>Continuously monitors your Gmail inbox for new leads and inquiries</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Bot className="h-8 w-8 text-primary mb-2" />
            <CardTitle>AI Processing</CardTitle>
            <CardDescription>Uses GPT-4 to intelligently parse emails and extract lead information</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Auto Workflows</CardTitle>
            <CardDescription>Automatically executes workflows across all connected integrations</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>The agent follows these steps for each new email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                title: "1. Monitor Gmail",
                description: "Checks for new emails every 5 minutes",
              },
              {
                icon: Bot,
                title: "2. Parse with AI",
                description: "Extracts lead data using GPT-4 (name, company, intent, urgency)",
              },
              {
                icon: CheckCircle2,
                title: "3. Create Lead",
                description: "Saves lead to database and checks for duplicates",
              },
              {
                icon: Zap,
                title: "4. Execute Workflow",
                description: "Runs automated workflow: CRM update → Calendar → Notion → Slack",
              },
              {
                icon: Clock,
                title: "5. Log Activity",
                description: "Records all actions for tracking and auditing",
              },
            ].map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
