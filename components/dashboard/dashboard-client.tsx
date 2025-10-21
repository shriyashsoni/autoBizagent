"use client"

import { StatsCards } from "@/components/dashboard/stats-cards"
import { LeadsTable } from "@/components/dashboard/leads-table"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { WorkflowStatus } from "@/components/dashboard/workflow-status"
import { useLeads } from "@/lib/hooks/use-leads"
import { useWorkflows } from "@/lib/hooks/use-workflows"
import { useActivities } from "@/lib/hooks/use-activities"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DashboardClient() {
  const { leads, isLoading: leadsLoading, isError: leadsError } = useLeads()
  const { workflows, isLoading: workflowsLoading, isError: workflowsError } = useWorkflows()
  const { activities, isLoading: activitiesLoading, isError: activitiesError } = useActivities()

  const hasError = leadsError || workflowsError || activitiesError

  if (hasError) {
    console.error("[v0] Dashboard errors:", { leadsError, workflowsError, activitiesError })
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Dashboard</AlertTitle>
          <AlertDescription>
            There was an error loading your dashboard data. Please check your database connection and try refreshing the
            page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const isLoading = leadsLoading || workflowsLoading || activitiesLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const activeWorkflows = Array.isArray(workflows)
    ? workflows.filter((wf) => wf.status === "in_progress" || wf.status === "pending").length
    : 0

  const completedToday = Array.isArray(workflows)
    ? workflows.filter((wf) => {
        if (wf.status !== "completed" || !wf.completed_at) return false
        const completedDate = new Date(wf.completed_at)
        const today = new Date()
        return completedDate.toDateString() === today.toDateString()
      }).length
    : 0

  // Calculate average processing time from completed workflows
  const completedWorkflows = Array.isArray(workflows)
    ? workflows.filter((wf) => wf.status === "completed" && wf.started_at && wf.completed_at)
    : []

  const avgProcessingTime =
    completedWorkflows.length > 0
      ? Math.round(
          completedWorkflows.reduce((acc, wf) => {
            const start = new Date(wf.started_at!).getTime()
            const end = new Date(wf.completed_at!).getTime()
            return acc + (end - start) / 1000
          }, 0) / completedWorkflows.length,
        ) + "s"
      : "0s"

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <Sparkles className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">AI Powered</span>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">Monitor your AI business automation in real-time</p>
        </div>
      </div>

      <StatsCards
        totalLeads={Array.isArray(leads) ? leads.length : 0}
        activeWorkflows={activeWorkflows}
        completedToday={completedToday}
        avgProcessingTime={avgProcessingTime}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold tracking-tight">Recent Leads</h3>
              <span className="text-sm text-muted-foreground">{Array.isArray(leads) ? leads.length : 0} total</span>
            </div>
            <LeadsTable leads={Array.isArray(leads) ? leads : []} />
          </div>
        </div>

        <div className="space-y-6">
          <WorkflowStatus workflows={Array.isArray(workflows) ? workflows : []} />
          <ActivityFeed activities={Array.isArray(activities) ? activities : []} />
        </div>
      </div>
    </div>
  )
}
