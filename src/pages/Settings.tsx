import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Modal } from '../components/Modal'
import type { SchoolYear } from '../types'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

function SchoolYearForm({ year, onSuccess, onCancel }: {
  year?: SchoolYear
  onSuccess: () => void
  onCancel: () => void
}) {
  const { user } = useAuth()
  const [name, setName] = useState(year?.name ?? '')
  const [startDate, setStartDate] = useState(year?.start_date ?? '')
  const [endDate, setEndDate] = useState(year?.end_date ?? '')
  const [isActive, setIsActive] = useState(year?.is_active ?? false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError('')
    const payload = { user_id: user.id, name, start_date: startDate, end_date: endDate, is_active: isActive }
    const { error: err } = year
      ? await supabase.from('school_years').update(payload).eq('id', year.id)
      : await supabase.from('school_years').insert(payload)
    setLoading(false)
    if (err) { setError(err.message); return }
    onSuccess()
  }

  const inputClass = 'w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent transition-colors'
  const labelClass = 'block text-xs text-muted font-medium mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Bezeichnung</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="2025/2026" className={inputClass} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Beginn</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Ende</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} required />
        </div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="accent-accent" />
        <span className="text-sm text-text">Aktives Schuljahr</span>
      </label>
      {error && <p className="text-grade-fail text-xs">{error}</p>}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 py-2 rounded-lg border border-border text-sm text-muted hover:text-text transition-colors">Abbrechen</button>
        <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover disabled:opacity-50 transition-colors">
          {loading ? 'Speichern…' : year ? 'Aktualisieren' : 'Erstellen'}
        </button>
      </div>
    </form>
  )
}

export function Settings() {
  const { user } = useAuth()
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [editYear, setEditYear] = useState<SchoolYear | undefined>()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!user) return
    const { data } = await supabase.from('school_years').select('*').eq('user_id', user.id).order('start_date', { ascending: false })
    setSchoolYears(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [user])

  async function deleteYear(id: string) {
    if (!confirm('Schuljahr löschen? Zugehörige Fächer bleiben erhalten.')) return
    await supabase.from('school_years').delete().eq('id', id)
    await load()
  }

  async function setActive(id: string) {
    if (!user) return
    await supabase.from('school_years').update({ is_active: false }).eq('user_id', user.id)
    await supabase.from('school_years').update({ is_active: true }).eq('id', id)
    await load()
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display font-bold text-2xl text-text">Einstellungen</h1>

      {/* Account */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="font-display font-semibold text-sm text-text mb-4">Konto</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text">{user?.email}</p>
            <p className="text-xs text-muted mt-0.5">Angemeldet seit {user?.created_at ? format(new Date(user.created_at), 'dd. MMMM yyyy', { locale: de }) : '–'}</p>
          </div>
        </div>
      </div>

      {/* School years */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-sm text-text">Schuljahre</h2>
          <button onClick={() => { setEditYear(undefined); setShowModal(true) }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent-hover transition-colors">
            <Plus size={14} /> Hinzufügen
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : schoolYears.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-muted text-sm">Noch keine Schuljahre konfiguriert.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {schoolYears.map((year, i) => (
              <div key={year.id} className={`flex items-center justify-between px-5 py-4 ${i < schoolYears.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex items-center gap-3">
                  {year.is_active && (
                    <span className="flex items-center gap-1 text-xs text-grade-6 bg-grade-6/10 px-2 py-0.5 rounded-full">
                      <Check size={10} /> Aktiv
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-text">{year.name}</p>
                    <p className="text-xs text-muted">
                      {format(new Date(year.start_date), 'dd.MM.yyyy')} – {format(new Date(year.end_date), 'dd.MM.yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!year.is_active && (
                    <button onClick={() => setActive(year.id)}
                      className="text-xs text-muted hover:text-grade-6 px-2 py-1 rounded-lg hover:bg-surface transition-colors">
                      Aktivieren
                    </button>
                  )}
                  <button onClick={() => { setEditYear(year); setShowModal(true) }}
                    className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteYear(year.id)}
                    className="p-1.5 rounded-lg text-muted hover:text-grade-fail hover:bg-surface transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grading info */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="font-display font-semibold text-sm text-text mb-3">Schweizer Notensystem</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { range: '5.5 – 6.0', label: 'Sehr gut', color: '#22C55E' },
            { range: '5.0 – 5.4', label: 'Gut', color: '#86EFAC' },
            { range: '4.5 – 4.9', label: 'Befriedigend', color: '#A3E635' },
            { range: '4.0 – 4.4', label: 'Genügend', color: '#F59E0B' },
            { range: '3.5 – 3.9', label: 'Knapp ungenügend', color: '#F97316' },
            { range: '1.0 – 3.4', label: 'Ungenügend', color: '#EF4444' },
          ].map(item => (
            <div key={item.range} className="flex items-center gap-2 p-2 bg-surface rounded-lg">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <div>
                <p className="text-xs font-medium text-text">{item.range}</p>
                <p className="text-xs text-muted">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3">Die Bestehensgrenze liegt bei <strong className="text-grade-4">4.0</strong>.</p>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editYear ? 'Schuljahr bearbeiten' : 'Schuljahr hinzufügen'}>
        <SchoolYearForm
          year={editYear}
          onSuccess={() => { setShowModal(false); load() }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}
