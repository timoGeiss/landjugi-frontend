import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, Star, MessageSquare, User } from 'lucide-react'
import { StarButton } from '@/components/events/star-button'

export const metadata = { title: 'Mein Bereich' }

export default async function PortalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/portal')

  const [{ data: profile }, { data: starredEvents }, { data: messages }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('starred_events').select('event_id, events(*)').eq('user_id', user.id),
    supabase.from('messages').select('*').eq('sender_id', user.id).order('created_at', { ascending: false }),
  ])

  const roleLabels: Record<string, string> = {
    besucher: 'Besucher/in',
    neumitglied: 'Neumitglied',
    mitglied: 'Mitglied',
    vorstandsmitglied: 'Vorstandsmitglied',
    admin: 'Admin',
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mein Bereich</h1>
        <div className="h-1 w-16 bg-[--primary] rounded" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" /> Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-[--accent] flex items-center justify-center text-xl font-bold text-[--primary]">
                {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div>
                <div className="font-medium">{profile?.full_name ?? user.email}</div>
                <div className="text-sm text-[--muted-foreground]">{user.email}</div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">{roleLabels[profile?.role ?? 'besucher']}</Badge>
              {profile?.label && <Badge variant="outline">{profile.label}</Badge>}
            </div>
          </CardContent>
        </Card>

        {/* Starred Events */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4" /> Gemerkte Anlässe
            </CardTitle>
          </CardHeader>
          <CardContent>
            {starredEvents && starredEvents.length > 0 ? (
              <div className="space-y-3">
                {starredEvents.map(({ event_id, events: event }: any) => event && (
                  <div key={event_id} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-[--border]">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-[--primary] flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-[--muted-foreground]">{formatDate(event.start_date)}</div>
                      </div>
                    </div>
                    <StarButton eventId={event_id} userId={user.id} initialStarred={true} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[--muted-foreground] text-sm text-center py-4">
                Noch keine Anlässe gemerkt. Gehe zum <a href="/programm" className="text-[--primary] hover:underline">Programm</a>!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4" /> Meine Nachrichten
            </CardTitle>
          </CardHeader>
          <CardContent>
            {messages && messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className="p-4 rounded-lg border border-[--border]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{msg.subject}</span>
                      <span className="text-xs text-[--muted-foreground]">{formatDate(msg.created_at ?? '')}</span>
                    </div>
                    <p className="text-sm text-[--muted-foreground] line-clamp-2">{msg.body}</p>
                    {msg.reply && (
                      <div className="mt-3 p-3 rounded bg-[--accent] text-sm">
                        <span className="font-medium text-[--accent-foreground]">Antwort: </span>
                        {msg.reply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[--muted-foreground] text-sm text-center py-4">
                Noch keine Nachrichten. Schreib uns über die <a href="/kontakt" className="text-[--primary] hover:underline">Kontaktseite</a>!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
