import { Link } from 'react-router-dom'
import { BookOpen, ClipboardCheck, Users, FileSpreadsheet, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import StatCard from '@/components/ui/StatCard'

export default function LecturerDashboard() {
  const { user } = useAuth()
  const { timetable } = useData()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayClasses = timetable.filter((t) => t.day === today && user?.courses?.includes(t.course))

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-br from-accent-600 to-brand-600 text-white border-0">
        <div>
          <div className="text-white/80 text-sm">Good day,</div>
          <h2 className="text-3xl font-display font-bold mt-1">Dr. {user?.name?.split(' ').slice(-1)} 👋</h2>
          <p className="text-white/80 mt-1.5">{user?.department} · {user?.courses?.length || 0} courses this semester</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="My Courses" value={user?.courses?.length || 0} color="brand" />
        <StatCard icon={Users} label="Total Students" value="128" trend="+8" color="accent" />
        <StatCard icon={ClipboardCheck} label="Attendance Marked" value="84%" color="green" />
        <StatCard icon={FileSpreadsheet} label="Pending Grades" value="22" color="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Today's Classes</h3>
            <Link to="/lecturer/classes" className="text-sm text-brand-600 hover:underline inline-flex items-center gap-1">
              All classes <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {todayClasses.length === 0 ? (
              <div className="text-sm text-ink-500 py-6 text-center">No classes today</div>
            ) : todayClasses.map((c, i) => (
              <div key={i} className="p-4 rounded-xl bg-ink-50 flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.course} — {c.time}</div>
                  <div className="text-xs text-ink-500">{c.room}</div>
                </div>
                <Link to={`/lecturer/attendance?course=${c.course}`} className="btn-primary text-xs py-1.5">
                  Mark attendance
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-display font-bold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/lecturer/attendance" className="p-4 rounded-xl border border-ink-200 hover:border-brand-300 hover:bg-brand-50 transition">
              <ClipboardCheck size={20} className="text-brand-600" />
              <div className="font-medium mt-2 text-sm">Mark Attendance</div>
              <div className="text-xs text-ink-500 mt-0.5">Record student presence</div>
            </Link>
            <Link to="/lecturer/grades" className="p-4 rounded-xl border border-ink-200 hover:border-brand-300 hover:bg-brand-50 transition">
              <FileSpreadsheet size={20} className="text-brand-600" />
              <div className="font-medium mt-2 text-sm">Enter Grades</div>
              <div className="text-xs text-ink-500 mt-0.5">Submit CA & exam scores</div>
            </Link>
            <Link to="/lecturer/classes" className="p-4 rounded-xl border border-ink-200 hover:border-brand-300 hover:bg-brand-50 transition">
              <BookOpen size={20} className="text-brand-600" />
              <div className="font-medium mt-2 text-sm">My Classes</div>
              <div className="text-xs text-ink-500 mt-0.5">View course rosters</div>
            </Link>
            <Link to="/lecturer/announcements" className="p-4 rounded-xl border border-ink-200 hover:border-brand-300 hover:bg-brand-50 transition">
              <Users size={20} className="text-brand-600" />
              <div className="font-medium mt-2 text-sm">Announce</div>
              <div className="text-xs text-ink-500 mt-0.5">Notify students</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
