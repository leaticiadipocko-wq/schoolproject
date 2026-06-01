import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { TIMETABLE_TRACKS, SPECIALTIES, HOLIDAYS } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'
import { Download, Printer, Moon, Sun, Clock, Filter, Calendar } from 'lucide-react'

const WEEK_DATES = {
  Monday: '25/05/2026', Tuesday: '26/05/2026', Wednesday: '27/05/2026',
  Thursday: '28/05/2026', Friday: '29/05/2026', Saturday: '30/05/2026',
}

export default function Timetable() {
  const { user } = useAuth()
  const { timetable } = useData()
  const [trackId, setTrackId] = useState('bachelor-evening')
  const [specialtyFilter, setSpecialtyFilter] = useState(user?.specialty || 'all')
  const track = TIMETABLE_TRACKS[trackId]

  // Filter entries by track AND specialty
  const entries = useMemo(
    () => timetable.filter((t) =>
      (t.track || 'bachelor-evening') === trackId &&
      (specialtyFilter === 'all' || t.specialty === specialtyFilter)
    ),
    [timetable, trackId, specialtyFilter]
  )

  const grid = useMemo(() => {
    const g = {}
    for (const item of entries) {
      const key = `${item.day}|${item.time}|${item.specialty || 'X'}`
      g[key] = item
    }
    return g
  }, [entries])

  const visibleSpecialties = specialtyFilter === 'all' ? track.specialties : [specialtyFilter]
  const totalHours = entries.length * 2

  const holidayFor = (day) => HOLIDAYS.find((h) => h.day === day && h.track === trackId)

  const exportPDF = () => {
    const t = toast.loading('Generating PDF…')
    try {
      const pdf = new jsPDF('l', 'mm', 'a4')
      pdf.setFontSize(16); pdf.text(`IUGET — ${track.name}`, 15, 18)
      pdf.setFontSize(10); pdf.text(`${track.description}  ·  Ref ${track.docRef || ''}`, 15, 25)
      pdf.text(`Filter: ${specialtyFilter === 'all' ? 'All specialties' : SPECIALTIES[specialtyFilter]?.name}`, 15, 31)
      pdf.text(`Generated ${new Date().toLocaleString()}`, 15, 37)

      let y = 50
      pdf.setFontSize(10)
      pdf.text('Day        Date          Time           Spec.   Course                          Room      Lecturer', 15, y)
      y += 4; pdf.line(15, y, 280, y); y += 5

      for (const e of entries.sort((a, b) => {
        const days = track.days
        const ad = days.indexOf(a.day), bd = days.indexOf(b.day)
        if (ad !== bd) return ad - bd
        if (a.time !== b.time) return a.time.localeCompare(b.time)
        return (a.specialty || '').localeCompare(b.specialty || '')
      })) {
        if (y > 195) { pdf.addPage(); y = 30 }
        const line = `${e.day.padEnd(10)} ${(WEEK_DATES[e.day] || '').padEnd(13)} ${e.time.padEnd(14)} ${(e.specialty || '').padEnd(7)} ${e.course.padEnd(32)} ${(e.room || '').padEnd(9)} ${e.lecturer}`
        pdf.text(line, 15, y); y += 5
      }
      pdf.save(`IUGET-Timetable-${trackId}-${specialtyFilter}.pdf`)
      toast.success('PDF downloaded', { id: t })
    } catch (err) {
      toast.error('Could not generate PDF', { id: t })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Timetable"
        subtitle={`${track.name}  ·  Ref ${track.docRef || ''}`}
        actions={
          <>
            <button onClick={() => window.print()} className="btn-secondary">
              <Printer size={16} /> Print
            </button>
            <button onClick={exportPDF} className="btn-primary">
              <Download size={16} /> Download PDF
            </button>
          </>
        }
      />

      {/* Track selector */}
      <div className="card">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Section</div>
        <div className="flex gap-2 flex-wrap">
          {Object.values(TIMETABLE_TRACKS).map((t) => (
            <button
              key={t.id}
              onClick={() => setTrackId(t.id)}
              className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition text-left ${
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

      {/* Specialty filter */}
      <div className="card">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
              <Filter size={11} className="inline mr-1" /> Specialty
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSpecialtyFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  specialtyFilter === 'all'
                    ? 'bg-brand-800 text-white'
                    : 'bg-white border border-ink-200 text-ink-700 hover:bg-ink-50'
                }`}
              >
                All specialties
              </button>
              {track.specialties.map((sid) => {
                const s = SPECIALTIES[sid]
                const isMine = user?.specialty === sid
                return (
                  <button
                    key={sid}
                    onClick={() => setSpecialtyFilter(sid)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                      specialtyFilter === sid
                        ? 'bg-brand-800 text-white'
                        : `${s.chip} hover:opacity-80`
                    }`}
                  >
                    {sid}
                    {isMine && <span className="ml-1 text-[9px] opacity-80">(yours)</span>}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="badge-info"><Clock size={10} /> {totalHours} hours / week</span>
            <span className="badge-success">{entries.length} sessions</span>
          </div>
        </div>
      </div>

      {/* Schedule info */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card flex items-center gap-3">
          <Moon size={18} className="text-brand-800 shrink-0" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Weekday sessions</div>
            <div className="text-sm">{track.weekdaySlots.join(' · ') || '—'}</div>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Sun size={18} className="text-amber-500 shrink-0" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Saturday sessions</div>
            <div className="text-sm">{track.saturdaySlots.length ? track.saturdaySlots.join(' · ') : 'No Saturday classes'}</div>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Calendar size={18} className="text-accent-600 shrink-0" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Effective</div>
            <div className="text-sm font-medium">Week 25–31 May 2026</div>
          </div>
        </div>
      </div>

      {/* IUGET-style 3-column-per-day grid (only for Bachelor evening with multiple specialties shown) */}
      {trackId === 'bachelor-evening' && (
        <BachelorGrid
          track={track}
          grid={grid}
          visibleSpecialties={visibleSpecialties}
          holidayFor={holidayFor}
        />
      )}

      {/* Compact single-specialty grid for Level 1 / Level 2 */}
      {trackId !== 'bachelor-evening' && (
        <SimpleGrid
          track={track}
          grid={grid}
          specialty={specialtyFilter}
        />
      )}

      {entries.length === 0 && (
        <div className="card text-center py-12 text-ink-500">
          <div className="font-display font-bold text-lg">No timetable entries match your filter</div>
          <div className="text-sm mt-1">Try selecting a different specialty or track.</div>
        </div>
      )}
    </div>
  )
}

/* ===== Bachelor 3-specialty grid (matches the IUGET paper format) ===== */
function BachelorGrid({ track, grid, visibleSpecialties, holidayFor }) {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const showWeekdays = track.weekdaySlots.length > 0

  return (
    <div className="space-y-6">
      {showWeekdays && (
        <>
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-brand-800" />
            <h3 className="font-display font-bold text-lg">Monday — Friday (Evening)</h3>
          </div>

          <div className="card p-0 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                {/* Day headers */}
                <tr className="bg-brand-800 text-white text-xs">
                  <th rowSpan={2} className="p-3 text-left border border-brand-900 w-32">Day</th>
                  <th rowSpan={2} className="p-3 text-left border border-brand-900 w-28">Time</th>
                  {visibleSpecialties.map((sid) => (
                    <th
                      key={sid}
                      colSpan={1}
                      className="p-3 text-center border border-brand-900"
                    >
                      {sid}
                      <div className="text-[10px] text-white/70 font-normal">{SPECIALTIES[sid]?.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekdays.map((day) => {
                  const holiday = holidayFor(day)
                  if (holiday) {
                    return (
                      <tr key={day}>
                        <td className="p-3 font-bold bg-ink-50 border border-ink-200">
                          <div>{day}</div>
                          <div className="text-[10px] text-ink-500 font-normal">{WEEK_DATES[day]}</div>
                        </td>
                        <td colSpan={visibleSpecialties.length + 1} className="p-6 text-center bg-amber-50 border border-ink-200">
                          <div className="font-display font-bold text-amber-700 text-lg">🕌 {holiday.name}</div>
                          <div className="text-xs text-amber-600 mt-1">No classes scheduled</div>
                        </td>
                      </tr>
                    )
                  }
                  return track.weekdaySlots.map((slot, slotIdx) => (
                    <tr key={`${day}-${slot}`}>
                      {slotIdx === 0 && (
                        <td rowSpan={track.weekdaySlots.length} className="p-3 font-bold bg-ink-50 border border-ink-200 align-top">
                          <div>{day}</div>
                          <div className="text-[10px] text-ink-500 font-normal">{WEEK_DATES[day]}</div>
                        </td>
                      )}
                      <td className="p-3 text-xs font-mono text-ink-700 bg-ink-50/50 border border-ink-200 whitespace-nowrap">
                        {slot}
                      </td>
                      {visibleSpecialties.map((sid) => {
                        const cell = grid[`${day}|${slot}|${sid}`]
                        return (
                          <td key={sid} className="p-2 border border-ink-200 align-top">
                            {cell ? (
                              <div className={`p-2.5 rounded-lg border ${SPECIALTIES[sid].chip} border-opacity-50`}>
                                <div className="text-xs font-bold leading-tight">
                                  {cell.course}
                                  {cell.kind && <span className="ml-1 px-1 py-0.5 bg-white/60 rounded text-[9px]">{cell.kind}</span>}
                                  {cell.group && <span className="ml-1 text-[10px] opacity-70">({cell.group})</span>}
                                </div>
                                <div className="text-[10px] mt-1 opacity-80">{cell.lecturer}</div>
                                <div className="text-[9px] opacity-60 mt-0.5">{cell.room}</div>
                              </div>
                            ) : (
                              <div className="p-2.5 text-center text-[10px] text-ink-300">—</div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Saturday grid */}
      {track.saturdaySlots.length > 0 && (
        <>
          <div className="flex items-center gap-2 mt-6">
            <Sun size={16} className="text-amber-500" />
            <h3 className="font-display font-bold text-lg">Saturday</h3>
            <span className="badge-warning">Full day · 30/05/2026</span>
          </div>
          <div className="card p-0 overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-amber-500 text-white text-xs">
                  <th className="p-3 text-left border border-amber-600 w-28">Time</th>
                  {visibleSpecialties.map((sid) => (
                    <th key={sid} className="p-3 text-center border border-amber-600">
                      {sid}
                      <div className="text-[10px] text-white/80 font-normal">{SPECIALTIES[sid]?.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {track.saturdaySlots.map((slot) => (
                  <tr key={slot}>
                    <td className="p-3 text-xs font-mono text-ink-700 bg-ink-50/50 border border-ink-200 whitespace-nowrap">
                      {slot}
                    </td>
                    {visibleSpecialties.map((sid) => {
                      const cell = grid[`Saturday|${slot}|${sid}`]
                      return (
                        <td key={sid} className="p-2 border border-ink-200 align-top">
                          {cell ? (
                            <div className={`p-2.5 rounded-lg border ${SPECIALTIES[sid].chip} border-opacity-50`}>
                              <div className="text-xs font-bold leading-tight">{cell.course}</div>
                              <div className="text-[10px] mt-1 opacity-80">{cell.lecturer}</div>
                              <div className="text-[9px] opacity-60 mt-0.5">{cell.room}</div>
                            </div>
                          ) : (
                            <div className="p-2.5 text-center text-[10px] text-ink-300">—</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

/* ===== Compact morning-section grid (Level 1, Level 2) ===== */
function SimpleGrid({ track, grid, specialty }) {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const visibleSpecs = specialty === 'all' ? track.specialties : [specialty]

  return (
    <div className="card p-0 overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
          <tr>
            <th className="text-left p-4 w-32">Time</th>
            {weekdays.map((d) => <th key={d} className="text-left p-4">{d}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {track.weekdaySlots.map((slot) => (
            <tr key={slot}>
              <td className="p-3 text-sm font-mono font-medium text-ink-700 bg-ink-50/50">{slot}</td>
              {weekdays.map((day) => {
                const cells = visibleSpecs.map((sid) => grid[`${day}|${slot}|${sid}`]).filter(Boolean)
                if (cells.length === 0) {
                  return (
                    <td key={day} className="p-2">
                      <div className="p-3 rounded-xl border border-dashed border-ink-200 text-center text-[11px] text-ink-400">Free</div>
                    </td>
                  )
                }
                return (
                  <td key={day} className="p-2 align-top space-y-1">
                    {cells.map((c, i) => (
                      <div key={i} className={`p-2 rounded-lg ${SPECIALTIES[c.specialty]?.chip || 'bg-brand-50 text-brand-800'} text-xs`}>
                        <div className="font-bold">{c.course}</div>
                        <div className="text-[10px] opacity-80">{c.room} · {c.lecturer}</div>
                      </div>
                    ))}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
