import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { CalendarDays, Clock, CheckCircle2, XCircle, AlertCircle, Plus, FileText, User } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'

const LEAVE_TYPES = [
  { id: 'annual', label: 'Annual Leave', days: 30 },
  { id: 'sick', label: 'Sick Leave', days: 14 },
  { id: 'personal', label: 'Personal Leave', days: 10 },
  { id: 'maternity', label: 'Maternity/Paternity', days: 98 },
  { id: 'study', label: 'Study Leave', days: 30 },
  { id: 'unpaid', label: 'Unpaid Leave', days: 0 },
]

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function LeaveManagement() {
  const { user } = useAuth()
  const { leaves = [], submitLeave, approveLeave, rejectLeave } = useData()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'annual', reason: '', startDate: '', endDate: '', contact: '' })
  const isAdmin = user?.role === 'admin' || user?.role === 'staff'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.startDate || !form.endDate || !form.reason) {
      toast.error('Please fill in all required fields')
      return
    }
    submitLeave({ ...form, userId: user?.uid, userName: user?.name })
    setShowForm(false)
    setForm({ type: 'annual', reason: '', startDate: '', endDate: '', contact: '' })
    toast.success('Leave request submitted')
  }

  const myLeaves = leaves.filter(l => l.userId === user?.uid)
  const pendingLeaves = leaves.filter(l => l.status === 'pending')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        subtitle={isAdmin ? 'Review and manage leave requests' : 'Submit and track your leave requests'}
        actions={
          !isAdmin && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={16} /> New Request
            </button>
          )
        }
      />

      {/* Leave balance cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {LEAVE_TYPES.map(lt => (
          <div key={lt.id} className="card text-center p-4">
            <div className="text-2xl font-display font-bold text-brand-700">{lt.days || '∞'}</div>
            <div className="text-xs text-ink-500 mt-1">{lt.label}</div>
          </div>
        ))}
      </div>

      {/* Admin: pending approvals */}
      {isAdmin && pendingLeaves.length > 0 && (
        <div className="card">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-600" />
            Pending Approvals ({pendingLeaves.length})
          </h3>
          <div className="space-y-3">
            {pendingLeaves.map(l => (
              <div key={l.id} className="p-4 rounded-xl border border-ink-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="font-semibold">{l.userName}</div>
                      <div className="text-sm text-ink-600 mt-0.5">
                        {LEAVE_TYPES.find(t => t.id === l.type)?.label || l.type}
                      </div>
                      <div className="text-xs text-ink-500 mt-1">
                        <CalendarDays size={12} className="inline mr-1" />
                        {l.startDate} → {l.endDate}
                      </div>
                      {l.reason && <div className="text-xs text-ink-500 mt-1 italic">"{l.reason}"</div>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => approveLeave(l.id)} className="p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition" title="Approve">
                      <CheckCircle2 size={18} />
                    </button>
                    <button onClick={() => rejectLeave(l.id)} className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition" title="Reject">
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My leave requests */}
      <div className="card">
        <h3 className="font-display font-bold text-lg mb-4">
          {isAdmin ? 'All Leave Requests' : 'My Leave Requests'}
        </h3>
        {myLeaves.length === 0 && pendingLeaves.length === 0 ? (
          <div className="text-center py-12 text-ink-500">
            <FileText size={40} className="mx-auto text-ink-300 mb-3" />
            <p>No leave requests yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {(isAdmin ? leaves : myLeaves).map(l => (
              <div key={l.id} className="flex items-center gap-4 p-3 rounded-xl bg-ink-50 border border-ink-100">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                  <CalendarDays size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">
                    {LEAVE_TYPES.find(t => t.id === l.type)?.label || l.type}
                    {isAdmin && <span className="text-ink-500 font-normal"> — {l.userName}</span>}
                  </div>
                  <div className="text-xs text-ink-500">
                    {l.startDate} → {l.endDate}
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[l.status] || STATUS_STYLES.pending}`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leave request form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg">New Leave Request</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-ink-100 rounded-lg"><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Leave Type</label>
                <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  {LEAVE_TYPES.map(lt => (
                    <option key={lt.id} value={lt.id}>{lt.label} ({lt.days ? `${lt.days} days` : 'Unlimited'})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Start Date</label>
                  <input type="date" className="input" value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })} required />
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input type="date" className="input" value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="label">Reason</label>
                <textarea className="input min-h-[80px]" value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })} required placeholder="Brief explanation for your leave request" />
              </div>
              <div>
                <label className="label">Emergency Contact</label>
                <input className="input" value={form.contact}
                  onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="Phone number during leave" />
              </div>
              <button type="submit" className="btn-primary w-full">Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}