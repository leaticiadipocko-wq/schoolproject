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
    // Generate the final student record
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
      {/* Top nav */}
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

      {/* Stepper */}
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

        {/* Bottom nav (hidden on payment & success which have their own CTAs) */}
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
  const [stage, setStage] = useState('select')  // select | enter-phone | enter-password | processing | success
  const [phone, setPhone]   = useState('')
  const [pwd, setPwd]       = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [reference, setReference] = useState(null)

  const method = PAY_METHODS.find((m) => m.id === pay.method)

  const startPayment = () => {
    setReference(ref(method.id.toUpperCase()))
    if (method.id === 'momo' || method.id === 'om') {
      setStage('enter-phone')
    } else if (method.id === 'paypal') {
      setStage('enter-password')  // PayPal asks email + password — we'll reuse password stage
    } else if (method.id === 'visa') {
      setStage('enter-password')  // Visa 3DS — we'll show a card form
    } else {
      // bank transfer — show the bank details and stop
      setStage('bank')
    }
  }

  const confirmPhone = () => {
    if (!/^\d{8,12}$/.test(phone.replace(/\s+/g, ''))) return toast.error('Enter a valid Cameroonian phone number')
    setStage('enter-password')
  }

  const submitPassword = async () => {
    if (!pwd) return toast.error('PIN / password is required')
    // ── PRIVACY: we never persist pwd anywhere
    setStage('processing')
    await new Promise((r) => setTimeout(r, 2200))
    setPwd('')           // <- erase immediately after the simulated send
    setStage('success')
    setTimeout(() => onSuccess({ reference, method: method.name }), 1400)
  }

  const cancel = () => { setStage('select'); setPhone(''); setPwd(''); setReference(null) }

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

        <button onClick={startPayment} className="btn-primary w-full mt-5 py-3 text-base">
          <Wallet size={18} /> Proceed to payment · {fmtFCFA(pay.amount)}
        </button>
      </div>

      {/* USSD / payment modal */}
      <AnimatePresence>
        {stage !== 'select' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink-900/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget && stage !== 'processing' && stage !== 'success') cancel() }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Provider header */}
              <div className={`bg-gradient-to-br ${method.color} text-white p-5 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                    <method.icon size={22} />
                  </div>
                  <div>
                    <div className="font-display font-bold">{method.name}</div>
                    <div className="text-xs text-white/80 font-mono">Ref · {reference}</div>
                  </div>
                </div>
                {stage !== 'processing' && stage !== 'success' && (
                  <button onClick={cancel} className="p-1.5 hover:bg-white/15 rounded-lg"><X size={18} /></button>
                )}
              </div>

              {/* Body — driven by stage */}
              <div className="p-6">
                {stage === 'enter-phone' && (
                  <USSDPhonePane method={method} phone={phone} setPhone={setPhone} confirm={confirmPhone} cancel={cancel} amount={pay.amount} />
                )}
                {stage === 'enter-password' && method.id === 'paypal' && (
                  <PayPalPane pwd={pwd} setPwd={setPwd} showPwd={showPwd} setShowPwd={setShowPwd} submit={submitPassword} cancel={cancel} amount={pay.amount} />
                )}
                {stage === 'enter-password' && method.id === 'visa' && (
                  <VisaPane pwd={pwd} setPwd={setPwd} showPwd={showPwd} setShowPwd={setShowPwd} submit={submitPassword} cancel={cancel} amount={pay.amount} />
                )}
                {stage === 'enter-password' && (method.id === 'momo' || method.id === 'om') && (
                  <PinPane method={method} phone={phone} pwd={pwd} setPwd={setPwd} showPwd={showPwd} setShowPwd={setShowPwd} submit={submitPassword} cancel={cancel} amount={pay.amount} />
                )}
                {stage === 'bank' && (
                  <BankPane reference={reference} amount={pay.amount} confirm={() => onSuccess({ reference, method: method.name })} cancel={cancel} />
                )}
                {stage === 'processing' && <ProcessingPane method={method} amount={pay.amount} />}
                {stage === 'success'    && <PaymentSuccessPane method={method} reference={reference} amount={pay.amount} />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* USSD phone-entry pane (MoMo / OM) */
function USSDPhonePane({ method, phone, setPhone, confirm, cancel, amount }) {
  return (
    <>
      {/* USSD-style screen */}
      <div className="bg-ink-900 text-emerald-300 font-mono text-sm rounded-xl p-4 mb-4">
        <div className="text-ink-400">{method.id === 'momo' ? 'MTN Cameroon' : 'Orange Cameroun'}</div>
        <div className="mt-1">› Dialled {method.prefix}</div>
        <div className="mt-3">{method.id === 'momo' ? 'Welcome to MTN MoMo' : 'Bienvenue sur Orange Money'}</div>
        <div className="mt-3">› 1. Send money</div>
        <div>› <span className="text-amber-300">2. Pay merchant</span></div>
        <div>› 3. Buy airtime</div>
        <div className="mt-3 text-amber-300">Selected: Pay merchant</div>
        <div className="mt-2">Merchant code: <span className="text-white">IUGET-BURSARY</span></div>
        <div>Amount: <span className="text-white">{fmtFCFA(amount)}</span></div>
        <div className="mt-3">→ Enter your phone number</div>
      </div>

      <div className="mb-4">
        <label className="label">Your {method.id === 'momo' ? 'MTN' : 'Orange'} number</label>
        <div className="relative">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-9 font-mono"
            placeholder={method.id === 'momo' ? '67xxxxxxx' : '69xxxxxxx'}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            autoFocus
          />
        </div>
        <div className="text-[11px] text-ink-500 mt-1">9 digits, no country code · e.g. {method.id === 'momo' ? '670123456' : '691234567'}</div>
      </div>

      <div className="flex gap-2">
        <button onClick={cancel} className="btn-secondary flex-1">Cancel</button>
        <button onClick={confirm} className="btn-primary flex-1">Continue <ArrowRight size={16} /></button>
      </div>
    </>
  )
}

/* PIN entry — MoMo/OM */
function PinPane({ method, phone, pwd, setPwd, showPwd, setShowPwd, submit, cancel, amount }) {
  return (
    <>
      <div className="bg-ink-900 text-emerald-300 font-mono text-sm rounded-xl p-4 mb-4">
        <div className="text-ink-400">{method.id === 'momo' ? 'MTN MoMo' : 'Orange Money'}</div>
        <div className="mt-2">You will pay <span className="text-white">{fmtFCFA(amount)}</span></div>
        <div>To <span className="text-white">IUGET BURSARY</span></div>
        <div>From <span className="text-white">+237 {phone}</span></div>
        <div className="mt-3 text-amber-300">→ Confirm with your PIN</div>
      </div>

      <div className="mb-2">
        <label className="label">Your PIN</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type={showPwd ? 'text' : 'password'}
            className="input pl-9 pr-10 font-mono tracking-[0.5em] text-center"
            placeholder="••••"
            maxLength={6}
            value={pwd}
            onChange={(e) => setPwd(e.target.value.replace(/\D/g, ''))}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
          >
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <PrivacyHint />

      <div className="mt-4 flex gap-2">
        <button onClick={cancel} className="btn-secondary flex-1">Cancel</button>
        <button onClick={submit} className="btn-primary flex-1">Confirm payment</button>
      </div>
    </>
  )
}

/* PayPal pane */
function PayPalPane({ pwd, setPwd, showPwd, setShowPwd, submit, cancel, amount }) {
  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm">
        <div className="font-semibold text-blue-900">Pay with PayPal</div>
        <div className="text-blue-700 mt-1">Total: <span className="font-bold">${(amount / 600).toFixed(2)} USD</span> ({fmtFCFA(amount)})</div>
        <div className="text-blue-700 mt-1">Recipient: <span className="font-mono">bursary@iuget.cm</span></div>
      </div>

      <Field label="PayPal email" value="parent@example.com" onChange={() => {}} disabled />
      <div className="mt-3">
        <label className="label">PayPal password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type={showPwd ? 'text' : 'password'}
            className="input pl-9 pr-10"
            placeholder="Your PayPal password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            autoFocus
          />
          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <PrivacyHint />

      <div className="mt-4 flex gap-2">
        <button onClick={cancel} className="btn-secondary flex-1">Cancel</button>
        <button onClick={submit} className="btn-primary flex-1">Log in & pay</button>
      </div>
    </>
  )
}

/* Visa / Mastercard pane */
function VisaPane({ pwd, setPwd, showPwd, setShowPwd, submit, cancel, amount }) {
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  return (
    <>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-sm">
        <div className="font-semibold text-slate-900">3-D Secure verification</div>
        <div className="text-slate-700 mt-1">Total: <span className="font-bold">{fmtFCFA(amount)}</span> · Merchant <span className="font-mono">IUGET-BURSARY</span></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Field label="Card number" value={card.replace(/(\d{4})(?=\d)/g, '$1 ').trim()} onChange={(v) => setCard(v.replace(/\D/g, '').slice(0, 16))} placeholder="•••• •••• •••• ••••" /></div>
        <Field label="Expiry (MM/YY)" value={expiry} onChange={(v) => setExpiry(v.replace(/[^\d/]/g, ''))} placeholder="12/27" />
        <Field label="CVC" value={cvc} onChange={(v) => setCvc(v.replace(/\D/g, '').slice(0, 4))} placeholder="•••" />
      </div>
      <div className="mt-3">
        <label className="label">3-D Secure password (one-time)</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type={showPwd ? 'text' : 'password'}
            className="input pl-9 pr-10 font-mono tracking-widest"
            placeholder="• • • • • •"
            value={pwd}
            onChange={(e) => setPwd(e.target.value.replace(/\D/g, '').slice(0, 6))}
            autoFocus
          />
          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <PrivacyHint />

      <div className="mt-4 flex gap-2">
        <button onClick={cancel} className="btn-secondary flex-1">Cancel</button>
        <button onClick={submit} className="btn-primary flex-1">Verify & pay</button>
      </div>
    </>
  )
}

/* Bank transfer pane */
function BankPane({ reference, amount, confirm, cancel }) {
  const copy = (text) => { navigator.clipboard.writeText(text); toast.success('Copied') }
  return (
    <>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 text-sm">
        <div className="font-semibold text-emerald-900">IUGET bursary bank account</div>
        <div className="text-emerald-700 mt-1">Reference your transfer with <span className="font-mono font-bold">{reference}</span></div>
      </div>
      <div className="space-y-2.5">
        {[
          ['Bank',    IUGET_BANK.bank],
          ['Branch',  IUGET_BANK.branch],
          ['Account', IUGET_BANK.account],
          ['Number',  IUGET_BANK.number],
          ['IBAN',    IUGET_BANK.iban],
          ['SWIFT',   IUGET_BANK.swift],
          ['Amount',  fmtFCFA(amount)],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-ink-50">
            <div className="text-xs text-ink-500 uppercase">{k}</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{v}</span>
              <button onClick={() => copy(v)} className="text-ink-400 hover:text-brand-700" title="Copy">
                <Copy size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-ink-500 mt-3">
        The bursary office will validate the transfer within 24-48 hours and issue your receipt.
      </p>

      <div className="mt-4 flex gap-2">
        <button onClick={cancel} className="btn-secondary flex-1">Cancel</button>
        <button onClick={confirm} className="btn-primary flex-1">I have transferred</button>
      </div>
    </>
  )
}

/* Processing pane */
function ProcessingPane({ method, amount }) {
  return (
    <div className="text-center py-6">
      <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${method.color} text-white flex items-center justify-center`}>
        <Loader2 className="animate-spin" size={28} />
      </div>
      <div className="mt-4 font-display font-bold text-lg">Processing payment…</div>
      <div className="text-sm text-ink-500 mt-1">Securely contacting {method.name}</div>
      <div className="text-xs text-ink-400 mt-3 font-mono">Amount {fmtFCFA(amount)}</div>
      <div className="mt-4 flex justify-center gap-1.5 text-ink-400 text-xs">
        <span>Encrypting</span>·<span>Authenticating</span>·<span>Authorising</span>
      </div>
    </div>
  )
}

