"use client"

import type { Integration } from "@/lib/db/schema"
import { INTEGRATION_CONFIGS } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Settings } from "lucide-react"

type IntegrationsListProps = {
  integrations: Integration[]
}

export function IntegrationsList({ integrations }: IntegrationsListProps) {
  const handleConnect = (service: string) => {
    console.log("[v0] Connecting integration:", service)
    // In production, this would open OAuth flow or config modal
  }

  const handleDisconnect = (service: string) => {
    console.log("[v0] Disconnecting integration:", service)
  }

  const formatLastSync = (dateString: string | null) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {integrations.map((integration) => {
        const config = INTEGRATION_CONFIGS[integration.service]

        return (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.color} text-white`}>
                    <span className="text-lg font-bold">{config.name.charAt(0)}</span>
                  </div>
                  <div>
                    <CardTitle className="text-base">{config.name}</CardTitle>
                    <CardDescription className="text-xs">{config.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {integration.is_connected ? (
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-500 text-white">
                    <XCircle className="mr-1 h-3 w-3" />
                    Not Connected
                  </Badge>
                )}
              </div>

              {integration.is_connected && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Sync</span>
                  <span className="text-sm font-medium">{formatLastSync(integration.last_sync)}</span>
                </div>
              )}

              <div className="flex gap-2">
                {integration.is_connected ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleDisconnect(integration.service)}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="w-full" onClick={() => handleConnect(integration.service)}>
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
