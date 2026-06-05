import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import {
  Sparkles, Send, Upload, Trash2, Clock, BookOpen, FileText, X,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'

export default function PublishLesson() {
  const { user } = useAuth()
  const { lessons, publishLesson, deleteLesson } = useData()
  const { lang } = useLang()
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    course: user?.courses?.[0] || 'CS501',
    title: '',
    body: '',
    duration: '10 min read',
    attachmentName: null,
  })

  const mine = lessons.filter((l) => l.lecturer === user?.name)

  const submit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) {
      return toast.error(lang === 'en' ? 'Title and content are required' : 'Titre et contenu requis')
    }
    publishLesson({ ...form, lecturer: user?.name || 'Lecturer' })
    setForm((f) => ({ ...f, title: '', body: '', attachmentName: null }))
    toast.success(lang === 'en' ? 'Lesson published to students' : 'Leçon publiée aux étudiants')
  }

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setForm((s) => ({ ...s, attachmentName: f.name }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Publish a Lesson' : 'Publier une leçon'}
        subtitle={lang === 'en'
          ? 'Share course material with your students on the Mobile Learning Hub'
          : 'Partagez du contenu de cours avec vos étudiants sur l\'Apprentissage Mobile'}
      />

      <form onSubmit={submit} className="card space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">{lang === 'en' ? 'Course code' : 'Code du cours'}</label>
            <select className="input" value={form.course} onChange={(e) => setForm((s) => ({ ...s, course: e.target.value }))}>
              {(user?.courses || ['CS501', 'CS503', 'CS505', 'CS507', 'CS509', 'CS511']).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{lang === 'en' ? 'Estimated duration' : 'Durée estimée'}</label>
            <input className="input" value={form.duration} onChange={(e) => setForm((s) => ({ ...s, duration: e.target.value }))} placeholder="10 min read" />
          </div>
        </div>

        <div>
          <label className="label">{lang === 'en' ? 'Lesson title' : 'Titre de la leçon'}</label>
          <input className="input" placeholder={lang === 'en' ? 'e.g. Introduction to Lexical Analysis' : 'ex. Introduction à l\'analyse lexicale'} value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
        </div>

        <div>
          <label className="label">{lang === 'en' ? 'Lesson content' : 'Contenu de la leçon'}</label>
          <textarea
            className="input min-h-[180px] font-mono text-[13px]"
            placeholder={lang === 'en' ? 'Write your lesson here. Markdown-style line breaks are preserved.' : 'Rédigez votre leçon ici. Les sauts de ligne sont conservés.'}
            value={form.body}
            onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))}
          />
        </div>

        <div>
          <label className="label">{lang === 'en' ? 'Optional attachment' : 'Pièce jointe optionnelle'}</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary text-sm">
              <Upload size={14} /> {lang === 'en' ? 'Attach file' : 'Joindre un fichier'}
            </button>
            {form.attachmentName && (
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-50 dark:bg-ink-800 text-sm">
                <FileText size={14} />
                <span className="truncate flex-1">{form.attachmentName}</span>
                <button type="button" onClick={() => setForm((s) => ({ ...s, attachmentName: null }))} className="text-ink-400 hover:text-red-600">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.docx,.pptx,.zip,.png,.jpg" className="hidden" onChange={onFile} />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-ink-100 dark:border-ink-800">
          <button type="button" className="btn-ghost" onClick={() => setForm({ course: form.course, title: '', body: '', duration: '10 min read', attachmentName: null })}>
            {lang === 'en' ? 'Clear' : 'Effacer'}
          </button>
          <button type="submit" className="btn-primary">
            <Send size={14} /> {lang === 'en' ? 'Publish to students' : 'Publier aux étudiants'}
          </button>
        </div>
      </form>

      {/* My published lessons */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-accent-600" />
          <h3 className="font-display font-bold text-lg">
            {lang === 'en' ? 'My published lessons' : 'Mes leçons publiées'}
          </h3>
          <span className="badge-info">{mine.length}</span>
        </div>
        {mine.length === 0 ? (
          <div className="text-center py-8 text-sm text-ink-500">
            <BookOpen size={28} className="mx-auto mb-2" />
            {lang === 'en' ? 'You have not published any lessons yet.' : 'Vous n\'avez pas encore publié de leçons.'}
          </div>
        ) : (
          <div className="divide-y divide-ink-100 dark:divide-ink-800">
            {mine.map((l) => (
              <div key={l.id} className="py-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="badge-info">{l.course}</span>
                    <span className="text-xs text-ink-500 inline-flex items-center gap-1">
                      <Clock size={11} /> {l.duration}
                    </span>
                  </div>
                  <div className="font-medium mt-1.5 truncate">{l.title}</div>
                  <div className="text-xs text-ink-500 mt-0.5 line-clamp-1">{l.body}</div>
                  <div className="text-[11px] text-ink-400 mt-1">
                    {new Date(l.publishedAt).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
                  </div>
                </div>
                <button onClick={() => { deleteLesson(l.id); toast.success(lang === 'en' ? 'Lesson removed' : 'Leçon supprimée') }} className="text-ink-400 hover:text-red-600 p-1.5">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
