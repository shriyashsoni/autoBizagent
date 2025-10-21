import { Header } from "@/components/layout/header"
import { Nav } from "@/components/layout/nav"
import { EmailParserDemo } from "@/components/email-parser-demo"
import { Sparkles, Mail } from "lucide-react"

export default function NewLeadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <Nav />
        </div>
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-4xl font-bold tracking-tight">Add New Lead</h2>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <Sparkles className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">AI Powered</span>
                </div>
              </div>
              <p className="text-muted-foreground text-lg">
                Parse emails with AI to automatically extract lead information and trigger workflows
              </p>
            </div>
          </div>

          <EmailParserDemo />
        </div>
      </div>
    </div>
  )
}
