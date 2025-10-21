import { Header } from "@/components/layout/header"
import { Nav } from "@/components/layout/nav"
import { WorkflowDetail } from "@/components/workflows/workflow-detail"
import { getWorkflow, getLead } from "@/lib/db/mock-data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LEAD_STATUS_CONFIG } from "@/lib/constants"

export default async function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const workflow = await getWorkflow(id)

  if (!workflow) {
    notFound()
  }

  const lead = await getLead(workflow.lead_id)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <div className="mb-6">
          <Nav />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Workflow Details</h2>
            <p className="text-muted-foreground">Workflow #{workflow.id}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WorkflowDetail workflow={workflow} />
            </div>

            <div>
              {lead && (
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Name</span>
                      <p className="font-medium">{lead.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email</span>
                      <p className="font-medium">{lead.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Company</span>
                      <p className="font-medium">{lead.company || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="secondary" className={`${LEAD_STATUS_CONFIG[lead.status].color} text-white mt-1`}>
                        {LEAD_STATUS_CONFIG[lead.status].label}
                      </Badge>
                    </div>
                    {lead.intent && (
                      <div>
                        <span className="text-sm text-muted-foreground">Intent</span>
                        <p className="text-sm">{lead.intent}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
