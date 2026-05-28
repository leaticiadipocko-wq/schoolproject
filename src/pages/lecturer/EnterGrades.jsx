import { useState } from 'react'
import toast from 'react-hot-toast'
import { Save, Upload } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'

const seedStudents = Array.from({ length: 12 }, (_, i) => ({
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
  const [rows, setRows] = useState(seedStudents)
  const [course, setCourse] = useState('CS301')

  const update = (id, field, value) => {
    setRows((r) => r.map((row) => row.id === id ? { ...row, [field]: Number(value) || 0 } : row))
  }

  const save = () => toast.success(`Grades saved for ${course} · ${rows.length} students`)

  const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.ca + r.exam, 0) / rows.length) : 0
  const passed = rows.filter((r) => r.ca + r.exam >= 50).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enter Grades"
        subtitle="Submit continuous assessment and exam scores"
        actions={
          <>
            <button className="btn-secondary"><Upload size={16} /> Import CSV</button>
            <button onClick={save} className="btn-primary"><Save size={16} /> Submit</button>
          </>
        }
      />

      <div className="card flex items-center gap-3 flex-wrap">
        <select value={course} onChange={(e) => setCourse(e.target.value)} className="input py-2 text-sm max-w-xs">
          <option>CS301 — Software Engineering</option>
          <option>CS305 — Database Systems</option>
          <option>CS402 — Artificial Intelligence</option>
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
                      total >= 50 ? 'bg-brand-100 text-brand-700' :
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
