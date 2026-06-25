'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, X, Upload, Loader2, FileText, Image } from 'lucide-react'
import type { Event } from '@/lib/supabase/types'

interface Props {
  event?: Event
}

export function EventForm({ event }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<'image' | 'pdf' | null>(null)
  const [form, setForm] = useState({
    title: event?.title ?? '',
    description: event?.description ?? '',
    start_date: event?.start_date ?? '',
    end_date: event?.end_date ?? '',
    start_time: event?.start_time ?? '',
    end_time: event?.end_time ?? '',
    location: event?.location ?? '',
    image_url: event?.image_url ?? '',
    pdf_url: event?.pdf_url ?? '',
    is_published: event?.is_published ?? false,
  })
  const imageInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileUpload = async (file: File, type: 'image' | 'pdf') => {
    setUploading(type)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'events')
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setUploading(null)
    if (data.url) {
      setForm(f => ({ ...f, [type === 'image' ? 'image_url' : 'pdf_url']: data.url }))
      toast.success('Datei hochgeladen')
    } else {
      toast.error(data.error || 'Upload fehlgeschlagen')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.start_date) { toast.error('Titel und Datum sind Pflicht.'); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const payload = {
      ...form,
      end_date: form.end_date || null,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      image_url: form.image_url || null,
      pdf_url: form.pdf_url || null,
      created_by: user?.id,
    }
    const { error } = event
      ? await supabase.from('events').update(payload).eq('id', event.id)
      : await supabase.from('events').insert(payload)
    setLoading(false)
    if (error) { toast.error('Fehler: ' + error.message); return }
    toast.success(event ? 'Anlass aktualisiert' : 'Anlass erstellt')
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="h-4 w-4 mr-1" /> {event ? 'Bearbeiten' : 'Neuer Anlass'}
      </Button>

      {open && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div className="modal-content">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">{event ? 'Anlass bearbeiten' : 'Neuer Anlass'}</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Titel *</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Anlassbeschreibung" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Datum von *</Label>
                  <Input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Datum bis</Label>
                  <Input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Zeit von</Label>
                  <Input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Zeit bis</Label>
                  <Input type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Ort</Label>
                <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="z.B. Festplatz Burgdorf" />
              </div>
              <div className="space-y-1.5">
                <Label>Beschreibung</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
              </div>

              {/* Image upload */}
              <div className="space-y-1.5">
                <Label>Titelbild</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.image_url}
                    onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                    placeholder="URL oder Datei hochladen"
                    className="flex-1"
                  />
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image')}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={uploading === 'image'}
                    onClick={() => imageInputRef.current?.click()}
                    title="Bild hochladen"
                  >
                    {uploading === 'image' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Image className="h-4 w-4" />}
                  </Button>
                </div>
                {form.image_url && (
                  <img src={form.image_url} alt="Vorschau" className="h-20 w-auto rounded border object-cover mt-1" />
                )}
              </div>

              {/* PDF upload */}
              <div className="space-y-1.5">
                <Label>Flyer (PDF)</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.pdf_url}
                    onChange={e => setForm(f => ({ ...f, pdf_url: e.target.value }))}
                    placeholder="URL oder Datei hochladen"
                    className="flex-1"
                  />
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pdf')}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={uploading === 'pdf'}
                    onClick={() => pdfInputRef.current?.click()}
                    title="PDF hochladen"
                  >
                    {uploading === 'pdf' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                  </Button>
                </div>
                {form.pdf_url && (
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <FileText className="h-3 w-3" /> PDF hochgeladen
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.is_published}
                  onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="published" className="text-sm">Veröffentlicht</label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">Abbrechen</Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-1" />Speichern...</> : 'Speichern'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
