import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { GradeForm } from '../components/GradeForm'
import { Modal } from '../components/Modal'
import type { Grade, Subject } from '../types'
import { gradeColor, GRADE_TYPE_LABELS } from '../types'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export function Grades() {
  const { user } = useAuth()
  const [grades, setGrades] = useState<Grade[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [editGrade, setEditGrade] = useState<Grade | undefined>()
  const [showModal, setShowModal] = useState(false)
  const [filterSubject, setFilterSubject] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!user) return
    const [{ data: gr }, { data: sub }] = await Promise.all([
      supabase.from('grades').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      supabase.from('subjects').select('*').eq('user_id', user.id).order('name'),
    ])
    setGrades(gr ?? [])
    setSubjects(sub ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [user])

  async function deleteGrade(id: string) {
    if (!confirm('Note wirklich löschen?')) return
    await supabase.from('grades').delete().eq('id', id)
    setGrades(prev => prev.filter(g => g.id !== id))
  }

  const filtered = filterSubject ? grades.filter(g => g.subject_id === filterSubject) : grades
  const grouped = filtered.reduce<Record<string, Grade[]>>((acc, g) => {
    const month = g.date.slice(0, 7)
    acc[month] = acc[month] ? [...acc[month], g] : [g]
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-text">Noten</h1>
        <button onClick={() => { setEditGrade(undefined); setShowModal(true) }}
          disabled={subjects.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-hover disabled:opacity-50 transition-colors shadow-lg shadow-accent/20">
          <Plus size={16} /> Neue Note
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-muted" />
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-text focus:outline-none focus:border-accent">
          <option value="">Alle Fächer</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <p className="text-muted">Noch keine Noten vorhanden.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([month, monthGrades]) => (
            <div key={month}>
              <h2 className="font-display font-semibold text-sm text-muted uppercase tracking-wider mb-3">
                {format(new Date(month + '-01'), 'MMMM yyyy', { locale: de })}
              </h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {monthGrades.map((grade, i) => {
                  const sub = subjects.find(s => s.id === grade.subject_id)
                  return (
                    <div key={grade.id}
                      className={`flex items-center justify-between px-5 py-3.5 ${i < monthGrades.length - 1 ? 'border-b border-border' : ''}`}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sub?.color ?? '#3B82F6' }} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text">{sub?.name ?? '–'}</p>
                          <p className="text-xs text-muted">
                            {format(new Date(grade.date), 'dd.MM.yyyy', { locale: de })} ·{' '}
                            {GRADE_TYPE_LABELS[grade.type]}
                            {grade.weight !== 1 && ` · ×${grade.weight}`}
                          </p>
                          {grade.notes && <p className="text-xs text-muted truncate mt-0.5">{grade.notes}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="font-display font-bold text-xl" style={{ color: gradeColor(grade.value) }}>
                          {grade.value.toFixed(1)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditGrade(grade); setShowModal(true) }}
                            className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => deleteGrade(grade.id)}
                            className="p-1.5 rounded-lg text-muted hover:text-grade-fail hover:bg-surface transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editGrade ? 'Note bearbeiten' : 'Note erfassen'}>
        <GradeForm
          subjects={subjects}
          grade={editGrade}
          onSuccess={() => { setShowModal(false); load() }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}
