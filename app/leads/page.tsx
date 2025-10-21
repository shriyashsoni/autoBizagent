import { Header } from "@/components/layout/header"
import { Nav } from "@/components/layout/nav"
import { LeadsClient } from "@/components/leads/leads-client"

export default function LeadsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <div className="mb-6">
          <Nav />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
            <p className="text-muted-foreground">Manage all your leads in one place</p>
          </div>
          <LeadsClient />
        </div>
      </div>
    </div>
  )
}
