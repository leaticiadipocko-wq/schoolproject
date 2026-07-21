import { useState } from 'react'
import toast from 'react-hot-toast'
import { AlertTriangle, MessageSquare, Plus, X, CheckCircle, Clock, Flag, Send, Filter } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'

const CATEGORIES = ['Facilities', 'Academic', 'Library', 'Administrative', 'Financial', 'Harassment', 'Other']
const PRIORITIES = [
  { id: 'low', label: 'Low', color: 'bg-ink-100 text-ink-700' },
  { id: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-700' },
  { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { id: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' },
]

export default function Complaints() {
  const { user } = useAuth()
  const { complaints, submitComplaint, updateComplaintStatus } = useData()
  const { lang } = useLang()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ category: 'Facilities', subject: '', description: '', priority: 'medium' })

  const filtered = filter === 'all' ? complaints : complaints.filter(c => c.status === filter)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.subject || !form.description) return toast.error(lang === 'en' ? 'Please fill all fields' : 'Remplissez tous les champs')
    await submitComplaint(form)
    setShowForm(false)
    setForm({ category: 'Facilities', subject: '', description: '', priority: 'medium' })
    toast.success(lang === 'en' ? 'Complaint submitted' : 'Plainte soumise')
  }

  const statusIcon = (s) => {
    if (s === 'resolved') return <CheckCircle size={16} className="text-emerald-600" />
    if (s === 'in-progress') return <Clock size={16} className="text-amber-600" />
    return <AlertTriangle size={16} className="text-red-600" />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Complaints & Suggestions' : 'Plaintes et suggestions'}
        subtitle={lang === 'en' ? 'Report issues or suggest improvements' : 'Signalez ou suggérez des améliorations'}
        actions={<button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> {lang === 'en' ? 'New Complaint' : 'Nouvelle plainte'}</button>}
      />

      <div className="flex gap-1 bg-ink-100 rounded-xl p-1 w-fit flex-wrap">
        {['all', 'open', 'in-progress', 'resolved'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === s ? 'bg-white shadow-soft' : 'text-ink-500 hover:text-ink-700'}`}
          >{s.charAt(0).toUpperCase() + s.slice(1)} ({s === 'all' ? complaints.length : complaints.filter(c => c.status === s).length})</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-12 text-ink-500">
            <MessageSquare size={40} className="mx-auto text-ink-300 mb-3" />
            <p>{lang === 'en' ? 'No complaints found.' : 'Aucune plainte trouvée.'}</p>
          </div>
        ) : filtered.map(c => (
          <div key={c.id} className="card-hover">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {statusIcon(c.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{c.subject}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${PRIORITIES.find(p => p.id === c.priority)?.color || 'bg-ink-100'}`}>{c.priority}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-600">{c.category}</span>
                  </div>
                  <div className="text-sm text-ink-600 mt-1">{c.description}</div>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-ink-400">
                    <span>{c.userName}</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    {c.resolution && <span className="text-emerald-600">Resolved: {c.resolution}</span>}
                  </div>
                </div>
              </div>
              {(user?.role === 'admin' || user?.role === 'staff') && c.status !== 'resolved' && (
                <div className="flex gap-1 shrink-0">
                  {c.status === 'open' && (
                    <button onClick={() => updateComplaintStatus(c.id, 'in-progress')} className="text-xs px-2 py-1 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200">Accept</button>
                  )}
                  {c.status === 'in-progress' && (
                    <button onClick={() => {
                      const r = prompt(lang === 'en' ? 'Resolution note:' : 'Note de résolution:')
                      updateComplaintStatus(c.id, 'resolved', r || 'Resolved')
                      toast.success(lang === 'en' ? 'Marked as resolved' : 'Marqué comme résolu')
                    }} className="text-xs px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Resolve</button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg">{lang === 'en' ? 'Submit a Complaint' : 'Soumettre une plainte'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-ink-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">{lang === 'en' ? 'Category' : 'Catégorie'}</label>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map(cat => (
                    <button key={cat} type="button" onClick={() => setForm({ ...form, category: cat })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${form.category === cat ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600 hover:border-brand-300'}`}
                    >{cat}</button>
                  ))}
                </div>
              </div>
              <div><label className="label">{lang === 'en' ? 'Priority' : 'Priorité'}</label>
                <div className="flex gap-2">
                  {PRIORITIES.map(p => (
                    <button key={p.id} type="button" onClick={() => setForm({ ...form, priority: p.id })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${form.priority === p.id ? p.color + ' ring-2 ring-offset-1' : 'bg-ink-50 text-ink-600 hover:bg-ink-100'}`}
                    >{p.label}</button>
                  ))}
                </div>
              </div>
              <div><label className="label">{lang === 'en' ? 'Subject' : 'Sujet'}</label><input className="input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required /></div>
              <div><label className="label">{lang === 'en' ? 'Description' : 'Description'}</label><textarea className="input min-h-[100px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
              <button type="submit" className="btn-primary w-full"><Send size={16} /> {lang === 'en' ? 'Submit' : 'Soumettre'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
