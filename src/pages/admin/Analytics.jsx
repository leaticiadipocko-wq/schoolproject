import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, CartesianGrid,
} from 'recharts'
import {
  Printer, TrendingUp, AlertTriangle, LineChart as LineChartIcon, X,
  BookOpen, Users, Phone, Send, CheckCircle2, Calendar, MessageCircle,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useLang } from '@/context/LanguageContext'

const PERFORMANCE = [
  { month: 'Jan', avg: 64, pass: 78 },
  { month: 'Feb', avg: 66, pass: 80 },
  { month: 'Mar', avg: 69, pass: 83 },
  { month: 'Apr', avg: 68, pass: 81 },
  { month: 'May', avg: 71, pass: 85 },
  { month: 'Jun', avg: 73, pass: 87 },
]

const STAFF_LOAD = [
  { dept: 'CS',         courses: 28, lecturers: 8 },
  { dept: 'Business',   courses: 24, lecturers: 7 },
  { dept: 'Engineering',courses: 22, lecturers: 6 },
  { dept: 'Nursing',    courses: 18, lecturers: 5 },
  { dept: 'Law',        courses: 14, lecturers: 4 },
]

const RISK_STUDENTS = [
  { name: 'Brian Etoh',  course: 'CS307', attendance: 58, grade: 'D',  reason: 'Low CA + poor attendance' },
  { name: 'Mary Tah',    course: 'CS305', attendance: 62, grade: 'C',  reason: 'Declining trend' },
  { name: 'Noah Bate',   course: 'CS307', attendance: 51, grade: 'F',  reason: 'Multiple missed assignments' },
  { name: 'Queen Nya',   course: 'CS311', attendance: 65, grade: 'C',  reason: 'Recent absence pattern' },
]

