import type React from "react"
import { SWRProvider } from "@/components/providers/swr-provider"
import { Header } from "@/components/layout/header"
import { Nav } from "@/components/layout/nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SWRProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Nav />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SWRProvider>
  )
}
