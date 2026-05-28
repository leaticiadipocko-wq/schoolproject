import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import { useData } from '@/context/DataContext'
import { TIMETABLE_TRACKS } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'
import { Download, Sparkles, Moon, Sun, Clock } from 'lucide-react'

export default function Timetable() {
  const { timetable } = useData()
  const [trackId, setTrackId] = useState('bachelor-evening')
  const track = TIMETABLE_TRACKS[trackId]

  // Filter timetable entries for the selected track
  const entries = useMemo(
    () => timetable.filter((t) => (t.track || 'bachelor-evening') === trackId),
    [timetable, trackId]
  )

  // Build the grid lookup
  const grid = useMemo(() => {
    const g = {}
    for (const item of entries) {
      g[`${item.day}|${item.time}`] = item
    }
    return g
  }, [entries])

  // Calculate hours per week
  const totalHours = entries.length * 2  // each slot is 2 hours

  const exportPDF = () => {
    const t = toast.loading('Generating PDF…')
    try {
      const pdf = new jsPDF('l', 'mm', 'a4')
      pdf.setFontSize(18)
      pdf.text(`IUGET — ${track.name}`, 15, 20)
      pdf.setFontSize(10)
      pdf.text(track.description, 15, 27)
      pdf.text(`Generated ${new Date().toLocaleDateString()}`, 15, 33)

      let y = 50
      pdf.setFontSize(11)
      pdf.text('Day        Time              Course   Room      Lecturer', 15, y)
      y += 6
      pdf.line(15, y - 2, 280, y - 2)
      for (const e of entries.sort((a, b) => {
        const days = track.days
        const ad = days.indexOf(a.day), bd = days.indexOf(b.day)
        if (ad !== bd) return ad - bd
        return a.time.localeCompare(b.time)
      })) {
        if (y > 195) { pdf.addPage(); y = 30 }
        pdf.text(`${e.day.padEnd(10)} ${e.time.padEnd(17)} ${e.course.padEnd(8)} ${e.room.padEnd(9)} ${e.lecturer}`, 15, y)
        y += 6
      }
      pdf.save(`IUGET-Timetable-${track.id}.pdf`)
      toast.success('PDF downloaded', { id: t })
    } catch (err) {
      toast.error('Could not generate PDF', { id: t })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Timetable"
        subtitle={track.description}
        actions={
          <>
            <button onClick={() => toast.success('Your schedule is already optimised!')} className="btn-secondary">
              <Sparkles size={16} /> Optimize
            </button>
            <button onClick={exportPDF} className="btn-primary">
              <Download size={16} /> Download PDF
            </button>
          </>
        }
      />

      {/* Track selector */}
      <div className="card">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Section / Track</div>
            <div className="flex gap-2 flex-wrap">
              {Object.values(TIMETABLE_TRACKS).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTrackId(t.id)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition ${
                    trackId === t.id
                      ? 'border-brand-800 bg-brand-50 text-brand-900'
                      : 'border-ink-200 hover:border-brand-300 text-ink-700'
                  }`}
                >
                  <div className="font-bold">{t.short}</div>
                  <div className="text-[11px] text-ink-500 font-normal">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="badge-info"><Clock size={10} /> {totalHours} hours / week</div>
            <div className="badge-success">{entries.length} sessions</div>
          </div>
        </div>
      </div>

      {/* Schedule details */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-brand-800" />
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Weekday sessions</div>
          </div>
          <div className="mt-2 text-sm">
            {track.weekdaySlots.length > 0
              ? track.weekdaySlots.join(' · ')
              : <span className="text-ink-500">None</span>}
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-2">
            <Sun size={16} className="text-amber-500" />
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Saturday sessions</div>
          </div>
          <div className="mt-2 text-sm">
            {track.saturdaySlots.length > 0
              ? track.saturdaySlots.join(' · ')
              : <span className="text-ink-500">No Saturday classes</span>}
          </div>
        </div>
        <div className="card">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Effective from</div>
          <div className="mt-2 text-sm font-medium">Semester 1 · 2025/2026</div>
        </div>
      </div>

      {/* Weekday grid — only render slots for Mon-Fri */}
      {track.weekdaySlots.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-brand-800" />
            <h3 className="font-display font-bold text-lg">Monday — Friday</h3>
          </div>
          <div className="card overflow-x-auto p-0">
            <table className="w-full min-w-[720px]">
              <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="text-left p-4 w-36">Time</th>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => (
                    <th key={d} className="text-left p-4">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {track.weekdaySlots.map((slot) => (
                  <tr key={slot}>
                    <td className="p-3 text-sm font-medium text-ink-700 bg-ink-50/50">
                      <div className="font-mono">{slot}</div>
                      <div className="text-[10px] text-ink-500 uppercase tracking-wider">
                        {parseInt(slot) >= 18 ? 'Evening' : 'Day'}
                      </div>
                    </td>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                      const cell = grid[`${day}|${slot}`]
                      return (
                        <td key={day} className="p-2 align-top">
                          {cell ? (
                            <div className={`p-3 rounded-xl border ${
                              parseInt(slot) >= 18
                                ? 'bg-gradient-to-br from-brand-50 to-accent-50 border-brand-200'
                                : 'bg-gradient-to-br from-emerald-50 to-brand-50 border-emerald-200'
                            }`}>
                              <div className="text-xs font-bold text-brand-900">{cell.course}</div>
                              <div className="text-[11px] text-ink-700 mt-0.5 truncate">{cell.room}</div>
                              <div className="text-[11px] text-ink-500 truncate">{cell.lecturer}</div>
                            </div>
                          ) : (
                            <div className="p-3 rounded-xl border border-dashed border-ink-200 h-full text-center text-[11px] text-ink-400">
                              Free
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Saturday grid */}
      {track.saturdaySlots.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sun size={16} className="text-amber-500" />
            <h3 className="font-display font-bold text-lg">Saturday</h3>
            <span className="badge-warning">Full day</span>
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead className="bg-amber-50 text-xs font-semibold uppercase tracking-wider text-amber-700">
                <tr>
                  <th className="text-left p-4 w-36">Time</th>
                  <th className="text-left p-4">Course</th>
                  <th className="text-left p-4">Room</th>
                  <th className="text-left p-4">Lecturer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {track.saturdaySlots.map((slot) => {
                  const cell = grid[`Saturday|${slot}`]
                  return (
                    <tr key={slot}>
                      <td className="p-4 text-sm font-mono font-medium text-ink-700">{slot}</td>
                      {cell ? (
                        <>
                          <td className="p-4">
                            <span className="font-bold text-brand-900">{cell.course}</span>
                          </td>
                          <td className="p-4 text-sm text-ink-600">{cell.room}</td>
                          <td className="p-4 text-sm text-ink-600">{cell.lecturer}</td>
                        </>
                      ) : (
                        <td colSpan={3} className="p-4 text-sm text-ink-400 italic">No class scheduled</td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div className="card text-center py-12 text-ink-500">
          <div className="font-display font-bold text-lg">No timetable yet for {track.short}</div>
          <div className="text-sm mt-1">Administrators can add slots via the Timetable Builder.</div>
        </div>
      )}
    </div>
  )
}
