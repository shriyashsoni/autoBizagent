import { Header } from "@/components/layout/header"
import { Nav } from "@/components/layout/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <div className="mb-6">
          <Nav />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Configure your AI Business Manager</p>
          </div>

          <div className="grid gap-6 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Automation</CardTitle>
                <CardDescription>Configure how workflows are triggered and executed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-trigger workflows</Label>
                    <p className="text-sm text-muted-foreground">Automatically start workflows for new leads</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email updates on workflow completion</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
                <CardDescription>Customize AI behavior for email parsing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="model">AI Model</Label>
                  <Input id="model" value="gpt-4o-mini" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input id="temperature" type="number" defaultValue="0.7" step="0.1" min="0" max="1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Settings</CardTitle>
                <CardDescription>Manage team members and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-email">Team Email</Label>
                  <Input id="team-email" type="email" placeholder="team@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slack-channel">Default Slack Channel</Label>
                  <Input id="slack-channel" placeholder="#sales" defaultValue="#sales" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
