"use client"

import { useEffect, useState } from "react"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { DatabaseSetup } from "@/components/setup/database-setup"
import { Loader2 } from "lucide-react"

export function DashboardWrapper() {
  const [isSetup, setIsSetup] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkSetup()
  }, [])

  const checkSetup = async () => {
    try {
      const response = await fetch("/api/setup/check")
      const data = await response.json()
      setIsSetup(data.isSetup)
    } catch (error) {
      console.error("Error checking setup:", error)
      setIsSetup(false)
    } finally {
      setIsChecking(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isSetup === false) {
    return <DatabaseSetup onComplete={() => setIsSetup(true)} />
  }

  return <DashboardClient />
}
