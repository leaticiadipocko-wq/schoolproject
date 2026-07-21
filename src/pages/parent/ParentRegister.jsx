import { useState, useMemo, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ArrowLeft, ArrowRight, Check, User, Baby, GraduationCap, Wallet, CreditCard,
  Smartphone, Building2, ShieldCheck, X, Loader2, CheckCircle2, Printer, Download,
  Eye, EyeOff, Lock, Hash, Globe, Copy, Mail, Phone, MapPin, Sparkles,
} from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Logo from '@/components/Logo'
import QRCode from '@/components/QRCode'
import { getEnrollmentVerificationUrl } from '@/lib/verificationUrl'
import { api } from '@/lib/api'

// IUGET tuition structure
const FEE_BREAKDOWN = [
  { item: 'Tuition',         value: 450_000 },
  { item: 'Registration',    value:  25_000 },
  { item: 'Examination fee', value:  15_000 },
  { item: 'Library fee',     value:   8_000 },
  { item: 'Student union',   value:   2_000 },
]
const TOTAL_FEES = FEE_BREAKDOWN.reduce((s, f) => s + f.value, 0)

const SPECIALTIES = {
  SWE:  { id: 'SWE',  name: 'Software Engineering',                  pill: 'bg-brand-100 text-brand-800' },
  CNSM: { id: 'CNSM', name: 'Computer Networks & Multimedia Systems',pill: 'bg-accent-100 text-accent-700' },
  BST:  { id: 'BST',  name: 'Business Strategy & Technology',        pill: 'bg-amber-100 text-amber-800' },
}

// Payment options with their behavioural details
const PAY_METHODS = [
  { id: 'momo',   name: 'MTN Mobile Money',  subtitle: '*126#',           color: 'from-amber-400 to-amber-600',  bg: 'bg-amber-50',   text: 'text-amber-900',   icon: Smartphone, phoneRegex: /^(67|65|68)\d{7}$/, prefix: '*126#' },
  { id: 'om',     name: 'Orange Money',      subtitle: '#150*4#',         color: 'from-orange-400 to-orange-600',bg: 'bg-orange-50',  text: 'text-orange-900',  icon: Smartphone, phoneRegex: /^(69|66|67)\d{7}$/, prefix: '#150*4#' },
  { id: 'paypal', name: 'PayPal',            subtitle: 'International',   color: 'from-blue-500 to-blue-700',    bg: 'bg-blue-50',    text: 'text-blue-900',    icon: Globe },
  { id: 'visa',   name: 'Visa / Mastercard', subtitle: '3-D Secure',      color: 'from-slate-700 to-slate-900',  bg: 'bg-slate-50',   text: 'text-slate-900',   icon: CreditCard },
  { id: 'bank',   name: 'Bank Transfer',     subtitle: 'Afriland · UBA',  color: 'from-emerald-500 to-emerald-700', bg: 'bg-emerald-50', text: 'text-emerald-900', icon: Building2 },
]

const IUGET_BANK = {
  bank:    'Afriland First Bank',
  branch:  'Bonabéri – Douala',
  account: 'IUGET-BURSARY',
  number:  '10005-00125-78901234567-19',
  iban:    'CM21 1000 5001 2578 9012 3456 719',
  swift:   'CCEICMCXXXX',
}

const STEPS = [
  { id: 1, label: 'Parent details',  icon: User },
  { id: 2, label: 'Child details',   icon: Baby },
  { id: 3, label: 'Specialty',       icon: GraduationCap },
  { id: 4, label: 'Review & pay',    icon: Wallet },
  { id: 5, label: 'Confirmation',    icon: Check },
]

const fmtFCFA = (n) => n.toLocaleString('en-US') + ' FCFA'
const ref     = (p) => `${p}-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`
const todayISO = () => new Date().toISOString().slice(0, 10)

