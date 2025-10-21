import useSWR from "swr"
import type { Lead } from "@/lib/db/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useLeads() {
  const { data, error, isLoading, mutate } = useSWR<Lead[]>("/api/leads", fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds
  })

  return {
    leads: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useLead(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Lead>(id ? `/api/leads/${id}` : null, fetcher)

  return {
    lead: data,
    isLoading,
    isError: error,
    mutate,
  }
}
