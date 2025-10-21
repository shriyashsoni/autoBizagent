"use client"

import { SWRConfig } from "swr"
import type { ReactNode } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (error) => {
          console.error("[v0] SWR Error:", error)
        },
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  )
}
