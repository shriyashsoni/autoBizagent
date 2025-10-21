"use client"

import type { Workflow } from "@/lib/db/schema"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { WORKFLOW_STATUS_CONFIG } from "@/lib/constants"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

type WorkflowsListProps = {
  workflows: Workflow[]
}

export function WorkflowsList({ workflows }: WorkflowsListProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  return (
    <div className="space-y-4">
      {workflows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">No workflows found</CardContent>
        </Card>
      ) : (
        workflows.map((workflow) => {
          const progress = (workflow.current_step / workflow.total_steps) * 100

          return (
            <Link key={workflow.id} href={`/workflows/${workflow.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className={`${WORKFLOW_STATUS_CONFIG[workflow.status].color} text-white`}
                      >
                        {WORKFLOW_STATUS_CONFIG[workflow.status].label}
                      </Badge>
                      <span className="font-medium">Workflow #{workflow.id}</span>
                      <span className="text-sm text-muted-foreground">Lead #{workflow.lead_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatTimeAgo(workflow.started_at)}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        Step {workflow.current_step} of {workflow.total_steps}
                      </span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {workflow.current_step > 0 && workflow.current_step <= workflow.steps.length && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Current: {workflow.steps[workflow.current_step - 1]?.name}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })
      )}
    </div>
  )
}
