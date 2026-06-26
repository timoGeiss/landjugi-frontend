import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import type { Grade, Subject } from '../types'
import { calcAverage, calcTrend, gradeLabel, GRADE_TYPE_LABELS } from '../types'

interface ReportData {
  title: string
  periodLabel: string
  subjects: Subject[]
  gradesBySubject: Record<string, Grade[]>
  userName?: string
}

function gradeColorRgb(value: number): [number, number, number] {
  if (value >= 5.5) return [34, 197, 94]
  if (value >= 5.0) return [134, 239, 172]
  if (value >= 4.0) return [245, 158, 11]
  if (value >= 3.5) return [249, 115, 22]
  return [239, 68, 68]
}

export function exportPDF(data: ReportData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 20

  // Cover header bar
  doc.setFillColor(8, 14, 26)
  doc.rect(0, 0, pageW, 50, 'F')
  doc.setFillColor(230, 57, 70)
  doc.rect(0, 0, 6, 50, 'F')

  doc.setTextColor(240, 244, 255)
  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.text('SimpleGrade', 14, 22)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(132, 150, 176)
  doc.text('Notenübersicht · ' + data.periodLabel, 14, 31)

  if (data.userName) {
    doc.setTextColor(240, 244, 255)
    doc.setFontSize(10)
    doc.text(data.userName, pageW - margin, 22, { align: 'right' })
  }

  doc.setFontSize(9)
  doc.setTextColor(132, 150, 176)
  doc.text('Erstellt am ' + format(new Date(), 'dd. MMMM yyyy', { locale: de }), pageW - margin, 31, { align: 'right' })

  // Title
  doc.setTextColor(30, 30, 40)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(data.title, margin, 68)

  // Summary table
  const summaryRows: (string | number)[][] = []
  let totalWeightedSum = 0
  let totalWeightSum = 0

  for (const subject of data.subjects) {
    const grades = data.gradesBySubject[subject.id] ?? []
    const avg = calcAverage(grades)
    const trend = calcTrend(grades)
    const min = grades.length ? Math.min(...grades.map(g => g.value)) : null
    const max = grades.length ? Math.max(...grades.map(g => g.value)) : null

    if (avg != null) {
      totalWeightedSum += avg * subject.weight
      totalWeightSum += subject.weight
    }

    summaryRows.push([
      subject.name,
      grades.length,
      avg != null ? avg.toFixed(2) : '–',
      min != null ? min.toFixed(1) : '–',
      max != null ? max.toFixed(1) : '–',
      trend != null ? (trend > 0 ? `+${trend.toFixed(2)}` : trend.toFixed(2)) : '–',
      avg != null ? gradeLabel(avg) : '–',
    ])
  }

  autoTable(doc, {
    startY: 75,
    head: [['Fach', 'Noten', 'Ø', 'Min', 'Max', 'Trend', 'Bewertung']],
    body: summaryRows,
    theme: 'striped',
    headStyles: {
      fillColor: [8, 14, 26],
      textColor: [240, 244, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: [30, 30, 40] },
    alternateRowStyles: { fillColor: [248, 249, 252] },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
    didParseCell(hookData) {
      if (hookData.section === 'body' && hookData.column.index === 2) {
        const val = parseFloat(String(hookData.cell.raw))
        if (!isNaN(val)) {
          const [r, g, b] = gradeColorRgb(val)
          hookData.cell.styles.textColor = [r, g, b]
        }
      }
    },
  })

  // Overall average
  if (totalWeightSum > 0) {
    const overallAvg = totalWeightedSum / totalWeightSum
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 40)
    doc.text(`Gesamtdurchschnitt: ${overallAvg.toFixed(2)}`, margin, finalY)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 120)
    doc.text(`(${gradeLabel(overallAvg)})`, margin + 58, finalY)
  }

  // Detail pages per subject
  for (const subject of data.subjects) {
    const grades = data.gradesBySubject[subject.id] ?? []
    if (grades.length === 0) continue

    doc.addPage()

    // Subject header
    doc.setFillColor(8, 14, 26)
    doc.rect(0, 0, pageW, 30, 'F')
    const [r, g, b] = subject.color
      ? (subject.color.match(/\w\w/g)?.map(x => parseInt(x, 16)) as [number, number, number]) ?? [59, 130, 246]
      : [59, 130, 246]
    doc.setFillColor(r, g, b)
    doc.rect(0, 0, 5, 30, 'F')

    doc.setTextColor(240, 244, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(subject.name, 12, 14)
    if (subject.teacher) {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(132, 150, 176)
      doc.text(subject.teacher, 12, 22)
    }

    const avg = calcAverage(grades)
    if (avg != null) {
      const [cr, cg, cb] = gradeColorRgb(avg)
      doc.setTextColor(cr, cg, cb)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(avg.toFixed(2), pageW - margin, 20, { align: 'right' })
    }

    const rows = [...grades]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(g => [
        format(new Date(g.date), 'dd.MM.yyyy'),
        GRADE_TYPE_LABELS[g.type],
        g.value.toFixed(1),
        g.weight !== 1 ? `×${g.weight}` : '–',
        g.notes ?? '',
      ])

    autoTable(doc, {
      startY: 38,
      head: [['Datum', 'Art', 'Note', 'Gewicht', 'Notizen']],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [30, 32, 53], textColor: [240, 244, 255], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      margin: { left: margin, right: margin },
      didParseCell(hookData) {
        if (hookData.section === 'body' && hookData.column.index === 2) {
          const val = parseFloat(String(hookData.cell.raw))
          if (!isNaN(val)) {
            const [cr, cg, cb] = gradeColorRgb(val)
            hookData.cell.styles.textColor = [cr, cg, cb]
            hookData.cell.styles.fontStyle = 'bold'
          }
        }
      },
    })
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(160, 160, 180)
    doc.text(`SimpleGrade · ${data.periodLabel}`, margin, pageH - 8)
    doc.text(`${i} / ${totalPages}`, pageW - margin, pageH - 8, { align: 'right' })
  }

  const filename = `SimpleGrade_${data.title.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`
  doc.save(filename)
}
