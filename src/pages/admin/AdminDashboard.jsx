import { Link } from 'react-router-dom'
import { Users, GraduationCap, TrendingUp, DollarSign, LineChart as LineChartIcon, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { useAuth } from '@/context/AuthContext'
import { MOCK_ENROLLMENT_TREND, MOCK_DEPARTMENT_DISTRIBUTION, MOCK_ANNOUNCEMENT_INSIGHTS } from '@/lib/mockData'
import StatCard from '@/components/ui/StatCard'

const PIE_COLORS = ['#1e3aa0', '#e63946', '#f59e0b', '#10b981', '#0ea5e9']

const INSIGHT_ICON = {
  success: { icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
  warning: { icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
  info:    { icon: Info,         color: 'text-brand-600 bg-brand-50' },
}

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-br from-ink-900 to-brand-900 text-white border-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-white/70 text-sm">Executive overview</div>
            <h2 className="text-3xl font-display font-bold mt-1">Welcome, {user?.title || user?.name}</h2>
            <p className="text-white/70 mt-1.5">Here is what's happening across SIARM University today.</p>
          </div>
          <Link to="/admin/analytics" className="bg-white/10 hover:bg-white/20 transition rounded-xl px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2">
            <LineChartIcon size={16} /> Open analytics
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value="2,847" trend="+12%" color="brand" />
        <StatCard icon={GraduationCap} label="Faculty" value="142" trend="+4" color="accent" />
        <StatCard icon={TrendingUp} label="Application Rate" value="22%" trend="+5%" color="green" />
        <StatCard icon={DollarSign} label="Fee Collection" value="92%" trend="+3%" color="amber" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Enrollment trend */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-lg">Enrollment Trend</h3>
              <p className="text-sm text-ink-500">Applications vs admitted · last 5 years</p>
            </div>
            <span className="badge-info">5-year trend</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={MOCK_ENROLLMENT_TREND}>
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="applications" stroke="#6366f1" fill="url(#ga)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="admitted"     stroke="#06b6d4" fill="url(#gb)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Departments */}
        <div className="card">
          <h3 className="font-display font-bold text-lg mb-1">Students by Department</h3>
          <p className="text-sm text-ink-500 mb-3">Current intake distribution</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={MOCK_DEPARTMENT_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {MOCK_DEPARTMENT_DISTRIBUTION.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {MOCK_DEPARTMENT_DISTRIBUTION.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  {d.name}
                </div>
                <span className="font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational insights */}
      <div className="card bg-gradient-to-br from-amber-50 to-accent-50 border-amber-100">
        <div className="flex items-center gap-2 mb-4">
          <LineChartIcon size={20} className="text-accent-600" />
          <h3 className="font-display font-bold text-lg">Operational Insights</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {MOCK_ANNOUNCEMENT_INSIGHTS.map((ins, i) => {
            const cfg = INSIGHT_ICON[ins.type] || INSIGHT_ICON.info
            const Icon = cfg.icon
            return (
              <div key={i} className="p-3 rounded-xl bg-white border border-amber-100 flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.color}`}>
                  <Icon size={18} />
                </div>
                <div className="text-sm text-ink-700">{ins.text}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
