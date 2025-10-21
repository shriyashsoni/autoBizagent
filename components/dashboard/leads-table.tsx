"use client"

import { useState } from "react"
import type { Lead } from "@/lib/db/types"
import { LEAD_STATUS_CONFIG } from "@/lib/constants"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Play, Mail, Building2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkflows } from "@/lib/hooks/use-workflows"

type LeadsTableProps = {
  leads: Lead[]
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [executingWorkflow, setExecutingWorkflow] = useState<string | null>(null)
  const router = useRouter()
  const { mutate } = useWorkflows()

  const handleExecuteWorkflow = async (leadId: string) => {
    setExecutingWorkflow(leadId)
    try {
      const response = await fetch("/api/workflows/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      })

      if (response.ok) {
        const data = await response.json()
        // Refresh workflows list
        mutate()
        // Navigate to workflow detail page
        router.push(`/workflows/${data.workflow.id}`)
      }
    } catch (error) {
      console.error("[v0] Error executing workflow:", error)
    } finally {
      setExecutingWorkflow(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Company</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Source</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Mail className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No leads found.</p>
                  <Button size="sm" asChild>
                    <Link href="/leads/new">Add your first lead</Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow
                key={lead.id}
                className={`transition-colors hover:bg-muted/30 ${selectedLead === lead.id ? "bg-muted/50" : ""}`}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    {lead.name}
                  </div>
                </TableCell>
                <TableCell>
                  {lead.company ? (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {lead.company}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {lead.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${LEAD_STATUS_CONFIG[lead.status].color} text-white font-medium shadow-sm`}
                  >
                    {LEAD_STATUS_CONFIG[lead.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="capitalize text-sm px-2 py-1 rounded-md bg-muted/50">{lead.source}</span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDate(lead.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30"
                    >
                      <Link href={`/leads/${lead.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/30"
                      onClick={() => handleExecuteWorkflow(lead.id)}
                      disabled={executingWorkflow === lead.id}
                    >
                      {executingWorkflow === lead.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
