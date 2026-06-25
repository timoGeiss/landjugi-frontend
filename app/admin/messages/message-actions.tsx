'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Reply, Eye } from 'lucide-react'

export function MessageActions({ message }: { message: any }) {
  const [reply, setReply] = useState(message.reply ?? '')
  const [showReply, setShowReply] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const markRead = async () => {
    await supabase.from('messages').update({ is_read: true }).eq('id', message.id)
    router.refresh()
  }

  const sendReply = async () => {
    if (!reply.trim()) return
    setLoading(true)
    const { error } = await supabase.from('messages').update({
      reply,
      replied_at: new Date().toISOString(),
      is_read: true,
    }).eq('id', message.id)
    setLoading(false)
    if (error) { toast.error('Fehler'); return }
    toast.success('Antwort gespeichert')
    setShowReply(false)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-2 min-w-[180px]">
      {!message.is_read && (
        <Button size="sm" variant="outline" onClick={markRead}>
          <Eye className="h-4 w-4" /> Als gelesen
        </Button>
      )}
      {!showReply ? (
        <Button size="sm" variant="outline" onClick={() => setShowReply(true)}>
          <Reply className="h-4 w-4" /> {message.reply ? 'Antwort bearbeiten' : 'Antworten'}
        </Button>
      ) : (
        <div className="space-y-2">
          <Textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} placeholder="Antwort..." />
          <div className="flex gap-2">
            <Button size="sm" onClick={sendReply} disabled={loading} className="flex-1">Speichern</Button>
            <Button size="sm" variant="outline" onClick={() => setShowReply(false)}>Abbrechen</Button>
          </div>
        </div>
      )}
    </div>
  )
}
