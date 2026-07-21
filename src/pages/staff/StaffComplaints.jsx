import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { AlertTriangle, MessageSquare, CheckCircle, Clock, Filter, Search } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'

const PRIORITIES = {
  low: 'bg-ink-100 text-ink-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
}

export default function StaffComplaints() {
  const { user } = useAuth()
  const { complaints, updateComplaintStatus } = useData()
  const { lang } = useLang()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [resolution, setResolution] = useState('')
  const [resolvingId, setResolvingId] = useState(null)

  const filtered = useMemo(() => {
    let items = filter === 'all' ? complaints : complaints.filter(c => c.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(c => c.subject?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q) || c.userName?.toLowerCase().includes(q))
    }
    return items
  }, [complaints, filter, search])

  const stats = useMemo(() => ({
    open: complaints.filter(c => c.status === 'open').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    urgent: complaints.filter(c => c.priority === 'urgent' && c.status !== 'resolved').length,
  }), [complaints])

  const handleResolve = (id) => {
    const note = resolution.trim() || 'Resolved'
    updateComplaintStatus(id, 'resolved', note)
    setResolvingId(null)
    setResolution('')
    toast.success(lang === 'en' ? 'Complaint marked as resolved' : 'Plainte résolue')
  }

  const handleAccept = (id) => {
    updateComplaintStatus(id, 'in-progress')
    toast.success(lang === 'en' ? 'Complaint accepted' : 'Plainte acceptée')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Complaints Management' : 'Gestion des plaintes'}
        subtitle={lang === 'en' ? 'Review, accept and resolve student complaints' : 'Examiner et résoudre les plaintes'}
      />

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="card"><MessageSquare size={18} className="text-brand-600 mb-2" /><div className="text-xs text-ink-500">{lang === 'en' ? 'Total' : 'Total'}</div><div className="text-2xl font-display font-bold">{complaints.length}</div></div>
        <div className="card"><AlertTriangle size={18} className="text-red-600 mb-2" /><div className="text-xs text-ink-500">{lang === 'en' ? 'Open' : 'Ouvertes'}</div><div className="text-2xl font-display font-bold">{stats.open}</div></div>
        <div className="card"><Clock size={18} className="text-amber-600 mb-2" /><div className="text-xs text-ink-500">{lang === 'en' ? 'In Progress' : 'En cours'}</div><div className="text-2xl font-display font-bold">{stats.inProgress}</div></div>
        <div className="card"><CheckCircle size={18} className="text-emerald-600 mb-2" /><div className="text-xs text-ink-500">{lang === 'en' ? 'Resolved' : 'Résolues'}</div><div className="text-2xl font-display font-bold">{stats.resolved}</div></div>
      </div>

      {stats.urgent > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle size={16} /> {stats.urgent} {lang === 'en' ? 'urgent complaints require immediate attention' : 'plaintes urgentes nécessitent une attention immédiate'}
        </div>
      )}

      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex gap-1 bg-ink-100 rounded-xl p-1 flex-wrap">
            {['all', 'open', 'in-progress', 'resolved'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === s ? 'bg-white shadow-soft' : 'text-ink-500 hover:text-ink-700'}`}
              >{s === 'all' ? (lang === 'en' ? 'All' : 'Tous') : s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input className="input pl-8 text-sm w-48 sm:w-64" placeholder={lang === 'en' ? 'Search...' : 'Rechercher...'} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-ink-500">
              <MessageSquare size={40} className="mx-auto text-ink-300 mb-3" />
              <p>{lang === 'en' ? 'No complaints found.' : 'Aucune plainte trouvée.'}</p>
            </div>
          ) : filtered.map(c => (
            <div key={c.id} className="p-4 rounded-xl border border-ink-100 hover:border-brand-200 hover:shadow-soft transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${PRIORITIES[c.priority] || 'bg-ink-100'}`}>{c.priority}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-600">{c.category}</span>
                    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${
                      c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                      c.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>{c.status}</span>
                  </div>
                  <div className="font-semibold text-sm mt-1">{c.subject}</div>
                  <div className="text-sm text-ink-600 mt-1">{c.description}</div>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-ink-400">
                    <span className="font-medium text-ink-600">{c.userName}</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    {c.resolution && <span className="text-emerald-600">→ {c.resolution}</span>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {c.status === 'open' && (
                    <button onClick={() => handleAccept(c.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition">
                      Accept
                    </button>
                  )}
                  {c.status === 'in-progress' && (
                    <button onClick={() => setResolvingId(resolvingId === c.id ? null : c.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition">
                      Resolve
                    </button>
                  )}
                </div>
              </div>
              {resolvingId === c.id && (
                <div className="mt-3 pt-3 border-t border-ink-100 flex items-center gap-2">
                  <input className="input text-sm flex-1" placeholder={lang === 'en' ? 'Resolution note...' : 'Note de résolution...'} value={resolution} onChange={e => setResolution(e.target.value)} autoFocus />
                  <button onClick={() => handleResolve(c.id)} className="btn-primary text-sm py-2">Submit</button>
                  <button onClick={() => setResolvingId(null)} className="btn-ghost text-sm py-2">Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
