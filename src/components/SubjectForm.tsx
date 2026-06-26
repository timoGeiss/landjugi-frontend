import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Subject, SchoolYear } from '../types'
import { SUBJECT_COLORS } from '../types'

interface SubjectFormProps {
  schoolYears: SchoolYear[]
  subject?: Subject
  onSuccess: () => void
  onCancel: () => void
}

export function SubjectForm({ schoolYears, subject, onSuccess, onCancel }: SubjectFormProps) {
  const { user } = useAuth()
  const activeYear = schoolYears.find(y => y.is_active)
  const [name, setName] = useState(subject?.name ?? '')
  const [shortName, setShortName] = useState(subject?.short_name ?? '')
  const [color, setColor] = useState(subject?.color ?? SUBJECT_COLORS[0])
  const [weight, setWeight] = useState(subject?.weight.toString() ?? '1')
  const [teacher, setTeacher] = useState(subject?.teacher ?? '')
  const [schoolYearId, setSchoolYearId] = useState(subject?.school_year_id ?? activeYear?.id ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !name.trim()) return
    setLoading(true)
    setError('')

    const payload = {
      user_id: user.id,
      name: name.trim(),
      short_name: shortName.trim() || null,
      color,
      weight: parseFloat(weight) || 1,
      teacher: teacher.trim() || null,
      school_year_id: schoolYearId || null,
    }

    const { error: err } = subject
      ? await supabase.from('subjects').update(payload).eq('id', subject.id)
      : await supabase.from('subjects').insert(payload)

    setLoading(false)
    if (err) { setError(err.message); return }
    onSuccess()
  }

  const inputClass = 'w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors'
  const labelClass = 'block text-xs text-muted font-medium mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className={labelClass}>Fachname</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Mathematik" className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Kürzel</label>
          <input value={shortName} onChange={e => setShortName(e.target.value)} placeholder="M" className={inputClass} maxLength={5} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Lehrkraft</label>
          <input value={teacher} onChange={e => setTeacher(e.target.value)} placeholder="Mustermann" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Gewicht</label>
          <input type="number" min="0.5" max="3" step="0.5" value={weight} onChange={e => setWeight(e.target.value)} className={inputClass} />
        </div>
      </div>

      {schoolYears.length > 0 && (
        <div>
          <label className={labelClass}>Schuljahr</label>
          <select value={schoolYearId} onChange={e => setSchoolYearId(e.target.value)} className={inputClass}>
            <option value="">Kein Schuljahr</option>
            {schoolYears.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className={labelClass}>Farbe</label>
        <div className="flex gap-2 flex-wrap">
          {SUBJECT_COLORS.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)}
              className="w-7 h-7 rounded-full border-2 transition-all"
              style={{ backgroundColor: c, borderColor: color === c ? '#fff' : 'transparent' }}
            />
          ))}
        </div>
      </div>

      {error && <p className="text-grade-fail text-xs">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2 rounded-lg border border-border text-sm text-muted hover:text-text hover:border-muted transition-colors">
          Abbrechen
        </button>
        <button type="submit" disabled={loading || !name.trim()}
          className="flex-1 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover disabled:opacity-50 transition-colors">
          {loading ? 'Speichern…' : subject ? 'Aktualisieren' : 'Fach hinzufügen'}
        </button>
      </div>
    </form>
  )
}
