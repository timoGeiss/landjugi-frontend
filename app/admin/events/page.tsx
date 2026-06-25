import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { EventActions } from './event-actions'
import { EventForm } from './event-form'

export const metadata = { title: 'Anlässe verwalten' }

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Anlässe</h1>
        <EventForm />
      </div>

      <div className="space-y-3">
        {events?.map(event => (
          <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl border border-[--border] bg-[--card]">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-[--secondary] flex-shrink-0">
              {event.image_url ? (
                <img src={event.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[--muted-foreground]">Kein Bild</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold truncate">{event.title}</span>
                <Badge variant={event.is_published ? 'success' : 'secondary'}>
                  {event.is_published ? 'Veröffentlicht' : 'Entwurf'}
                </Badge>
              </div>
              <div className="text-sm text-[--muted-foreground]">
                {formatDate(event.start_date)}{event.location ? ` · ${event.location}` : ''}
              </div>
            </div>
            <EventActions event={event} />
          </div>
        ))}
        {(!events || events.length === 0) && (
          <div className="text-center py-12 text-[--muted-foreground] border border-dashed border-[--border] rounded-xl">
            Noch keine Anlässe. Erstelle den ersten!
          </div>
        )}
      </div>
    </div>
  )
}
