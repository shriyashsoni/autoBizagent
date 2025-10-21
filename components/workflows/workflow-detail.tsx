"use client"

import type { Workflow } from "@/lib/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { WORKFLOW_STATUS_CONFIG } from "@/lib/constants"
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react"

type WorkflowDetailProps = {
  workflow: Workflow
}

export function WorkflowDetail({ workflow }: WorkflowDetailProps) {
  const progress = (workflow.current_step / workflow.total_steps) * 100

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "in_progress":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const formatDuration = (start: string | null, end: string | null) => {
    if (!start) return "-"
    if (!end) return "In progress..."

    const startTime = new Date(start).getTime()
    const endTime = new Date(end).getTime()
    const durationMs = endTime - startTime

    if (durationMs < 1000) return `${durationMs}ms`
    if (durationMs < 60000) return `${(durationMs / 1000).toFixed(1)}s`
    return `${(durationMs / 60000).toFixed(1)}m`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Workflow Status</CardTitle>
            <Badge variant="secondary" className={`${WORKFLOW_STATUS_CONFIG[workflow.status].color} text-white`}>
              {WORKFLOW_STATUS_CONFIG[workflow.status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Step {workflow.current_step} of {workflow.total_steps}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Started</span>
              <p className="font-medium">{new Date(workflow.started_at).toLocaleString()}</p>
            </div>
            {workflow.completed_at && (
              <div>
                <span className="text-muted-foreground">Completed</span>
                <p className="font-medium">{new Date(workflow.completed_at).toLocaleString()}</p>
              </div>
            )}
          </div>

          {workflow.error_message && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{workflow.error_message}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflow.steps.map((step, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                <div className="flex-shrink-0 mt-1">{getStepIcon(step.status)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{step.name}</h4>
                    <Badge variant="outline" className="text-xs capitalize">
                      {step.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.service.charAt(0).toUpperCase() + step.service.slice(1)} - {step.action}
                  </p>
                  {step.error && <p className="text-sm text-destructive">Error: {step.error}</p>}
                  {step.started_at && (
                    <p className="text-xs text-muted-foreground">
                      Duration: {formatDuration(step.started_at, step.completed_at)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
