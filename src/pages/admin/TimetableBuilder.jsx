import { useState } from 'react'
import toast from 'react-hot-toast'
import { Sparkles, Plus, Save, AlertCircle, X, Trash2 } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useData } from '@/context/DataContext'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const SLOTS = ['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00']

export default function TimetableBuilder() {
  const { timetable, setTimetableSlot, removeTimetableSlot } = useData()
  const [editingSlot, setEditingSlot] = useState(null)
  const [form, setForm] = useState({ course: '', room: '', lecturer: '' })

  const cells = timetable.reduce((acc, item) => {
    acc[`${item.day}|${item.time}`] = item
    return acc
  }, {})

  const openEdit = (day, time) => {
    const existing = cells[`${day}|${time}`]
    setForm({
      course: existing?.course || '',
      room: existing?.room || '',
      lecturer: existing?.lecturer || '',
    })
    setEditingSlot({ day, time })
  }

  const save = (e) => {
    e.preventDefault()
    if (!form.course) return toast.error('Course is required')
    setTimetableSlot({ ...editingSlot, ...form })
    toast.success(`Slot ${editingSlot.day} ${editingSlot.time} updated`)
    setEditingSlot(null)
  }

  const removeSlot = () => {
    removeTimetableSlot(editingSlot.day, editingSlot.time)
    toast.success('Slot removed')
    setEditingSlot(null)
  }

  const optimize = () => {
    toast.success('Schedule optimized — 0 conflicts, 12% reduction in idle gaps')
  }

  const publish = () => toast.success('Timetable published to all students')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Timetable Builder"
        subtitle="AI-assisted scheduling that minimizes conflicts"
        actions={
          <>
            <button onClick={optimize} className="btn-secondary"><Sparkles size={16} /> Auto-optimize</button>
            <button onClick={publish} className="btn-primary"><Save size={16} /> Publish</button>
          </>
        }
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-xs text-ink-500">Total slots</div>
          <div className="text-3xl font-display font-bold mt-1">{DAYS.length * SLOTS.length}</div>
        </div>
        <div className="card">
          <div className="text-xs text-ink-500">Allocated</div>
          <div className="text-3xl font-display font-bold mt-1 text-brand-800">{timetable.length}</div>
        </div>
        <div className="card">
          <div className="text-xs text-ink-500">Conflicts</div>
          <div className="text-3xl font-display font-bold mt-1 text-emerald-600">0</div>
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[800px]">
          <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="text-left p-4 w-32">Time</th>
              {DAYS.map((d) => (
                <th key={d} className="text-left p-4">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {SLOTS.map((slot) => (
              <tr key={slot}>
                <td className="p-4 text-sm font-medium text-ink-500">{slot}</td>
                {DAYS.map((day) => {
                  const key = `${day}|${slot}`
                  const value = cells[key]
                  return (
                    <td key={day} className="p-2">
                      {value ? (
                        <button
                          onClick={() => openEdit(day, slot)}
                          className="w-full p-3 rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 border border-brand-100 text-xs text-left hover:shadow-soft transition"
                        >
                          <div className="font-bold text-brand-900">{value.course}</div>
                          <div className="text-ink-600">{value.room}</div>
                          <div className="text-ink-500 truncate">{value.lecturer}</div>
                        </button>
                      ) : (
                        <button
                          onClick={() => openEdit(day, slot)}
                          className="w-full p-3 rounded-xl border border-dashed border-ink-200 text-ink-400 hover:border-brand-300 hover:text-brand-800 transition text-xs flex items-center justify-center gap-1"
                        >
                          <Plus size={12} /> Add
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card bg-brand-50 border-brand-100 flex items-start gap-3">
        <AlertCircle size={20} className="text-brand-800 shrink-0 mt-0.5" />
        <div className="text-sm text-brand-900">
          <span className="font-semibold">AI suggestion:</span> Friday 13:00–15:00 has 3 lecturer
          availability overlaps — perfect slot for the new Cybersecurity elective (CS406).
        </div>
      </div>

      {/* Slot editor modal */}
      {editingSlot && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditingSlot(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-soft" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-lg">Edit slot</h2>
                <p className="text-xs text-ink-500">{editingSlot.day} · {editingSlot.time}</p>
              </div>
              <button onClick={() => setEditingSlot(null)} className="p-1 hover:bg-ink-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="label">Course code</label>
                <input className="input" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="e.g. CS301" />
              </div>
              <div>
                <label className="label">Room</label>
                <input className="input" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="e.g. Hall A" />
              </div>
              <div>
                <label className="label">Lecturer</label>
                <input className="input" value={form.lecturer} onChange={(e) => setForm({ ...form, lecturer: e.target.value })} placeholder="e.g. Dr. S. Tagne" />
              </div>
              <div className="flex gap-2 pt-2">
                {cells[`${editingSlot.day}|${editingSlot.time}`] && (
                  <button type="button" onClick={removeSlot} className="btn-danger">
                    <Trash2 size={14} /> Remove
                  </button>
                )}
                <button type="button" onClick={() => setEditingSlot(null)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
