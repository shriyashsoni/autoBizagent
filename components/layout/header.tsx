import { Button } from "@/components/ui/button"
import { Plus, Settings, Sparkles, LogOut, LogIn } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/lib/actions/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      {!user && (
        <Alert className="rounded-none border-x-0 border-t-0 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            You're using AutoBiz Agent as a guest.
            <Link href="/auth/signup" className="font-medium underline ml-1">
              Sign up
            </Link>{" "}
            to save your data and access all features.
          </AlertDescription>
        </Alert>
      )}

      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20 transition-all group-hover:shadow-xl group-hover:shadow-blue-500/30 group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">AutoBiz Agent</h1>
              <p className="text-xs text-muted-foreground">AI Business Manager</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {user && <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>}
            <Button variant="outline" size="sm" asChild className="hidden sm:flex bg-transparent">
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button size="sm" asChild className="shadow-sm">
              <Link href="/leads/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Link>
            </Button>

            {user ? (
              <form action={signOut}>
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
