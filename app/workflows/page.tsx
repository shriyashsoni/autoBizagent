import { Header } from "@/components/layout/header"
import { Nav } from "@/components/layout/nav"
import { WorkflowsClient } from "@/components/workflows/workflows-client"

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <div className="mb-6">
          <Nav />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Workflows</h2>
            <p className="text-muted-foreground">Monitor and manage automated workflow executions</p>
          </div>
          <WorkflowsClient />
        </div>
      </div>
    </div>
  )
}
