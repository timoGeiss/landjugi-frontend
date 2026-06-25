'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Trash2, Save } from 'lucide-react'
import type { VorstandMember } from '@/lib/supabase/types'

const labelOptions = ['Präsident/in', 'Vizepräsident/in', 'Kassier/in', 'Aktuar/in', 'Beisitzer/in', 'Revisor/in']

export function VorstandEditor({ members: initial }: { members: VorstandMember[] }) {
  const [members, setMembers] = useState(initial)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const update = (id: string, field: string, value: string) => {
    setMembers(ms => ms.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const add = () => {
    setMembers(ms => [...ms, {
      id: crypto.randomUUID(),
      full_name: '', label: 'Beisitzer/in', email: null, phone: null,
      image_url: null, sort_order: ms.length + 1, is_active: true,
      profile_id: null, created_at: new Date().toISOString(),
    }])
  }

  const remove = async (id: string) => {
    const existing = initial.find(m => m.id === id)
    if (existing) await supabase.from('vorstand').delete().eq('id', id)
    setMembers(ms => ms.filter(m => m.id !== id))
    router.refresh()
  }

  const handleSave = async () => {
    setSaving(true)
    for (const member of members) {
      const isNew = !initial.find(m => m.id === member.id)
      const payload = {
        full_name: member.full_name,
        label: member.label,
        email: member.email,
        phone: member.phone,
        sort_order: member.sort_order,
        is_active: member.is_active,
      }
      if (isNew) {
        await supabase.from('vorstand').insert({ ...payload, id: member.id })
      } else {
        await supabase.from('vorstand').update(payload).eq('id', member.id)
      }
    }
    setSaving(false)
    toast.success('Vorstand gespeichert')
    router.refresh()
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {members.map((member, i) => (
        <div key={member.id} className="p-4 border border-[--border] rounded-xl bg-[--card] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[--muted-foreground]">#{i + 1}</span>
            <button onClick={() => remove(member.id)} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Name</Label>
              <Input value={member.full_name} onChange={e => update(member.id, 'full_name', e.target.value)} placeholder="Vor- und Nachname" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Funktion</Label>
              <select value={member.label} onChange={e => update(member.id, 'label', e.target.value)}
                className="flex h-10 w-full rounded-md border border-[--border] bg-[--background] px-3 py-2 text-sm">
                {labelOptions.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">E-Mail</Label>
              <Input value={member.email ?? ''} onChange={e => update(member.id, 'email', e.target.value)} type="email" placeholder="optional" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Telefon</Label>
              <Input value={member.phone ?? ''} onChange={e => update(member.id, 'phone', e.target.value)} placeholder="optional" />
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <Button variant="outline" onClick={add}>
          <Plus className="h-4 w-4" /> Person hinzufügen
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? 'Speichern...' : 'Alle speichern'}
        </Button>
      </div>
    </div>
  )
}
