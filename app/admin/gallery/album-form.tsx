'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react'

interface Props {
  events: { id: string; title: string }[]
  album?: any
}

export function AlbumForm({ events, album }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [form, setForm] = useState({
    title: album?.title ?? '',
    description: album?.description ?? '',
    event_id: album?.event_id ?? '',
    cover_url: album?.cover_url ?? '',
    is_published: album?.is_published ?? true,
  })
  const [photos, setPhotos] = useState<File[]>([])
  const coverInputRef = useRef<HTMLInputElement>(null)
  const photosInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', folder)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    return data.url ?? null
  }

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true)
    const url = await uploadFile(file, 'albums/covers')
    setUploadingCover(false)
    if (url) { setForm(f => ({ ...f, cover_url: url })); toast.success('Cover hochgeladen') }
    else toast.error('Cover-Upload fehlgeschlagen')
  }

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

    if (photos.length > 0) {
      setUploadingPhotos(true)
      for (const file of photos) {
        const url = await uploadFile(file, `albums/${albumId}`)
        if (url) await supabase.from('photos').insert({ album_id: albumId, url, thumbnail_url: url })
      }
      setUploadingPhotos(false)
    }

    setLoading(false)
    toast.success(album ? 'Album aktualisiert' : 'Album erstellt')
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="h-4 w-4 mr-1" /> {album ? 'Bearbeiten' : 'Neues Album'}
      </Button>

      {open && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div className="modal-content">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">{album ? 'Album bearbeiten' : 'Neues Album'}</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-100"><X className="h-5 w-5" /></button>
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
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                  <option value="">Kein Anlass</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Cover-Bild</Label>
                <div className="flex gap-2">
                  <Input value={form.cover_url} onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))} placeholder="URL oder hochladen" className="flex-1" />
                  <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && handleCoverUpload(e.target.files[0])} />
                  <Button type="button" variant="outline" size="icon" disabled={uploadingCover}
                    onClick={() => coverInputRef.current?.click()} title="Bild hochladen">
                    {uploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                  </Button>
                </div>
                {form.cover_url && <img src={form.cover_url} alt="Cover" className="h-20 w-auto rounded border object-cover mt-1" />}
              </div>

              <div className="space-y-1.5">
                <Label>Fotos hochladen</Label>
                <button type="button" onClick={() => photosInputRef.current?.click()}
                  className="flex items-center gap-2 w-full border border-dashed border-gray-300 rounded-md p-3 hover:border-primary transition-colors text-left">
                  <Upload className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-500">
                    {photos.length > 0 ? `${photos.length} Foto(s) ausgewählt` : 'Fotos auswählen (mehrere möglich)'}
                  </span>
                </button>
                <input ref={photosInputRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={e => setPhotos(Array.from(e.target.files ?? []))} />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="pub" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} />
                <label htmlFor="pub" className="text-sm">Öffentlich sichtbar</label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">Abbrechen</Button>
                <Button type="submit" disabled={loading || uploadingPhotos} className="flex-1">
                  {(loading || uploadingPhotos) ? <><Loader2 className="h-4 w-4 animate-spin mr-1" />Speichern...</> : 'Speichern'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
