import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Wallet, CheckCircle2, Clock, Download, Search, Filter, Banknote, UserCheck, X } from 'lucide-react'
import { MOCK_PAYROLL_RECORDS, PAYROLL_SUMMARY } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'
import StatCard from '@/components/ui/StatCard'

const STATUS_COLORS = {
  paid: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function PayrollManagement() {
  const [records, setRecords] = useState(MOCK_PAYROLL_RECORDS)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(new Set())

  const filtered = useMemo(() => {
    return records.filter(r =>
      (statusFilter === 'all' || r.status === statusFilter) &&
      (!query.trim() || r.lecturerName.toLowerCase().includes(query.toLowerCase()) || r.department.toLowerCase().includes(query))
    )
  }, [records, query, statusFilter])

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const processPayment = (id) => {
    setRecords(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'paid', paidOn: new Date().toISOString().split('T')[0] } : r
    ))
    toast.success('Payment processed')
    setSelected(new Set())
  }

  const bulkProcess = () => {
    setRecords(prev => prev.map(r =>
      selected.has(r.id) ? { ...r, status: 'paid', paidOn: new Date().toISOString().split('T')[0] } : r
    ))
    toast.success(`${selected.size} payments processed`)
    setSelected(new Set())
  }

  const exportCSV = () => {
    const headers = ['Lecturer', 'Department', 'Role', 'Base Salary', 'Allowances', 'Deductions', 'Net Pay', 'Status', 'Period', 'Paid On']
    const rows = filtered.map(r => [r.lecturerName, r.department, r.role, r.baseSalary, r.allowances, r.deductions, r.netPay, r.status, r.period, r.paidOn || ''])
    const csv = [headers, ...rows].map(r => r.map(c => `"${(c||'').replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'siarm-payroll.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Payroll exported')
  }

  const totalPaid = records.filter(r => r.status === 'paid').reduce((s, r) => s + r.netPay, 0)
  const totalPending = records.filter(r => r.status === 'pending').reduce((s, r) => s + r.netPay, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lecturer Payroll"
        subtitle="Manage lecturer salaries, allowances, and payment processing"
        actions={
          <div className="flex gap-2">
            <button onClick={exportCSV} className="btn-secondary"><Download size={16} /> Export</button>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Wallet} label="Total Budget" value={`${(PAYROLL_SUMMARY.totalBudget / 1e6).toFixed(1)}M`} color="brand" />
        <StatCard icon={CheckCircle2} label="Paid" value={`${(totalPaid / 1e6).toFixed(1)}M`} color="green" />
        <StatCard icon={Clock} label="Pending" value={`${(totalPending / 1e6).toFixed(1)}M`} color="amber" />
        <StatCard icon={UserCheck} label="Lecturers" value={records.length} color="accent" />
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search lecturer, department…" className="input pl-10 py-2 text-sm w-56 sm:w-72" />
            </div>
            <div className="flex gap-1 bg-ink-100 rounded-xl p-1">
              {['all', 'paid', 'pending'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition ${
                    statusFilter === s ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>
          {selected.size > 0 && (
            <button onClick={bulkProcess} className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs font-medium transition">
              <Banknote size={14} className="inline mr-1" /> Process {selected.size} payment(s)
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-ink-100">
          <table className="w-full min-w-[800px]">
            <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="p-3 w-10"></th>
                <th className="text-left p-3">Lecturer</th>
                <th className="text-left p-3">Department</th>
                <th className="text-left p-3">Role</th>
                <th className="text-right p-3">Base</th>
                <th className="text-right p-3">Allowances</th>
                <th className="text-right p-3">Deductions</th>
                <th className="text-right p-3">Net Pay</th>
                <th className="text-center p-3">Status</th>
                <th className="text-left p-3">Period</th>
                <th className="p-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map(r => (
                <tr key={r.id} className={`hover:bg-ink-50 transition ${selected.has(r.id) ? 'bg-brand-50/40' : ''}`}>
                  <td className="p-3">
                    <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)}
                      className="rounded border-ink-300 text-brand-700 focus:ring-brand-500" />
                  </td>
                  <td className="p-3 font-medium text-sm">{r.lecturerName}</td>
                  <td className="p-3 text-sm text-ink-600">{r.department}</td>
                  <td className="p-3 text-sm text-ink-500">{r.role}</td>
                  <td className="p-3 text-sm text-right">{r.baseSalary.toLocaleString()}</td>
                  <td className="p-3 text-sm text-right text-emerald-600">+{r.allowances.toLocaleString()}</td>
                  <td className="p-3 text-sm text-right text-red-500">-{r.deductions.toLocaleString()}</td>
                  <td className="p-3 text-sm text-right font-bold">{r.netPay.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.status]}`}>
                      {r.status === 'paid' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-ink-500">{r.period}</td>
                  <td className="p-3">
                    {r.status === 'pending' && (
                      <button onClick={() => processPayment(r.id)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-brand-100 text-brand-700 hover:bg-brand-200 font-medium transition">
                        Pay now
                      </button>
                    )}
                    {r.status === 'paid' && (
                      <span className="text-[10px] text-ink-400">{r.paidOn}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="p-12 text-center text-ink-500 text-sm">No payroll records match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-ink-100 text-xs text-ink-500 text-right">
          Showing {filtered.length} of {records.length} records · {PAYROLL_SUMMARY.currency}
        </div>
      </div>
    </div>
  )
}
