"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLeads } from "@/lib/hooks/use-leads"

export function EmailParserDemo() {
  const [emailContent, setEmailContent] = useState("")
  const [senderEmail, setSenderEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [savedLeadId, setSavedLeadId] = useState<string | null>(null)
  const router = useRouter()
  const { mutate } = useLeads()

  const handleParse = async () => {
    if (!emailContent || !senderEmail) return

    setIsLoading(true)
    setResult(null)
    setSavedLeadId(null)

    try {
      const response = await fetch("/api/parse-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent, senderEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data.lead)
        setSavedLeadId(data.lead.id)
        // Refresh leads list
        mutate()
      } else {
        setResult({ error: data.error || "Failed to parse email" })
      }
    } catch (error) {
      console.error("[v0] Error parsing email:", error)
      setResult({ error: "Failed to parse email" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Email Input</CardTitle>
          <CardDescription>Paste an email to extract lead information using AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sender">Sender Email</Label>
            <Input
              id="sender"
              type="email"
              placeholder="john.doe@company.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Email Content</Label>
            <Textarea
              id="content"
              placeholder="Hi, I'm interested in your product..."
              className="min-h-[200px]"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
          </div>
          <Button onClick={handleParse} disabled={isLoading || !emailContent || !senderEmail} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Parsing with AI...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Parse with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extracted Lead Data</CardTitle>
          <CardDescription>AI-parsed information saved to database</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            result.error ? (
              <div className="text-sm text-destructive">{result.error}</div>
            ) : (
              <div className="space-y-4">
                {savedLeadId && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Lead saved to database!</span>
                  </div>
                )}
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <p className="text-sm font-medium">{result.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="text-sm font-medium">{result.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Company</Label>
                    <p className="text-sm font-medium">{result.company || "Not mentioned"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <p className="text-sm font-medium">{result.phone || "Not mentioned"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Intent</Label>
                    <p className="text-sm">{result.intent}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Urgency</Label>
                    <p className="text-sm capitalize">{result.urgency}</p>
                  </div>
                </div>
                {savedLeadId && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={() => router.push(`/leads/${savedLeadId}`)}>
                      View Lead
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => router.push("/leads")}>
                      All Leads
                    </Button>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
              Parse an email to see results
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
