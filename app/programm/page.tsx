import { createClient } from '@/lib/supabase/server'
import { formatDate, isPastEvent } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, MapPin, Clock, FileText } from 'lucide-react'

export const metadata = { title: 'Programm' }

export default async function ProgrammPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('start_date', { ascending: false })

  const upcoming = events?.filter(e => !isPastEvent(e.start_date)) ?? []
  const past = events?.filter(e => isPastEvent(e.start_date)) ?? []

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Programm</h1>
        <div className="h-1 w-16 bg-[--primary] rounded" />
        <p className="text-[--muted-foreground] mt-3">Unsere geplanten und vergangenen Anlässe.</p>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
            Kommende Anlässe
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming.map(event => (
              <EventCard key={event.id} event={event} upcoming />
            ))}
          </div>
        </section>
      )}

      {upcoming.length === 0 && (
        <div className="text-center py-10 text-[--muted-foreground] border border-dashed border-[--border] rounded-xl mb-12">
          <CalendarDays className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>Aktuell sind keine Anlässe geplant.</p>
        </div>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gray-400 inline-block" />
            Vergangene Anlässe
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-75">
            {past.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function EventCard({ event, upcoming }: { event: any; upcoming?: boolean }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {event.image_url ? (
        <div className="h-40 overflow-hidden">
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-[--accent] to-[--secondary] flex items-center justify-center">
          <CalendarDays className="h-12 w-12 text-[--primary]/25" />
        </div>
      )}
      <CardContent className="pt-4">
        {upcoming && <Badge variant="success" className="mb-2">Geplant</Badge>}
        <h3 className="font-semibold text-base mb-2 line-clamp-2">{event.title}</h3>
        <div className="space-y-1.5 text-sm text-[--muted-foreground]">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" />
            {formatDate(event.start_date)}
            {event.end_date && event.end_date !== event.start_date && ` – ${formatDate(event.end_date)}`}
          </div>
          {event.start_time && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              {event.start_time.slice(0, 5)}{event.end_time && ` – ${event.end_time.slice(0, 5)}`} Uhr
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              {event.location}
            </div>
          )}
        </div>
        {event.description && (
          <p className="text-sm text-[--muted-foreground] mt-3 line-clamp-3">{event.description}</p>
        )}
        {event.pdf_url && (
          <a href={event.pdf_url} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-[--primary] hover:underline">
            <FileText className="h-3.5 w-3.5" /> Flyer öffnen
          </a>
        )}
      </CardContent>
    </Card>
  )
}
