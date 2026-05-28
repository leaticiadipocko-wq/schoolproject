import toast from 'react-hot-toast'
import { Sparkles, BookOpen, Clock, TrendingUp, Check, Plus } from 'lucide-react'
import { MOCK_COURSES } from '@/lib/mockData'
import { useData } from '@/context/DataContext'
import PageHeader from '@/components/ui/PageHeader'

export default function Courses() {
  const { enrolledCourses, enrollCourse, unenrollCourse, recommendedCourses } = useData()

  const handleEnroll = (code, name) => {
    if (enrolledCourses.includes(code)) {
      unenrollCourse(code)
      toast.success(`Unenrolled from ${code}`)
    } else {
      enrollCourse(code)
      toast.success(`Enrolled in ${code} — ${name}`)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses & Recommendations"
        subtitle={`You are enrolled in ${enrolledCourses.length} course${enrolledCourses.length === 1 ? '' : 's'}`}
      />

      {/* AI recommendations */}
      <div className="card bg-gradient-to-br from-brand-50 to-accent-50 border-brand-100">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-brand-800" />
          <h2 className="font-display font-bold text-lg">AI-Curated Recommendations</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {recommendedCourses.map((c) => {
            const enrolled = enrolledCourses.includes(c.code)
            return (
              <div key={c.code} className="p-4 rounded-xl bg-white border border-brand-100">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm">{c.code}</div>
                  <span className="badge-info"><TrendingUp size={10} /> {c.match}%</span>
                </div>
                <div className="text-sm font-medium mt-1.5">{c.name}</div>
                <div className="text-xs text-ink-500 mt-2">{c.reason}</div>
                <button
                  onClick={() => handleEnroll(c.code, c.name)}
                  className={`w-full mt-3 text-xs py-2 rounded-xl font-medium inline-flex items-center justify-center gap-1.5 transition ${
                    enrolled
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-brand-800 text-white hover:bg-brand-900'
                  }`}
                >
                  {enrolled ? <><Check size={12} /> Enrolled</> : <><Plus size={12} /> Enroll</>}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* All courses */}
      <div>
        <h2 className="font-display font-bold text-lg mb-3">All Available Courses</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_COURSES.map((c) => {
            const enrolled = enrolledCourses.includes(c.code)
            return (
              <div key={c.code} className="card-hover">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <span className="badge-info">Level {c.level}</span>
                </div>
                <div className="font-bold mt-3">{c.code}</div>
                <div className="text-sm text-ink-700">{c.name}</div>
                <div className="text-xs text-ink-500 mt-2">{c.lecturer}</div>
                <div className="text-xs text-ink-500 mt-1 flex items-center gap-1">
                  <Clock size={12} /> {c.credits} credits
                </div>
                <button
                  onClick={() => handleEnroll(c.code, c.name)}
                  className={`w-full mt-4 text-xs py-2 rounded-xl font-medium inline-flex items-center justify-center gap-1.5 transition ${
                    enrolled
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'border border-brand-300 text-brand-800 hover:bg-brand-50'
                  }`}
                >
                  {enrolled ? <><Check size={12} /> Enrolled · Unenroll</> : <><Plus size={12} /> Enroll</>}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