export default function Analytics() {
  const { lang } = useLang()
  const [intervening, setIntervening] = useState(null)  // student object
  const [handled, setHandled] = useState({})            // { studentName: { at, actions, notes } }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Analytics"
        subtitle="Operational dashboards for academic leadership"
        actions={<button onClick={() => window.print()} className="btn-primary"><Printer size={16} /> Print report</button>}
      />

      {/* Summary banner */}
      <div className="card bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 text-white border-0">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <LineChartIcon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold">This week's executive summary</h3>
            <p className="text-white/85 mt-1.5 max-w-3xl">
              Overall student performance is up 5% versus last semester. Computer Science remains the
              highest-enrolment department. CS307 shows an at-risk cohort of 14% — the registrar may consider
              scheduling supplementary tutorials within the next two weeks.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Academic Performance Trend</h3>
            <span className="badge-success"><TrendingUp size={10} /> +5%</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={PERFORMANCE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="avg"  stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="pass" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Staff Workload by Department</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={STAFF_LOAD}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="dept" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="courses"    fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="lecturers"  fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Students needing follow-up */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-600" />
            <h3 className="font-display font-bold text-lg">Students Needing Follow-up</h3>
          </div>
          <span className="badge-warning">{RISK_STUDENTS.length} flagged</span>
        </div>
        <div className="overflow-hidden rounded-xl border border-ink-100">
          <table className="w-full">
            <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="text-left p-4">Student</th>
                <th className="text-left p-4">Course</th>
                <th className="text-left p-4">Attendance</th>
                <th className="text-left p-4">Current Grade</th>
                <th className="text-left p-4">Notes</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {RISK_STUDENTS.map((s, i) => {
                const done = handled[s.name]
                return (
                <tr key={i} className="hover:bg-ink-50/50 dark:hover:bg-ink-800/40">
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4 text-ink-600">{s.course}</td>
                  <td className="p-4 text-ink-600">{s.attendance}%</td>
                  <td className="p-4">
                    <span className={`badge ${
                      s.grade === 'F' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                                        'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'
                    }`}>{s.grade}</span>
                  </td>
                  <td className="p-4 text-sm text-ink-600">{s.reason}</td>
                  <td className="p-4">
                    {done ? (
                      <span className="badge-success">
                        <CheckCircle2 size={12} /> {lang === 'en' ? 'Logged' : 'Enregistré'}
                      </span>
                    ) : (
                      <button onClick={() => setIntervening(s)} className="btn-primary text-xs py-1.5">
                        {lang === 'en' ? 'Intervene' : 'Intervenir'}
                      </button>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {intervening && (
        <InterventionModal
          student={intervening}
          lang={lang}
          onClose={() => setIntervening(null)}
          onSave={(payload) => {
            setHandled((h) => ({ ...h, [intervening.name]: payload }))
            toast.success(lang === 'en'
              ? `Intervention started for ${intervening.name}`
              : `Plan d'intervention démarré pour ${intervening.name}`)
            setIntervening(null)
          }}
        />
      )}
    </div>
  )
}

/* ─── Intervention modal ───────────────────────────────────── */
function InterventionModal({ student, lang, onClose, onSave }) {
  const [actions, setActions] = useState({
    tutoring:    true,
    mentor:      false,
    parents:     true,
    bursary:     false,
    counselling: false,
  })
  const [notes, setNotes] = useState('')
  const [date, setDate]   = useState(() => new Date(Date.now() + 7 * 24 * 60 * 60_000).toISOString().slice(0, 10))

  const T = {
    title:     lang === 'en' ? 'Start intervention plan' : 'Démarrer un plan d\'intervention',
    student:   lang === 'en' ? 'Student' : 'Étudiant',
    course:    lang === 'en' ? 'Course' : 'Cours',
    actions:   lang === 'en' ? 'Actions to take' : 'Actions à mener',
    tutoring:  lang === 'en' ? 'Assign supplementary tutoring sessions' : 'Affecter à des séances de tutorat supplémentaires',
    mentor:    lang === 'en' ? 'Assign a faculty mentor' : 'Affecter un enseignant référent',
    parents:   lang === 'en' ? 'Contact parents / guardian' : 'Contacter les parents / tuteur',
    bursary:   lang === 'en' ? 'Notify the bursary office' : 'Informer la scolarité',
    counselling: lang === 'en' ? 'Schedule counselling appointment' : 'Programmer un entretien avec le service d\'orientation',
    follow:    lang === 'en' ? 'Follow-up date' : 'Date de suivi',
    notes:     lang === 'en' ? 'Notes for the case file' : 'Notes pour le dossier',
    notesP:    lang === 'en' ? 'Add any context, history or required outcomes…' : 'Ajoutez contexte, antécédents ou attendus…',
    cancel:    lang === 'en' ? 'Cancel' : 'Annuler',
    submit:    lang === 'en' ? 'Send intervention' : 'Envoyer l\'intervention',
    privacy:   lang === 'en' ? 'The student and concerned lecturers receive an automatic notification.' : 'L\'étudiant et les enseignants concernés reçoivent une notification automatique.',
  }

  const toggle = (k) => setActions((a) => ({ ...a, [k]: !a[k] }))
  const submit = () => {
    onSave({
      at: new Date().toISOString(),
      followUpAt: date,
      actions: Object.entries(actions).filter(([, v]) => v).map(([k]) => k),
      notes,
    })
  }

  const ACTION_ITEMS = [
    { id: 'tutoring',    icon: BookOpen,      label: T.tutoring,    color: 'text-brand-700' },
    { id: 'mentor',      icon: Users,         label: T.mentor,      color: 'text-emerald-700' },
    { id: 'parents',     icon: Phone,         label: T.parents,     color: 'text-amber-700' },
    { id: 'bursary',     icon: Send,          label: T.bursary,     color: 'text-accent-700' },
    { id: 'counselling', icon: MessageCircle, label: T.counselling, color: 'text-violet-700' },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white dark:bg-ink-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-600" />
              <h2 className="font-display font-bold text-lg">{T.title}</h2>
            </div>
            <div className="text-sm text-ink-500 mt-1">
              <span className="font-medium">{T.student}:</span> {student.name} ·{' '}
              <span className="font-medium">{T.course}:</span> {student.course} ·{' '}
              <span className="font-medium">{student.attendance}% · Grade {student.grade}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Actions */}
          <div>
            <div className="text-sm font-semibold text-ink-700 dark:text-ink-200 mb-2">{T.actions}</div>
            <div className="space-y-2">
              {ACTION_ITEMS.map((a) => {
                const Icon = a.icon
                const on = actions[a.id]
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggle(a.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition ${
                      on ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-ink-200 dark:border-ink-700 hover:border-brand-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-white dark:bg-ink-800 flex items-center justify-center ${a.color}`}>
                      <Icon size={18} />
                    </div>
                    <span className="flex-1 text-sm">{a.label}</span>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      on ? 'bg-brand-600 border-brand-600' : 'border-ink-300 dark:border-ink-600'
                    }`}>
                      {on && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Follow-up */}
          <div>
            <label className="label">
              <Calendar size={14} className="inline -mt-0.5 mr-1" /> {T.follow}
            </label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          {/* Notes */}
          <div>
            <label className="label">{T.notes}</label>
            <textarea className="input min-h-[80px]" placeholder={T.notesP} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-200">
            ✓ {T.privacy}
          </div>
        </div>

        <div className="p-4 border-t border-ink-100 dark:border-ink-800 flex justify-end gap-2 bg-ink-50/50 dark:bg-ink-950/50">
          <button onClick={onClose} className="btn-ghost">{T.cancel}</button>
          <button onClick={submit} className="btn-primary">
            <Send size={14} /> {T.submit}
          </button>
        </div>
      </div>
    </div>
  )
}
