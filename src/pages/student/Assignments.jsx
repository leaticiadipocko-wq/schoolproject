import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  ClipboardList, Calendar, Upload, CheckCircle2, Clock, FileText,
  X, Send, Award, MessageSquare,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'

export default function StudentAssignments() {
  const { user } = useAuth()
  const { assignments = [], submissions = [], submitAssignment } = useData()
  const { lang } = useLang()
  const [submittingTo, setSubmittingTo] = useState(null)

  const mine = submissions.filter((s) => s.studentId === user?.studentId)
  const findSub = (assignmentId) => mine.find((s) => s.assignmentId === assignmentId)

  const onSubmit = (data) => {
    submitAssignment({
      assignmentId: submittingTo.id,
      studentId:    user?.studentId,
      studentName:  user?.name,
      ...data,
    })
    toast.success(lang === 'en' ? 'Submission sent to lecturer' : 'Soumission envoyée à l\'enseignant')
    setSubmittingTo(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'My Assignments' : 'Mes devoirs'}
        subtitle={lang === 'en'
          ? 'Submit work and view your graded feedback'
          : 'Soumettre vos travaux et consulter les retours notés'}
      />

      {assignments.length === 0 ? (
        <div className="card text-center py-12">
          <ClipboardList size={36} className="mx-auto text-ink-400 mb-3" />
          <div className="font-medium text-ink-700 dark:text-ink-200">
            {lang === 'en' ? 'No assignments posted yet' : 'Aucun devoir publié'}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => {
            const sub = findSub(a.id)
            const dueAt = new Date(a.dueAt)
            const overdue = !sub && Date.now() > dueAt.getTime()
            return (
              <div key={a.id} className="card">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="badge-info">{a.course}</span>
                      <span className={`badge ${overdue ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'}`}>
                        <Calendar size={10} /> {lang === 'en' ? 'Due' : 'Échéance'} {dueAt.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
                      </span>
                      <span className="text-xs text-ink-500">·  {a.maxPoints} {lang === 'en' ? 'points' : 'points'}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg">{a.title}</h3>
                    <p className="text-sm text-ink-600 dark:text-ink-300 mt-1 whitespace-pre-line">{a.description}</p>
                    <div className="text-xs text-ink-500 mt-2">
                      {lang === 'en' ? 'Lecturer' : 'Enseignant'}: <span className="font-medium">{a.lecturer}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {sub?.grade != null ? (
                      <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 p-4 min-w-[120px]">
                        <Award size={18} className="mx-auto text-emerald-600 mb-1" />
                        <div className="text-3xl font-display font-bold text-emerald-700">
                          {sub.grade}<span className="text-base text-emerald-600">/{a.maxPoints}</span>
                        </div>
                        <div className="text-[11px] text-emerald-700 mt-0.5">
                          {lang === 'en' ? 'Graded' : 'Noté'}
                        </div>
                      </div>
                    ) : sub ? (
                      <div className="badge-warning">
                        <Clock size={12} /> {lang === 'en' ? 'Submitted · awaiting grade' : 'Soumis · en attente'}
                      </div>
                    ) : (
                      <button onClick={() => setSubmittingTo(a)} className="btn-primary text-sm">
                        <Upload size={14} /> {lang === 'en' ? 'Submit' : 'Soumettre'}
                      </button>
                    )}
                  </div>
                </div>

                {sub?.feedback && (
                  <div className="mt-4 border-t border-ink-100 dark:border-ink-800 pt-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2 flex items-center gap-1">
                      <MessageSquare size={11} /> {lang === 'en' ? 'Lecturer feedback' : 'Retour de l\'enseignant'}
                    </div>
                    <div className="text-sm text-ink-700 dark:text-ink-200 whitespace-pre-line">{sub.feedback}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {submittingTo && (
        <SubmitModal
          lang={lang}
          assignment={submittingTo}
          onClose={() => setSubmittingTo(null)}
          onSave={onSubmit}
        />
      )}
    </div>
  )
}

function SubmitModal({ lang, assignment, onClose, onSave }) {
  const [body, setBody] = useState('')
  const [fileName, setFileName] = useState(null)
  const submit = (e) => {
    e.preventDefault()
    if (!body.trim() && !fileName) return toast.error(lang === 'en' ? 'Add text or attach a file' : 'Ajoutez du texte ou un fichier')
    onSave({ body, fileName })
  }
  return (
    <div className="fixed inset-0 bg-ink-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <form onSubmit={submit} className="bg-white dark:bg-ink-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold">{lang === 'en' ? 'Submit work' : 'Soumettre le travail'}</h2>
            <div className="text-xs text-ink-500 mt-0.5">{assignment.course} · {assignment.title}</div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="label">{lang === 'en' ? 'Submission text' : 'Texte de la soumission'}</label>
            <textarea className="input min-h-[150px]" placeholder={lang === 'en' ? 'Paste your answer, code, or URL…' : 'Collez votre réponse, code ou URL…'} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <div>
            <label className="label">{lang === 'en' ? 'Attachment (optional)' : 'Pièce jointe (optionnelle)'}</label>
            <input type="file" className="input" onChange={(e) => setFileName(e.target.files?.[0]?.name || null)} />
            {fileName && <div className="text-xs text-emerald-700 mt-1"><CheckCircle2 size={11} className="inline -mt-0.5 mr-1" /> {fileName}</div>}
          </div>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-2.5 text-xs text-amber-900 dark:text-amber-200">
            {lang === 'en' ? 'Once submitted, you cannot edit. The lecturer will review and grade.' : 'Après soumission, vous ne pourrez plus modifier. L\'enseignant examinera et notera.'}
          </div>
        </div>
        <div className="p-4 border-t border-ink-100 dark:border-ink-800 flex justify-end gap-2 bg-ink-50/50 dark:bg-ink-950/50">
          <button type="button" onClick={onClose} className="btn-ghost">{lang === 'en' ? 'Cancel' : 'Annuler'}</button>
          <button type="submit" className="btn-primary"><Send size={14} /> {lang === 'en' ? 'Submit' : 'Soumettre'}</button>
        </div>
      </form>
    </div>
  )
}
