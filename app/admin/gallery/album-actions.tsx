'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { AlbumForm } from './album-form'

export function AlbumActions({ album, events }: { album: any; events: any[] }) {
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm(`Album "${album.title}" wirklich löschen?`)) return
    const { error } = await supabase.from('photo_albums').delete().eq('id', album.id)
    if (error) { toast.error('Fehler beim Löschen'); return }
    toast.success('Album gelöscht')
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <AlbumForm album={album} events={events} />
      <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
