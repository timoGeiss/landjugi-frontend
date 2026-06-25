import { createClient } from '@/lib/supabase/server'
import { isPastEvent } from '@/lib/utils'
import { CalendarDays } from 'lucide-react'
import { ProgrammGrid } from '@/components/events/programm-grid'

export const metadata = { title: 'Programm' }

export default async function ProgrammPage() {
  const supabase = await createClient()

  const [{ data: events }, { data: { user } }] = await Promise.all([
    supabase.from('events').select('*').eq('is_published', true).order('start_date', { ascending: true }),
    supabase.auth.getUser(),
  ])

  let starredIds: string[] = []
  if (user) {
    const { data } = await supabase.from('starred_events').select('event_id').eq('user_id', user.id)
    starredIds = data?.map(s => s.event_id) ?? []
  }

  const upcoming = events?.filter(e => !isPastEvent(e.start_date)) ?? []
  const past = events?.filter(e => isPastEvent(e.start_date)).reverse() ?? []

  return (
    <div className="container py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Programm</h1>
        <div className="h-1 w-16 bg-primary rounded" />
        <p className="text-muted-foreground mt-3">Unsere geplanten und vergangenen Anlässe.</p>
      </div>

      {upcoming.length > 0 ? (
        <section className="mb-14">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
            Kommende Anlässe
          </h2>
          <ProgrammGrid events={upcoming} starredIds={starredIds} userId={user?.id ?? null} upcoming />
        </section>
      ) : (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-gray-200 rounded-xl mb-14">
          <CalendarDays className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>Aktuell sind keine Anlässe geplant.</p>
        </div>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gray-400 inline-block" />
            Vergangene Anlässe
          </h2>
          <ProgrammGrid events={past} starredIds={starredIds} userId={user?.id ?? null} />
        </section>
      )}
    </div>
  )
}
