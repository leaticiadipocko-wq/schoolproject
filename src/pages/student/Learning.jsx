import { useState, useMemo } from 'react'
import { BookOpen, Clock, Play, Search, GraduationCap, Sparkles, X, FileText, CheckCircle2, Trophy, ArrowLeft, ArrowRight, ChevronRight, Award, BarChart3 } from 'lucide-react'
import { MOCK_LEARNING_TOPICS } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'
import toast from 'react-hot-toast'

const PROGRESS_KEY = 'siarm_learning_progress'
const BADGE_KEY = 'siarm_earned_badges'

const BADGES = [
  { id:'first-lesson',  name:{ en:'First Step', fr:'Premier Pas' }, icon:'🎯', desc:{ en:'Complete your first lesson', fr:'Terminez votre première leçon' } },
  { id:'three-topics',  name:{ en:'Eager Learner', fr:'Apprenant Assidu' }, icon:'🔥', desc:{ en:'Complete 3 topics', fr:'Terminez 3 sujets' } },
  { id:'all-topics',    name:{ en:'Knowledge Master', fr:'Maître du Savoir' }, icon:'🏆', desc:{ en:'Complete all topics', fr:'Terminez tous les sujets' } },
  { id:'quiz-ace',      name:{ en:'Quiz Ace', fr:'As du Quiz' }, icon:'💯', desc:{ en:'Score 100% on any quiz', fr:'Obtenez 100% à un quiz' } },
  { id:'speed-demon',   name:{ en:'Speed Demon', fr:'Démon de Vitesse' }, icon:'⚡', desc:{ en:'Complete a topic in under 15 min', fr:'Terminez un sujet en moins de 15 min' } },
]

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {} } catch { return {} }
}
function saveProgress(p) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)) }
function loadBadges() {
  try { return JSON.parse(localStorage.getItem(BADGE_KEY)) || [] } catch { return [] }
}
function saveBadges(b) { localStorage.setItem(BADGE_KEY, JSON.stringify(b)) }