export default function ParentRegister() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const initialSpec = params.get('specialty') || 'SWE'

  const [step, setStep] = useState(1)
  const [parent, setParent] = useState({ fullName: '', relationship: 'Father', phone: '', email: '', address: '', city: 'Douala' })
  const [child, setChild]   = useState({ fullName: '', dob: '', sex: 'M', nationality: 'Cameroonian', prevSchool: '', average: '' })
  const [program, setProgram] = useState({ specialty: initialSpec, level: 1 })
  const [pay, setPay] = useState({ method: 'momo', amount: TOTAL_FEES })
  const [paid, setPaid] = useState(null)        // { reference, paidAt, method, amount }
  const [enrolment, setEnrolment] = useState(null)  // final student record

  const goNext = () => {
    if (step === 1 && (!parent.fullName || !parent.phone)) { toast.error('Parent name and phone are required'); return }
    if (step === 2 && (!child.fullName  || !child.dob))    { toast.error('Child name and DOB are required'); return }
    setStep((s) => Math.min(5, s + 1))
  }
  const goBack = () => setStep((s) => Math.max(1, s - 1))

  const onPaymentSuccess = ({ reference, method }) => {
    const paidAt = new Date().toISOString()
    setPaid({ reference, method, paidAt, amount: pay.amount })
    const matricule = `IUGET/${new Date().getFullYear()}/${program.specialty}/${String(Math.floor(Math.random() * 900) + 100).padStart(4, '0')}`
    const lastWord  = child.fullName.trim().split(/\s+/).pop().toLowerCase().replace(/[^a-z]/g, '')
    const email     = `${lastWord}.${matricule.split('/').pop()}@iuget.cm`
    setEnrolment({
      matricule,
      email,
      child,
      parent,
      program,
      paymentRef: reference,
      paymentMethod: method,
      enrolledOn: todayISO(),
      initialPassword: `iuget${matricule.slice(-4)}`,
    })
    setStep(5)
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/parent" className="flex items-center gap-3">
            <Logo size={38} />
          </Link>
          <Link to="/parent" className="text-sm text-ink-600 hover:text-brand-700 inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Back to portal
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        <Stepper step={step} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && <ParentStep parent={parent} setParent={setParent} />}
            {step === 2 && <ChildStep  child={child}   setChild={setChild}   />}
            {step === 3 && <SpecialtyStep program={program} setProgram={setProgram} />}
            {step === 4 && <PaymentStep
                              pay={pay} setPay={setPay}
                              parent={parent} child={child} program={program}
                              onSuccess={onPaymentSuccess} />}
            {step === 5 && enrolment && <SuccessStep enrolment={enrolment} paid={paid} />}
          </motion.div>
        </AnimatePresence>

        {step < 4 && (
          <div className="mt-8 flex items-center justify-between">
            <button onClick={goBack} disabled={step === 1} className="btn-secondary disabled:opacity-40">
              <ArrowLeft size={16} /> Back
            </button>
            <button onClick={goNext} className="btn-primary px-6">
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}
        {step === 4 && (
          <div className="mt-6">
            <button onClick={goBack} className="btn-secondary">
              <ArrowLeft size={16} /> Edit details
            </button>
          </div>
        )}
        {step === 5 && (
          <div className="mt-8 flex justify-center gap-3">
            <button onClick={() => { setStep(1); setParent({ fullName: '', relationship: 'Father', phone: '', email: '', address: '', city: 'Douala' }); setChild({ fullName: '', dob: '', sex: 'M', nationality: 'Cameroonian', prevSchool: '', average: '' }); setPaid(null); setEnrolment(null) }} className="btn-secondary">
              Register another child
            </button>
            <Link to="/" className="btn-primary">Back to home</Link>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Stepper ─────────────────────────────────────────────── */
function Stepper({ step }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const Active = s.icon
        const done = step > s.id
        const cur  = step === s.id
        return (
          <li key={s.id} className="flex-1 flex items-center gap-2">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
              done ? 'bg-emerald-600 text-white' :
              cur  ? 'bg-brand-700 text-white ring-4 ring-brand-100' :
                     'bg-white border border-ink-200 text-ink-500'
            }`}>
              {done ? <Check size={16} /> : <Active size={16} />}
            </div>
            <div className="hidden sm:block">
              <div className={`text-[11px] uppercase tracking-wider ${cur ? 'text-brand-700 font-bold' : 'text-ink-500'}`}>Step {s.id}</div>
              <div className={`text-sm ${cur || done ? 'text-ink-900 font-medium' : 'text-ink-500'}`}>{s.label}</div>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 rounded-full ${done ? 'bg-emerald-300' : 'bg-ink-200'}`} />}
          </li>
        )
      })}
    </ol>
  )
}

