import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, CartesianGrid,
} from 'recharts'
import { Sparkles, TrendingUp, AlertTriangle, Brain } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'

const PERFORMANCE = [
  { month: 'Jan', avg: 64, pass: 78 },
  { month: 'Feb', avg: 66, pass: 80 },
  { month: 'Mar', avg: 69, pass: 83 },
  { month: 'Apr', avg: 68, pass: 81 },
  { month: 'May', avg: 71, pass: 85 },
  { month: 'Jun', avg: 73, pass: 87 },
]

const STAFF_LOAD = [
  { dept: 'CS',         courses: 28, lecturers: 8 },
  { dept: 'Business',   courses: 24, lecturers: 7 },
  { dept: 'Engineering',courses: 22, lecturers: 6 },
  { dept: 'Nursing',    courses: 18, lecturers: 5 },
  { dept: 'Law',        courses: 14, lecturers: 4 },
]

const RISK_STUDENTS = [
  { name: 'Brian Etoh',  course: 'CS307', attendance: 58, grade: 'D',  reason: 'Low CA + poor attendance' },
  { name: 'Mary Tah',    course: 'CS305', attendance: 62, grade: 'C',  reason: 'Declining trend' },
  { name: 'Noah Bate',   course: 'CS307', attendance: 51, grade: 'F',  reason: 'Multiple missed assignments' },
  { name: 'Queen Nya',   course: 'CS311', attendance: 65, grade: 'C',  reason: 'Recent absence pattern' },
]

export default function Analytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Analytics & Decision Support"
        subtitle="Data-driven insights for institutional leadership"
        actions={<button className="btn-primary"><Sparkles size={16} /> Generate report</button>}
      />

      {/* AI summary banner */}
      <div className="card bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 text-white border-0">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <Brain size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold">This week's executive summary</h3>
            <p className="text-white/85 mt-1.5 max-w-3xl">
              Overall student performance is trending upward (+5% vs last semester). Computer Science remains the
              highest-demand department. However, CS307 shows a concerning at-risk cohort of 14% — recommend
              scheduling supplementary tutorials within the next two weeks.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Academic Performance Trend</h3>
            <span className="badge-success"><TrendingUp size={10} /> +5%</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={PERFORMANCE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="avg"  stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="pass" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Staff Workload by Department</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={STAFF_LOAD}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="dept" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="courses"    fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="lecturers"  fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Predictive at-risk */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-600" />
            <h3 className="font-display font-bold text-lg">Predictive Risk: Students Needing Intervention</h3>
          </div>
          <span className="badge-warning">{RISK_STUDENTS.length} flagged</span>
        </div>
        <div className="overflow-hidden rounded-xl border border-ink-100">
          <table className="w-full">
            <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="text-left p-4">Student</th>
                <th className="text-left p-4">Course</th>
                <th className="text-left p-4">Attendance</th>
                <th className="text-left p-4">Current Grade</th>
                <th className="text-left p-4">AI Reason</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {RISK_STUDENTS.map((s, i) => (
                <tr key={i} className="hover:bg-ink-50/50">
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4 text-ink-600">{s.course}</td>
                  <td className="p-4 text-ink-600">{s.attendance}%</td>
                  <td className="p-4">
                    <span className={`badge ${
                      s.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{s.grade}</span>
                  </td>
                  <td className="p-4 text-sm text-ink-600">{s.reason}</td>
                  <td className="p-4">
                    <button className="btn-primary text-xs py-1.5">Intervene</button>
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
