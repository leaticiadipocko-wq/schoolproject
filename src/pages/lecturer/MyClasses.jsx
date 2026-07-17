import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Users, Calendar, ClipboardCheck, FileSpreadsheet, MessageCircle, X, Search, Clock, GraduationCap } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { MOCK_COURSES } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'
import toast from 'react-hot-toast'

const COURSE_ACTIONS = [
  { label: 'Mark Attendance', icon: ClipboardCheck, to: '/lecturer/attendance', color: 'bg-brand-500' },
  { label: 'Enter Grades',    icon: FileSpreadsheet, to: '/lecturer/grades',     color: 'bg-accent-600' },
  { label: 'Class Chat',      icon: MessageCircle,   to: '/lecturer/chat',       color: 'bg-emerald-600' },
]

export default function MyClasses() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const lecturerCourses = user?.courses || []
  const mine = lecturerCourses.length > 0
    ? MOCK_COURSES.filter((c) => lecturerCourses.includes(c.code))
    : MOCK_COURSES

  const filtered = searchTerm.trim()
    ? mine.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mine

  return (
    <div className="space-y-6">
      <PageHeader title="My Classes" subtitle="Courses you teach this semester" />

      <div className="card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              className="input pl-9 text-sm"
              placeholder="Search by course code or name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <BookOpen size={16} />
            <span>{filtered.length} course{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <BookOpen size={48} className="mx-auto text-ink-300" />
          <h3 className="font-display font-bold text-lg mt-4">No courses found</h3>
          <p className="text-ink-500 mt-1">
            {searchTerm ? 'Try a different search term.' : 'Courses assigned to you will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.code} className="card-hover group">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center group-hover:scale-110 transition">
                  <BookOpen size={22} />
                </div>
                <span className="badge-info">Level {c.level}</span>
              </div>
              <div className="font-display font-bold text-lg mt-3">{c.code}</div>
              <div className="text-sm text-ink-700">{c.name}</div>
              <div className="flex items-center gap-4 mt-4 text-xs text-ink-500">
                <span className="flex items-center gap-1"><Users size={12} /> 42 enrolled</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {c.credits} credits</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {c.semester || 'Semester 1'}</span>
              </div>
              <div className="mt-4 space-y-2">
                {COURSE_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.to)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: action.color }}
                  >
                    <action.icon size={16} />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
