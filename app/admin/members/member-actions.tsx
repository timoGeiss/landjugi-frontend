'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Settings, X } from 'lucide-react'
import type { Profile } from '@/lib/supabase/types'

const roles = ['besucher', 'neumitglied', 'mitglied', 'vorstandsmitglied', 'admin'] as const
const labelOptions = ['', 'Präsident/in', 'Vizepräsident/in', 'Kassier/in', 'Aktuar/in', 'Beisitzer/in', 'Revisor/in']

export function MemberActions({ member }: { member: Profile }) {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState(member.role)
  const [label, setLabel] = useState(member.label ?? '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    const { error } = await supabase.from('profiles').update({ role, label: label || null, updated_at: new Date().toISOString() }).eq('id', member.id)
    setLoading(false)
    if (error) { toast.error('Fehler: ' + error.message); return }
    toast.success('Mitglied aktualisiert')
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Settings className="h-4 w-4" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[--card] rounded-xl w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Mitglied bearbeiten</h2>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="mb-3 text-sm text-[--muted-foreground]">{member.full_name} · {member.email}</div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Rolle</Label>
                <select value={role} onChange={e => setRole(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-[--border] bg-[--background] px-3 py-2 text-sm">
                  {roles.map(r => (
                    <option key={r} value={r}>
                      {r === 'besucher' ? 'Besucher/in' : r === 'neumitglied' ? 'Neumitglied' : r === 'mitglied' ? 'Mitglied' : r === 'vorstandsmitglied' ? 'Vorstandsmitglied' : 'Admin'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Label (Vorstandsamt)</Label>
                <select value={label} onChange={e => setLabel(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-[--border] bg-[--background] px-3 py-2 text-sm">
                  {labelOptions.map(l => <option key={l} value={l}>{l || '– Kein Label –'}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">Abbrechen</Button>
                <Button onClick={handleSave} disabled={loading} className="flex-1">{loading ? 'Speichern...' : 'Speichern'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
