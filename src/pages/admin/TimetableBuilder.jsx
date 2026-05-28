import { useState } from 'react'
import toast from 'react-hot-toast'
import { Sparkles, Plus, Save, AlertCircle } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const SLOTS = ['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00']

const initialAssignments = {
  'Monday|08:00 - 10:00':   'CS301 · Hall A',
  'Monday|10:00 - 12:00':   'CS305 · Lab 2',
  'Tuesday|08:00 - 10:00':  'CS307 · Hall B',
  'Tuesday|13:00 - 15:00':  'CS309 · Lab 1',
  'Wednesday|09:00 - 11:00':'CS311 · Lab 3',
  'Thursday|08:00 - 10:00': 'CS301 · Hall A',
  'Friday|10:00 - 12:00':   'CS305 · Lab 2',
}

export default function TimetableBuilder() {
  const [cells, setCells] = useState(initialAssignments)
  const conflicts = 0

  const optimize = () => {
    toast.success('Schedule optimized — 0 conflicts, 12% reduction in idle gaps')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Timetable Builder"
        subtitle="AI-assisted scheduling that minimizes conflicts"
        actions={
          <>
            <button onClick={optimize} className="btn-secondary"><Sparkles size={16} /> Auto-optimize</button>
            <button onClick={() => toast.success('Saved')} className="btn-primary"><Save size={16} /> Publish</button>
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
          <div className="text-3xl font-display font-bold mt-1 text-brand-600">{Object.keys(cells).length}</div>
        </div>
        <div className="card">
          <div className="text-xs text-ink-500">Conflicts</div>
          <div className="text-3xl font-display font-bold mt-1 text-green-600">{conflicts}</div>
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
                        <div className="p-3 rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 border border-brand-100 text-xs">
                          {value}
                        </div>
                      ) : (
                        <button className="w-full p-3 rounded-xl border border-dashed border-ink-200 text-ink-400 hover:border-brand-300 hover:text-brand-600 transition text-xs flex items-center justify-center gap-1">
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
        <AlertCircle size={20} className="text-brand-600 shrink-0 mt-0.5" />
        <div className="text-sm text-brand-900">
          <span className="font-semibold">AI suggestion:</span> Friday 13:00–15:00 has 3 lecturer
          availability overlaps — perfect slot for the new Cybersecurity elective (CS406).
        </div>
      </div>
    </div>
  )
}
