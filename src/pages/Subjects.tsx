import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Download, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { SubjectForm } from '../components/SubjectForm'
import { Modal } from '../components/Modal'
import type { Subject, Grade, SchoolYear } from '../types'
import { calcAverage, gradeColor } from '../types'

const SWISS_SCHOOLS = [
  { label: 'Gymnasium Münchenbuchsee', server: 'hektor.webuntis.com', school: 'Gym-Muenchenbuchsee' },
  { label: 'Kantonsschule Zug', server: 'kzg.webuntis.com', school: 'KZG' },
  { label: 'Kantonsschule Aarau', server: 'ksa.webuntis.com', school: 'KSA' },
  { label: 'Gymnasium Liestal', server: 'gymliestal.webuntis.com', school: 'GymLiestal' },
  { label: 'Andere Schule', server: '', school: '' },
]

export function Subjects() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [editSubject, setEditSubject] = useState<Subject | undefined>()
  const [showModal, setShowModal] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [loading, setLoading] = useState(true)

  // WebUntis import state
  const [wu_school, setWuSchool] = useState(0)
  const [wu_server, setWuServer] = useState('')
  const [wu_schoolname, setWuSchoolname] = useState('')
  const [wu_user, setWuUser] = useState('')
  const [wu_pass, setWuPass] = useState('')
  const [wu_loading, setWuLoading] = useState(false)
  const [wu_error, setWuError] = useState('')
  const [wu_subjects, setWuSubjects] = useState<string[]>([])
  const [wu_selected, setWuSelected] = useState<Set<string>>(new Set())

  async function load() {
    if (!user) return
    const [{ data: sub }, { data: gr }, { data: sy }] = await Promise.all([
      supabase.from('subjects').select('*').eq('user_id', user.id).order('name'),
      supabase.from('grades').select('*').eq('user_id', user.id),
      supabase.from('school_years').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
    ])
    setSubjects(sub ?? [])
    setGrades(gr ?? [])
    setSchoolYears(sy ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [user])

  async function deleteSubject(id: string) {
    if (!confirm('Fach und alle zugehörigen Noten löschen?')) return
    await supabase.from('subjects').delete().eq('id', id)
    await load()
  }

  async function fetchWebUntis() {
    const school = SWISS_SCHOOLS[wu_school]
    const server = school.server || wu_server
    const schoolname = school.school || wu_schoolname
    if (!server || !schoolname || !wu_user || !wu_pass) {
      setWuError('Bitte alle Felder ausfüllen.')
      return
    }
    setWuLoading(true)
    setWuError('')
    setWuSubjects([])

    try {
      const loginRes = await fetch(`https://${server}/WebUntis/j_spring_security_check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ j_username: wu_user, j_password: wu_pass, school: schoolname, token: '' }),
        credentials: 'include',
      })
      if (!loginRes.ok) throw new Error('Login fehlgeschlagen')

      const res = await fetch(`https://${server}/WebUntis/api/rest/view/v1/subjects`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Fächer konnten nicht geladen werden')
      const data = await res.json()
      const names: string[] = (data as { name: string }[]).map((s) => s.name).filter(Boolean)
      setWuSubjects([...new Set(names)].sort())
      setWuSelected(new Set(names))
    } catch (err) {
      setWuError(
        'Verbindung zu WebUntis fehlgeschlagen. Dies kann durch CORS-Einschränkungen des Browsers verursacht werden. ' +
        'Bitte füge deine Fächer manuell hinzu.'
      )
    } finally {
      setWuLoading(false)
    }
  }

  async function importSelected() {
    if (!user) return
    const activeYear = schoolYears.find(y => y.is_active)
    const rows = [...wu_selected].map(name => ({
      user_id: user.id,
      name,
      school_year_id: activeYear?.id ?? null,
      color: `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`,
      weight: 1,
    }))
    await supabase.from('subjects').insert(rows)
    setShowImport(false)
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-text">Fächer</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowImport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-sm text-muted hover:text-text rounded-xl transition-colors">
            <Download size={16} /> WebUntis Import
          </button>
          <button onClick={() => { setEditSubject(undefined); setShowModal(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20">
            <Plus size={16} /> Fach hinzufügen
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : subjects.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <p className="text-muted mb-4">Noch keine Fächer vorhanden.</p>
          <button onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm rounded-xl hover:bg-accent-hover transition-colors">
            <Plus size={16} /> Erstes Fach hinzufügen
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {subjects.map((subject, i) => {
            const sg = grades.filter(g => g.subject_id === subject.id)
            const avg = calcAverage(sg)
            return (
              <div key={subject.id}
                className={`flex items-center justify-between px-5 py-4 ${i < subjects.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                  <div>
                    <p className="text-sm font-medium text-text">{subject.name}</p>
                    <p className="text-xs text-muted">
                      {subject.teacher && `${subject.teacher} · `}
                      {sg.length} Note{sg.length !== 1 ? 'n' : ''}
                      {subject.weight !== 1 && ` · Gewicht ×${subject.weight}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  {avg != null ? (
                    <span className="font-display font-bold text-xl" style={{ color: gradeColor(avg) }}>
                      Ø {avg.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-sm text-muted">Keine Noten</span>
                  )}
                  <div className="flex gap-1">
                    <button onClick={() => { setEditSubject(subject); setShowModal(true) }}
                      className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteSubject(subject.id)}
                      className="p-1.5 rounded-lg text-muted hover:text-grade-fail hover:bg-surface transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editSubject ? 'Fach bearbeiten' : 'Fach hinzufügen'}>
        <SubjectForm
          schoolYears={schoolYears}
          subject={editSubject}
          onSuccess={() => { setShowModal(false); load() }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      {/* WebUntis Import Modal */}
      <Modal open={showImport} onClose={() => { setShowImport(false); setWuSubjects([]); setWuError('') }} title="Fächer von WebUntis importieren">
        {wu_subjects.length === 0 ? (
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-xl p-3 flex gap-2">
              <AlertCircle size={16} className="text-grade-4 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted">
                WebUntis benötigt Zugangsdaten deiner Schule. Browser-CORS kann den Import blockieren — in diesem Fall bitte Fächer manuell eintragen.
              </p>
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">Schule</label>
              <select value={wu_school} onChange={e => setWuSchool(Number(e.target.value))}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent">
                {SWISS_SCHOOLS.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
              </select>
            </div>

            {SWISS_SCHOOLS[wu_school].server === '' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted mb-1">Server (z.B. hektor.webuntis.com)</label>
                  <input value={wu_server} onChange={e => setWuServer(e.target.value)}
                    placeholder="meine-schule.webuntis.com"
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Schulname</label>
                  <input value={wu_schoolname} onChange={e => setWuSchoolname(e.target.value)}
                    placeholder="MeineSchule"
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted mb-1">Benutzername</label>
                <input value={wu_user} onChange={e => setWuUser(e.target.value)} autoComplete="username"
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Passwort</label>
                <input type="password" value={wu_pass} onChange={e => setWuPass(e.target.value)} autoComplete="current-password"
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" />
              </div>
            </div>

            {wu_error && <p className="text-grade-fail text-xs">{wu_error}</p>}

            <button onClick={fetchWebUntis} disabled={wu_loading}
              className="w-full py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover disabled:opacity-60 transition-colors">
              {wu_loading ? 'Verbinde…' : 'Fächer laden'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted">{wu_subjects.length} Fächer gefunden. Wähle aus, welche du importieren möchtest.</p>
            <div className="max-h-64 overflow-y-auto space-y-1 scrollbar-thin">
              {wu_subjects.map(name => (
                <label key={name} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface cursor-pointer">
                  <input type="checkbox" checked={wu_selected.has(name)}
                    onChange={e => {
                      const s = new Set(wu_selected)
                      e.target.checked ? s.add(name) : s.delete(name)
                      setWuSelected(s)
                    }}
                    className="accent-accent" />
                  <span className="text-sm text-text">{name}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setWuSubjects([])} className="flex-1 py-2 rounded-xl border border-border text-sm text-muted hover:text-text transition-colors">
                Zurück
              </button>
              <button onClick={importSelected} disabled={wu_selected.size === 0}
                className="flex-1 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover disabled:opacity-60 transition-colors">
                {wu_selected.size} Fächer importieren
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
