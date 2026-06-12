import { useMemo, useState } from 'react'
import {
  Activity, Filter, Search, Download, User, Shield,
  CheckCircle2, AlertCircle, Trash2,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'

const ACTION_ICONS = {
  'student.enrol':         { color: 'bg-emerald-100 text-emerald-700', label: 'Student enrolled' },
  'student.delete':        { color: 'bg-red-100 text-red-700',         label: 'Student deleted' },
  'announcement.publish':  { color: 'bg-amber-100 text-amber-700',     label: 'Announcement published' },
  'announcement.delete':   { color: 'bg-red-100 text-red-700',         label: 'Announcement deleted' },
  'grades.submit':         { color: 'bg-brand-100 text-brand-700',     label: 'Grades submitted' },
  'attendance.submit':     { color: 'bg-brand-100 text-brand-700',     label: 'Attendance saved' },
  'timetable.update':      { color: 'bg-accent-100 text-accent-700',   label: 'Timetable updated' },
  'assignment.create':     { color: 'bg-emerald-100 text-emerald-700', label: 'Assignment created' },
  'submission.grade':      { color: 'bg-emerald-100 text-emerald-700', label: 'Submission graded' },
  'lesson.publish':        { color: 'bg-accent-100 text-accent-700',   label: 'Lesson published' },
  'payment.recorded':      { color: 'bg-emerald-100 text-emerald-700', label: 'Payment recorded' },
  'user.role.change':      { color: 'bg-amber-100 text-amber-700',     label: 'Role changed' },
  'login.success':         { color: 'bg-brand-100 text-brand-700',     label: 'Sign-in' },
  'login.failed':          { color: 'bg-red-100 text-red-700',         label: 'Failed sign-in' },
  'data.export':           { color: 'bg-accent-100 text-accent-700',   label: 'Data exported' },
  'intervention.start':    { color: 'bg-amber-100 text-amber-700',     label: 'Intervention started' },
}

export default function AuditLog() {
  const { auditLog = [] } = useData()
  const { lang } = useLang()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')
  const [days, setDays] = useState(30)

  const cutoff = useMemo(() => Date.now() - days * 24 * 3600_000, [days])

  const filtered = useMemo(() => {
    return auditLog.filter((e) =>
      new Date(e.at).getTime() >= cutoff &&
      (roleFilter === 'all'   || e.role === roleFilter) &&
      (actionFilter === 'all' || e.action === actionFilter) &&
      (!search ||
        (e.actor || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.target || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.action || '').toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [auditLog, roleFilter, actionFilter, search, cutoff])

  const actionTypes = useMemo(() => Array.from(new Set(auditLog.map((e) => e.action))), [auditLog])

  const exportCsv = () => {
    const header = ['Timestamp', 'Actor', 'Role', 'Action', 'Target']
    const rows = filtered.map((e) => [e.at, `"${e.actor}"`, e.role, e.action, `"${e.target || ''}"`])
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `iuget-audit-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Audit Log' : 'Journal d\'audit'}
        subtitle={lang === 'en'
          ? 'Every privileged action — who, what, when'
          : 'Toutes les actions privilégiées — qui, quoi, quand'}
        actions={
          <button onClick={exportCsv} className="btn-primary">
            <Download size={16} /> {lang === 'en' ? 'Export CSV' : 'Exporter CSV'}
          </button>
        }
      />

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Activity} label={lang === 'en' ? 'Total events' : 'Total événements'} value={auditLog.length} accent="bg-brand-100 text-brand-700" />
        <StatCard icon={User}     label={lang === 'en' ? 'Unique actors' : 'Acteurs uniques'} value={new Set(auditLog.map((e) => e.actor)).size} accent="bg-emerald-100 text-emerald-700" />
        <StatCard icon={Shield}   label={lang === 'en' ? 'Sensitive events' : 'Événements sensibles'} value={auditLog.filter((e) => /delete|role|export/.test(e.action)).length} accent="bg-amber-100 text-amber-700" />
        <StatCard icon={AlertCircle} label={lang === 'en' ? 'Failed sign-ins' : 'Échecs de connexion'} value={auditLog.filter((e) => e.action === 'login.failed').length} accent="bg-red-100 text-red-700" />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2">
            <label className="label">{lang === 'en' ? 'Search' : 'Rechercher'}</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input className="input pl-9" placeholder={lang === 'en' ? 'Actor, target, action…' : 'Acteur, cible, action…'} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">{lang === 'en' ? 'Role' : 'Rôle'}</label>
            <select className="input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">{lang === 'en' ? 'All roles' : 'Tous'}</option>
              <option value="student">{lang === 'en' ? 'Student' : 'Étudiant'}</option>
              <option value="lecturer">{lang === 'en' ? 'Lecturer' : 'Enseignant'}</option>
              <option value="staff">{lang === 'en' ? 'Staff' : 'Personnel'}</option>
              <option value="admin">{lang === 'en' ? 'Admin' : 'Administration'}</option>
            </select>
          </div>
          <div>
            <label className="label">{lang === 'en' ? 'Action' : 'Action'}</label>
            <select className="input" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
              <option value="all">{lang === 'en' ? 'All actions' : 'Toutes'}</option>
              {actionTypes.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {[7, 30, 90, 365].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 rounded-full font-medium transition ${
                days === d ? 'bg-brand-700 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300'
              }`}
            >
              {lang === 'en' ? `Last ${d} d` : `${d} derniers j`}
            </button>
          ))}
          <span className="badge-info ml-auto">
            <Filter size={12} /> {filtered.length} {lang === 'en' ? 'events' : 'événements'}
          </span>
        </div>
      </div>

      {/* Log table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-500 uppercase tracking-wider border-b border-ink-100 dark:border-ink-800">
                <th className="py-2.5 px-3">{lang === 'en' ? 'Timestamp' : 'Date / heure'}</th>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Actor' : 'Acteur'}</th>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Action' : 'Action'}</th>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Target' : 'Cible'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-ink-500">
                  <Activity size={28} className="mx-auto mb-2" />
                  {lang === 'en' ? 'No events match the filters.' : 'Aucun événement ne correspond.'}
                </td></tr>
              ) : filtered.map((e) => {
                const meta = ACTION_ICONS[e.action] || { color: 'bg-ink-100 text-ink-700', label: e.action }
                return (
                  <tr key={e.id} className="border-b border-ink-50 dark:border-ink-800 hover:bg-ink-50/40 dark:hover:bg-ink-800/30">
                    <td className="py-2.5 px-3 text-xs text-ink-600 font-mono">{new Date(e.at).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB')}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium">{e.actor}</div>
                      <div className="text-[11px] text-ink-500">{e.role}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`badge ${meta.color}`}>{meta.label}</span>
                    </td>
                    <td className="py-2.5 px-3 text-ink-600 text-sm font-mono">{e.target || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 flex items-start gap-3">
        <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-sm text-emerald-900 dark:text-emerald-200">
          {lang === 'en'
            ? 'The audit log is append-only. Entries cannot be deleted from the UI; only an admin with direct Firestore access can purge — which is itself logged.'
            : 'Le journal est append-only. Les entrées ne peuvent être supprimées via l\'interface ; seul un admin avec accès direct à Firestore peut purger — ce qui est lui-même journalisé.'}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon size={18} />
        </div>
        <div>
          <div className="text-xs text-ink-500">{label}</div>
          <div className="text-xl font-display font-bold mt-0.5">{value}</div>
        </div>
      </div>
    </div>
  )
}
