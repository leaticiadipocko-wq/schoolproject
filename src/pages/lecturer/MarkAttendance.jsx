import { useState } from 'react'
import toast from 'react-hot-toast'
import { Save, UserCheck, UserX, Search } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { MOCK_STUDENTS } from '@/lib/mockData'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'

export default function MarkAttendance() {
  const { user } = useAuth()
  const { submitAttendance } = useData()
  const [present, setPresent] = useState(new Set(MOCK_STUDENTS.slice(0, 14).map((s) => s.id)))
  const [course, setCourse] = useState('CS501')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState(false)

  const toggle = (id) => {
    const next = new Set(present)
    if (next.has(id)) next.delete(id); else next.add(id)
    setPresent(next)
  }

  const markAll = () => setPresent(new Set(MOCK_STUDENTS.map((s) => s.id)))
  const clearAll = () => setPresent(new Set())

  const filtered = MOCK_STUDENTS.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) || s.id.includes(query)
  )

  const save = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 400))
    submitAttendance({
      course,
      date,
      presentIds: Array.from(present),
      totalStudents: MOCK_STUDENTS.length,
      lecturerId: user?.uid,
    })
    toast.success(`Attendance saved · ${present.size} / ${MOCK_STUDENTS.length} present`)
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mark Attendance"
        subtitle="Record student presence for today's class"
        actions={
          <button onClick={save} disabled={saving} className="btn-primary">
            <Save size={16} /> {saving ? 'Saving…' : 'Save'}
          </button>
        }
      />

      <div className="card">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="label">Course</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)} className="input py-2 text-sm">
              <option value="CS501">CS501 — Compiler Design</option>
              <option value="CS503">CS503 — Research Methodology</option>
              <option value="CS505">CS505 — Embedded Systems</option>
              <option value="CS507">CS507 — Mobile Development</option>
              <option value="CS509">CS509 — Design Project</option>
              <option value="CS511">CS511 — Object Oriented Programming</option>
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input py-2 text-sm" />
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={markAll} className="btn-secondary text-sm py-2"><UserCheck size={14} /> All present</button>
            <button onClick={clearAll} className="btn-secondary text-sm py-2"><UserX size={14} /> Clear</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <span className="badge-success">{present.size} present</span>{' '}
            <span className="badge-danger">{MOCK_STUDENTS.length - present.size} absent</span>
          </div>
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students…"
              className="input pl-9 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map((s) => {
            const isPresent = present.has(s.id)
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition text-left ${
                  isPresent
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-ink-200 hover:bg-ink-50'
                }`}
              >
                <img src={s.avatar} alt="" className="w-9 h-9 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="text-[11px] text-ink-500 font-mono">{s.id}</div>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                  isPresent ? 'bg-brand-800 text-white' : 'border border-ink-300'
                }`}>
                  {isPresent && '✓'}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
