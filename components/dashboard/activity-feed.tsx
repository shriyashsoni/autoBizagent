import type { Activity } from "@/lib/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Workflow, UserPlus, Plug, ActivityIcon } from "lucide-react"

type ActivityFeedProps = {
  activities: Activity[]
}

const activityIcons = {
  lead_created: UserPlus,
  workflow_started: Workflow,
  workflow_completed: CheckCircle2,
  integration_connected: Plug,
  error: AlertCircle,
}

const activityColors = {
  lead_created: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
  workflow_started: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
  workflow_completed: "text-green-500 bg-green-50 dark:bg-green-950/30",
  integration_connected: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
  error: "text-red-500 bg-red-50 dark:bg-red-950/30",
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
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
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <ActivityIcon className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ActivityIcon className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            activities.map((activity, index) => {
              const Icon = activityIcons[activity.type]
              const colorClass = activityColors[activity.type]

              return (
                <div
                  key={activity.id}
                  className="flex gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
                    <p className="text-xs text-muted-foreground font-medium">{formatTimeAgo(activity.created_at)}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
