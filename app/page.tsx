import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  Database,
  Bot,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-500/20 transition-all group-hover:shadow-lg group-hover:shadow-blue-500/30 group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900">AutoBiz Agent</h1>
              <p className="text-xs text-gray-600">AI Business Manager</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="shadow-sm bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/auth/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container py-20 md:py-32 overflow-hidden">
        {/* Background Design Elements */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient Mesh Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />

          {/* Decorative Blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        </div>

        <div className="mx-auto max-w-4xl text-center space-y-8 relative">
          <Badge
            variant="secondary"
            className="px-4 py-1.5 text-sm font-medium bg-blue-100 text-blue-700 border-blue-200"
          >
            <Sparkles className="mr-2 h-3.5 w-3.5 inline" />
            Powered by AI
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance text-gray-900">
            Everything You Need to Automate Your Business
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 text-balance max-w-3xl mx-auto leading-relaxed">
            Connect your favorite tools and let AI handle the repetitive work
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              asChild
              className="text-base h-12 px-8 shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link href="/dashboard">
                Start Automating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base h-12 px-8 bg-white border-gray-300 hover:bg-gray-50"
            >
              <Link href="/agent">View AI Agent</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative container pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-radial from-blue-50/50 to-transparent" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Zap, label: "Hours Saved", value: "20+/week" },
            { icon: Users, label: "Leads Processed", value: "1000+" },
            { icon: TrendingUp, label: "Response Time", value: "< 5 min" },
            { icon: Shield, label: "Accuracy", value: "99.9%" },
          ].map((stat, i) => (
            <Card
              key={i}
              className="p-6 text-center border-2 border-gray-200 hover:border-blue-400 transition-colors bg-white shadow-sm"
            >
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <div className="text-2xl font-bold mb-1 text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative container py-20 border-t border-gray-200 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gray-50" />
        <div className="absolute inset-0 -z-10 opacity-30 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_50%,transparent_50%,transparent_75%,rgba(59,130,246,0.05)_75%,rgba(59,130,246,0.05))] bg-[length:60px_60px]" />

        <div className="text-center mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Seamlessly Connects With Your Tools</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            One platform that brings all your business tools together
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-5xl mx-auto items-center relative">
          {[
            { name: "Gmail", icon: Mail },
            { name: "HubSpot", icon: Database },
            { name: "Calendar", icon: Calendar },
            { name: "Notion", icon: FileText },
            { name: "Slack", icon: MessageSquare },
          ].map((integration, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-xl hover:bg-white transition-colors">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-200">
                <integration.icon className="h-8 w-8 text-blue-600" />
              </div>
              <span className="font-medium text-sm text-gray-900">{integration.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative container py-20 border-t border-gray-200 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-white" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="text-center mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Powerful Features, Zero Complexity</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to automate your business workflows
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative">
          {[
            {
              icon: Bot,
              title: "AI Email Parser",
              description: "Automatically extracts lead data from emails using advanced GPT-4 technology",
            },
            {
              icon: Database,
              title: "CRM Integration",
              description: "Instantly updates HubSpot or Salesforce with new lead information",
            },
            {
              icon: Calendar,
              title: "Smart Scheduling",
              description: "Books meetings in Google Calendar based on lead priority and availability",
            },
            {
              icon: FileText,
              title: "Notion Notes",
              description: "Creates detailed meeting notes and lead profiles automatically",
            },
            {
              icon: MessageSquare,
              title: "Slack Notifications",
              description: "Keeps your team updated with real-time lead alerts and updates",
            },
            {
              icon: Zap,
              title: "Workflow Automation",
              description: "Orchestrates all tools in one seamless, intelligent workflow",
            },
          ].map((feature, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition-all hover:border-blue-300 bg-white border-gray-200">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative container py-20 border-t border-gray-200 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 to-white" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />

        <div className="text-center mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {[
            {
              step: "01",
              title: "Connect Your Tools",
              description: "Link your Gmail, CRM, Calendar, Notion, and Slack accounts in one click",
            },
            {
              step: "02",
              title: "Configure AI Agent",
              description: "Set up your automation rules and let the AI learn your preferences",
            },
            {
              step: "03",
              title: "Watch It Work",
              description: "Sit back as AutoBiz handles leads, schedules meetings, and updates your team",
            },
          ].map((step, i) => (
            <div key={i} className="relative">
              <div className="text-6xl font-bold text-blue-100 mb-4">{step.step}</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
              {i < 2 && <ArrowRight className="hidden md:block absolute top-8 -right-4 h-6 w-6 text-gray-300" />}
            </div>
          ))}
        </div>
      </section>

      <section className="relative container py-20 border-t border-gray-200 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-white" />
        <div className="absolute inset-0 -z-10 opacity-20 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px]" />

        <div className="text-center mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Choose AutoBiz Agent?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built for modern businesses that value efficiency and growth
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative">
          {[
            {
              icon: Clock,
              title: "Save 20+ Hours Weekly",
              description: "Automate repetitive tasks and focus on what matters most",
            },
            {
              icon: Target,
              title: "Never Miss a Lead",
              description: "Instant response times keep prospects engaged and interested",
            },
            {
              icon: CheckCircle2,
              title: "99.9% Accuracy",
              description: "AI-powered parsing ensures data quality and consistency",
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              description: "Bank-level encryption keeps your business data safe",
            },
            {
              icon: TrendingUp,
              title: "Scale Effortlessly",
              description: "Handle 10x more leads without hiring additional staff",
            },
            {
              icon: Users,
              title: "Team Collaboration",
              description: "Keep everyone in sync with real-time notifications",
            },
          ].map((benefit, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition-all bg-white border-gray-200">
              <benefit.icon className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 bg-white">
        <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
            Ready to Automate Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 text-balance">
            Join hundreds of businesses saving time with AI automation
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="text-base h-12 px-8 shadow-lg bg-white text-blue-600 hover:bg-gray-50"
          >
            <Link href="/dashboard">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">AutoBiz Agent</span>
            </div>
            <p className="text-sm text-gray-600">© 2025 AutoBiz</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
