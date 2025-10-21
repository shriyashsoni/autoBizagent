import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Workflow, CheckCircle2, Clock, TrendingUp } from "lucide-react"

type StatsCardsProps = {
  totalLeads: number
  activeWorkflows: number
  completedToday: number
  avgProcessingTime: string
}

export function StatsCards({ totalLeads, activeWorkflows, completedToday, avgProcessingTime }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
      description: "All time",
      trend: "+12% from last month",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Active Workflows",
      value: activeWorkflows,
      icon: Workflow,
      description: "Currently processing",
      trend: `${activeWorkflows} in progress`,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Completed Today",
      value: completedToday,
      icon: CheckCircle2,
      description: "Last 24 hours",
      trend: "100% success rate",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Avg Processing Time",
      value: avgProcessingTime,
      icon: Clock,
      description: "Per workflow",
      trend: "-3s from average",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.title}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${stat.borderColor} bg-white`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">{stat.title}</CardTitle>
              <div className={`p-3 rounded-xl ${stat.bgColor} shadow-sm`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-4xl font-bold tracking-tight text-gray-900">{stat.value}</div>
              <p className="text-sm text-gray-500">{stat.description}</p>
              <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
                <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                <p className="text-xs text-green-600 font-semibold">{stat.trend}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
