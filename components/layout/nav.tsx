"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Workflow, Plug, Settings, Bot } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Leads",
    href: "/leads",
    icon: Users,
  },
  {
    title: "Workflows",
    href: "/workflows",
    icon: Workflow,
  },
  {
    title: "AI Agent",
    href: "/agent",
    icon: Bot,
  },
  {
    title: "Integrations",
    href: "/integrations",
    icon: Plug,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-1 lg:space-x-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
              isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden md:inline">{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
