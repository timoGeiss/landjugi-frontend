import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Award, BookOpen, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { GradeRing } from '../components/GradeRing'
import { TrendBadge } from '../components/TrendBadge'
import { Modal } from '../components/Modal'
import { GradeForm } from '../components/GradeForm'
import type { Subject, Grade, SchoolYear } from '../types'
import { calcAverage, calcTrend, gradeColor, gradeLabel } from '../types'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export function Dashboard() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!user) return
    const [{ data: sy }, { data: sub }, { data: gr }] = await Promise.all([
      supabase.from('school_years').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
      supabase.from('subjects').select('*').eq('user_id', user.id).order('name'),
      supabase.from('grades').select('*').eq('user_id', user.id).order('date', { ascending: false }),
    ])
    setSchoolYears(sy ?? [])
    setSubjects(sub ?? [])
    setGrades(gr ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [user])

  const activeYear = schoolYears.find(y => y.is_active)

  const subjectsWithStats = subjects.map(s => {
    const sg = grades.filter(g => g.subject_id === s.id)
    return { subject: s, grades: sg, avg: calcAverage(sg), trend: calcTrend(sg) }
  })

  const overallAvg = (() => {
    const avgs = subjectsWithStats.filter(s => s.avg != null)
    if (!avgs.length) return null
    const total = avgs.reduce((sum, s) => sum + s.avg! * s.subject.weight, 0)
    const weights = avgs.reduce((sum, s) => sum + s.subject.weight, 0)
    return Math.round((total / weights) * 100) / 100
  })()

  const recentGrades = grades.slice(0, 5)
  const failingSubjects = subjectsWithStats.filter(s => s.avg != null && s.avg < 4)
  const bestSubject = subjectsWithStats.reduce<typeof subjectsWithStats[0] | null>((best, s) =>
    s.avg != null && (best == null || s.avg > (best.avg ?? 0)) ? s : best, null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-text">Übersicht</h1>
          {activeYear && (
            <p className="text-muted text-sm mt-0.5">Schuljahr {activeYear.name}</p>
          )}
        </div>
        <button onClick={() => { setSelectedSubjectId(undefined); setShowGradeModal(true) }}
          disabled={subjects.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-hover disabled:opacity-50 transition-colors shadow-lg shadow-accent/20">
          <Plus size={16} /> Note erfassen
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <BookOpen size={40} className="mx-auto text-muted mb-4" />
          <h2 className="font-display font-semibold text-text mb-2">Noch keine Fächer</h2>
          <p className="text-muted text-sm mb-6">Füge deine Schulfächer hinzu, um Noten zu erfassen.</p>
          <Link to="/subjects"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-hover transition-colors">
            <Plus size={16} /> Fächer hinzufügen
          </Link>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Gesamtdurchschnitt', value: overallAvg?.toFixed(2) ?? '–', sub: overallAvg ? gradeLabel(overallAvg) : 'Noch keine Noten', color: overallAvg ? gradeColor(overallAvg) : '#8496B0', icon: Award },
              { label: 'Fächer', value: subjects.length.toString(), sub: 'aktiv', color: '#3B82F6', icon: BookOpen },
              { label: 'Noten gesamt', value: grades.length.toString(), sub: 'erfasst', color: '#8B5CF6', icon: TrendingUp },
              { label: 'Ungenügende', value: failingSubjects.length.toString(), sub: failingSubjects.length > 0 ? 'Fächer unter 4.0' : 'Alles im grünen Bereich', color: failingSubjects.length > 0 ? '#EF4444' : '#22C55E', icon: AlertTriangle },
            ].map(stat => (
              <div key={stat.label} className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted">{stat.label}</span>
                  <stat.icon size={14} style={{ color: stat.color }} />
                </div>
                <p className="font-display font-bold text-2xl" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-muted mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Subject rings */}
          <div>
            <h2 className="font-display font-semibold text-base text-text mb-4">Fachübersicht</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjectsWithStats.map(({ subject, grades: sg, avg, trend }) => (
                <div key={subject.id}
                  className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-accent/40 transition-colors cursor-pointer group"
                  onClick={() => { setSelectedSubjectId(subject.id); setShowGradeModal(true) }}>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium text-muted truncate">{subject.name}</span>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: subject.color }} />
                  </div>
                  <GradeRing value={avg} size={88} sublabel={avg ? `${sg.length} Note${sg.length !== 1 ? 'n' : ''}` : 'Keine Noten'} />
                  <div className="flex items-center gap-2">
                    <TrendBadge value={trend} />
                    {avg == null && <span className="text-xs text-muted">Keine Noten</span>}
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-accent transition-opacity">
                    <Plus size={12} /> Note erfassen
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent grades + best subject */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-card border border-border rounded-2xl p-5">
              <h2 className="font-display font-semibold text-sm text-text mb-4">Letzte Noten</h2>
              {recentGrades.length === 0 ? (
                <p className="text-muted text-sm">Noch keine Noten erfasst.</p>
              ) : (
                <div className="space-y-2">
                  {recentGrades.map(g => {
                    const sub = subjects.find(s => s.id === g.subject_id)
                    return (
                      <div key={g.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sub?.color ?? '#3B82F6' }} />
                          <div>
                            <p className="text-sm text-text">{sub?.name ?? 'Unbekanntes Fach'}</p>
                            <p className="text-xs text-muted">{format(new Date(g.date), 'dd. MMM yyyy', { locale: de })}</p>
                          </div>
                        </div>
                        <span className="font-display font-bold text-lg" style={{ color: gradeColor(g.value) }}>
                          {g.value.toFixed(1)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
              {grades.length > 5 && (
                <Link to="/grades" className="mt-3 text-xs text-accent hover:underline block">Alle Noten anzeigen →</Link>
              )}
            </div>

            {bestSubject && bestSubject.avg != null && (
              <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                <Award size={20} className="text-grade-4 mb-2" />
                <p className="text-xs text-muted mb-3">Bestes Fach</p>
                <GradeRing value={bestSubject.avg} size={80} />
                <p className="font-display font-semibold text-sm text-text mt-4">{bestSubject.subject.name}</p>
              </div>
            )}
          </div>
        </>
      )}

      <Modal open={showGradeModal} onClose={() => setShowGradeModal(false)} title="Note erfassen">
        <GradeForm
          subjects={subjects}
          defaultSubjectId={selectedSubjectId}
          onSuccess={() => { setShowGradeModal(false); load() }}
          onCancel={() => setShowGradeModal(false)}
        />
      </Modal>
    </div>
  )
}