/* ─── Step 1 — Parent ─────────────────────────────────────── */
function ParentStep({ parent, setParent }) {
  const set = (k, v) => setParent((p) => ({ ...p, [k]: v }))
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-1">
        <User size={20} className="text-brand-600" />
        <h2 className="text-2xl font-display font-bold">Parent / Guardian details</h2>
      </div>
      <p className="text-sm text-ink-500 mb-5">Information that will appear on the receipt and on the student's emergency contact card.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Full name *" value={parent.fullName} onChange={(v) => set('fullName', v)} placeholder="e.g. Mr Tabi Felix" />
        <Field label="Relationship to child" value={parent.relationship} onChange={(v) => set('relationship', v)} as="select" options={['Father', 'Mother', 'Legal guardian', 'Aunt', 'Uncle', 'Brother', 'Sister']} />
        <Field label="Phone *" value={parent.phone} onChange={(v) => set('phone', v)} placeholder="+237 6xx xx xx xx" icon={Phone} />
        <Field label="Email" value={parent.email} onChange={(v) => set('email', v)} placeholder="parent@example.com" icon={Mail} />
        <Field label="Home address" value={parent.address} onChange={(v) => set('address', v)} placeholder="Akwa, Bonabéri…" icon={MapPin} />
        <Field label="City" value={parent.city} onChange={(v) => set('city', v)} as="select" options={['Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Limbe', 'Buea', 'Kribi', 'Garoua', 'Other']} />
      </div>
    </div>
  )
}

/* ─── Step 2 — Child ──────────────────────────────────────── */
function ChildStep({ child, setChild }) {
  const set = (k, v) => setChild((c) => ({ ...c, [k]: v }))
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-1">
        <Baby size={20} className="text-accent-600" />
        <h2 className="text-2xl font-display font-bold">Your child's details</h2>
      </div>
      <p className="text-sm text-ink-500 mb-5">Used to generate the student account, matricule, ID card and tuition record.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Full name *" value={child.fullName} onChange={(v) => set('fullName', v)} placeholder="e.g. Tabi Christabel" />
        <Field label="Date of birth *" type="date" value={child.dob} onChange={(v) => set('dob', v)} />
        <Field label="Sex" as="select" value={child.sex} onChange={(v) => set('sex', v)} options={[['M', 'Male'], ['F', 'Female']]} />
        <Field label="Nationality" value={child.nationality} onChange={(v) => set('nationality', v)} placeholder="Cameroonian" />
        <Field label="Previous school" value={child.prevSchool} onChange={(v) => set('prevSchool', v)} placeholder="Lycée Bilingue de Bonabéri" />
        <Field label="GCE Advanced Level average (%)" value={child.average} onChange={(v) => set('average', v)} placeholder="e.g. 65" />
      </div>
    </div>
  )
}

