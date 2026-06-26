export interface SchoolYear {
  id: string
  user_id: string
  name: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
}

export interface Subject {
  id: string
  user_id: string
  school_year_id: string | null
  name: string
  short_name: string | null
  color: string
  weight: number
  teacher: string | null
  created_at: string
}

export interface Grade {
  id: string
  user_id: string
  subject_id: string
  value: number
  date: string
  type: 'exam' | 'test' | 'oral' | 'homework' | 'project'
  notes: string | null
  weight: number
  created_at: string
}

export interface GradeWithSubject extends Grade {
  subject: Subject
}

export type GradeType = Grade['type']

export const GRADE_TYPE_LABELS: Record<GradeType, string> = {
  exam: 'Prüfung',
  test: 'Test',
  oral: 'Mündlich',
  homework: 'Hausaufgabe',
  project: 'Projekt',
}

export const SUBJECT_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F97316',
  '#22C55E', '#14B8A6', '#EAB308', '#E63946',
  '#06B6D4', '#A855F7',
]

export function gradeColor(value: number): string {
  if (value >= 5.5) return '#22C55E'
  if (value >= 5.0) return '#86EFAC'
  if (value >= 4.5) return '#A3E635'
  if (value >= 4.0) return '#F59E0B'
  if (value >= 3.5) return '#F97316'
  return '#EF4444'
}

export function gradeLabel(value: number): string {
  if (value >= 5.5) return 'Sehr gut'
  if (value >= 5.0) return 'Gut'
  if (value >= 4.5) return 'Befriedigend'
  if (value >= 4.0) return 'Genügend'
  if (value >= 3.5) return 'Knapp ungenügend'
  return 'Ungenügend'
}

export function calcAverage(grades: Grade[]): number | null {
  if (grades.length === 0) return null
  const totalWeight = grades.reduce((s, g) => s + g.weight, 0)
  const weighted = grades.reduce((s, g) => s + g.value * g.weight, 0)
  return Math.round((weighted / totalWeight) * 100) / 100
}

export function calcTrend(grades: Grade[]): number | null {
  if (grades.length < 2) return null
  const sorted = [...grades].sort((a, b) => a.date.localeCompare(b.date))
  const half = Math.floor(sorted.length / 2)
  const first = calcAverage(sorted.slice(0, half))
  const second = calcAverage(sorted.slice(half))
  if (first == null || second == null) return null
  return Math.round((second - first) * 100) / 100
}
