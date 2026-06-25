'use client'

import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, MapPin, Clock, FileText } from 'lucide-react'
import { StarButton } from '@/components/events/star-button'

interface Event {
  id: string
  title: string
  description?: string | null
  start_date: string
  end_date?: string | null
  start_time?: string | null
  end_time?: string | null
  location?: string | null
  image_url?: string | null
  pdf_url?: string | null
}

interface Props {
  events: Event[]
  starredIds: string[]
  userId: string | null
  upcoming?: boolean
}

export function ProgrammGrid({ events, starredIds, userId, upcoming }: Props) {
  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-5 ${upcoming ? '' : 'opacity-80'}`}>
      {events.map(event => (
        <div key={event.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
          {event.image_url ? (
            <div className="h-44 overflow-hidden">
              <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-44 bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center">
              <CalendarDays className="h-12 w-12 text-primary opacity-20" />
            </div>
          )}
          <div className="p-4 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {upcoming && <Badge variant="success">Geplant</Badge>}
              </div>
              {userId && (
                <StarButton
                  eventId={event.id}
                  userId={userId}
                  initialStarred={starredIds.includes(event.id)}
                />
              )}
            </div>
            <h3 className="font-semibold text-base mb-2 line-clamp-2">{event.title}</h3>
            <div className="space-y-1.5 text-sm text-muted-foreground">
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
              <p className="text-sm text-muted-foreground mt-3 line-clamp-3 flex-1">{event.description}</p>
            )}
            {event.pdf_url && (
              <a href={event.pdf_url} target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium">
                <FileText className="h-3.5 w-3.5" /> Flyer öffnen
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
