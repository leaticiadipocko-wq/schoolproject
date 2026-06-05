import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import {
  MessageSquare, Send, Plus, X, Filter, User as UserIcon,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'

export default function Discussions() {
  const { user } = useAuth()
  const { discussions = [], postDiscussion, replyToDiscussion, enrolledCourses } = useData()
  const { lang } = useLang()
  const [opening, setOpening] = useState(false)
  const [filter, setFilter] = useState('all')

  // For students, only show discussions in courses they are enrolled in.
  // For lecturers, show only discussions in courses they teach.
  const visible = useMemo(() => {
    let list = discussions
    if (user?.role === 'student') {
      list = list.filter((d) => (enrolledCourses || []).includes(d.course))
    } else if (user?.role === 'lecturer') {
      list = list.filter((d) => (user.courses || []).includes(d.course))
    }
    if (filter !== 'all') list = list.filter((d) => d.course === filter)
    return list
  }, [discussions, user, filter, enrolledCourses])

  const myCourses = useMemo(() => {
    if (user?.role === 'student') return enrolledCourses || []
    if (user?.role === 'lecturer') return user.courses || []
    return Array.from(new Set(discussions.map((d) => d.course)))
  }, [user, enrolledCourses, discussions])

  const openThread = (data) => {
    postDiscussion({ ...data, author: user?.name, role: user?.role })
    toast.success(lang === 'en' ? 'Thread posted' : 'Discussion publiée')
    setOpening(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Course Discussions' : 'Discussions de cours'}
        subtitle={lang === 'en'
          ? 'Ask questions, share resources, and reach your lecturers'
          : 'Posez des questions, partagez des ressources, contactez vos enseignants'}
        actions={
          <button onClick={() => setOpening(true)} className="btn-primary">
            <Plus size={16} /> {lang === 'en' ? 'New thread' : 'Nouvelle discussion'}
          </button>
        }
      />

      {/* Filter pills */}
      <div className="card flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-ink-500" />
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${filter === 'all' ? 'bg-brand-700 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300'}`}>
          {lang === 'en' ? 'All courses' : 'Tous'}
        </button>
        {myCourses.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${filter === c ? 'bg-brand-700 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300'}`}>
            {c}
          </button>
        ))}
        <span className="badge-info ml-auto">{visible.length} {lang === 'en' ? 'threads' : 'discussions'}</span>
      </div>

      {visible.length === 0 ? (
        <div className="card text-center py-12">
          <MessageSquare size={36} className="mx-auto text-ink-400 mb-3" />
          <div className="font-medium text-ink-700 dark:text-ink-200">
            {lang === 'en' ? 'No discussions yet' : 'Aucune discussion'}
          </div>
          <div className="text-sm text-ink-500 mt-1">
            {lang === 'en' ? 'Start a thread to ask a question or share something.' : 'Démarrez une discussion pour poser une question.'}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((d) => (
            <Thread key={d.id} discussion={d} lang={lang} currentUser={user} onReply={replyToDiscussion} />
          ))}
        </div>
      )}

      {opening && <NewThreadModal lang={lang} courses={myCourses} onSave={openThread} onClose={() => setOpening(false)} />}
    </div>
  )
}

function Thread({ discussion, lang, currentUser, onReply }) {
  const [reply, setReply] = useState('')
  const [expanded, setExpanded] = useState(false)
  const send = () => {
    if (!reply.trim()) return
    onReply(discussion.id, { author: currentUser?.name, role: currentUser?.role, body: reply })
    setReply('')
  }
  const isLecturer = discussion.role === 'lecturer'
  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${isLecturer ? 'bg-accent-600' : 'bg-brand-700'}`}>
          <UserIcon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{discussion.author}</span>
            <span className={`badge ${isLecturer ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-200' : 'badge-info'}`}>
              {discussion.role}
            </span>
            <span className="badge-info">{discussion.course}</span>
            <span className="text-xs text-ink-500">·  {new Date(discussion.createdAt).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB')}</span>
          </div>
          <p className="text-sm text-ink-800 dark:text-ink-100 mt-2 whitespace-pre-line">{discussion.body}</p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-xs text-brand-700 hover:underline inline-flex items-center gap-1"
          >
            <MessageSquare size={11} /> {(discussion.replies || []).length} {lang === 'en' ? 'replies' : 'réponses'}
          </button>

          {expanded && (
            <>
              <div className="mt-4 space-y-3 pl-3 border-l-2 border-ink-100 dark:border-ink-800">
                {(discussion.replies || []).map((r) => (
                  <div key={r.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{r.author}</span>
                      <span className={`badge ${r.role === 'lecturer' ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-200' : 'badge-info'}`}>{r.role}</span>
                      <span className="text-[11px] text-ink-500">·  {new Date(r.createdAt).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB')}</span>
                    </div>
                    <p className="text-ink-700 dark:text-ink-200 mt-1 whitespace-pre-line">{r.body}</p>
                  </div>
                ))}
                {(discussion.replies || []).length === 0 && (
                  <div className="text-sm text-ink-500 italic">
                    {lang === 'en' ? 'No replies yet. Be the first.' : 'Aucune réponse. Soyez le premier.'}
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  className="input flex-1"
                  placeholder={lang === 'en' ? 'Write a reply…' : 'Écrire une réponse…'}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                />
                <button onClick={send} className="btn-primary"><Send size={14} /></button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function NewThreadModal({ lang, courses, onSave, onClose }) {
  const [form, setForm] = useState({ course: courses[0] || '', body: '' })
  const submit = (e) => {
    e.preventDefault()
    if (!form.course || !form.body.trim()) return toast.error(lang === 'en' ? 'Course and message required' : 'Cours et message requis')
    onSave(form)
  }
  return (
    <div className="fixed inset-0 bg-ink-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <form onSubmit={submit} className="bg-white dark:bg-ink-900 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-brand-600" />
            <h2 className="font-display font-bold text-lg">
              {lang === 'en' ? 'New discussion thread' : 'Nouvelle discussion'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="label">{lang === 'en' ? 'Course' : 'Cours'}</label>
            <select className="input" value={form.course} onChange={(e) => setForm((s) => ({ ...s, course: e.target.value }))}>
              {courses.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">{lang === 'en' ? 'Your message' : 'Votre message'}</label>
            <textarea className="input min-h-[150px]" placeholder={lang === 'en' ? 'Type your question or share something…' : 'Tapez votre question ou partagez quelque chose…'} value={form.body} onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))} autoFocus />
          </div>
        </div>
        <div className="p-4 border-t border-ink-100 dark:border-ink-800 flex justify-end gap-2 bg-ink-50/50 dark:bg-ink-950/50">
          <button type="button" onClick={onClose} className="btn-ghost">{lang === 'en' ? 'Cancel' : 'Annuler'}</button>
          <button type="submit" className="btn-primary"><Send size={14} /> {lang === 'en' ? 'Post' : 'Publier'}</button>
        </div>
      </form>
    </div>
  )
}
