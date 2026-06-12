import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  ClipboardList, Plus, Calendar, FileText, CheckCircle2, Clock,
  Award, Send, X, Trash2,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'

export default function LecturerAssignments() {
  const { user } = useAuth()
  const { assignments = [], submissions = [], createAssignment, gradeSubmission, logAction } = useData()
  const { lang } = useLang()
  const [showCreate, setShowCreate] = useState(false)
  const [grading, setGrading] = useState(null)

  const mine = assignments.filter((a) => a.lecturer === user?.name)

  const submit = (data) => {
    createAssignment({ ...data, lecturer: user?.name })
    logAction({ actor: user?.name, role: 'lecturer', action: 'assignment.create', target: `${data.course} — ${data.title}` })
    toast.success(lang === 'en' ? 'Assignment posted to students' : 'Devoir publié aux étudiants')
    setShowCreate(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Assignments & Grading' : 'Devoirs & Notation'}
        subtitle={lang === 'en'
          ? 'Post assignments, review submissions, and return graded feedback'
          : 'Publier des devoirs, examiner les soumissions, renvoyer la notation'}
        actions={
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus size={16} /> {lang === 'en' ? 'New assignment' : 'Nouveau devoir'}
          </button>
        }
      />

      {mine.length === 0 ? (
        <div className="card text-center py-12">
          <ClipboardList size={36} className="mx-auto text-ink-400 mb-3" />
          <div className="font-medium text-ink-700 dark:text-ink-200">
            {lang === 'en' ? 'No assignments yet' : 'Aucun devoir pour le moment'}
          </div>
          <div className="text-sm text-ink-500 mt-1">
            {lang === 'en' ? 'Click "New assignment" above to post your first.' : 'Cliquez sur « Nouveau devoir » pour commencer.'}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {mine.map((a) => {
            const subs = submissions.filter((s) => s.assignmentId === a.id)
            const graded = subs.filter((s) => s.grade != null).length
            return (
              <div key={a.id} className="card">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-info">{a.course}</span>
                      <span className="text-xs text-ink-500">
                        <Calendar size={11} className="inline -mt-0.5 mr-1" />
                        {lang === 'en' ? 'Due' : 'Échéance'} {new Date(a.dueAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg">{a.title}</h3>
                    <p className="text-sm text-ink-600 mt-1 line-clamp-2">{a.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display font-bold text-brand-700">
                      {subs.length}<span className="text-base text-ink-500">/{(a.enrolled || 18)}</span>
                    </div>
                    <div className="text-xs text-ink-500">
                      {lang === 'en' ? 'submitted' : 'soumis'}
                    </div>
                    <div className="text-xs text-emerald-700 mt-1">
                      <CheckCircle2 size={11} className="inline -mt-0.5 mr-0.5" />
                      {graded} {lang === 'en' ? 'graded' : 'notés'}
                    </div>
                  </div>
                </div>

                {subs.length > 0 && (
                  <div className="mt-4 border-t border-ink-100 dark:border-ink-800 pt-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
                      {lang === 'en' ? 'Submissions' : 'Soumissions'}
                    </div>
                    <div className="space-y-2">
                      {subs.map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-ink-50/50 dark:bg-ink-800/30">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{s.studentName}</div>
                            <div className="text-[11px] text-ink-500">
                              <Clock size={10} className="inline -mt-0.5 mr-1" />
                              {new Date(s.submittedAt).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
                            </div>
                          </div>
                          {s.grade != null ? (
                            <div className="text-right pr-3">
                              <div className="text-base font-bold text-emerald-700">{s.grade}/{a.maxPoints}</div>
                              <div className="text-[10px] text-ink-500">
                                {lang === 'en' ? 'graded' : 'noté'}
                              </div>
                            </div>
                          ) : null}
                          <button
                            onClick={() => setGrading({ ...s, maxPoints: a.maxPoints })}
                            className="btn-secondary text-xs"
                          >
                            <Award size={12} /> {s.grade != null ? (lang === 'en' ? 'Edit' : 'Modifier') : (lang === 'en' ? 'Grade' : 'Noter')}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showCreate && <CreateAssignmentModal lang={lang} courses={user?.courses || ['CS501']} onSave={submit} onClose={() => setShowCreate(false)} />}
      {grading && (
        <GradeModal
          lang={lang}
          submission={grading}
          onClose={() => setGrading(null)}
          onSave={(payload) => {
            gradeSubmission(grading.id, payload)
            logAction({ actor: user?.name, role: 'lecturer', action: 'submission.grade', target: `${grading.studentName} → ${payload.grade}/${grading.maxPoints}` })
            toast.success(lang === 'en' ? 'Grade returned to student' : 'Note retournée à l\'étudiant')
            setGrading(null)
          }}
        />
      )}
    </div>
  )
}

function CreateAssignmentModal({ lang, courses, onSave, onClose }) {
  const [form, setForm] = useState({
    course: courses[0],
    title: '',
    description: '',
    dueAt: new Date(Date.now() + 7 * 24 * 3600_000).toISOString().slice(0, 10),
    maxPoints: 20,
  })
  const submit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error(lang === 'en' ? 'Title required' : 'Titre requis')
    onSave({ ...form, dueAt: new Date(form.dueAt).toISOString() })
  }
  return (
    <div className="fixed inset-0 bg-ink-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <form onSubmit={submit} className="bg-white dark:bg-ink-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList size={20} className="text-brand-600" />
            <h2 className="font-display font-bold text-lg">
              {lang === 'en' ? 'New assignment' : 'Nouveau devoir'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">{lang === 'en' ? 'Course' : 'Cours'}</label>
              <select className="input" value={form.course} onChange={(e) => setForm((s) => ({ ...s, course: e.target.value }))}>
                {courses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">{lang === 'en' ? 'Maximum points' : 'Note maximale'}</label>
              <input type="number" className="input" value={form.maxPoints} onChange={(e) => setForm((s) => ({ ...s, maxPoints: Number(e.target.value) }))} />
            </div>
          </div>
          <div>
            <label className="label">{lang === 'en' ? 'Title' : 'Titre'}</label>
            <input className="input" placeholder={lang === 'en' ? 'e.g. Implement lexical analyser' : 'ex. Mettre en œuvre un analyseur lexical'} value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">{lang === 'en' ? 'Description' : 'Description'}</label>
            <textarea className="input min-h-[100px]" placeholder={lang === 'en' ? 'Instructions, expected deliverables, marking criteria…' : 'Consignes, livrables attendus, critères de notation…'} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
          </div>
          <div>
            <label className="label">{lang === 'en' ? 'Due date' : 'Date d\'échéance'}</label>
            <input type="date" className="input" value={form.dueAt} onChange={(e) => setForm((s) => ({ ...s, dueAt: e.target.value }))} />
          </div>
        </div>
        <div className="p-4 border-t border-ink-100 dark:border-ink-800 flex justify-end gap-2 bg-ink-50/50 dark:bg-ink-950/50">
          <button type="button" onClick={onClose} className="btn-ghost">{lang === 'en' ? 'Cancel' : 'Annuler'}</button>
          <button type="submit" className="btn-primary"><Send size={14} /> {lang === 'en' ? 'Publish' : 'Publier'}</button>
        </div>
      </form>
    </div>
  )
}

function GradeModal({ lang, submission, onClose, onSave }) {
  const [grade, setGrade] = useState(submission.grade ?? '')
  const [feedback, setFeedback] = useState(submission.feedback ?? '')
  const submit = (e) => {
    e.preventDefault()
    const g = Number(grade)
    if (Number.isNaN(g) || g < 0 || g > submission.maxPoints) return toast.error(lang === 'en' ? `Grade must be 0–${submission.maxPoints}` : `La note doit être entre 0 et ${submission.maxPoints}`)
    onSave({ grade: g, feedback })
  }
  return (
    <div className="fixed inset-0 bg-ink-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <form onSubmit={submit} className="bg-white dark:bg-ink-900 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold">{lang === 'en' ? 'Grade submission' : 'Noter la soumission'}</h2>
            <div className="text-xs text-ink-500 mt-0.5">{submission.studentName}</div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {submission.body && (
            <div className="rounded-xl bg-ink-50 dark:bg-ink-800/50 p-3 text-sm whitespace-pre-line max-h-32 overflow-y-auto">
              {submission.body}
            </div>
          )}
          {submission.fileName && (
            <div className="flex items-center gap-2 text-sm text-ink-700 dark:text-ink-200">
              <FileText size={14} /> {submission.fileName}
            </div>
          )}
          <div>
            <label className="label">{lang === 'en' ? `Grade out of ${submission.maxPoints}` : `Note sur ${submission.maxPoints}`}</label>
            <input type="number" min={0} max={submission.maxPoints} className="input text-2xl font-bold text-center" value={grade} onChange={(e) => setGrade(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="label">{lang === 'en' ? 'Feedback for the student' : 'Commentaires pour l\'étudiant'}</label>
            <textarea className="input min-h-[80px]" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder={lang === 'en' ? 'What was good, what could improve…' : 'Points forts, axes d\'amélioration…'} />
          </div>
        </div>
        <div className="p-4 border-t border-ink-100 dark:border-ink-800 flex justify-end gap-2 bg-ink-50/50 dark:bg-ink-950/50">
          <button type="button" onClick={onClose} className="btn-ghost">{lang === 'en' ? 'Cancel' : 'Annuler'}</button>
          <button type="submit" className="btn-primary"><Award size={14} /> {lang === 'en' ? 'Return grade' : 'Renvoyer la note'}</button>
        </div>
      </form>
    </div>
  )
}
