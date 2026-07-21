import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Save, Building2, GraduationCap, Banknote, Bell, Settings2, RefreshCw } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'

const STORAGE_KEY = 'siarm_settings'

const DEFAULTS = {
  institution: {
    name: 'Institut Universitaire du Golfe de Guinée',
    shortName: 'IUGET',
    motto: 'Bien choisir c\'est déjà réussir',
    campus: 'Bonabéri · Douala',
    address: 'BP 3000, Bonaberi, Douala, Cameroon',
    phone: '+237 233 456 789',
    email: 'info@iuget.cm',
    website: 'www.iuget.cm',
    logoUrl: '/brand/iuget-logo.png',
  },
  academic: {
    year: '2026 / 2027',
    semester: 'Semester 1',
    termStart: '2026-09-15',
    termEnd: '2027-07-15',
    registrationDeadline: '2026-10-15',
    examStart: '2027-06-01',
    examEnd: '2027-07-01',
  },
  grading: {
    scale: 4.00,
    passMark: 50,
    gradeA: 80,
    gradeBplus: 70,
    gradeB: 60,
    gradeCplus: 55,
    gradeC: 50,
    gradeD: 40,
  },
  fees: {
    tuition: 450000,
    registration: 25000,
    examFee: 15000,
    libraryFee: 8000,
    studentUnion: 2000,
    currency: 'FCFA',
    latePenalty: 25000,
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: false,
    paymentAlerts: true,
    gradeAlerts: true,
    attendanceAlerts: true,
    announcementAlerts: true,
  },
  system: {
    language: 'en',
    timezone: 'Africa/Douala',
    dateFormat: 'DD/MM/YYYY',
    weekStartDay: 'Monday',
    sessionTimeout: 30,
    maintenanceMode: false,
  },
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULTS
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="card space-y-4">
      <h3 className="font-display font-bold flex items-center gap-2 text-lg">
        <Icon size={18} className="text-brand-700" /> {title}
      </h3>
      {children}
    </div>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="label text-xs uppercase tracking-wider text-ink-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState(loadSettings)
  const [activeTab, setActiveTab] = useState('institution')

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)) }, [settings])

  const update = (section, key, value) => {
    setSettings(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }))
  }

  const reset = () => {
    setSettings(DEFAULTS)
    toast.success('Settings reset to defaults')
  }

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    toast.success('Settings saved')
  }

  const tabs = [
    { id: 'institution', label: 'Institution', icon: Building2 },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'fees', label: 'Fee Structure', icon: Banknote },
    { id: 'grading', label: 'Grading', icon: Settings2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  const inst = settings.institution
  const acad = settings.academic
  const grading = settings.grading
  const fees = settings.fees
  const notif = settings.notifications

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution Settings"
        subtitle="Configure SIARM for your university"
        actions={
          <div className="flex gap-2">
            <button onClick={reset} className="btn-secondary"><RefreshCw size={16} /> Reset</button>
            <button onClick={save} className="btn-primary"><Save size={16} /> Save all</button>
          </div>
        }
      />

      <div className="flex gap-1 bg-ink-100 rounded-xl p-1 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition ${
              activeTab === t.id ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
            }`}
          ><t.icon size={14} /> {t.label}</button>
        ))}
      </div>

      {activeTab === 'institution' && (
        <Section icon={Building2} title="Institution Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Institution name"><input className="input" value={inst.name} onChange={e => update('institution', 'name', e.target.value)} /></Field>
            <Field label="Short name"><input className="input" value={inst.shortName} onChange={e => update('institution', 'shortName', e.target.value)} /></Field>
            <Field label="Motto"><input className="input" value={inst.motto} onChange={e => update('institution', 'motto', e.target.value)} /></Field>
            <Field label="Campus"><input className="input" value={inst.campus} onChange={e => update('institution', 'campus', e.target.value)} /></Field>
            <Field label="Phone"><input className="input" value={inst.phone} onChange={e => update('institution', 'phone', e.target.value)} /></Field>
            <Field label="Email"><input className="input" value={inst.email} onChange={e => update('institution', 'email', e.target.value)} /></Field>
            <Field label="Address" className="sm:col-span-2"><input className="input" value={inst.address} onChange={e => update('institution', 'address', e.target.value)} /></Field>
            <Field label="Website"><input className="input" value={inst.website} onChange={e => update('institution', 'website', e.target.value)} /></Field>
          </div>
        </Section>
      )}

      {activeTab === 'academic' && (
        <Section icon={GraduationCap} title="Academic Calendar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Academic year"><input className="input" value={acad.year} onChange={e => update('academic', 'year', e.target.value)} /></Field>
            <Field label="Current semester">
              <select className="input" value={acad.semester} onChange={e => update('academic', 'semester', e.target.value)}>
                <option>Semester 1</option><option>Semester 2</option>
              </select>
            </Field>
            <Field label="Term starts"><input type="date" className="input" value={acad.termStart} onChange={e => update('academic', 'termStart', e.target.value)} /></Field>
            <Field label="Term ends"><input type="date" className="input" value={acad.termEnd} onChange={e => update('academic', 'termEnd', e.target.value)} /></Field>
            <Field label="Registration deadline"><input type="date" className="input" value={acad.registrationDeadline} onChange={e => update('academic', 'registrationDeadline', e.target.value)} /></Field>
            <Field label="Exam start"><input type="date" className="input" value={acad.examStart} onChange={e => update('academic', 'examStart', e.target.value)} /></Field>
            <Field label="Exam end"><input type="date" className="input" value={acad.examEnd} onChange={e => update('academic', 'examEnd', e.target.value)} /></Field>
          </div>
        </Section>
      )}

      {activeTab === 'fees' && (
        <Section icon={Banknote} title="Fee Structure">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Tuition (FCFA)"><input type="number" className="input" value={fees.tuition} onChange={e => update('fees', 'tuition', Number(e.target.value))} /></Field>
            <Field label="Registration (FCFA)"><input type="number" className="input" value={fees.registration} onChange={e => update('fees', 'registration', Number(e.target.value))} /></Field>
            <Field label="Exam fee (FCFA)"><input type="number" className="input" value={fees.examFee} onChange={e => update('fees', 'examFee', Number(e.target.value))} /></Field>
            <Field label="Library fee (FCFA)"><input type="number" className="input" value={fees.libraryFee} onChange={e => update('fees', 'libraryFee', Number(e.target.value))} /></Field>
            <Field label="Student union (FCFA)"><input type="number" className="input" value={fees.studentUnion} onChange={e => update('fees', 'studentUnion', Number(e.target.value))} /></Field>
            <Field label="Late payment penalty (FCFA)"><input type="number" className="input" value={fees.latePenalty} onChange={e => update('fees', 'latePenalty', Number(e.target.value))} /></Field>
            <Field label="Currency"><input className="input" value={fees.currency} onChange={e => update('fees', 'currency', e.target.value)} /></Field>
          </div>
          <div className="bg-brand-50 rounded-xl p-4 mt-4">
            <div className="text-sm font-medium text-brand-800">Total per student: <strong>{(fees.tuition + fees.registration + fees.examFee + fees.libraryFee + fees.studentUnion).toLocaleString()} {fees.currency}</strong></div>
          </div>
        </Section>
      )}

      {activeTab === 'grading' && (
        <Section icon={Settings2} title="Grading System">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="CGPA scale"><input type="number" step="0.01" className="input" value={grading.scale} onChange={e => update('grading', 'scale', Number(e.target.value))} /></Field>
            <Field label="Pass mark (%)"><input type="number" className="input" value={grading.passMark} onChange={e => update('grading', 'passMark', Number(e.target.value))} /></Field>
            <Field label="A from"><input type="number" className="input" value={grading.gradeA} onChange={e => update('grading', 'gradeA', Number(e.target.value))} /></Field>
            <Field label="B+ from"><input type="number" className="input" value={grading.gradeBplus} onChange={e => update('grading', 'gradeBplus', Number(e.target.value))} /></Field>
            <Field label="B from"><input type="number" className="input" value={grading.gradeB} onChange={e => update('grading', 'gradeB', Number(e.target.value))} /></Field>
            <Field label="C+ from"><input type="number" className="input" value={grading.gradeCplus} onChange={e => update('grading', 'gradeCplus', Number(e.target.value))} /></Field>
            <Field label="C from"><input type="number" className="input" value={grading.gradeC} onChange={e => update('grading', 'gradeC', Number(e.target.value))} /></Field>
            <Field label="D from"><input type="number" className="input" value={grading.gradeD} onChange={e => update('grading', 'gradeD', Number(e.target.value))} /></Field>
          </div>
        </Section>
      )}

      {activeTab === 'notifications' && (
        <Section icon={Bell} title="Notification Preferences">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'emailEnabled', label: 'Email notifications' },
              { key: 'smsEnabled', label: 'SMS notifications' },
              { key: 'pushEnabled', label: 'Push notifications' },
            ].map(t => (
              <label key={t.key} className="flex items-center gap-3 p-3 rounded-xl bg-ink-50 cursor-pointer">
                <input type="checkbox" checked={notif[t.key]} onChange={e => update('notifications', t.key, e.target.checked)}
                  className="rounded border-ink-300 text-brand-700 focus:ring-brand-500" />
                <span className="text-sm font-medium">{t.label}</span>
              </label>
            ))}
          </div>
          <div className="border-t border-ink-100 pt-4 mt-4">
            <h4 className="font-semibold text-sm mb-3">Alert triggers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'paymentAlerts', label: 'Payment confirmations' },
                { key: 'gradeAlerts', label: 'Grade published' },
                { key: 'attendanceAlerts', label: 'Attendance warnings' },
                { key: 'announcementAlerts', label: 'New announcements' },
              ].map(t => (
                <label key={t.key} className="flex items-center gap-3 p-3 rounded-lg bg-ink-50 cursor-pointer">
                  <input type="checkbox" checked={notif[t.key]} onChange={e => update('notifications', t.key, e.target.checked)}
                    className="rounded border-ink-300 text-brand-700 focus:ring-brand-500" />
                  <span className="text-sm">{t.label}</span>
                </label>
              ))}
            </div>
          </div>
        </Section>
      )}
    </div>
  )
}
