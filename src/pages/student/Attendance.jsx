import toast from 'react-hot-toast'
import { ClipboardCheck, Download } from 'lucide-react'
import { useData } from '@/context/DataContext'
import PageHeader from '@/components/ui/PageHeader'

export default function Attendance() {
  const { attendance } = useData()
  const overall = attendance.length
    ? Math.round(attendance.reduce((s, a) => s + a.percent, 0) / attendance.length)
    : 0

  const exportCsv = () => {
    const csv = ['Course,Attended,Total,Percent', ...attendance.map((a) => `${a.course},${a.attended},${a.total},${a.percent}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url; link.download = 'attendance.csv'; link.click()
    URL.revokeObjectURL(url)
    toast.success('Attendance exported')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        subtitle="Track your presence across all enrolled courses"
        actions={
          <button onClick={exportCsv} className="btn-secondary"><Download size={16} /> Export</button>
        }
      />

      <div className="card bg-gradient-to-br from-brand-600 to-accent-600 text-white border-0">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
            <ClipboardCheck size={28} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-white/80">Overall attendance</div>
            <div className="text-4xl font-display font-bold">{overall}%</div>
            <div className="text-sm text-white/80 mt-1">
              {overall >= 75 ? '✓ Meets minimum requirement' : '⚠ Below required threshold'}
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="text-left p-4">Course</th>
              <th className="text-left p-4">Attended</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Percentage</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {attendance.map((a) => (
              <tr key={a.course} className="hover:bg-ink-50/50 transition">
                <td className="p-4 font-medium">{a.course}</td>
                <td className="p-4 text-ink-600">{a.attended}</td>
                <td className="p-4 text-ink-600">{a.total}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-[200px] h-2 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${a.percent >= 75 ? 'bg-brand-500' : 'bg-amber-500'}`}
                        style={{ width: `${a.percent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{a.percent}%</span>
                  </div>
                </td>
                <td className="p-4">
                  {a.percent >= 75 ? (
                    <span className="badge-success">Good</span>
                  ) : a.percent >= 65 ? (
                    <span className="badge-warning">At risk</span>
                  ) : (
                    <span className="badge-danger">Critical</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
