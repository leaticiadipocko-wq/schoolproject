import { BookOpen, Users, Calendar } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { MOCK_COURSES } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'

export default function MyClasses() {
  const { user } = useAuth()
  const mine = MOCK_COURSES.filter((c) => user?.courses?.includes(c.code))

  return (
    <div className="space-y-6">
      <PageHeader title="My Classes" subtitle="Courses you teach this semester" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mine.map((c) => (
          <div key={c.code} className="card-hover">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center">
                <BookOpen size={22} />
              </div>
              <span className="badge-info">Level {c.level}</span>
            </div>
            <div className="font-display font-bold text-lg mt-3">{c.code}</div>
            <div className="text-sm text-ink-700">{c.name}</div>
            <div className="flex items-center gap-4 mt-4 text-xs text-ink-500">
              <span className="flex items-center gap-1"><Users size={12} /> 42 enrolled</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {c.credits} credits</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="btn-secondary text-xs py-2">Roster</button>
              <button className="btn-primary text-xs py-2">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