/* ─── Step 3 — Specialty ──────────────────────────────────── */
function SpecialtyStep({ program, setProgram }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-1">
        <GraduationCap size={20} className="text-brand-600" />
        <h2 className="text-2xl font-display font-bold">Choose specialty & level</h2>
      </div>
      <p className="text-sm text-ink-500 mb-5">All Bachelor specialties share the same evening + Saturday schedule.</p>

      <div className="grid sm:grid-cols-3 gap-3">
        {Object.values(SPECIALTIES).map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setProgram((p) => ({ ...p, specialty: s.id }))}
            className={`text-left p-4 rounded-2xl border-2 transition ${
              program.specialty === s.id ? 'border-brand-500 bg-brand-50 shadow-soft' : 'border-ink-200 hover:border-brand-300 bg-white'
            }`}
          >
            <span className={`${s.pill} text-xs px-2 py-0.5 rounded-full font-semibold inline-block`}>{s.id}</span>
            <div className="font-semibold mt-2 text-sm">{s.name}</div>
            <div className="text-[11px] text-ink-500 mt-0.5">Bachelor of Technology · 3 years</div>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <div className="text-sm font-medium text-ink-700 mb-2">Entry level</div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setProgram((p) => ({ ...p, level: l }))}
              className={`p-3 rounded-xl border transition ${
                program.level === l ? 'border-brand-500 bg-brand-50 text-brand-800 font-semibold' : 'border-ink-200 hover:bg-ink-50'
              }`}
            >
              Level {l}
              <div className="text-[10px] text-ink-500 mt-0.5">
                {l === 1 ? 'Foundations (morning)' : l === 2 ? 'Core (morning)' : 'Specialisation (evening)'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Step 4 — Review & pay ───────────────────────────────── */
function PaymentStep({ pay, setPay, parent, child, program, onSuccess }) {
  const [stage, setStage] = useState('select')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const method = PAY_METHODS.find((m) => m.id === pay.method)

  const startPayment = async () => {
    setError('')
    setProcessing(true)
    setStage('processing')
    try {
      const initResp = await api.request('/payments/initialize', {
        method: 'POST',
        body: { amount: pay.amount, method: method.id, methodName: method.name },
      })
      if (!initResp.success) throw new Error(initResp.message || 'Failed to initialize payment')

      const { authorization_url, access_code, reference, publicKey } = initResp.data

      if (['momo', 'om'].includes(method.id)) {
        const handler = window.PaystackPop?.setup({
          key: publicKey,
          email: parent.email || parent.phone + '@parent.iuget.cm',
          amount: Math.round(pay.amount * 100),
          ref: reference,
          access_code,
          currency: 'XAF',
          channels: ['mobile_money'],
          mobile_money: { provider: method.id === 'momo' ? 'mtn' : 'orange' },
          onSuccess: (txn) => {
            setStage('success')
            setTimeout(() => onSuccess({ reference: txn.reference || reference, method: method.name }), 800)
          },
          onCancel: () => { setStage('select'); setProcessing(false); toast.error('Payment cancelled') },
          onError: (err) => { setStage('select'); setProcessing(false); setError(err?.message || 'Payment failed') },
        })
        if (!handler) {
          window.open(authorization_url, '_blank')
          setStage('select'); setProcessing(false)
          toast.error('Paystack popup blocked. Please allow popups and try again.')
        }
      } else {
        const handler = window.PaystackPop?.setup({
          key: publicKey,
          email: parent.email || parent.phone + '@parent.iuget.cm',
          amount: Math.round(pay.amount * 100),
          ref: reference,
          access_code,
          currency: 'XAF',
          onSuccess: (txn) => {
            setStage('success')
            setTimeout(() => onSuccess({ reference: txn.reference || reference, method: method.name }), 800)
          },
          onCancel: () => { setStage('select'); setProcessing(false); toast.error('Payment cancelled') },
          onError: (err) => { setStage('select'); setProcessing(false); setError(err?.message || 'Payment failed') },
        })
        if (!handler) {
          window.open(authorization_url, '_blank')
          setStage('select'); setProcessing(false)
          toast.error('Paystack popup blocked. Please allow popups and try again.')
        }
      }
    } catch (err) {
      setError(err.message)
      setStage('select')
      setProcessing(false)
    }
  }

  const cancel = () => { setStage('select'); setProcessing(false); setError('') }

  return (
    <div className="space-y-5">
      <div className="card">
        <h2 className="text-2xl font-display font-bold">Review & pay tuition</h2>
        <p className="text-sm text-ink-500 mt-1">Confirm everything, then choose a payment method.</p>

        {/* Review summary */}
        <div className="mt-5 grid md:grid-cols-2 gap-4 text-sm">
          <SummaryBlock title="Parent" rows={[
            ['Name', parent.fullName || '—'],
            ['Relationship', parent.relationship],
            ['Phone', parent.phone || '—'],
            ['Email', parent.email || '—'],
          ]} />
          <SummaryBlock title="Child" rows={[
            ['Name', child.fullName || '—'],
            ['DOB',  child.dob || '—'],
            ['Sex',  child.sex === 'M' ? 'Male' : 'Female'],
            ['Previous school', child.prevSchool || '—'],
          ]} />
          <SummaryBlock title="Programme" rows={[
            ['Specialty', SPECIALTIES[program.specialty]?.name || '—'],
            ['Level', `Level ${program.level}`],
            ['Schedule', program.level === 3 ? 'Mon-Fri 18:00-22:00 + Sat 08:00-17:00' : 'Mon-Fri 08:00-17:00'],
            ['Academic year', '2026 / 2027'],
          ]} />
          <SummaryBlock title="Tuition" rows={FEE_BREAKDOWN.map((f) => [f.item, fmtFCFA(f.value)]).concat([['TOTAL', fmtFCFA(TOTAL_FEES)]])} highlight />
        </div>
      </div>

      <div className="card">
        <h3 className="font-display font-bold text-lg mb-3">Choose a payment method</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PAY_METHODS.map((m) => {
            const Icon = m.icon
            const active = pay.method === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setPay((p) => ({ ...p, method: m.id }))}
                className={`p-3 rounded-2xl border-2 text-left transition ${active ? 'border-brand-500 shadow-soft' : 'border-ink-200 hover:border-brand-300'}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} text-white flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
                <div className="font-semibold mt-2 text-sm">{m.name}</div>
                <div className="text-[11px] text-ink-500 font-mono">{m.subtitle}</div>
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-sm">
          <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-emerald-900">
            <span className="font-semibold">Privacy guarantee:</span> SIARM never stores your PIN, password or card.
            All credentials are sent directly to the provider and erased from memory after the transaction.
          </div>
        </div>

        <button onClick={startPayment} disabled={processing} className="btn-primary w-full mt-5 py-3 text-base">
          <Wallet size={18} /> {processing ? 'Processing…' : 'Proceed to payment · ' + fmtFCFA(pay.amount)}
        </button>
      </div>

      {/* Payment processing / success modal */}
      <AnimatePresence>
        {stage !== 'select' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink-900/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget && stage !== 'processing') cancel() }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${method?.color} text-white p-5 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                    <method.icon size={22} />
                  </div>
                  <div>
                    <div className="font-display font-bold">{method?.name}</div>
                    <div className="text-xs text-white/80">{stage === 'processing' ? 'Processing payment' : stage === 'success' ? 'Payment complete' : ''}</div>
                  </div>
                </div>
                {stage !== 'processing' && (
                  <button onClick={cancel} className="p-1.5 hover:bg-white/15 rounded-lg"><X size={18} /></button>
                )}
              </div>
              <div className="p-6">
                {stage === 'processing' && (
                  <div className="text-center space-y-4 py-6">
                    <Loader2 size={48} className="mx-auto text-brand-800 animate-spin" />
                    <div className="font-display font-bold text-lg">Opening {method?.name}…</div>
                    <div className="text-sm text-ink-500">
                      Paystack checkout will open in a popup. Please complete the payment there.
                    </div>
                  </div>
                )}
                {stage === 'success' && (
                  <div className="text-center space-y-4 py-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={36} />
                    </div>
                    <div className="font-display font-bold text-xl">Payment successful!</div>
                    <div className="text-sm text-ink-500">
                      Your payment via {method?.name} has been confirmed. Redirecting…
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Summary block used in the review step */
function SummaryBlock({ title, rows, highlight }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'border-brand-200 bg-brand-50' : 'border-ink-100 bg-ink-50'}`}>
      <div className={`text-xs font-semibold uppercase tracking-wider ${highlight ? 'text-brand-700' : 'text-ink-500'} mb-2`}>{title}</div>
      <div className="space-y-1">
        {rows.map(([k, v]) => (
          <div key={k} className={`flex justify-between gap-3 text-sm ${k === 'TOTAL' ? 'font-bold text-brand-900 pt-1 border-t border-brand-200 mt-1' : ''}`}>
            <span className="text-ink-600">{k}</span>
            <span className={k === 'TOTAL' ? 'text-brand-800' : 'font-medium'}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', icon: Icon, as, options, disabled }) {
  if (as === 'select') {
    return (
      <div>
        <label className="label">{label}</label>
        <select className="input" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
          {options.map((o) => {
            const [val, lab] = Array.isArray(o) ? o : [o, o]
            return <option key={val} value={val}>{lab}</option>
          })}
        </select>
      </div>
    )
  }
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />}
        {type === 'date' ? (
          <input type="date" className={`input ${Icon ? 'pl-9' : ''}`} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
        ) : (
          <input type={type} className={`input ${Icon ? 'pl-9' : ''}`} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} />
        )}
      </div>
    </div>
  )
}

const PAY_METHODS_ALL = [...PAY_METHODS]

/* ─── Step 5 — Confirmation ───────────────────────────────── */
function SuccessStep({ enrolment, paid }) {
  const receiptRef = useRef()
  const [printing, setPrinting] = useState(false)

  const { matricule, email, child, parent, program, paymentRef, paymentMethod, enrolledOn, initialPassword } = enrolment

  const downloadPDF = async () => {
    if (!receiptRef.current) return
    const t = toast.loading('Generating PDF…')
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pw = pdf.internal.pageSize.getWidth()
      const ph = (canvas.height * pw) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pw, ph)
      pdf.save(`IUGET-Enrolment-${matricule.replace(/\//g, '-')}.pdf`)
      toast.success('PDF downloaded', { id: t })
    } catch { toast.error('Could not generate PDF', { id: t }) }
  }

  const printReceipt = () => {
    setPrinting(true)
    setTimeout(() => { window.print(); setPrinting(false) }, 200)
  }

  const copy = (text, label) => { navigator.clipboard.writeText(text); toast.success(`${label} copied`) }

  return (
    <div className="space-y-5">
      {/* Success hero */}
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
          <CheckCircle2 size={44} />
        </div>
        <h2 className="text-3xl font-display font-bold mt-4">Enrolment complete!</h2>
        <p className="text-ink-500 mt-1">Your child has been registered at IUGET Bonabéri.</p>
      </motion.div>

      {/* Receipt card — also the print target */}
      <div ref={receiptRef} className="card max-w-2xl mx-auto receipt-print">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b-2 border-brand-800">
          <Logo size={44} />
          <div className="text-right">
            <div className="font-display font-bold text-lg text-brand-900">ENROLMENT CONFIRMATION</div>
            <div className="text-xs text-ink-500">IUGET Bonabéri · Bursary Office</div>
          </div>
        </div>

        {/* Key credentials */}
        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div className="text-ink-500">Matricule</div>
          <div className="font-bold font-mono text-right">{matricule}</div>
          <div className="text-ink-500">Email</div>
          <div className="font-mono text-right">{email}</div>
          <div className="text-ink-500">Initial password</div>
          <div className="font-mono text-right">{initialPassword}</div>
          <div className="text-ink-500">Enrolled on</div>
          <div className="font-mono text-right">{new Date(enrolledOn).toLocaleDateString()}</div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm pt-4 border-t border-ink-200">
          <div><span className="text-ink-500">Student</span><div className="font-medium mt-0.5">{child.fullName}</div></div>
          <div><span className="text-ink-500">Program</span><div className="font-medium mt-0.5">{SPECIALTIES[program.specialty]?.name} · Level {program.level}</div></div>
          <div><span className="text-ink-500">Parent</span><div className="font-medium mt-0.5">{parent.fullName}</div></div>
          <div><span className="text-ink-500">Payment</span><div className="font-medium mt-0.5">{paymentMethod} · Ref: <span className="font-mono">{paymentRef}</span></div></div>
        </div>

        <div className="mt-4 pt-4 border-t border-ink-200">
          <div className="flex justify-between items-baseline">
            <span className="text-ink-500">Tuition paid</span>
            <span className="text-3xl font-display font-bold text-brand-800">{fmtFCFA(paid?.amount || TOTAL_FEES)}</span>
          </div>
        </div>

        {/* QR verification */}
        <div className="mt-5 flex items-center justify-between p-4 rounded-xl bg-ink-50">
          <div>
            <div className="text-sm font-semibold">Verify online</div>
            <div className="text-xs text-ink-500 mt-0.5 max-w-[200px]">
              Scan or navigate to this URL to verify your enrolment:
            </div>
            <div className="text-xs font-mono text-brand-800 mt-1 break-all">
              {getEnrollmentVerificationUrl(matricule)}
            </div>
          </div>
          <div className="shrink-0">
            <QRCode value={getEnrollmentVerificationUrl(matricule)} size={72} />
          </div>
        </div>

        <div className="mt-4 text-[10px] text-ink-400 text-center">
          Electronically generated document. Verify at verify.iuget.cm/enrolment/{matricule.replace(/\//g, '')}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 flex-wrap max-w-2xl mx-auto">
        <button onClick={printReceipt} className="btn-secondary"><Printer size={16} /> Print</button>
        <button onClick={downloadPDF} className="btn-primary"><Download size={16} /> Download PDF</button>
        <button onClick={() => copy(matricule, 'Matricule')} className="btn-secondary"><Copy size={16} /> Copy matricule</button>
      </div>
    </div>
  )
}
