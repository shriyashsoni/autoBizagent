import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const authToken = request.cookies.get("sb-access-token")?.value

  if (authToken) {
    const refreshToken = request.cookies.get("sb-refresh-token")?.value
    if (refreshToken) {
      await supabase.auth.setSession({
        access_token: authToken,
        refresh_token: refreshToken,
      })
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to dashboard if accessing auth pages while authenticated
  if (user && request.nextUrl.pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
