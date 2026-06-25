'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { EventForm } from './event-form'
import type { Event } from '@/lib/supabase/types'

export function EventActions({ event }: { event: Event }) {
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm(`Anlass "${event.title}" wirklich löschen?`)) return
    const { error } = await supabase.from('events').delete().eq('id', event.id)
    if (error) { toast.error('Fehler beim Löschen'); return }
    toast.success('Anlass gelöscht')
    router.refresh()
  }

  return (
    <div className="flex gap-2 flex-shrink-0">
      <EventForm event={event} />
      <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
