import type { Workflow } from "@/lib/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { WORKFLOW_STATUS_CONFIG } from "@/lib/constants"
import { Clock, Zap } from "lucide-react"
import Link from "next/link"

type WorkflowStatusProps = {
  workflows: Workflow[]
}

export function WorkflowStatus({ workflows }: WorkflowStatusProps) {
  const activeWorkflows = workflows.filter((wf) => wf.status === "in_progress" || wf.status === "pending")

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    return `${Math.floor(diffInSeconds / 3600)} hours ago`
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Active Workflows</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {activeWorkflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Zap className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No active workflows</p>
              <p className="text-xs text-muted-foreground mt-1">Workflows will appear here when processing</p>
            </div>
          ) : (
            activeWorkflows.map((workflow, index) => {
              const progress = (workflow.current_step / workflow.total_steps) * 100

              return (
                <Link
                  key={workflow.id}
                  href={`/workflows/${workflow.id}`}
                  className="block space-y-3 rounded-lg border p-4 hover:bg-muted/50 hover:shadow-md transition-all animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`${WORKFLOW_STATUS_CONFIG[workflow.status].color} text-white font-medium shadow-sm`}
                      >
                        {WORKFLOW_STATUS_CONFIG[workflow.status].label}
                      </Badge>
                      <span className="text-sm font-semibold">Lead #{workflow.lead_id}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(workflow.started_at)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-muted-foreground">
                        Step {workflow.current_step} of {workflow.total_steps}
                      </span>
                      <span className="text-blue-600">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse-subtle" />
                    <p className="text-xs text-muted-foreground font-medium">
                      {workflow.steps[workflow.current_step - 1]?.name}
                    </p>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