/* Payment-success pane (inside the modal) — before we jump to the big confirmation screen */
function PaymentSuccessPane({ method, reference, amount }) {
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 14 }}
        className="mx-auto w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center"
      >
        <CheckCircle2 size={42} />
      </motion.div>
      <div className="mt-4 text-2xl font-display font-bold text-emerald-700">SUCCESSFUL PAYMENT</div>
      <div className="text-sm text-ink-500 mt-1">Your payment of <span className="font-bold">{fmtFCFA(amount)}</span> via {method.name} was accepted.</div>
      <div className="text-xs text-ink-400 mt-2 font-mono">Reference {reference}</div>
      <div className="mt-4 text-xs text-ink-500">Issuing your registration confirmation…</div>
    </div>
  )
}

function PrivacyHint() {
  return (
    <div className="mt-3 flex items-start gap-2 text-[11px] text-ink-500">
      <ShieldCheck size={12} className="text-emerald-600 mt-0.5 shrink-0" />
      <span>SIARM never stores this password — it is forwarded to the provider and erased from memory.</span>
    </div>
  )
}

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
        <input
          type={type}
          className={`input ${Icon ? 'pl-9' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

/* ─── Step 5 — Final confirmation + receipt ───────────────── */
function SuccessStep({ enrolment, paid }) {
  const printRef = useRef()

  const print = () => window.print()
  const downloadPDF = async () => {
    const t = toast.loading('Generating receipt PDF…')
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2, backgroundColor: '#ffffff' })
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const w = pdf.internal.pageSize.getWidth()
      const h = (canvas.height * w) / canvas.width
      pdf.addImage(img, 'PNG', 0, 0, w, h)
      pdf.save(`IUGET-Registration-${enrolment.matricule.replace(/\//g, '-')}.pdf`)
      toast.success('Receipt saved', { id: t })
    } catch (err) {
      toast.error('Could not generate PDF', { id: t })
    }
  }

  return (
    <div className="space-y-5">
      {/* Big success banner */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="card bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-0 text-center py-10"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
          className="mx-auto w-20 h-20 rounded-full bg-white text-emerald-600 flex items-center justify-center"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="mt-4 text-3xl md:text-4xl font-display font-bold">Student registered successfully</h2>
        <p className="text-white/90 mt-2 max-w-2xl mx-auto">
          {enrolment.child.fullName} is officially enrolled at IUGET Bonabéri.
          Login credentials and registration details are below.
        </p>
        <div className="mt-5 flex justify-center gap-3 flex-wrap">
          <button onClick={print} className="bg-white text-emerald-700 hover:bg-white/90 px-5 py-2.5 rounded-xl font-medium inline-flex items-center gap-2">
            <Printer size={16} /> Print receipt
          </button>
          <button onClick={downloadPDF} className="bg-white/15 hover:bg-white/25 px-5 py-2.5 rounded-xl font-medium inline-flex items-center gap-2">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </motion.div>

      {/* Printable receipt */}
      <div ref={printRef} className="bg-white border border-ink-100 rounded-2xl p-8 print-section">
        {/* Letterhead */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-brand-800">
          <div className="flex items-start gap-4">
            <Logo size={56} withText={false} />
            <div>
              <div className="font-display font-bold text-lg text-ink-900">Institut Universitaire du Golfe de Guinée</div>
              <div className="text-xs text-ink-600">Bonabéri Campus · Douala, Cameroon · www.iuget.cm</div>
              <div className="text-xs text-ink-500 italic mt-0.5">« Bien choisir c'est déjà réussir »</div>
            </div>
          </div>
          <div className="text-right text-xs text-ink-600">
            <div className="font-bold text-base text-ink-900">OFFICIAL ENROLMENT RECEIPT</div>
            <div className="font-mono text-[11px] mt-1">N° {enrolment.matricule.replace(/\//g, '·')}</div>
            <div className="font-mono text-[11px]">Issued {new Date(paid.paidAt).toLocaleString('en-GB')}</div>
          </div>
        </div>

        {/* Big matricule */}
        <div className="mt-5 rounded-xl bg-brand-50 border border-brand-100 p-4">
          <div className="text-xs text-brand-700 uppercase tracking-wider">Matricule attributed</div>
          <div className="text-2xl md:text-3xl font-display font-bold text-brand-900 font-mono tracking-wider mt-1">{enrolment.matricule}</div>
        </div>

        {/* Student details */}
        <div className="mt-6">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-800">Student details</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm mt-2">
            <Row k="Full name"    v={enrolment.child.fullName} />
            <Row k="Date of birth"v={new Date(enrolment.child.dob).toLocaleDateString('en-GB')} />
            <Row k="Sex"          v={enrolment.child.sex === 'M' ? 'Male' : 'Female'} />
            <Row k="Nationality"  v={enrolment.child.nationality} />
            <Row k="Previous school" v={enrolment.child.prevSchool || '—'} />
            <Row k="Average (GCE A/L)" v={enrolment.child.average ? `${enrolment.child.average}%` : '—'} />
            <Row k="Specialty"    v={SPECIALTIES[enrolment.program.specialty]?.name} />
            <Row k="Level"        v={`Level ${enrolment.program.level} · Year 2026/2027`} />
            <Row k="University email" v={enrolment.email} />
            <Row k="Initial password" v={enrolment.initialPassword} mono />
          </div>
        </div>

        {/* Parent details */}
        <div className="mt-6">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-800">Parent / Guardian</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm mt-2">
            <Row k="Name"         v={enrolment.parent.fullName} />
            <Row k="Relationship" v={enrolment.parent.relationship} />
            <Row k="Phone"        v={enrolment.parent.phone} />
            <Row k="Email"        v={enrolment.parent.email || '—'} />
            <Row k="Address"      v={`${enrolment.parent.address || '—'}, ${enrolment.parent.city}`} />
          </div>
        </div>

        {/* Payment summary */}
        <div className="mt-6">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-800">Payment received</div>
          <table className="w-full text-sm border border-ink-200 mt-2">
            <tbody>
              {FEE_BREAKDOWN.map((f) => (
                <tr key={f.item} className="border-b border-ink-100">
                  <td className="p-2">{f.item}</td>
                  <td className="p-2 text-right font-medium">{fmtFCFA(f.value)}</td>
                </tr>
              ))}
              <tr className="bg-emerald-50">
                <td className="p-2 font-bold">TOTAL PAID</td>
                <td className="p-2 text-right font-bold text-emerald-700">{fmtFCFA(paid.amount)}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
            <div><span className="text-ink-500">Method:</span> <span className="font-medium">{paid.method}</span></div>
            <div><span className="text-ink-500">Reference:</span> <span className="font-mono font-medium">{paid.reference}</span></div>
            <div><span className="text-ink-500">Status:</span> <span className="text-emerald-700 font-bold">PAID</span></div>
          </div>
        </div>

        {/* Note + signatures */}
        <div className="mt-6 rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-900">
          The parent / guardian may request a stamped duplicate of this receipt at the bursary office.
          Bring this document on first day of class. Welcome to IUGET! 🎓
        </div>

        <div className="mt-6 pt-6 border-t border-ink-200 grid grid-cols-3 gap-6 text-xs text-ink-600">
          <div>
            <div className="h-10" />
            <div className="border-t border-ink-400 pt-1.5">Parent signature</div>
          </div>
          <div>
            <div className="h-10" />
            <div className="border-t border-ink-400 pt-1.5">Bursar signature</div>
          </div>
          <div>
            <div className="h-10" />
            <div className="border-t border-ink-400 pt-1.5">Official seal</div>
          </div>
        </div>
        <div className="mt-4 text-[9px] text-ink-400 text-center">
          Generated by SIARM · Verify at verify.iuget.cm/{enrolment.matricule.split('/').pop()} · Privacy: SIARM never stores parent passwords or card details
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; width: 100%; border: none; padding: 20mm; box-shadow: none; border-radius: 0; }
        }
      `}</style>
    </div>
  )
}

function Row({ k, v, mono }) {
  return (
    <div className="flex gap-2">
      <span className="text-ink-500 min-w-[120px]">{k}:</span>
      <span className={`font-medium ${mono ? 'font-mono' : ''}`}>{v}</span>
    </div>
  )
}
