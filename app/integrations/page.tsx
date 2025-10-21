import { Header } from "@/components/layout/header"
import { Nav } from "@/components/layout/nav"
import { IntegrationsList } from "@/components/integrations/integrations-list"
import { getIntegrations } from "@/lib/db/mock-data"

export default async function IntegrationsPage() {
  const integrations = await getIntegrations()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <div className="mb-6">
          <Nav />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
            <p className="text-muted-foreground">Connect your business tools to automate workflows</p>
          </div>

          <IntegrationsList integrations={integrations} />
        </div>
      </div>
    </div>
  )
}
