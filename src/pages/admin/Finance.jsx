import { useMemo, useRef, useState } from 'react'
import {
  Wallet, TrendingUp, AlertTriangle, CheckCircle2, Search,
  Download, Printer, Filter, FileText,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { MOCK_STUDENTS, MOCK_FEE_STRUCTURE, PAYMENT_METHODS, SPECIALTIES } from '@/lib/mockData'
import StatCard from '@/components/ui/StatCard'
import toast from 'react-hot-toast'

// Build a flat list of payment transactions from each student's fee status.
// "paid" → 1 transaction (full); "partial" → 1 transaction (350k); "overdue" → 1 small attempt
function buildTransactions() {
  const methods = PAYMENT_METHODS.map((m) => m.name)
  const rows = []
  MOCK_STUDENTS.forEach((s, i) => {
    if (s.feesPaid <= 0) return
    const method = methods[(i + s.feesPaid) % methods.length]
    const day = String(((i * 7) % 28) + 1).padStart(2, '0')
    const month = ['01', '02', '03', '04', '05'][i % 5]
    rows.push({
      id:        `TXN-2026-${String(1000 + i).padStart(4, '0')}`,
      studentId: s.id,
      studentName: s.name,
      specialty: s.specialty,
      amount:    s.feesPaid,
      method,
      status:    s.feeStatus === 'overdue' ? 'partial' : 'success',
      date:      `2026-${month}-${day}`,
      reference: `${method.includes('MoMo') ? 'MOMO' : method.includes('Orange') ? 'OM' : method.includes('Visa') ? 'VISA' : 'BANK'}-2026-${String(0xABCDE + i).toString(16).toUpperCase()}`,
    })
  })
  return rows.sort((a, b) => b.date.localeCompare(a.date))
}

const TXNS = buildTransactions()

// Monthly collection trend
const MONTHLY_TREND = [
  { month: 'Sep 25', amount: 8_500_000, target: 7_000_000 },
  { month: 'Oct 25', amount: 7_200_000, target: 7_000_000 },
  { month: 'Nov 25', amount: 9_800_000, target: 7_000_000 },
  { month: 'Dec 25', amount: 4_600_000, target: 5_000_000 },
  { month: 'Jan 26', amount: 11_400_000, target: 8_000_000 },
  { month: 'Feb 26', amount: 8_900_000, target: 7_000_000 },
  { month: 'Mar 26', amount: 7_500_000, target: 7_000_000 },
  { month: 'Apr 26', amount: 6_200_000, target: 7_000_000 },
  { month: 'May 26', amount: 5_800_000, target: 7_000_000 },
]

const STATUS_BADGE = {
  paid:    'badge-success',
  partial: 'badge-warning',
  overdue: 'badge-danger',
  success: 'badge-success',
}

export default function Finance() {
  const [methodFilter,    setMethodFilter]    = useState('all')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')
  const [statusFilter,    setStatusFilter]    = useState('all')
  const [search,          setSearch]          = useState('')
  const printRef = useRef(null)

  // KPIs
  const kpis = useMemo(() => {
    const totalCollected = MOCK_STUDENTS.reduce((s, x) => s + x.feesPaid, 0)
    const totalExpected  = MOCK_STUDENTS.reduce((s, x) => s + x.feesTotal, 0)
    const totalOutstanding = totalExpected - totalCollected
    const fullyPaid    = MOCK_STUDENTS.filter((s) => s.feeStatus === 'paid').length
    const overdueCount = MOCK_STUDENTS.filter((s) => s.feeStatus === 'overdue').length
    const recoveryRate = Math.round((totalCollected / totalExpected) * 100)
    return { totalCollected, totalOutstanding, fullyPaid, overdueCount, recoveryRate }
  }, [])

  // Method distribution for pie chart
  const methodDistribution = useMemo(() => {
    const tally = {}
    TXNS.forEach((t) => { tally[t.method] = (tally[t.method] || 0) + t.amount })
    return Object.entries(tally).map(([name, value]) => ({ name, value }))
  }, [])

  const PIE_COLORS = ['#f59e0b', '#fb923c', '#1e3aa0', '#10b981']

  // Filtered table rows
  const rows = useMemo(() => {
    return TXNS.filter((t) =>
      (methodFilter    === 'all' || t.method   .includes(methodFilter)) &&
      (specialtyFilter === 'all' || t.specialty === specialtyFilter)    &&
      (statusFilter    === 'all' || t.status    === statusFilter)       &&
      (!search ||
        t.studentName.toLowerCase().includes(search.toLowerCase()) ||
        t.studentId  .toLowerCase().includes(search.toLowerCase()) ||
        t.reference  .toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [methodFilter, specialtyFilter, statusFilter, search])

  const fmtFCFA = (n) => n.toLocaleString('en-US') + ' FCFA'

  const exportCSV = () => {
    const header = ['Reference', 'Date', 'Student ID', 'Student', 'Specialty', 'Method', 'Amount (FCFA)', 'Status']
    const csv = [header.join(',')].concat(
      rows.map((r) => [
        r.reference, r.date, r.studentId, `"${r.studentName}"`, r.specialty, `"${r.method}"`, r.amount, r.status,
      ].join(','))
    ).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `iuget-tuition-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${rows.length} transactions`)
  }

  const printReport = () => {
    const w = window.open('', '_blank', 'width=1100,height=800')
    w.document.write(`
      <html><head><title>IUGET — Tuition Financial Report</title>
      <style>
        body { font-family: -apple-system, system-ui, sans-serif; padding: 32px; color: #1e293b }
        h1 { color: #1e3aa0; margin: 0 0 6px } .ref { color: #64748b; font-size: 12px; margin-bottom: 22px }
        table { width: 100%; border-collapse: collapse; font-size: 12px }
        th { background: #1e3aa0; color: #fff; text-align: left; padding: 8px 10px }
        td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0 }
        .total { background: #f1f5f9; font-weight: 700 } .right { text-align: right }
        .badge { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 600 }
        .b-paid { background: #dcfce7; color: #166534 } .b-partial { background: #fef3c7; color: #92400e }
      </style></head><body>
        <h1>IUGET — Tuition Financial Report</h1>
        <div class="ref">Generated ${new Date().toLocaleString('en-GB')} · ${rows.length} transactions</div>
        <table><thead><tr>
          <th>Reference</th><th>Date</th><th>Student</th><th>Specialty</th><th>Method</th><th class="right">Amount (FCFA)</th><th>Status</th>
        </tr></thead><tbody>
          ${rows.map((r) => `<tr>
            <td><code>${r.reference}</code></td>
            <td>${r.date}</td>
            <td>${r.studentName}<br/><span style="color:#64748b;font-size:11px">${r.studentId}</span></td>
            <td>${r.specialty}</td>
            <td>${r.method}</td>
            <td class="right">${r.amount.toLocaleString('en-US')}</td>
            <td><span class="badge b-${r.status === 'success' ? 'paid' : 'partial'}">${r.status}</span></td>
          </tr>`).join('')}
          <tr class="total">
            <td colspan="5">TOTAL</td>
            <td class="right">${rows.reduce((s, r) => s + r.amount, 0).toLocaleString('en-US')}</td>
            <td></td>
          </tr>
        </tbody></table>
      </body></html>
    `)
    w.document.close(); w.focus(); setTimeout(() => w.print(), 250)
  }

  return (
    <div className="space-y-6" ref={printRef}>
      {/* Header */}
      <div className="card bg-gradient-to-br from-emerald-600 to-brand-700 text-white border-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-white/70 text-sm uppercase tracking-wider">Bursary · Financial Tracking</div>
            <h2 className="text-3xl font-display font-bold mt-1">Tuition Payments Overview</h2>
            <p className="text-white/80 mt-1.5">All MoMo, OM, Visa, and bank transactions across the institution.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="bg-white/15 hover:bg-white/25 transition rounded-xl px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2">
              <Download size={16} /> Export CSV
            </button>
            <button onClick={printReport} className="bg-white text-emerald-700 hover:bg-white/90 transition rounded-xl px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2">
              <Printer size={16} /> Print report
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet}         label="Total Collected"  value={fmtFCFA(kpis.totalCollected)}  trend={`${kpis.recoveryRate}% rate`} color="green" />
        <StatCard icon={AlertTriangle}  label="Outstanding"      value={fmtFCFA(kpis.totalOutstanding)} trend={`${kpis.overdueCount} overdue`} color="amber" />
        <StatCard icon={CheckCircle2}   label="Fully Paid"       value={`${kpis.fullyPaid} students`} trend="cleared accounts" color="brand" />
        <StatCard icon={TrendingUp}     label="Recovery Rate"    value={`${kpis.recoveryRate}%`}      trend="of expected" color="accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trend */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-lg">Monthly Collection Trend</h3>
              <p className="text-sm text-ink-500">Actual collection vs. monthly target · 2025/2026 academic year</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={MONTHLY_TREND}>
              <defs>
                <linearGradient id="emColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#94a3b8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                formatter={(v) => v.toLocaleString('en-US') + ' FCFA'}
              />
              <Area type="monotone" dataKey="target" stroke="#94a3b8" fill="url(#tColor)" strokeDasharray="4 4" strokeWidth={2} />
              <Area type="monotone" dataKey="amount" stroke="#10b981" fill="url(#emColor)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Method distribution */}
        <div className="card">
          <h3 className="font-display font-bold text-lg mb-1">Collection by Method</h3>
          <p className="text-sm text-ink-500 mb-3">Distribution across payment channels</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={methodDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {methodDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} formatter={(v) => v.toLocaleString('en-US') + ' FCFA'} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2 text-xs">
            {methodDistribution.map((m, i) => (
              <div key={m.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  {m.name}
                </div>
                <span className="font-medium">{(m.value / 1_000_000).toFixed(1)}M FCFA</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters + table */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              className="input pl-9"
              placeholder="Search by name, ID, reference…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input w-auto" value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
            <option value="all">All methods</option>
            {PAYMENT_METHODS.map((m) => <option key={m.id} value={m.name.split(' ')[0]}>{m.name}</option>)}
          </select>
          <select className="input w-auto" value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)}>
            <option value="all">All specialties</option>
            {Object.values(SPECIALTIES).map((s) => <option key={s.id} value={s.id}>{s.id}</option>)}
          </select>
          <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="success">Success</option>
            <option value="partial">Partial</option>
          </select>
          <span className="badge-info"><Filter size={12} /> {rows.length} results</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-500 uppercase tracking-wider border-b border-ink-100">
                <th className="py-2.5 px-3">Reference</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Specialty</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-ink-50 hover:bg-ink-50/50">
                  <td className="py-2.5 px-3 font-mono text-xs">{r.reference}</td>
                  <td className="py-2.5 px-3 text-ink-600">{r.date}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium">{r.studentName}</div>
                    <div className="text-[11px] text-ink-500 font-mono">{r.studentId}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={SPECIALTIES[r.specialty]?.chip || 'badge-info'}>
                      {r.specialty}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">{r.method}</td>
                  <td className="py-2.5 px-3 text-right font-medium">{fmtFCFA(r.amount)}</td>
                  <td className="py-2.5 px-3">
                    <span className={STATUS_BADGE[r.status] || 'badge-info'}>{r.status}</span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-ink-500"><FileText className="mx-auto mb-2" size={28} />No transactions match the filters.</td></tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-ink-50 font-semibold">
                <td colSpan={5} className="py-3 px-3 uppercase tracking-wider text-xs">Total</td>
                <td className="py-3 px-3 text-right">{fmtFCFA(rows.reduce((s, r) => s + r.amount, 0))}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
