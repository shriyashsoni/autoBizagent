"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Square, RefreshCw, Settings, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AgentControlPanel() {
  const { toast } = useToast()
  const [isStarting, setIsStarting] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [isTriggeringCycle, setIsTriggeringCycle] = useState(false)

  const { data: statusData, mutate } = useSWR("/api/agent/status", fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds
  })

  const agentStatus = statusData?.status

  const handleStart = async () => {
    setIsStarting(true)
    try {
      const response = await fetch("/api/agent/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkInterval: 5,
          autoExecuteWorkflows: true,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Agent Started",
          description: "The AI agent is now monitoring for new leads",
        })
        mutate()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start agent",
        variant: "destructive",
      })
    } finally {
      setIsStarting(false)
    }
  }

  const handleStop = async () => {
    setIsStopping(true)
    try {
      const response = await fetch("/api/agent/stop", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Agent Stopped",
          description: "The AI agent has been stopped",
        })
        mutate()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop agent",
        variant: "destructive",
      })
    } finally {
      setIsStopping(false)
    }
  }

  const handleTriggerCycle = async () => {
    setIsTriggeringCycle(true)
    try {
      const response = await fetch("/api/agent/trigger", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Cycle Triggered",
          description: "Agent is checking for new emails now",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger agent cycle",
        variant: "destructive",
      })
    } finally {
      setIsTriggeringCycle(false)
    }
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              AI Agent Control Panel
            </CardTitle>
            <CardDescription>Autonomous agent that monitors emails and executes workflows</CardDescription>
          </div>
          <Badge variant={agentStatus?.isRunning ? "default" : "secondary"} className="text-sm">
            {agentStatus?.isRunning ? "Running" : "Stopped"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">Status</p>
            <p className="text-sm text-muted-foreground">
              {agentStatus?.isRunning ? "Actively monitoring for new leads" : "Agent is currently stopped"}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Last Check</p>
            <p className="text-sm text-muted-foreground">
              {agentStatus?.lastCheckTime ? new Date(agentStatus.lastCheckTime).toLocaleString() : "Never"}
            </p>
          </div>
        </div>

        {agentStatus?.config && (
          <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-medium">Configuration</p>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Check Interval:</span>
                <span className="font-medium text-foreground">{agentStatus.config.checkInterval} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Auto Execute:</span>
                <span className="font-medium text-foreground">
                  {agentStatus.config.autoExecuteWorkflows ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {!agentStatus?.isRunning ? (
            <Button onClick={handleStart} disabled={isStarting} className="gap-2">
              <Play className="h-4 w-4" />
              {isStarting ? "Starting..." : "Start Agent"}
            </Button>
          ) : (
            <Button onClick={handleStop} disabled={isStopping} variant="destructive" className="gap-2">
              <Square className="h-4 w-4" />
              {isStopping ? "Stopping..." : "Stop Agent"}
            </Button>
          )}

          <Button
            onClick={handleTriggerCycle}
            disabled={!agentStatus?.isRunning || isTriggeringCycle}
            variant="outline"
            className="gap-2 bg-transparent"
          >
            <RefreshCw className="h-4 w-4" />
            {isTriggeringCycle ? "Checking..." : "Check Now"}
          </Button>

          <Button variant="outline" className="gap-2 bg-transparent">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
