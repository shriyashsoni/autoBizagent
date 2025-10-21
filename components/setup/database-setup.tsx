"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export function DatabaseSetup({ onComplete }: { onComplete: () => void }) {
  const [isInitializing, setIsInitializing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInitialize = async () => {
    setIsInitializing(true)
    setError(null)

    try {
      const response = await fetch("/api/setup/initialize", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          onComplete()
        }, 1500)
      } else {
        setError(data.error || "Failed to initialize database")
      }
    } catch (err) {
      setError("Failed to initialize database. Please try again.")
      console.error("[v0] Setup error:", err)
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Database Setup Required</CardTitle>
          <CardDescription>Initialize your database to start using the AI Business Manager</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>Database initialized successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>This will create the following tables:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Leads - Store customer information</li>
              <li>Workflows - Track automation processes</li>
              <li>Activities - Log all system events</li>
              <li>Integrations - Manage connected services</li>
            </ul>
          </div>

          <Button onClick={handleInitialize} disabled={isInitializing || success} className="w-full" size="lg">
            {isInitializing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {success ? "Redirecting..." : "Initialize Database"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
