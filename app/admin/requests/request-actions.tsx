'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle, XCircle } from 'lucide-react'

export function RequestActions({ request }: { request: any }) {
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handle = async (status: 'approved' | 'rejected') => {
    setLoading(true)
    const { error } = await supabase.from('join_requests').update({
      status,
      admin_note: note || null,
      updated_at: new Date().toISOString(),
    }).eq('id', request.id)
    setLoading(false)
    if (error) { toast.error('Fehler: ' + error.message); return }
    toast.success(status === 'approved' ? 'Anfrage angenommen' : 'Anfrage abgelehnt')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Notiz (optional)" rows={2} className="text-sm" />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => handle('approved')} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-4 w-4" /> Annehmen
        </Button>
        <Button size="sm" variant="outline" onClick={() => handle('rejected')} disabled={loading} className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
          <XCircle className="h-4 w-4" /> Ablehnen
        </Button>
      </div>
    </div>
  )
}
