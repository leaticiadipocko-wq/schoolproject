import { useData } from '@/context/DataContext'
import PageHeader from '@/components/ui/PageHeader'
import StatCard from '@/components/ui/StatCard'
import { Award, TrendingUp, Target } from 'lucide-react'

const gradePoints = { 'A': 4, 'B+': 3.5, 'B': 3, 'C+': 2.5, 'C': 2, 'D': 1, 'F': 0 }

export default function Results() {
  const { results: storedResults } = useData()
  // Only show results without a studentId (general/aggregate) or for the current user
  const results = storedResults.filter((r) => !r.studentId)
  const gpa = results.length
    ? (results.reduce((s, r) => s + (gradePoints[r.grade] || 0), 0) / results.length).toFixed(2)
    : '0.00'
  const best = results.length ? results.reduce((m, r) => (r.total > m.total ? r : m), results[0]) : null
  const passed = results.filter((r) => r.total >= 50).length

  return (
    <div className="space-y-6">
      <PageHeader title="Academic Results" subtitle="Cumulative performance across semesters" />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={Award} label="Current GPA" value={gpa} color="brand" />
        <StatCard icon={TrendingUp} label="Highest Score" value={best ? `${best.total} (${best.course})` : '—'} color="green" />
        <StatCard icon={Target} label="Courses Passed" value={`${passed} / ${results.length}`} color="accent" />
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
            {results.map((r, i) => (
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
