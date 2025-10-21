import { Header } from "@/components/layout/header"
import { Nav } from "@/components/layout/nav"
import { DashboardWrapper } from "@/components/dashboard/dashboard-wrapper"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <Nav />
        </div>
      </div>
      <div className="container py-8">
        <DashboardWrapper />
      </div>
    </div>
  )
}