export default function Learning() {
  const { lang } = useLang()
  const { lessons } = useData()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)
  const [progress, setProgress] = useState(loadProgress)
  const [badges, setBadges] = useState(loadBadges)
  const [activeSlide, setActiveSlide] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(null)
  const [showBadges, setShowBadges] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

  const categories = ['All', 'IUGET courses', ...new Set(MOCK_LEARNING_TOPICS.map(t => t.category))]

  const filteredTopics = MOCK_LEARNING_TOPICS.filter(t =>
    (category === 'All' || category === t.category) &&
    (t.title.toLowerCase().includes(query.toLowerCase()) || t.summary.toLowerCase().includes(query.toLowerCase()))
  )
  const filteredLessons = lessons.filter(l =>
    (category === 'All' || category === 'IUGET courses') &&
    (l.title.toLowerCase().includes(query.toLowerCase()) || l.body.toLowerCase().includes(query.toLowerCase()) || l.course.toLowerCase().includes(query.toLowerCase()))
  )

  const totalTopics = MOCK_LEARNING_TOPICS.length
  const completedTopics = MOCK_LEARNING_TOPICS.filter(t => progress[t.id]?.completed).length
  const overallProgress = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0

  const currentProgress = selected ? progress[selected.id] || { completed: false, lessonIndex: 0, completedLessons: [] } : null
  const currentBadges = BADGES.map(b => ({ ...b, earned: badges.includes(b.id) }))

  function earnBadge(id) {
    if (!badges.includes(id)) {
      const next = [...badges, id]
      setBadges(next)
      saveBadges(next)
      const badge = BADGES.find(b => b.id === id)
      if (badge) toast.success(`🏅 ${lang === 'en' ? 'Badge earned' : 'Badge obtenu'}: ${badge.name[lang]}`, { duration: 3000 })
    }
  }

  function openTopic(topic) {
    setSelected(topic)
    setActiveSlide(0)
    setQuizAnswers({})
    setQuizSubmitted(false)
    setQuizScore(null)
    if (!progress[topic.id]) {
      const p = { ...progress, [topic.id]: { completed: false, lessonIndex: 0, completedLessons: [], startedAt: Date.now() } }
      setProgress(p)
      saveProgress(p)
    }
  }

  function markLessonComplete(topicId, lessonIdx) {
    const p = { ...progress }
    if (!p[topicId]) return
    const completedLessons = [...(p[topicId].completedLessons || [])]
    if (!completedLessons.includes(lessonIdx)) completedLessons.push(lessonIdx)
    p[topicId] = { ...p[topicId], completedLessons, lessonIndex: lessonIdx + 1 }
    if (completedLessons.length >= (selected?.slides?.length || 1)) {
      p[topicId].completed = true
      earnBadge('first-lesson')
      const completedCount = Object.values(p).filter(v => v.completed).length
      if (completedCount >= 3) earnBadge('three-topics')
      if (completedCount >= MOCK_LEARNING_TOPICS.length) earnBadge('all-topics')
      const elapsed = (Date.now() - (p[topicId].startedAt || Date.now())) / 60000
      if (elapsed < 15) earnBadge('speed-demon')
    }
    setProgress(p)
    saveProgress(p)
  }

  function handleQuizSubmit() {
    if (!selected?.quiz) return
    let correct = 0
    selected.quiz.forEach((q, i) => { if (quizAnswers[i] === q.correct) correct++ })
    const score = Math.round((correct / selected.quiz.length) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)
    if (score === 100) earnBadge('quiz-ace')
    if (currentProgress) markLessonComplete(selected.id, 999)
  }

  const SlideRenderer = ({ topic, idx }) => {
    const slides = topic.content?.slides || [
      { title: topic.title, body: topic.summary, image: null },
      { title: 'Key Concepts', body: `${topic.title} covers essential knowledge for ${topic.category} development.\n\nKey topics include:\n• Core principles and best practices\n• Hands-on exercises and examples\n• Real-world applications`, image: null },
      { title: 'Summary', body: `You have completed the ${topic.title} module.\n\nTotal duration: ${topic.minutes} minutes\nLessons: ${topic.lessons}`, image: null },
    ]
    if (idx >= slides.length) return null
    const slide = slides[idx]
    const isLast = idx === slides.length - 1
    const hasQuiz = !!topic.quiz?.length

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'en' ? 'Lesson' : 'Leçon'} {idx + 1} / {slides.length + (hasQuiz ? 1 : 0)}</span>
          <span className="badge-info">{topic.category}</span>
        </div>
        <div className="w-full h-1.5 bg-ink-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${((idx + 1) / (slides.length + (hasQuiz ? 1 : 0))) * 100}%` }} />
        </div>
        <h3 className="text-2xl font-display font-bold">{slide.title}</h3>
        {slide.image && <img src={slide.image} alt="" className="w-full rounded-xl max-h-64 object-cover" />}
        <div className="prose prose-sm max-w-none">
          <p className="text-ink-700 leading-relaxed whitespace-pre-line">{slide.body}</p>
        </div>
        {idx > 0 && <p className="text-xs text-ink-500 italic">{lang === 'en' ? 'Estimated reading: 3-5 min' : 'Lecture estimée : 3-5 min'}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={showBadges ? (lang === 'en' ? 'Achievements' : 'Récompenses') : showProgress ? (lang === 'en' ? 'My Progress' : 'Ma Progression') : (lang === 'en' ? 'Mobile Learning Hub' : 'Apprentissage Mobile')}
        subtitle={showBadges ? (lang === 'en' ? 'Badges and milestones' : 'Badges et jalons') : showProgress ? (lang === 'en' ? 'Track your learning journey' : 'Suivez votre parcours') : (lang === 'en' ? 'Bite-sized lessons — anywhere, anytime' : 'Cours courts — partout, à tout moment')}
        actions={<div className="flex gap-2">
          <button onClick={() => { setShowBadges(!showBadges); setShowProgress(false) }}
            className={`btn-ghost text-sm ${showBadges ? 'bg-brand-100 text-brand-700' : ''}`}>
            <Award size={16} /> {lang === 'en' ? 'Badges' : 'Badges'}
          </button>
          <button onClick={() => { setShowProgress(!showProgress); setShowBadges(false) }}
            className={`btn-ghost text-sm ${showProgress ? 'bg-brand-100 text-brand-700' : ''}`}>
            <BarChart3 size={16} /> {lang === 'en' ? 'Progress' : 'Progrès'}
          </button>
        </div>}
      />

      {/* Badges view */}
      {showBadges && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {currentBadges.map(b => (
            <div key={b.id} className={`card text-center ${b.earned ? 'ring-2 ring-amber-400' : 'opacity-50'}`}>
              <div className="text-4xl mb-2">{b.icon}</div>
              <div className="font-semibold text-sm">{b.name[lang]}</div>
              <div className="text-[11px] text-ink-500 mt-1">{b.desc[lang]}</div>
              {b.earned && <div className="mt-2 text-amber-600 text-xs font-medium">✅ {lang === 'en' ? 'Earned' : 'Obtenu'}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Progress view */}
      {showProgress && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-lg">{lang === 'en' ? 'Learning Progress' : 'Progression'}</h3>
              <p className="text-sm text-ink-500">{completedTopics} / {totalTopics} {lang === 'en' ? 'topics completed' : 'sujets terminés'}</p>
            </div>
            <div className="text-3xl font-display font-bold text-brand-700">{overallProgress}%</div>
          </div>
          <div className="w-full h-3 bg-ink-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
          </div>
          <div className="mt-4 space-y-2">
            {MOCK_LEARNING_TOPICS.map(t => {
              const done = progress[t.id]?.completed
              return (
                <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-ink-50">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${done ? 'bg-emerald-100 text-emerald-600' : 'bg-ink-100 text-ink-400'}`}>
                    {done ? <CheckCircle2 size={14} /> : <span className="text-xs">{t.lessons}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{t.title}</div>
                    <div className="text-xs text-ink-500">{t.category} · {t.minutes} min</div>
                  </div>
                  {done && <span className="badge-success text-xs">{lang === 'en' ? 'Done' : 'Fait'}</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Continue learning banner - only if has progress */}
      {!showBadges && !showProgress && completedTopics > 0 && (
        <div className="card bg-gradient-to-br from-brand-700 to-accent-600 text-white border-0">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-2xl font-display font-bold">{lang === 'en' ? 'Continue Learning' : 'Reprendre l\'apprentissage'}</h3>
              <p className="text-white/80 text-sm mt-1">
                {overallProgress}% {lang === 'en' ? 'complete' : 'terminé'} · {completedTopics} / {totalTopics} {lang === 'en' ? 'topics' : 'sujets'}
              </p>
              <div className="mt-3 w-64 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {!showBadges && !showProgress && <>
        {/* Search + filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder={lang === 'en' ? 'Search topics…' : 'Rechercher…'} className="input pl-10 py-2 text-sm" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${category === c ? 'bg-brand-700 text-white' : 'bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700'}`}>{c}</button>
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
              {filteredLessons.map(l => (
                <button key={l.id} onClick={() => setSelected(l)} className="card-hover text-left">
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

        {/* Self-study tracks */}
        <div>
          <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            <BookOpen size={18} className="text-brand-700" />
            {lang === 'en' ? 'Self-study tracks' : 'Parcours d\'auto-formation'}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map(t => {
              const p = progress[t.id]
              const done = p?.completed
              const pct = p ? Math.round(((p.completedLessons?.length || 0) / (t.lessons || 1)) * 100) : 0
              return (
                <div key={t.id} className={`card-hover ${done ? 'ring-1 ring-emerald-200' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${done ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-100 text-brand-700'}`}>
                      {done ? <CheckCircle2 size={20} /> : <BookOpen size={20} />}
                    </div>
                    <span className="badge-info">{t.category}</span>
                  </div>
                  <h3 className="font-display font-bold mt-3">{t.title}</h3>
                  <p className="text-sm text-ink-600 mt-1.5 line-clamp-2">{t.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-ink-500 mt-3">
                    <span className="flex items-center gap-1"><Clock size={12} /> {t.minutes} min</span>
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {t.lessons} lessons</span>
                  </div>
                  {p && <div className="mt-2 w-full h-1 bg-ink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>}
                  <button onClick={() => openTopic(t)} className={`w-full mt-3 py-2 rounded-xl text-sm font-medium transition ${done ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'btn-primary text-sm'}`}>
                    {done ? <span className="flex items-center justify-center gap-1.5"><CheckCircle2 size={14} /> {lang === 'en' ? 'Review' : 'Réviser'}</span> : <span className="flex items-center justify-center gap-1.5"><Play size={14} /> {lang === 'en' ? 'Start lesson' : 'Commencer'}</span>}
                  </button>
                </div>
              )}
            )}
          </div>
        </div>
      </>}

      {/* Course player modal */}
      {selected && !selected.course && (
        <div className="fixed inset-0 bg-ink-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}>
          <div className="bg-white dark:bg-ink-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white dark:bg-ink-900 border-b border-ink-100 dark:border-ink-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => { setSelected(null); setActiveSlide(0); setQuizSubmitted(false); setQuizScore(null) }}
                  className="p-2 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl">
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h2 className="font-display font-bold">{selected.title}</h2>
                  <div className="text-xs text-ink-500">{selected.category} · {selected.lessons} {lang === 'en' ? 'lessons' : 'leçons'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentProgress?.completed && <span className="badge-success text-xs">{lang === 'en' ? 'Completed' : 'Terminé'}</span>}
              </div>
            </div>
            <div className="p-6">
              <SlideRenderer topic={selected} idx={activeSlide} />
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-ink-100">
                <button onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                  disabled={activeSlide === 0}
                  className="btn-ghost text-sm disabled:opacity-30">
                  <ArrowLeft size={14} /> {lang === 'en' ? 'Previous' : 'Précédent'}
                </button>
                <div className="flex gap-2">
                  {activeSlide < ((selected.content?.slides?.length || 3) - 1) ? (
                    <button onClick={() => { markLessonComplete(selected.id, activeSlide); setActiveSlide(activeSlide + 1) }}
                      className="btn-primary text-sm">
                      {lang === 'en' ? 'Continue' : 'Continuer'} <ArrowRight size={14} />
                    </button>
                  ) : activeSlide === ((selected.content?.slides?.length || 3) - 1) && selected.quiz?.length ? (
                    <button onClick={() => { setActiveSlide(activeSlide + 1) }}
                      className="btn-primary text-sm">
                      {lang === 'en' ? 'Take quiz' : 'Faire le quiz'} <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button onClick={() => { markLessonComplete(selected.id, 999); setSelected(null); setActiveSlide(0) }}
                      className="btn-primary text-sm">
                      <CheckCircle2 size={14} /> {lang === 'en' ? 'Complete' : 'Terminer'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lesson reader modal (lecturer-published) */}
      {selected?.course && (
        <div className="fixed inset-0 bg-ink-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}>
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
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg"><X size={20} /></button>
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
