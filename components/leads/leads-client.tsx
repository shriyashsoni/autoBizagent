"use client"

import { LeadsTable } from "@/components/dashboard/leads-table"
import { useLeads } from "@/lib/hooks/use-leads"
import { Loader2 } from "lucide-react"

export function LeadsClient() {
  const { leads, isLoading } = useLeads()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <LeadsTable leads={leads} />
}
