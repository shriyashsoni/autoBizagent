import useSWR from "swr"
import type { Workflow } from "@/lib/db/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useWorkflows() {
  const { data, error, isLoading, mutate } = useSWR<Workflow[]>("/api/workflows", fetcher, {
    refreshInterval: 3000, // Refresh every 3 seconds for real-time updates
  })

  return {
    workflows: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useWorkflow(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Workflow>(id ? `/api/workflows/${id}` : null, fetcher, {
    refreshInterval: 2000, // Faster refresh for individual workflow monitoring
  })

  return {
    workflow: data,
    isLoading,
    isError: error,
    mutate,
  }
}
