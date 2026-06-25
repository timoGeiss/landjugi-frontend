'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

const fields = [
  { key: 'welcome_title', label: 'Startseite – Titel', type: 'input' },
  { key: 'welcome_subtitle', label: 'Startseite – Untertitel', type: 'input' },
  { key: 'about_title', label: 'Über uns – Titel', type: 'input' },
  { key: 'about_text', label: 'Über uns – Text', type: 'textarea' },
  { key: 'contact_address', label: 'Kontakt – Adresse', type: 'input' },
  { key: 'contact_email', label: 'Kontakt – E-Mail', type: 'input' },
]

interface Props {
  initialContent: Record<string, string>
}

export function ContentEditor({ initialContent }: Props) {
  const [content, setContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const updates = fields.map(f => ({
      key: f.key,
      value: content[f.key] ?? '',
      updated_at: new Date().toISOString(),
      updated_by: user?.id,
    }))
    const { error } = await supabase.from('site_content').upsert(updates, { onConflict: 'key' })
    setSaving(false)
    if (error) { toast.error('Fehler: ' + error.message); return }
    toast.success('Inhalt gespeichert')
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {fields.map(field => (
        <div key={field.key} className="space-y-1.5">
          <Label>{field.label}</Label>
          {field.type === 'textarea' ? (
            <Textarea value={content[field.key] ?? ''} onChange={e => setContent(c => ({ ...c, [field.key]: e.target.value }))} rows={4} />
          ) : (
            <Input value={content[field.key] ?? ''} onChange={e => setContent(c => ({ ...c, [field.key]: e.target.value }))} />
          )}
        </div>
      ))}
      <Button onClick={handleSave} disabled={saving}>
        <Save className="h-4 w-4" /> {saving ? 'Speichern...' : 'Alles speichern'}
      </Button>
    </div>
  )
}
