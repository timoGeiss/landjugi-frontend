import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protect /admin routes
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (!profile || !['vorstandsmitglied', 'admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url))
    }
  }

  // Protect /portal routes
  if (path.startsWith('/portal')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=/portal', request.url))
    }
  }

  // Log page view (fire and forget)
  if (!path.startsWith('/api') && !path.startsWith('/admin') && !path.startsWith('/_next')) {
    supabase.from('page_views').insert({
      page: path,
      referrer: request.headers.get('referer') ?? undefined,
      user_agent: request.headers.get('user-agent') ?? undefined,
    }).then(() => {})
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
