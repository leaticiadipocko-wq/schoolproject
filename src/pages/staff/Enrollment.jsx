import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import {
  UserPlus, Upload, CheckCircle2, Download, Trash2, IdCard,
  Wallet, Mail, Info, FileText, Loader2,
} from 'lucide-react'
import { SPECIALTIES, MOCK_FEE_STRUCTURE } from '@/lib/mockData'
import { makeMatricule, makeEmail } from '@/lib/enrolment'

// Automated student enrollment:
//  - One-by-one form with auto-generated matricule (IUGET/YYYY/SPEC/NNNN)
//  - Bulk CSV upload
//  - For each new student we auto-create: account, ID card record, fee balance
const YEAR = new Date().getFullYear()

const SPEC_OPTIONS = Object.values(SPECIALTIES)
const LEVEL_OPTIONS = [1, 2, 3]

export default function Enrollment() {
  const [enrolled, setEnrolled] = useState([])  // newly enrolled students this session
  const [form, setForm] = useState({
    fullName: '', dob: '', sex: 'M', phone: '', email: '',
    specialty: 'SWE', level: 3, guardian: '', guardianPhone: '',
  })
  const [busy, setBusy] = useState(false)
  const [bulkBusy, setBulkBusy] = useState(false)
  const [bulkProgress, setBulkProgress] = useState(0)
  const fileRef = useRef(null)

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const reset = () =>
    setForm({ fullName: '', dob: '', sex: 'M', phone: '', email: '',
              specialty: 'SWE', level: 3, guardian: '', guardianPhone: '' })

  const enrol = async (s) => {
    // simulated server roundtrip
    await new Promise((r) => setTimeout(r, 280))
    const idx = enrolled.length
    const matricule = makeMatricule(s.specialty, idx)
    const email = s.email || makeEmail(s.fullName, matricule)
    const record = {
      ...s,
      matricule,
      email,
      enrolledOn: new Date().toISOString().slice(0, 10),
      account:   { created: true, password: 'changeme' + matricule.slice(-4) },
      idCard:    { issued: true, validUntil: `${YEAR + 1}-07-31` },
      fee:       { total: MOCK_FEE_STRUCTURE.total, paid: 0, balance: MOCK_FEE_STRUCTURE.total },
    }
    setEnrolled((prev) => [record, ...prev])
    return record
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.dob) return toast.error('Full name and date of birth are required')
    setBusy(true)
    try {
      const rec = await enrol(form)
      toast.success(
        `${rec.fullName} enrolled · ${rec.matricule}`,
        { duration: 4000 }
      )
      reset()
    } catch (err) {
      toast.error('Enrolment failed')
    } finally {
      setBusy(false)
    }
  }

  const downloadSampleCSV = () => {
    const sample = [
      'fullName,dob,sex,phone,specialty,level,guardian,guardianPhone',
      'Tabi Christabel,2003-04-12,F,690112233,SWE,3,Mr Tabi Felix,675001122',
      'Nfor Lionel,2002-11-30,M,691445566,CNSM,3,Mrs Nfor Grace,696778899',
      'Bate Audrey,2004-02-09,F,673332244,BST,3,Dr Bate Eric,699112233',
    ].join('\n')
    const blob = new Blob([sample], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'iuget-enrollment-template.csv'
    a.click()
  }

  const handleBulkUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBulkBusy(true)
    setBulkProgress(0)
    try {
      const text = await file.text()
      const lines = text.split(/\r?\n/).filter(Boolean)
      const header = lines[0].split(',').map((h) => h.trim())
      const expected = ['fullName', 'dob', 'sex', 'phone', 'specialty', 'level']
      const missing = expected.filter((c) => !header.includes(c))
      if (missing.length) {
        toast.error('CSV missing columns: ' + missing.join(', '))
        return
      }
      const rows = lines.slice(1).map((line) => {
        const cells = line.split(',')
        return header.reduce((o, h, i) => ({ ...o, [h]: (cells[i] || '').trim() }), {})
      })
      let count = 0
      for (const r of rows) {
        await enrol({
          ...r,
          level:    Number(r.level) || 3,
          email:    r.email || '',
        })
        count++
        setBulkProgress(Math.round((count / rows.length) * 100))
      }
      toast.success(`${count} students enrolled from CSV`)
    } catch (err) {
      toast.error('Failed to process CSV')
    } finally {
      setBulkBusy(false)
      if (fileRef.current) fileRef.current.value = ''
      setTimeout(() => setBulkProgress(0), 1200)
    }
  }

  const exportEnrolledCSV = () => {
    if (!enrolled.length) return toast.error('No new enrolments yet')
    const header = ['Matricule', 'Name', 'Email', 'Specialty', 'Level', 'Enrolled On', 'Initial password']
    const csv = [header.join(',')].concat(
      enrolled.map((s) => [s.matricule, s.fullName, s.email, s.specialty, s.level, s.enrolledOn, s.account.password].join(','))
    ).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `iuget-new-enrollments-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-br from-brand-700 to-accent-600 text-white border-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-white/70 text-sm uppercase tracking-wider">Registrar · Automated Enrolment</div>
            <h2 className="text-3xl font-display font-bold mt-1">Register a new student</h2>
            <p className="text-white/80 mt-1.5">Auto-generates matricule, university email, ID card record, and tuition account.</p>
          </div>
          <div className="bg-white/15 rounded-xl px-4 py-2.5 text-sm">
            <div className="text-white/70 text-xs uppercase tracking-wider">This session</div>
            <div className="text-2xl font-display font-bold">{enrolled.length}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="card lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <UserPlus size={20} className="text-brand-600" />
            <h3 className="font-display font-bold text-lg">Single student</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full name *</label>
              <input className="input" placeholder="e.g. Nkwenti Deshnic"
                value={form.fullName} onChange={(e) => setF('fullName', e.target.value)} />
            </div>
            <div>
              <label className="label">Date of birth *</label>
              <input type="date" className="input"
                value={form.dob} onChange={(e) => setF('dob', e.target.value)} />
            </div>
            <div>
              <label className="label">Sex</label>
              <div className="flex gap-2">
                {['M', 'F'].map((g) => (
                  <button key={g} type="button" onClick={() => setF('sex', g)}
                    className={`flex-1 py-2.5 rounded-xl border transition ${
                      form.sex === g ? 'border-brand-500 bg-brand-50 text-brand-800 font-medium' : 'border-ink-200 hover:bg-ink-50'
                    }`}>{g === 'M' ? 'Male' : 'Female'}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" placeholder="6xx xxx xxx"
                value={form.phone} onChange={(e) => setF('phone', e.target.value)} />
            </div>
            <div>
              <label className="label">Specialty *</label>
              <select className="input" value={form.specialty} onChange={(e) => setF('specialty', e.target.value)}>
                {SPEC_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Level *</label>
              <select className="input" value={form.level} onChange={(e) => setF('level', Number(e.target.value))}>
                {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>Level {l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Guardian name</label>
              <input className="input" placeholder="e.g. Mr Nkwenti Senior"
                value={form.guardian} onChange={(e) => setF('guardian', e.target.value)} />
            </div>
            <div>
              <label className="label">Guardian phone</label>
              <input className="input" placeholder="6xx xxx xxx"
                value={form.guardianPhone} onChange={(e) => setF('guardianPhone', e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-ink-200 p-3 bg-ink-50 text-xs text-ink-600">
            <Info size={12} className="inline -mt-0.5 mr-1 text-brand-600" />
            On submit, SIARM will auto-create:
            <span className="font-medium"> matricule</span>,
            <span className="font-medium"> university email</span>,
            <span className="font-medium"> login account</span>,
            <span className="font-medium"> ID card record</span>, and a
            <span className="font-medium"> tuition account</span> of {MOCK_FEE_STRUCTURE.total.toLocaleString('en-US')} FCFA.
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" className="btn-ghost" onClick={reset}>Clear</button>
            <button type="submit" disabled={busy} className="btn-primary px-5">
              {busy ? <><Loader2 className="animate-spin" size={16} /> Enrolling…</> : <><UserPlus size={16} /> Enrol student</>}
            </button>
          </div>
        </form>

        {/* Bulk upload + downloads */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Upload size={20} className="text-accent-600" />
              <h3 className="font-display font-bold text-lg">Bulk CSV upload</h3>
            </div>
            <p className="text-sm text-ink-600">
              Upload a CSV to register many students at once. Each row creates a full account.
            </p>
            <button onClick={downloadSampleCSV} className="btn-secondary w-full mt-3">
              <Download size={16} /> Download template
            </button>
            <label className="btn-primary w-full mt-2 cursor-pointer">
              {bulkBusy ? <><Loader2 className="animate-spin" size={16} /> Processing… {bulkProgress}%</> : <><Upload size={16} /> Choose CSV</>}
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleBulkUpload} disabled={bulkBusy} />
            </label>
            {bulkBusy && (
              <div className="mt-3 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                <div className="h-full bg-accent-500 transition-all" style={{ width: `${bulkProgress}%` }} />
              </div>
            )}
          </div>

          {enrolled.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-base">Export this session</h3>
                <button onClick={() => setEnrolled([])} className="text-ink-400 hover:text-red-600" title="Clear">
                  <Trash2 size={16} />
                </button>
              </div>
              <button onClick={exportEnrolledCSV} className="btn-secondary w-full">
                <Download size={16} /> CSV ({enrolled.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Newly enrolled students */}
      {enrolled.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-lg">Newly enrolled students</h3>
              <p className="text-sm text-ink-500">{enrolled.length} created in this session</p>
            </div>
            <span className="badge-success"><CheckCircle2 size={12} /> Accounts active</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-500 uppercase tracking-wider border-b border-ink-100">
                  <th className="py-2.5 px-3">Matricule</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Specialty</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Auto-created</th>
                </tr>
              </thead>
              <tbody>
                {enrolled.map((s) => (
                  <tr key={s.matricule} className="border-b border-ink-50">
                    <td className="py-2.5 px-3 font-mono text-xs">{s.matricule}</td>
                    <td className="py-2.5 px-3 font-medium">{s.fullName}</td>
                    <td className="py-2.5 px-3">
                      <span className={SPECIALTIES[s.specialty]?.chip || 'badge-info'}>
                        {s.specialty} · L{s.level}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-ink-600">{s.email}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge-info"><Mail size={10} /> account</span>
                        <span className="badge-info"><IdCard size={10} /> ID card</span>
                        <span className="badge-info"><Wallet size={10} /> tuition</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
