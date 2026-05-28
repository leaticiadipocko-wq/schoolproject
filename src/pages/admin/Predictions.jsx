import { TrendingUp, Sparkles, Target, AlertTriangle } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { MOCK_ENROLLMENT_TREND } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'

const RECOVERY = [
  { month: 'Jan', overdue: 240, recovered: 180 },
  { month: 'Feb', overdue: 280, recovered: 220 },
  { month: 'Mar', overdue: 310, recovered: 260 },
  { month: 'Apr', overdue: 290, recovered: 250 },
  { month: 'May', overdue: 260, recovered: 240 },
]

export default function Predictions() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Predictive Systems"
        subtitle="Forecasted enrollment, retention, and automated recovery"
      />

      {/* Headline forecast */}
      <div className="card bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 text-white border-0">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
            <Sparkles size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-display font-bold">2026 Enrollment Forecast</h3>
            <p className="text-white/85 mt-1.5 max-w-3xl">
              Based on 6-year historical data and macroeconomic indicators, SIARM University is
              projected to receive <strong>1,240 applications</strong> for the 2026 intake (+22%),
              with an admission target of <strong>860 students</strong>.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 max-w-md">
              <div className="rounded-xl bg-white/10 p-3">
                <div className="text-xs text-white/70">Confidence</div>
                <div className="font-display font-bold text-xl">94%</div>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <div className="text-xs text-white/70">Δ vs 2025</div>
                <div className="font-display font-bold text-xl">+22%</div>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <div className="text-xs text-white/70">Model</div>
                <div className="font-display font-bold text-xl">v2.1</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg flex items-center gap-2">
            <TrendingUp size={18} /> Enrollment Projection
          </h3>
          <span className="badge-info">Linear regression + ARIMA</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={MOCK_ENROLLMENT_TREND}>
            <defs>
              <linearGradient id="pa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
            <Area type="monotone" dataKey="applications" stroke="#6366f1" fill="url(#pa)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <Target size={18} /> Automated Fee Recovery
            </h3>
            <span className="badge-success">+18% vs Q1</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={RECOVERY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="overdue"   fill="#ef4444" radius={[6, 6, 0, 0]} />
              <Bar dataKey="recovered" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-600" />
            <h3 className="font-display font-bold text-lg">Retention Risk Predictions</h3>
          </div>
          <div className="space-y-3">
            {[
              { dept: 'Computer Science', risk: 'Low',     pct: 8,  color: 'bg-green-500' },
              { dept: 'Business',         risk: 'Medium',  pct: 18, color: 'bg-amber-500' },
              { dept: 'Engineering',      risk: 'Low',     pct: 11, color: 'bg-green-500' },
              { dept: 'Nursing',          risk: 'High',    pct: 26, color: 'bg-red-500' },
              { dept: 'Law',              risk: 'Medium',  pct: 16, color: 'bg-amber-500' },
            ].map((r) => (
              <div key={r.dept}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{r.dept}</span>
                  <span className="text-ink-500">{r.pct}% at risk · {r.risk}</span>
                </div>
                <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                  <div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.pct * 3}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
