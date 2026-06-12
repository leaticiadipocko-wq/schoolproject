import { useState } from 'react'
import toast from 'react-hot-toast'
import { Save, Upload } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useData } from '@/context/DataContext'

const seedStudents = () => Array.from({ length: 12 }, (_, i) => ({
  id: `IUGET/2023/CS/${String(140 + i).padStart(4, '0')}`,
  name: ['Alice Mbah', 'Brian Etoh', 'Clara Wirba', 'David Nfor', 'Esther Akem',
         'Frank Tabi', 'Gloria Mbi', 'Henri Anye', 'Ivy Nkeng', 'Joel Tagne',
         'Karen Asaba', 'Leo Nfah'][i],
  ca: Math.floor(15 + Math.random() * 15),
  exam: Math.floor(30 + Math.random() * 35),
}))

const getGrade = (total) => {
  if (total >= 80) return 'A'
  if (total >= 70) return 'B+'
  if (total >= 60) return 'B'
  if (total >= 55) return 'C+'
  if (total >= 50) return 'C'
  if (total >= 40) return 'D'
  return 'F'
}

export default function EnterGrades() {
  const { submitGrades } = useData()
  const [rows, setRows] = useState(seedStudents)
  const [course, setCourse] = useState('CS501')
  const [semester, setSemester] = useState('S2 2026')
  const [saving, setSaving] = useState(false)

  const update = (id, field, value) => {
    const n = Math.max(0, Math.min(field === 'ca' ? 30 : 70, Number(value) || 0))
    setRows((r) => r.map((row) => row.id === id ? { ...row, [field]: n } : row))
  }

  const save = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 400))
    submitGrades({ course, semester, students: rows })
    toast.success(`Grades saved for ${course} · ${rows.length} students`)
    setSaving(false)
  }

  const importCsv = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const lines = String(reader.result).split(/\r?\n/).filter(Boolean)
          const parsed = lines.slice(1).map((l) => {
            const [id, name, ca, exam] = l.split(',')
            return { id, name, ca: Number(ca), exam: Number(exam) }
          }).filter((r) => r.id)
          if (parsed.length === 0) return toast.error('No valid rows in CSV')
          setRows(parsed)
          toast.success(`Imported ${parsed.length} students`)
        } catch {
          toast.error('Invalid CSV format')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.ca + r.exam, 0) / rows.length) : 0
  const passed = rows.filter((r) => r.ca + r.exam >= 50).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enter Grades"
        subtitle="Submit continuous assessment and exam scores"
        actions={
          <>
            <button onClick={importCsv} className="btn-secondary"><Upload size={16} /> Import CSV</button>
            <button onClick={save} disabled={saving} className="btn-primary">
              <Save size={16} /> {saving ? 'Submitting…' : 'Submit'}
            </button>
          </>
        }
      />

      <div className="card flex items-center gap-3 flex-wrap">
        <select value={course} onChange={(e) => setCourse(e.target.value)} className="input py-2 text-sm max-w-xs">
          <option value="CS501">CS501 — Compiler Design</option>
          <option value="CS503">CS503 — Research Methodology</option>
          <option value="CS505">CS505 — Embedded Systems</option>
          <option value="CS507">CS507 — Mobile Development</option>
          <option value="CS509">CS509 — Design Project</option>
          <option value="CS511">CS511 — Object Oriented Programming</option>
        </select>
        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="input py-2 text-sm max-w-xs">
          <option>S1 2026</option>
          <option>S2 2026</option>
        </select>
        <div className="ml-auto flex gap-2">
          <span className="badge-info">Avg {avg}</span>
          <span className="badge-success">{passed} / {rows.length} passed</span>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="text-left p-4">Student</th>
              <th className="text-left p-4 w-32">CA (30)</th>
              <th className="text-left p-4 w-32">Exam (70)</th>
              <th className="text-left p-4 w-24">Total</th>
              <th className="text-left p-4 w-24">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((r) => {
              const total = r.ca + r.exam
              return (
                <tr key={r.id} className="hover:bg-ink-50/50">
                  <td className="p-4">
                    <div className="font-medium text-sm">{r.name}</div>
                    <div className="text-xs text-ink-500 font-mono">{r.id}</div>
                  </td>
                  <td className="p-4">
                    <input
                      type="number" min={0} max={30}
                      className="input py-1.5 w-24 text-sm"
                      value={r.ca}
                      onChange={(e) => update(r.id, 'ca', e.target.value)}
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number" min={0} max={70}
                      className="input py-1.5 w-24 text-sm"
                      value={r.exam}
                      onChange={(e) => update(r.id, 'exam', e.target.value)}
                    />
                  </td>
                  <td className="p-4 font-semibold">{total}</td>
                  <td className="p-4">
                    <span className={`badge ${
                      total >= 70 ? 'bg-emerald-100 text-emerald-700' :
                      total >= 50 ? 'bg-brand-100 text-brand-800' :
                      total >= 40 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>{getGrade(total)}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
