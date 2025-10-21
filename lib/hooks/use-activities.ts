import useSWR from "swr"
import type { Activity } from "@/lib/db/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useActivities() {
  const { data, error, isLoading, mutate } = useSWR<Activity[]>("/api/activities", fetcher, {
    refreshInterval: 5000,
  })

  return {
    activities: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
