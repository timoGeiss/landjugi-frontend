import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, Users, MessageSquare, UserCheck, Eye, TrendingUp } from 'lucide-react'

export const metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboard() {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: eventCount },
    { count: memberCount },
    { count: pendingRequests },
    { count: unreadMessages },
    { count: pageViewsMonth },
    { count: pageViewsToday },
    { data: recentViews },
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('join_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', today),
    supabase.from('page_views').select('page').gte('created_at', thirtyDaysAgo).limit(200),
  ])

  // Top pages
  const pageCounts = recentViews?.reduce((acc: Record<string, number>, v) => {
    acc[v.page] = (acc[v.page] ?? 0) + 1
    return acc
  }, {}) ?? {}
  const topPages = Object.entries(pageCounts).sort(([, a], [, b]) => b - a).slice(0, 5)

  const stats = [
    { label: 'Veröffentlichte Anlässe', value: eventCount ?? 0, icon: CalendarDays, color: 'text-blue-600' },
    { label: 'Mitglieder', value: memberCount ?? 0, icon: Users, color: 'text-green-600' },
    { label: 'Offene Anfragen', value: pendingRequests ?? 0, icon: UserCheck, color: pendingRequests ? 'text-orange-600' : 'text-gray-600' },
    { label: 'Ungelesene Nachrichten', value: unreadMessages ?? 0, icon: MessageSquare, color: unreadMessages ? 'text-red-600' : 'text-gray-600' },
    { label: 'Besuche (30 Tage)', value: pageViewsMonth ?? 0, icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Besuche heute', value: pageViewsToday ?? 0, icon: Eye, color: 'text-indigo-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-xs text-[--muted-foreground] mt-0.5">{label}</div>
                </div>
                <Icon className={`h-8 w-8 ${color} opacity-70`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Seiten (30 Tage)</CardTitle>
          </CardHeader>
          <CardContent>
            {topPages.length > 0 ? (
              <div className="space-y-2">
                {topPages.map(([page, count]) => (
                  <div key={page} className="flex items-center justify-between text-sm">
                    <span className="text-[--muted-foreground] font-mono">{page || '/'}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[--muted-foreground]">Noch keine Daten.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Schnellzugriff</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { href: '/admin/events', label: 'Neuen Anlass erstellen', icon: CalendarDays },
              { href: '/admin/requests', label: `Beitrittsanfragen (${pendingRequests ?? 0} offen)`, icon: UserCheck },
              { href: '/admin/messages', label: `Nachrichten (${unreadMessages ?? 0} ungelesen)`, icon: MessageSquare },
              { href: '/admin/members', label: 'Mitglieder verwalten', icon: Users },
            ].map(({ href, label, icon: Icon }) => (
              <a key={href} href={href} className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-[--secondary] transition-colors">
                <Icon className="h-4 w-4 text-[--muted-foreground]" />
                {label}
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
