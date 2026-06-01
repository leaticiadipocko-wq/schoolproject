import { useState } from 'react'
import { BookOpen, Clock, Play, Search, Code, Database, Smartphone } from 'lucide-react'
import { MOCK_LEARNING_TOPICS } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'

const CATEGORY_ICON = {
  Web: Code,
  Data: Database,
  Mobile: Smartphone,
}

export default function Learning() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const categories = ['All', ...new Set(MOCK_LEARNING_TOPICS.map((t) => t.category))]

  const filtered = MOCK_LEARNING_TOPICS.filter((t) =>
    (category === 'All' || t.category === category) &&
    (t.title.toLowerCase().includes(query.toLowerCase()) || t.summary.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mobile Learning Hub"
        subtitle="Bite-sized lessons — anywhere, anytime"
      />

      <div className="card bg-gradient-to-br from-brand-600 to-accent-600 text-white border-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-2xl font-display font-bold">Continue Learning</h3>
            <p className="text-white/80 text-sm mt-1">JavaScript Essentials · Lesson 7 of 18</p>
            <div className="mt-3 w-64 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '38%' }} />
            </div>
          </div>
          <button className="bg-white/15 hover:bg-white/25 rounded-xl px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2">
            <Play size={16} /> Resume
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics…"
            className="input pl-10 py-2 text-sm"
          />
        </div>
        <div className="flex gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                category === c ? 'bg-brand-600 text-white' : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => {
          const Icon = CATEGORY_ICON[t.category] || BookOpen
          return (
            <div key={t.id} className="card-hover">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <span className="badge-info">{t.category}</span>
              </div>
              <h3 className="font-display font-bold mt-3">{t.title}</h3>
              <p className="text-sm text-ink-600 mt-1.5 line-clamp-2">{t.summary}</p>
              <div className="flex items-center gap-4 text-xs text-ink-500 mt-3">
                <span className="flex items-center gap-1"><Clock size={12} /> {t.minutes} min</span>
                <span className="flex items-center gap-1"><BookOpen size={12} /> {t.lessons} lessons</span>
              </div>
              <button className="btn-primary w-full mt-4 text-sm">
                <Play size={14} /> Start lesson
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
