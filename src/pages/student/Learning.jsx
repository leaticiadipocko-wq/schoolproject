import { useState } from 'react'
import { BookOpen, Clock, Play, Search, GraduationCap, Sparkles, X, FileText } from 'lucide-react'
import { MOCK_LEARNING_TOPICS } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'

export default function Learning() {
  const { lang } = useLang()
  const { lessons } = useData()           // ← lecturer-published lessons live here
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)

  const categories = ['All', 'IUGET courses', ...new Set(MOCK_LEARNING_TOPICS.map((t) => t.category))]

  const filteredTopics = MOCK_LEARNING_TOPICS.filter((t) =>
    (category === 'All' || category === t.category) &&
    (t.title.toLowerCase().includes(query.toLowerCase()) || t.summary.toLowerCase().includes(query.toLowerCase()))
  )

  const filteredLessons = lessons.filter((l) =>
    (category === 'All' || category === 'IUGET courses') &&
    (l.title.toLowerCase().includes(query.toLowerCase()) || l.body.toLowerCase().includes(query.toLowerCase()) || l.course.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Mobile Learning Hub' : 'Apprentissage Mobile'}
        subtitle={lang === 'en' ? 'Bite-sized lessons — anywhere, anytime' : 'Cours courts — partout, à tout moment'}
      />

      <div className="card bg-gradient-to-br from-brand-700 to-accent-600 text-white border-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-2xl font-display font-bold">
              {lang === 'en' ? 'Continue Learning' : 'Reprendre l\'apprentissage'}
            </h3>
            <p className="text-white/80 text-sm mt-1">
              {lang === 'en' ? 'JavaScript Essentials · Lesson 7 of 18' : 'JavaScript Essentiel · Leçon 7 sur 18'}
            </p>
            <div className="mt-3 w-64 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '38%' }} />
            </div>
          </div>
          <button className="bg-white/15 hover:bg-white/25 rounded-xl px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2">
            <Play size={16} /> {lang === 'en' ? 'Resume' : 'Reprendre'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search topics…' : 'Rechercher…'}
            className="input pl-10 py-2 text-sm"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                category === c ? 'bg-brand-700 text-white' : 'bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Lecturer-published lessons */}
      {filteredLessons.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-accent-600" />
            {lang === 'en' ? 'From your IUGET lecturers' : 'Par vos enseignants IUGET'}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelected(l)}
                className="card-hover text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-accent-100 text-accent-700 flex items-center justify-center">
                    <GraduationCap size={20} />
                  </div>
                  <span className="badge-info">{l.course}</span>
                </div>
                <h3 className="font-display font-bold mt-3 line-clamp-2">{l.title}</h3>
                <p className="text-sm text-ink-600 mt-1.5 line-clamp-2">{l.body}</p>
                <div className="flex items-center gap-3 text-xs text-ink-500 mt-3">
                  <span className="flex items-center gap-1"><Clock size={12} /> {l.duration}</span>
                  <span className="truncate">{l.lecturer}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Generic learning topics */}
      <div>
        <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-brand-700" />
          {lang === 'en' ? 'Self-study tracks' : 'Parcours d\'auto-formation'}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((t) => (
            <div key={t.id} className="card-hover">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                  <BookOpen size={20} />
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
                <Play size={14} /> {lang === 'en' ? 'Start lesson' : 'Commencer'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Lesson reader modal */}
      {selected && (
        <div className="fixed inset-0 bg-ink-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null) }}>
          <div className="bg-white dark:bg-ink-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b border-ink-100 dark:border-ink-800 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge-info">{selected.course}</span>
                  <span className="text-xs text-ink-500">· {selected.duration}</span>
                </div>
                <h2 className="font-display font-bold text-xl">{selected.title}</h2>
                <div className="text-xs text-ink-500 mt-1">
                  {lang === 'en' ? 'Published by' : 'Publié par'} {selected.lecturer} ·{' '}
                  {new Date(selected.publishedAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-line text-ink-800 dark:text-ink-100 leading-relaxed">{selected.body}</p>
              {selected.attachmentName && (
                <div className="mt-6 p-3 rounded-xl border border-ink-100 dark:border-ink-800 flex items-center gap-3">
                  <FileText size={18} className="text-brand-600" />
                  <div className="flex-1 text-sm">{selected.attachmentName}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
