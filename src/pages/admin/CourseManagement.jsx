import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, Search, BookOpen, X, AlertCircle } from 'lucide-react'
import { MOCK_COURSES, SPECIALTIES, TIMETABLE_TRACKS } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'
import StatCard from '@/components/ui/StatCard'

const LEVELS = [1, 2, 3]
const TRACKS = Object.values(TIMETABLE_TRACKS)

export default function CourseManagement() {
  const [courses, setCourses] = useState(MOCK_COURSES)
  const [query, setQuery] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ code: '', name: '', credits: 3, lecturer: '', level: 3, track: 'bachelor-evening' })

  const filtered = useMemo(() => {
    return courses.filter(c =>
      (filterLevel === 'all' || String(c.level) === filterLevel) &&
      (!query.trim() || c.code.toLowerCase().includes(query.toLowerCase()) || c.name.toLowerCase().includes(query.toLowerCase()) || c.lecturer.toLowerCase().includes(query.toLowerCase()))
    )
  }, [courses, query, filterLevel])

  const openAdd = () => {
    setEditing(null)
    setForm({ code: '', name: '', credits: 3, lecturer: '', level: 3, track: 'bachelor-evening' })
    setShowForm(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({ code: c.code, name: c.name, credits: c.credits, lecturer: c.lecturer, level: c.level, track: c.track || 'bachelor-evening' })
    setShowForm(true)
  }

  const onSave = (e) => {
    e.preventDefault()
    if (!form.code || !form.name) return toast.error('Course code and name are required')
    const payload = { code: form.code.toUpperCase(), name: form.name, credits: Number(form.credits) || 3, lecturer: form.lecturer, level: Number(form.level) || 3, track: form.track }
    if (editing) {
      setCourses(prev => prev.map(c => c.code === editing.code ? { ...c, ...payload } : c))
      toast.success('Course updated')
    } else {
      if (courses.find(c => c.code === payload.code)) return toast.error('Course code already exists')
      setCourses(prev => [...prev, payload])
      toast.success('Course added')
    }
    setShowForm(false)
  }

  const handleDelete = (code) => {
    setCourses(prev => prev.filter(c => c.code !== code))
    toast.success('Course deleted')
    setConfirmDelete(null)
  }

  const trackName = (tid) => TRACKS.find(t => t.id === tid)?.short || tid

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Management"
        subtitle="Manage the academic course catalog — add, edit, and organize courses"
        actions={
          <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add course</button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={BookOpen} label="Total Courses" value={courses.length} color="brand" />
        <StatCard icon={BookOpen} label="Level 1" value={courses.filter(c => c.level === 1).length} color="accent" />
        <StatCard icon={BookOpen} label="Level 2" value={courses.filter(c => c.level === 2).length} color="green" />
        <StatCard icon={BookOpen} label="Level 3" value={courses.filter(c => c.level === 3).length} color="amber" />
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search code, name, lecturer…" className="input pl-10 py-2 text-sm w-56 sm:w-72" />
            </div>
            <div className="flex gap-1 bg-ink-100 rounded-xl p-1">
              {['all', '1', '2', '3'].map(l => (
                <button key={l} onClick={() => { setFilterLevel(l); setQuery(query) }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition ${
                    filterLevel === l ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
                  }`}
                >{l === 'all' ? 'All Levels' : `Level ${l}`}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-ink-100">
          <table className="w-full min-w-[600px]">
            <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Course Name</th>
                <th className="text-center p-3">Credits</th>
                <th className="text-center p-3">Level</th>
                <th className="text-left p-3">Lecturer</th>
                <th className="text-left p-3 hidden lg:table-cell">Track</th>
                <th className="p-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map(c => (
                <tr key={c.code} className="hover:bg-ink-50 transition">
                  <td className="p-3"><span className="font-mono text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded font-medium">{c.code}</span></td>
                  <td className="p-3 font-medium text-sm">{c.name}</td>
                  <td className="p-3 text-center text-sm">{c.credits}</td>
                  <td className="p-3 text-center">
                    <span className="text-[11px] bg-ink-100 text-ink-600 px-2 py-0.5 rounded-full font-medium">L{c.level}</span>
                  </td>
                  <td className="p-3 text-sm text-ink-600">{c.lecturer}</td>
                  <td className="p-3 text-sm text-ink-500 hidden lg:table-cell">{trackName(c.track)}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-ink-200 rounded-lg transition text-ink-500"><Edit2 size={14} /></button>
                      <button onClick={() => setConfirmDelete(c)} className="p-1.5 hover:bg-red-100 rounded-lg transition text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-12 text-center text-ink-500 text-sm">No courses match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg">{editing ? 'Edit Course' : 'Add Course'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-ink-100 rounded-lg transition"><X size={18} /></button>
            </div>
            <form onSubmit={onSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Course code</label>
                  <input className="input uppercase" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="CS501" autoFocus />
                </div>
                <div className="col-span-2">
                  <label className="label">Course name</label>
                  <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Compiler Design" />
                </div>
                <div>
                  <label className="label">Credits</label>
                  <input type="number" min={1} max={6} className="input" value={form.credits} onChange={e => setForm({ ...form, credits: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="label">Level</label>
                  <select className="input" value={form.level} onChange={e => setForm({ ...form, level: Number(e.target.value) })}>
                    {LEVELS.map(l => <option key={l} value={l}>Level {l}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label">Lecturer</label>
                  <input className="input" value={form.lecturer} onChange={e => setForm({ ...form, lecturer: e.target.value })} placeholder="Dr. Name" />
                </div>
                <div className="col-span-2">
                  <label className="label">Track</label>
                  <select className="input" value={form.track} onChange={e => setForm({ ...form, track: e.target.value })}>
                    {TRACKS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Save changes' : 'Add course'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">Delete course?</h3>
            <p className="text-sm text-ink-600 mb-6">
              This will permanently remove <strong>{confirmDelete.code} — {confirmDelete.name}</strong>. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete.code)} className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex-1 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
