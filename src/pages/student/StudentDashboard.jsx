import { Link } from 'react-router-dom'
import { ClipboardCheck, CalendarClock, FileText, BookOpen, Sparkles, TrendingUp, ArrowRight, Bot, Wallet, IdCard } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import StatCard from '@/components/ui/StatCard'

const formatFCFA = (n) => new Intl.NumberFormat('fr-CM').format(n) + ' FCFA'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { attendance, announcements: allAnnouncements, timetable, enrolledCourses, recommendedCourses, fees } = useData()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  // Show only the Bachelor (Level 3) evening + Saturday schedule
  const todayClasses = timetable.filter(
    (t) => t.day === today && (t.track || 'bachelor-evening') === 'bachelor-evening'
  )
  const avgAttendance = attendance.length
    ? Math.round(attendance.reduce((s, a) => s + a.percent, 0) / attendance.length)
    : 0
  const announcements = allAnnouncements.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="card bg-gradient-to-br from-brand-600 to-accent-600 text-white border-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-white/80 text-sm">Welcome back,</div>
            <h2 className="text-3xl font-display font-bold mt-1">{user?.name?.split(' ')[0]} 👋</h2>
            <p className="text-white/80 mt-1.5">{user?.program} · Level {user?.level} · {user?.studentId}</p>
          </div>
          <Link to="/student/chatbot" className="bg-white/15 hover:bg-white/25 transition rounded-xl px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2">
            <Bot size={16} /> Ask AI Assistant
          </Link>
        </div>
      </div>

      {/* Quick actions: Fees + ID Card */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/student/fees" className="card-hover bg-gradient-to-br from-accent-50 to-amber-50 border-accent-200 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-600 text-white flex items-center justify-center group-hover:scale-110 transition">
              <Wallet size={22} />
            </div>
            <div className="flex-1">
              <div className="text-xs text-ink-500">Outstanding tuition</div>
              <div className="text-xl font-display font-bold text-accent-700">{formatFCFA(fees.balance)}</div>
              <div className="text-xs text-ink-500">Due {new Date(fees.deadline).toLocaleDateString('en-GB')}</div>
            </div>
            <ArrowRight size={20} className="text-accent-600 group-hover:translate-x-1 transition" />
          </div>
        </Link>
        <Link to="/student/idcard" className="card-hover bg-gradient-to-br from-brand-50 to-accent-50 border-brand-200 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center group-hover:scale-110 transition">
              <IdCard size={22} />
            </div>
            <div className="flex-1">
              <div className="text-xs text-ink-500">Student ID Card</div>
              <div className="text-xl font-display font-bold text-brand-800">View & print</div>
              <div className="text-xs text-ink-500">Valid until Sep 2027</div>
            </div>
            <ArrowRight size={20} className="text-brand-800 group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ClipboardCheck} label="Avg. Attendance" value={`${avgAttendance}%`} trend="+3%" color="brand" />
        <StatCard icon={FileText} label="Current GPA" value="3.62" trend="+0.18" color="green" />
        <StatCard icon={BookOpen} label="Active Courses" value="6" color="accent" />
        <StatCard icon={CalendarClock} label="Classes Today" value={todayClasses.length} color="amber" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Attendance chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-lg">Attendance by Course</h3>
              <p className="text-sm text-ink-500">This semester</p>
            </div>
            <Link to="/student/attendance" className="text-sm text-brand-600 hover:underline inline-flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={attendance}>
              <XAxis dataKey="course" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)' }}
              />
              <Bar dataKey="percent" radius={[8, 8, 0, 0]}>
                {attendance.map((d, i) => (
                  <Cell key={i} fill={d.percent >= 75 ? '#6366f1' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Today's classes */}
        <div className="card">
          <h3 className="font-display font-bold text-lg">Today · {today}</h3>
          <div className="mt-4 space-y-3">
            {todayClasses.length === 0 ? (
              <div className="text-sm text-ink-500 py-6 text-center">No classes scheduled — enjoy your day!</div>
            ) : (
              todayClasses.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-ink-50">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold">
                    {c.course}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">{c.time}</div>
                    <div className="text-xs text-ink-500">{c.room} · {c.lecturer}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Announcements */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-lg">Latest Announcements</h3>
            <Link to="/student/announcements" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-4 rounded-xl border border-ink-100 hover:border-brand-200 transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-sm text-ink-600 mt-1">{a.body}</div>
                    <div className="text-xs text-ink-400 mt-2">{a.author} · {new Date(a.createdAt).toLocaleDateString()}</div>
                  </div>
                  {a.pinned && <span className="badge-warning">Pinned</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI recommendations */}
        <div className="card bg-gradient-to-br from-brand-50 to-accent-50 border-brand-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-brand-600" />
            <h3 className="font-display font-bold text-lg">Recommended for You</h3>
          </div>
          <div className="space-y-3">
            {recommendedCourses.map((c) => (
              <div key={c.code} className="p-3 rounded-xl bg-white border border-brand-100">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{c.code} · {c.name}</div>
                  <span className="badge-info">{c.match}%</span>
                </div>
                <div className="text-xs text-ink-500 mt-1">{c.reason}</div>
              </div>
            ))}
          </div>
          <Link to="/student/courses" className="mt-4 btn-primary w-full text-sm">
            <TrendingUp size={14} /> Explore all
          </Link>
        </div>
      </div>
    </div>
  )
}
