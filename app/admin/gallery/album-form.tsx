'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, X, Upload } from 'lucide-react'

interface Props {
  events: { id: string; title: string }[]
  album?: any
}

export function AlbumForm({ events, album }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: album?.title ?? '',
    description: album?.description ?? '',
    event_id: album?.event_id ?? '',
    cover_url: album?.cover_url ?? '',
    is_published: album?.is_published ?? false,
  })
  const [photos, setPhotos] = useState<File[]>([])
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) { toast.error('Titel ist Pflicht'); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    let albumId = album?.id
    if (!album) {
      const { data, error } = await supabase.from('photo_albums').insert({
        title: form.title, description: form.description || null,
        event_id: form.event_id || null, cover_url: form.cover_url || null,
        is_published: form.is_published, created_by: user?.id,
      }).select().single()
      if (error) { toast.error(error.message); setLoading(false); return }
      albumId = data.id
    } else {
      await supabase.from('photo_albums').update({
        title: form.title, description: form.description || null,
        event_id: form.event_id || null, cover_url: form.cover_url || null,
        is_published: form.is_published,
      }).eq('id', album.id)
    }

    // Upload photos
    for (const file of photos) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', `albums/${albumId}`)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        await supabase.from('photos').insert({ album_id: albumId, url: data.url, thumbnail_url: data.url })
      }
    }

    setLoading(false)
    toast.success(album ? 'Album aktualisiert' : 'Album erstellt')
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="h-4 w-4" /> {album ? 'Bearbeiten' : 'Neues Album'}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[--card] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">{album ? 'Album bearbeiten' : 'Neues Album'}</h2>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Titel *</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Beschreibung</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
              </div>
              <div className="space-y-1.5">
                <Label>Verknüpfter Anlass</Label>
                <select value={form.event_id} onChange={e => setForm(f => ({ ...f, event_id: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-[--border] bg-[--background] px-3 py-2 text-sm">
                  <option value="">Kein Anlass</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Cover-Bild URL</Label>
                <Input value={form.cover_url} onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="space-y-1.5">
                <Label>Fotos hochladen</Label>
                <label className="flex items-center gap-2 cursor-pointer border border-dashed border-[--border] rounded-md p-3 hover:border-[--primary]">
                  <Upload className="h-4 w-4 text-[--muted-foreground]" />
                  <span className="text-sm text-[--muted-foreground]">
                    {photos.length > 0 ? `${photos.length} Foto(s) ausgewählt` : 'Fotos auswählen'}
                  </span>
                  <input type="file" accept="image/*" multiple className="hidden"
                    onChange={e => setPhotos(Array.from(e.target.files ?? []))} />
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pub" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} />
                <label htmlFor="pub" className="text-sm">Öffentlich sichtbar</label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">Abbrechen</Button>
                <Button type="submit" disabled={loading} className="flex-1">{loading ? 'Speichern...' : 'Speichern'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
