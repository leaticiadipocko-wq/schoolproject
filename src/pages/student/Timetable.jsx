import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import { useData } from '@/context/DataContext'
import PageHeader from '@/components/ui/PageHeader'
import { Download, Sparkles } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const SLOTS = ['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00']

export default function Timetable() {
  const { timetable } = useData()
  const grid = {}
  for (const item of timetable) {
    if (!grid[item.day]) grid[item.day] = {}
    grid[item.day][item.time] = item
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Timetable"
        subtitle="AI-optimized weekly schedule"
        actions={
          <>
            <button onClick={() => toast.success('Your timetable is already optimized!')} className="btn-secondary">
              <Sparkles size={16} /> Optimize
            </button>
            <button onClick={() => {
              const pdf = new jsPDF('l', 'mm', 'a4')
              pdf.setFontSize(18); pdf.text('IUGET — Class Timetable', 15, 20)
              pdf.setFontSize(10); pdf.text(`Generated ${new Date().toLocaleDateString()}`, 15, 27)
              let y = 40
              for (const t of timetable) {
                pdf.text(`${t.day.padEnd(10)} ${t.time}  ${t.course}  ${t.room}  ${t.lecturer}`, 15, y); y += 7
              }
              pdf.save('IUGET-Timetable.pdf')
              toast.success('PDF downloaded')
            }} className="btn-primary"><Download size={16} /> Download PDF</button>
          </>
        }
      />

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[720px]">
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
                  const cell = grid[day]?.[slot]
                  return (
                    <td key={day} className="p-2 align-top">
                      {cell ? (
                        <div className="p-3 rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 border border-brand-100 h-full">
                          <div className="text-xs font-bold text-brand-700">{cell.course}</div>
                          <div className="text-[11px] text-ink-600 mt-1">{cell.room}</div>
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
  )
}
