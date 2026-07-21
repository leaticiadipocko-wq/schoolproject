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
    const csv = ['Course,Period,Attended,Total,Percent', ...attendance.map((a) => `${a.course},${a.period || '-'},${a.attended},${a.total},${a.percent}`)].join('\n')
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
        subtitle="Track your presence across all enrolled courses and time periods"
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="text-left p-4 whitespace-nowrap">Course</th>
                <th className="text-left p-4 whitespace-nowrap">Period</th>
                <th className="text-left p-4 whitespace-nowrap">Attended</th>
                <th className="text-left p-4 whitespace-nowrap">Total</th>
                <th className="text-left p-4 whitespace-nowrap">Percentage</th>
                <th className="text-left p-4 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {attendance.map((a) => (
                <tr key={`${a.course}-${a.period || ''}`} className="hover:bg-ink-50/50 transition">
                  <td className="p-4 font-medium whitespace-nowrap">{a.course}</td>
                  <td className="p-4 text-ink-600 font-mono text-xs whitespace-nowrap">{a.period || '—'}</td>
                  <td className="p-4 text-ink-600 whitespace-nowrap">{a.attended}</td>
                  <td className="p-4 text-ink-600 whitespace-nowrap">{a.total}</td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[120px] sm:max-w-[200px] h-2 bg-ink-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${a.percent >= 75 ? 'bg-brand-500' : 'bg-amber-500'}`}
                          style={{ width: `${a.percent}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{a.percent}%</span>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
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
    </div>
  )
}
