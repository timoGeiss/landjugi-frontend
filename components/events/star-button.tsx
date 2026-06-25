'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Props {
  eventId: string
  userId: string
  initialStarred: boolean
}

export function StarButton({ eventId, userId, initialStarred }: Props) {
  const [starred, setStarred] = useState(initialStarred)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const toggle = async () => {
    setLoading(true)
    if (starred) {
      await supabase.from('starred_events').delete().match({ event_id: eventId, user_id: userId })
      setStarred(false)
      toast('Aus Merkliste entfernt')
    } else {
      await supabase.from('starred_events').insert({ event_id: eventId, user_id: userId })
      setStarred(true)
      toast.success('Auf Merkliste gesetzt')
    }
    setLoading(false)
  }

  return (
    <button onClick={toggle} disabled={loading} className="p-1.5 rounded-md hover:bg-[--secondary] transition-colors" title={starred ? 'Von Merkliste entfernen' : 'Merken'}>
      <Star className={cn('h-4 w-4 transition-colors', starred ? 'fill-yellow-400 text-yellow-400' : 'text-[--muted-foreground]')} />
    </button>
  )
}
