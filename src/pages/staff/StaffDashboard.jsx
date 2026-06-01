import { Link } from 'react-router-dom'
import { Users, FileText, ClipboardCheck, Megaphone, ArrowRight, UserPlus, Banknote } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import StatCard from '@/components/ui/StatCard'

export default function StaffDashboard() {
  const { user } = useAuth()
  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-br from-amber-500 to-brand-600 text-white border-0">
        <div className="text-white/80 text-sm">Office</div>
        <h2 className="text-3xl font-display font-bold mt-1">{user?.department} — {user?.name}</h2>
        <p className="text-white/80 mt-1.5">Manage academic operations and student support.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Active Students" value="2,847" color="brand" />
        <StatCard icon={FileText} label="Pending Documents" value="14" color="amber" />
        <StatCard icon={ClipboardCheck} label="Resit Requests" value="22" color="accent" />
        <StatCard icon={Megaphone} label="Open Tickets" value="8" color="red" />
      </div>

      <div className="card">
        <h3 className="font-display font-bold text-lg mb-4">Quick Operations</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link to="/staff/enrollment" className="p-4 rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-accent-50 hover:shadow-soft transition">
            <UserPlus size={20} className="text-brand-700" />
            <div className="font-medium mt-2 text-sm">Enrol New Student</div>
            <div className="text-[11px] text-ink-500 mt-0.5">Auto matricule + account + ID + fees</div>
          </Link>
          <Link to="/staff/finance" className="p-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-amber-50 hover:shadow-soft transition">
            <Banknote size={20} className="text-emerald-700" />
            <div className="font-medium mt-2 text-sm">Tuition Tracking</div>
            <div className="text-[11px] text-ink-500 mt-0.5">All MoMo / OM / card payments</div>
          </Link>
          <Link to="/staff/users" className="p-4 rounded-xl border border-ink-200 hover:border-brand-300 hover:bg-brand-50 transition">
            <Users size={20} className="text-brand-600" />
            <div className="font-medium mt-2 text-sm">Manage Users</div>
          </Link>
          <Link to="/staff/announcements" className="p-4 rounded-xl border border-ink-200 hover:border-brand-300 hover:bg-brand-50 transition">
            <Megaphone size={20} className="text-brand-600" />
            <div className="font-medium mt-2 text-sm">Send Announcement</div>
          </Link>
          <Link to="/staff/timetable" className="p-4 rounded-xl border border-ink-200 hover:border-brand-300 hover:bg-brand-50 transition">
            <FileText size={20} className="text-brand-600" />
            <div className="font-medium mt-2 text-sm">Timetables</div>
          </Link>
          <Link to="/staff/analytics" className="p-4 rounded-xl border border-ink-200 hover:border-brand-300 hover:bg-brand-50 transition">
            <ArrowRight size={20} className="text-brand-600" />
            <div className="font-medium mt-2 text-sm">View Analytics</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
