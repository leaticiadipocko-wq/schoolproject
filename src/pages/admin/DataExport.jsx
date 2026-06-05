import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  Database, Download, FileJson, FileSpreadsheet, Lock, ShieldCheck,
  CheckCircle2, AlertCircle, Package,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'

/**
 * Institutional data export — addresses vendor-lock-in concerns.
 *
 * The admin can download every collection as a single JSON archive, or
 * any individual collection as CSV. Each export is logged.
 */
export default function Export() {
  const data = useData()
  const { user } = useAuth()
  const { lang } = useLang()
  const [busy, setBusy] = useState(false)

  const T = {
    title:    lang === 'en' ? 'Institutional Data Export' : 'Export Institutionnel',
    sub:      lang === 'en' ? 'Download a full archive of every collection — addresses vendor-lock-in concerns.' : 'Téléchargez une archive complète de toutes les collections — adresse les inquiétudes de dépendance technologique.',
    full:     lang === 'en' ? 'Full JSON archive' : 'Archive JSON complète',
    fullSub:  lang === 'en' ? 'Everything: users, courses, timetable, results, attendance, payments, announcements, lessons, assignments, signatures.' : 'Tout : utilisateurs, cours, emploi du temps, résultats, présences, paiements, annonces, leçons, devoirs, signatures.',
    download: lang === 'en' ? 'Download archive' : 'Télécharger l\'archive',
    csv:      lang === 'en' ? 'Per-collection CSV' : 'CSV par collection',
    csvSub:   lang === 'en' ? 'Spreadsheet-friendly export of a single collection.' : 'Export feuille de calcul d\'une collection.',
    note:     lang === 'en' ? 'Privacy note' : 'Note de confidentialité',
    notes:    lang === 'en'
      ? 'Exports may contain personal data (names, emails, phone numbers). Handle the resulting file according to the institution\'s data-protection policy. SIARM logs every export, including the requester\'s identity and the time.'
      : 'Les exports peuvent contenir des données personnelles (noms, e-mails, téléphones). Manipulez le fichier selon la politique de protection des données de l\'établissement. SIARM journalise chaque export, y compris l\'identité du demandeur et l\'horodatage.',
  }

  // Collections that are safe to export
  const COLLECTIONS = [
    { id: 'users',          label: lang === 'en' ? 'Users (mock)' : 'Utilisateurs (démo)' },
    { id: 'courses',        label: lang === 'en' ? 'Courses' : 'Cours' },
    { id: 'timetable',      label: lang === 'en' ? 'Timetable' : 'Emploi du temps' },
    { id: 'results',        label: lang === 'en' ? 'Results' : 'Résultats' },
    { id: 'attendance',     label: lang === 'en' ? 'Attendance' : 'Présences' },
    { id: 'announcements',  label: lang === 'en' ? 'Announcements' : 'Annonces' },
    { id: 'lessons',        label: lang === 'en' ? 'Lessons (Mobile Learning)' : 'Leçons' },
    { id: 'assignments',    label: lang === 'en' ? 'Assignments' : 'Devoirs' },
    { id: 'submissions',    label: lang === 'en' ? 'Submissions' : 'Soumissions' },
    { id: 'payments',       label: lang === 'en' ? 'Payments' : 'Paiements' },
    { id: 'auditLog',       label: lang === 'en' ? 'Audit log' : 'Journal d\'audit' },
    { id: 'discussions',    label: lang === 'en' ? 'Discussions' : 'Discussions' },
  ]

  const buildArchive = () => {
    const archive = {
      meta: {
        institution: 'IUGET Bonabéri',
        exportedAt:  new Date().toISOString(),
        exportedBy:  user?.name || 'admin',
        version:     'siarm-v1',
        notes:       'Full institutional export. Re-import via scripts/import-iuget.mjs.',
      },
    }
    COLLECTIONS.forEach((c) => { archive[c.id] = data[c.id] || [] })
    return archive
  }

  const downloadJson = () => {
    setBusy(true)
    try {
      const archive = buildArchive()
      const blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `iuget-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      data.logAction?.({ actor: user?.name || 'admin', role: 'admin', action: 'data.export', target: `full archive · ${Object.keys(archive).length - 1} collections` })
      toast.success(lang === 'en' ? 'Archive downloaded' : 'Archive téléchargée')
    } catch (e) {
      toast.error(lang === 'en' ? 'Export failed' : 'Échec de l\'export')
    } finally { setBusy(false) }
  }

  const downloadCsv = (key, label) => {
    const items = data[key] || []
    if (items.length === 0) {
      return toast.error(lang === 'en' ? `No ${label} to export` : `Aucun ${label} à exporter`)
    }
    const headers = Array.from(new Set(items.flatMap((it) => Object.keys(it || {}))))
    const escape = (v) => {
      const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v)
      return `"${s.replace(/"/g, '""')}"`
    }
    const csv = [headers.join(','), ...items.map((it) => headers.map((h) => escape(it[h])).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `iuget-${key}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    data.logAction?.({ actor: user?.name || 'admin', role: 'admin', action: 'data.export', target: `${key} · ${items.length} rows` })
    toast.success(lang === 'en' ? `${items.length} ${label} exported` : `${items.length} ${label} exportés`)
  }

  return (
    <div className="space-y-6">
      <PageHeader title={T.title} subtitle={T.sub} />

      {/* Privacy banner */}
      <div className="card bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 flex items-start gap-3">
        <Lock size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900 dark:text-amber-200">
          <div className="font-bold">{T.note}</div>
          <div className="mt-1">{T.notes}</div>
        </div>
      </div>

      {/* Full archive */}
      <div className="card">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
            <Package size={26} />
          </div>
          <div className="flex-1 min-w-[260px]">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <FileJson size={18} className="text-brand-600" /> {T.full}
            </h3>
            <p className="text-sm text-ink-600 dark:text-ink-300 mt-1">{T.fullSub}</p>
            <div className="mt-3 text-xs text-ink-500 flex flex-wrap gap-3">
              <span>{COLLECTIONS.length} {lang === 'en' ? 'collections' : 'collections'}</span>
              <span>·</span>
              <span>{(data.users?.length || 0) + (data.results?.length || 0)} {lang === 'en' ? 'records (approx.)' : 'enregistrements (approx.)'}</span>
            </div>
          </div>
          <button onClick={downloadJson} disabled={busy} className="btn-primary">
            <Download size={16} /> {T.download}
          </button>
        </div>
      </div>

      {/* Per-collection */}
      <div className="card">
        <h3 className="font-display font-bold text-lg flex items-center gap-2 mb-3">
          <FileSpreadsheet size={18} className="text-emerald-600" /> {T.csv}
        </h3>
        <p className="text-sm text-ink-500 mb-4">{T.csvSub}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COLLECTIONS.map((c) => {
            const n = (data[c.id] || []).length
            return (
              <button
                key={c.id}
                onClick={() => downloadCsv(c.id, c.label)}
                disabled={n === 0}
                className="p-3 rounded-xl border border-ink-100 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-800/30 text-left hover:border-brand-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{c.label}</div>
                  <span className="text-xs text-ink-500">{n}</span>
                </div>
                <div className="text-[11px] text-brand-700 mt-1 inline-flex items-center gap-1">
                  <Download size={11} /> CSV
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Re-import guidance */}
      <div className="card bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 flex items-start gap-3">
        <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-sm text-emerald-900 dark:text-emerald-200">
          <div className="font-bold flex items-center gap-2">
            <CheckCircle2 size={14} />
            {lang === 'en' ? 'No vendor lock-in' : 'Aucune dépendance technologique'}
          </div>
          <div className="mt-1">
            {lang === 'en'
              ? 'The JSON archive can be re-imported into another SIARM instance with scripts/import-iuget.mjs. The CSVs are spreadsheet-compatible and can be loaded into any other system.'
              : 'L\'archive JSON peut être réimportée dans une autre instance SIARM via scripts/import-iuget.mjs. Les CSV sont compatibles tableur et peuvent être chargés dans tout autre système.'}
          </div>
        </div>
      </div>
    </div>
  )
}
