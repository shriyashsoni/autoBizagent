"use client"

import { WorkflowsList } from "@/components/workflows/workflows-list"
import { useWorkflows } from "@/lib/hooks/use-workflows"
import { Loader2 } from "lucide-react"

export function WorkflowsClient() {
  const { workflows, isLoading } = useWorkflows()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <WorkflowsList workflows={workflows} />
}
