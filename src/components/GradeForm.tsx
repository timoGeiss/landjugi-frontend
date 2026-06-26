import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Grade, Subject } from '../types'
import { GRADE_TYPE_LABELS } from '../types'

interface GradeFormProps {
  subjects: Subject[]
  grade?: Grade
  defaultSubjectId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function GradeForm({ subjects, grade, defaultSubjectId, onSuccess, onCancel }: GradeFormProps) {
  const { user } = useAuth()
  const [subjectId, setSubjectId] = useState(grade?.subject_id ?? defaultSubjectId ?? subjects[0]?.id ?? '')
  const [value, setValue] = useState(grade?.value.toString() ?? '')
  const [date, setDate] = useState(grade?.date ?? new Date().toISOString().split('T')[0])
  const [type, setType] = useState<Grade['type']>(grade?.type ?? 'exam')
  const [weight, setWeight] = useState(grade?.weight.toString() ?? '1')
  const [notes, setNotes] = useState(grade?.notes ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const numVal = parseFloat(value)
  const isValidGrade = !isNaN(numVal) && numVal >= 1 && numVal <= 6

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !isValidGrade) return
    setLoading(true)
    setError('')

    const payload = {
      user_id: user.id,
      subject_id: subjectId,
      value: numVal,
      date,
      type,
      weight: parseFloat(weight) || 1,
      notes: notes || null,
    }

    const { error: err } = grade
      ? await supabase.from('grades').update(payload).eq('id', grade.id)
      : await supabase.from('grades').insert(payload)

    setLoading(false)
    if (err) { setError(err.message); return }
    onSuccess()
  }

  const inputClass = 'w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors'
  const labelClass = 'block text-xs text-muted font-medium mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Fach</label>
        <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className={inputClass}>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Note (1–6)</label>
          <input
            type="number" min="1" max="6" step="0.1"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="5.5"
            className={`${inputClass} ${value && !isValidGrade ? 'border-grade-fail' : ''}`}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Gewicht</label>
          <input
            type="number" min="0.5" max="3" step="0.5"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Datum</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Art</label>
          <select value={type} onChange={e => setType(e.target.value as Grade['type'])} className={inputClass}>
            {(Object.entries(GRADE_TYPE_LABELS) as [Grade['type'], string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Notizen (optional)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          placeholder="z.B. Thema, Kommentar..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && <p className="text-grade-fail text-xs">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2 rounded-lg border border-border text-sm text-muted hover:text-text hover:border-muted transition-colors">
          Abbrechen
        </button>
        <button type="submit" disabled={loading || !isValidGrade}
          className="flex-1 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover disabled:opacity-50 transition-colors">
          {loading ? 'Speichern…' : grade ? 'Aktualisieren' : 'Note erfassen'}
        </button>
      </div>
    </form>
  )
}
