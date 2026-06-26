import { useEffect, useState } from 'react'
import { FileText, Download } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { GradeRing } from '../components/GradeRing'
import { TrendBadge } from '../components/TrendBadge'
import { exportPDF } from '../lib/pdfExport'
import type { Subject, Grade, SchoolYear } from '../types'
import { calcAverage, calcTrend, gradeColor } from '../types'
import { format, isWithinInterval, parseISO, startOfMonth, endOfMonth, endOfQuarter } from 'date-fns'
import { de } from 'date-fns/locale'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

type PeriodType = 'year' | 'quarter' | 'month'

const QUARTERS = ['Q1 (Aug–Okt)', 'Q2 (Nov–Jan)', 'Q3 (Feb–Apr)', 'Q4 (Mai–Jul)']

export function Reports() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [periodType, setPeriodType] = useState<PeriodType>('year')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedQuarter, setSelectedQuarter] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('subjects').select('*').eq('user_id', user.id).order('name'),
      supabase.from('grades').select('*').eq('user_id', user.id).order('date'),
      supabase.from('school_years').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
    ]).then(([{ data: s }, { data: g }, { data: sy }]) => {
      setSubjects(s ?? [])
      setGrades(g ?? [])
      setSchoolYears(sy ?? [])
      const active = (sy ?? []).find(y => y.is_active)
      if (active) setSelectedYear(active.id)
      else if ((sy ?? []).length > 0) setSelectedYear((sy ?? [])[0].id)
      setLoading(false)
    })
  }, [user])

  function filterGrades(subjectGrades: Grade[]): Grade[] {
    if (periodType === 'year') {
      const year = schoolYears.find(y => y.id === selectedYear)
      if (!year) return subjectGrades
      return subjectGrades.filter(g =>
        isWithinInterval(parseISO(g.date), { start: parseISO(year.start_date), end: parseISO(year.end_date) })
      )
    }
    if (periodType === 'quarter') {
      const year = schoolYears.find(y => y.id === selectedYear)
      if (!year) return subjectGrades
      const yearStart = parseISO(year.start_date)
      const qStart = new Date(yearStart)
      qStart.setMonth(yearStart.getMonth() + selectedQuarter * 3)
      const qEnd = endOfQuarter(qStart)
      return subjectGrades.filter(g =>
        isWithinInterval(parseISO(g.date), { start: qStart, end: qEnd })
      )
    }
    const monthDate = parseISO(selectedMonth + '-01')
    return subjectGrades.filter(g =>
      isWithinInterval(parseISO(g.date), { start: startOfMonth(monthDate), end: endOfMonth(monthDate) })
    )
  }

  const gradesBySubject: Record<string, Grade[]> = {}
  for (const s of subjects) {
    gradesBySubject[s.id] = filterGrades(grades.filter(g => g.subject_id === s.id))
  }

  const periodLabel = periodType === 'year'
    ? schoolYears.find(y => y.id === selectedYear)?.name ?? 'Schuljahr'
    : periodType === 'quarter'
    ? `${QUARTERS[selectedQuarter]} ${schoolYears.find(y => y.id === selectedYear)?.name ?? ''}`
    : format(parseISO(selectedMonth + '-01'), 'MMMM yyyy', { locale: de })

  const reportTitle = `Notenübersicht ${periodLabel}`

  const overallAvg = (() => {
    const avgs = subjects.map(s => ({ avg: calcAverage(gradesBySubject[s.id] ?? []), weight: s.weight })).filter(x => x.avg != null)
    if (!avgs.length) return null
    return avgs.reduce((s, x) => s + x.avg! * x.weight, 0) / avgs.reduce((s, x) => s + x.weight, 0)
  })()

  // Chart data: average per month across all subjects
  const chartData = (() => {
    const byMonth: Record<string, number[]> = {}
    for (const g of grades) {
      const m = g.date.slice(0, 7)
      byMonth[m] = byMonth[m] ? [...byMonth[m], g.value] : [g.value]
    }
    return Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)).map(([month, vals]) => ({
      month: format(parseISO(month + '-01'), 'MMM yy', { locale: de }),
      avg: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100,
    }))
  })()

  function handleExport() {
    exportPDF({
      title: reportTitle,
      periodLabel,
      subjects,
      gradesBySubject,
      userName: user?.email,
    })
  }

  const inputClass = 'bg-card border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-text">Berichte</h1>
        <button onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20">
          <Download size={16} /> PDF exportieren
        </button>
      </div>

      {/* Period selector */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs text-muted mb-1">Zeitraum</label>
          <div className="flex bg-surface rounded-xl p-1 gap-1">
            {(['year', 'quarter', 'month'] as PeriodType[]).map(p => (
              <button key={p} onClick={() => setPeriodType(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  periodType === p ? 'bg-card text-text shadow-sm' : 'text-muted hover:text-text'
                }`}>
                {p === 'year' ? 'Schuljahr' : p === 'quarter' ? 'Quartal' : 'Monat'}
              </button>
            ))}
          </div>
        </div>

        {(periodType === 'year' || periodType === 'quarter') && schoolYears.length > 0 && (
          <div>
            <label className="block text-xs text-muted mb-1">Schuljahr</label>
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className={inputClass}>
              {schoolYears.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
            </select>
          </div>
        )}

        {periodType === 'quarter' && (
          <div>
            <label className="block text-xs text-muted mb-1">Quartal</label>
            <select value={selectedQuarter} onChange={e => setSelectedQuarter(Number(e.target.value))} className={inputClass}>
              {QUARTERS.map((q, i) => <option key={i} value={i}>{q}</option>)}
            </select>
          </div>
        )}

        {periodType === 'month' && (
          <div>
            <label className="block text-xs text-muted mb-1">Monat</label>
            <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className={inputClass} />
          </div>
        )}

        <div className="ml-auto text-right">
          <p className="text-xs text-muted">Zeitraum</p>
          <p className="font-display font-semibold text-sm text-text">{periodLabel}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Overall stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center">
              <p className="text-xs text-muted mb-4">Gesamtdurchschnitt</p>
              <GradeRing value={overallAvg ?? null} size={110} />
              {overallAvg != null && (
                <p className="text-xs text-muted mt-6">{overallAvg.toFixed(2)} · {overallAvg >= 4 ? 'Bestanden' : 'Nicht bestanden'}</p>
              )}
            </div>
            <div className="col-span-2 bg-card border border-border rounded-2xl p-5">
              <p className="text-xs text-muted mb-3">Notenverlauf (alle Fächer)</p>
              {chartData.length < 2 ? (
                <div className="flex items-center justify-center h-36 text-muted text-sm">
                  <FileText size={24} className="mr-2" /> Zu wenig Daten für Verlauf
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8496B0' }} tickLine={false} axisLine={false} />
                    <YAxis domain={[1, 6]} tick={{ fontSize: 10, fill: '#8496B0' }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#162035', border: '1px solid #1E2D45', borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: '#8496B0' }}
                      itemStyle={{ color: '#F0F4FF' }}
                    />
                    <ReferenceLine y={4} stroke="#F59E0B" strokeDasharray="4 4" strokeWidth={1} />
                    <Line type="monotone" dataKey="avg" stroke="#E63946" strokeWidth={2} dot={{ fill: '#E63946', r: 3 }} name="Ø" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Per subject */}
          <div>
            <h2 className="font-display font-semibold text-sm text-text mb-3">Fachdetails</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {subjects.filter(s => (gradesBySubject[s.id] ?? []).length > 0).length === 0 ? (
                <div className="p-10 text-center text-muted text-sm">Keine Noten im gewählten Zeitraum.</div>
              ) : (
                subjects.map((subject, _i, arr) => {
                  const sg = gradesBySubject[subject.id] ?? []
                  if (sg.length === 0) return null
                  const avg = calcAverage(sg)
                  const trend = calcTrend(sg)
                  const min = Math.min(...sg.map(g => g.value))
                  const max = Math.max(...sg.map(g => g.value))
                  const withGrades = arr.filter(s => (gradesBySubject[s.id] ?? []).length > 0)
                  const isLast = withGrades[withGrades.length - 1]?.id === subject.id
                  return (
                    <div key={subject.id} className={`flex items-center justify-between px-5 py-4 ${!isLast ? 'border-b border-border' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subject.color }} />
                        <div>
                          <p className="text-sm font-medium text-text">{subject.name}</p>
                          <p className="text-xs text-muted">{sg.length} Note{sg.length !== 1 ? 'n' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-xs text-muted">Min / Max</p>
                          <p className="text-xs text-text">{min.toFixed(1)} / {max.toFixed(1)}</p>
                        </div>
                        <TrendBadge value={trend} />
                        {avg != null && (
                          <span className="font-display font-bold text-xl w-16 text-right" style={{ color: gradeColor(avg) }}>
                            Ø {avg.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
