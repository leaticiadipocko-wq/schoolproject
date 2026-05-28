import { MOCK_RESULTS } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'
import StatCard from '@/components/ui/StatCard'
import { Award, TrendingUp, Target } from 'lucide-react'

const gradePoints = { 'A': 4, 'B+': 3.5, 'B': 3, 'C+': 2.5, 'C': 2, 'D': 1, 'F': 0 }

export default function Results() {
  const gpa = (
    MOCK_RESULTS.reduce((s, r) => s + (gradePoints[r.grade] || 0), 0) / MOCK_RESULTS.length
  ).toFixed(2)
  const best = MOCK_RESULTS.reduce((m, r) => (r.total > m.total ? r : m), MOCK_RESULTS[0])
  const passed = MOCK_RESULTS.filter((r) => r.total >= 50).length

  return (
    <div className="space-y-6">
      <PageHeader title="Academic Results" subtitle="Cumulative performance across semesters" />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={Award} label="Current GPA" value={gpa} color="brand" />
        <StatCard icon={TrendingUp} label="Highest Score" value={`${best.total} (${best.course})`} color="green" />
        <StatCard icon={Target} label="Courses Passed" value={`${passed} / ${MOCK_RESULTS.length}`} color="accent" />
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="text-left p-4">Course</th>
              <th className="text-left p-4">Semester</th>
              <th className="text-left p-4">CA (30)</th>
              <th className="text-left p-4">Exam (70)</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {MOCK_RESULTS.map((r, i) => (
              <tr key={i} className="hover:bg-ink-50/50">
                <td className="p-4 font-medium">{r.course}</td>
                <td className="p-4 text-ink-600">{r.semester}</td>
                <td className="p-4 text-ink-600">{r.ca}</td>
                <td className="p-4 text-ink-600">{r.exam}</td>
                <td className="p-4 font-semibold">{r.total}</td>
                <td className="p-4">
                  <span className={`badge ${
                    r.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                    r.grade.startsWith('B') ? 'bg-brand-100 text-brand-700' :
                    r.grade.startsWith('C') ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>{r.grade}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
