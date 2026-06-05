import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  User as UserIcon, Camera, Mail, Phone, Lock, Languages, Moon, Sun, Save,
  ShieldCheck, Bell, CheckCircle2, AlertTriangle, PenLine, Trash2,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'
import PageHeader from '@/components/ui/PageHeader'
import WebcamCapture from '@/components/WebcamCapture'
import SignaturePad  from '@/components/SignaturePad'

export default function Profile() {
  const { user } = useAuth()
  const { theme, toggleTheme, photos = {}, signatures = {}, savePhoto, saveSignature } = useData()
  const { lang, setLang, t } = useLang()

  const [form, setForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '+237 6',
    bio:   user?.bio   || '',
  })
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [twoFA, setTwoFA] = useState(false)
  const [notifyByEmail, setNotifyByEmail] = useState(true)
  const [notifyByPush,  setNotifyByPush]  = useState(true)
  const [showCamera, setShowCamera] = useState(false)
  const photoUrl  = photos[user?.uid] || user?.avatar
  const sigUrl    = signatures[user?.uid]

  const saveProfile = (e) => {
    e.preventDefault()
    toast.success('Profile saved')
  }
  const savePassword = (e) => {
    e.preventDefault()
    if (!pwd.current || !pwd.next) return toast.error('Please fill in all password fields')
    if (pwd.next !== pwd.confirm) return toast.error('Passwords do not match')
    if (pwd.next.length < 6) return toast.error('Password must be at least 6 characters')
    setPwd({ current: '', next: '', confirm: '' })
    toast.success('Password updated')
  }
  const passwordStrength = pwd.next
    ? pwd.next.length < 6 ? 'weak' : pwd.next.length < 10 ? 'medium' : 'strong'
    : null

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('common.profile')}
        subtitle={user?.email || ''}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div className="card text-center">
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-brand-100 to-accent-100 mx-auto overflow-hidden ring-4 ring-white dark:ring-ink-800 shadow-soft">
            <img src={photoUrl} alt={user?.name} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-brand-700 text-white flex items-center justify-center shadow-glow hover:bg-brand-800 transition"
              title={lang === 'en' ? 'Take or upload a photo' : 'Prendre ou importer une photo'}
            >
              <Camera size={16} />
            </button>
          </div>
          <div className="mt-4 font-display font-bold text-xl">{user?.name}</div>
          <div className="text-sm text-ink-500">{user?.email}</div>
          <div className="mt-2 badge-info inline-flex">{user?.role}</div>
        </div>

        {/* Form */}
        <form onSubmit={saveProfile} className="card lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <UserIcon size={20} className="text-brand-600" />
            <h3 className="font-display font-bold text-lg">Personal information</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field icon={UserIcon} label="Full name"   value={form.name}  onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <Field icon={Mail}     label="Email"       value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
            <Field icon={Phone}    label="Phone"       value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
            <div>
              <label className="label">Role</label>
              <input className="input" value={user?.role || ''} disabled />
            </div>
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea
              className="input min-h-[80px]"
              placeholder="A short bio about yourself…"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              <Save size={16} /> {t('common.save')}
            </button>
          </div>
        </form>
      </div>

      {/* Preferences */}
      <div className="card">
        <h3 className="font-display font-bold text-lg mb-4">Preferences</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Language */}
          <div className="rounded-xl border border-ink-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Languages size={20} className="text-brand-600 mt-0.5" />
                <div>
                  <div className="font-medium">Language</div>
                  <div className="text-xs text-ink-500 mt-0.5">{lang === 'en' ? 'English (US)' : 'Français'}</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setLang('en')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${lang === 'en' ? 'bg-brand-700 text-white' : 'bg-ink-50 text-ink-600 hover:bg-ink-100'}`}>EN</button>
                <button onClick={() => setLang('fr')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${lang === 'fr' ? 'bg-brand-700 text-white' : 'bg-ink-50 text-ink-600 hover:bg-ink-100'}`}>FR</button>
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="rounded-xl border border-ink-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {theme === 'dark' ? <Moon size={20} className="text-brand-600 mt-0.5" /> : <Sun size={20} className="text-brand-600 mt-0.5" />}
                <div>
                  <div className="font-medium">Theme</div>
                  <div className="text-xs text-ink-500 mt-0.5">{theme === 'dark' ? t('common.theme.dark') : t('common.theme.light')}</div>
                </div>
              </div>
              <button onClick={toggleTheme} className="btn-secondary text-xs">
                Switch
              </button>
            </div>
          </div>

          {/* Email notifications */}
          <div className="rounded-xl border border-ink-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-emerald-600 mt-0.5" />
                <div>
                  <div className="font-medium">Email notifications</div>
                  <div className="text-xs text-ink-500 mt-0.5">Grades, fees, announcements</div>
                </div>
              </div>
              <Toggle checked={notifyByEmail} onChange={setNotifyByEmail} />
            </div>
          </div>

          {/* Push notifications */}
          <div className="rounded-xl border border-ink-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Bell size={20} className="text-amber-600 mt-0.5" />
                <div>
                  <div className="font-medium">Push notifications</div>
                  <div className="text-xs text-ink-500 mt-0.5">In-browser & mobile</div>
                </div>
              </div>
              <Toggle checked={notifyByPush} onChange={setNotifyByPush} />
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={20} className="text-brand-600" />
          <h3 className="font-display font-bold text-lg">Security</h3>
        </div>

        <form onSubmit={savePassword} className="grid md:grid-cols-3 gap-4">
          <Field icon={Lock} type="password" label="Current password" value={pwd.current} onChange={(v) => setPwd((p) => ({ ...p, current: v }))} />
          <Field icon={Lock} type="password" label="New password"     value={pwd.next}    onChange={(v) => setPwd((p) => ({ ...p, next: v }))} />
          <Field icon={Lock} type="password" label="Confirm new"      value={pwd.confirm} onChange={(v) => setPwd((p) => ({ ...p, confirm: v }))} />
          {passwordStrength && (
            <div className="md:col-span-3 -mt-2 text-xs">
              <span className="text-ink-500">Strength: </span>
              <span className={
                passwordStrength === 'strong' ? 'text-emerald-700 font-medium' :
                passwordStrength === 'medium' ? 'text-amber-700 font-medium' :
                                                'text-red-600 font-medium'
              }>
                {passwordStrength === 'strong' ? '● ● ● strong' : passwordStrength === 'medium' ? '● ● medium' : '● weak'}
              </span>
            </div>
          )}
          <div className="md:col-span-3 flex justify-end gap-2">
            <button type="submit" className="btn-primary">
              <Save size={16} /> Update password
            </button>
          </div>
        </form>

        <div className="mt-6 rounded-xl border border-ink-100 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-brand-600 mt-0.5" />
              <div>
                <div className="font-medium">Two-factor authentication (2FA)</div>
                <div className="text-xs text-ink-500 mt-0.5">Receive a 6-digit code by SMS or email on every new sign-in.</div>
              </div>
            </div>
            <Toggle checked={twoFA} onChange={(v) => { setTwoFA(v); toast.success(v ? '2FA enabled' : '2FA disabled') }} />
          </div>
          {twoFA && (
            <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-900 flex items-start gap-2">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
              You will receive a code on <span className="font-mono ml-1">{form.phone}</span> on your next sign-in.
            </div>
          )}
        </div>

        <div className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          {lang === 'en'
            ? 'SIARM never stores your password in plain text. Passwords are hashed via Firebase Authentication (bcrypt + salt).'
            : 'SIARM ne stocke jamais votre mot de passe en clair. Les mots de passe sont hachés via Firebase Authentication (bcrypt + sel).'}
        </div>
      </div>

      {/* Digital signature */}
      <div className="card">
        <div className="flex items-center gap-2 mb-1">
          <PenLine size={20} className="text-accent-600" />
          <h3 className="font-display font-bold text-lg">
            {lang === 'en' ? 'Digital signature' : 'Signature numérique'}
          </h3>
        </div>
        <p className="text-sm text-ink-500 mb-4">
          {lang === 'en'
            ? 'Draw your signature once. It will appear on every document you sign — results, transcripts, ID cards, receipts.'
            : 'Tracez votre signature une fois. Elle apparaîtra sur tous les documents signés — résultats, relevés, cartes, reçus.'}
        </p>
        {sigUrl ? (
          <div className="rounded-xl border border-ink-200 dark:border-ink-700 bg-white p-3 mb-4 flex items-center justify-between">
            <img src={sigUrl} alt="Signature" className="h-24" />
            <button
              onClick={() => saveSignature(user?.uid, null)}
              className="btn-ghost text-sm text-red-600"
            >
              <Trash2 size={14} /> {lang === 'en' ? 'Remove' : 'Supprimer'}
            </button>
          </div>
        ) : (
          <SignaturePad
            width={520}
            height={180}
            onSave={(dataUrl) => saveSignature(user?.uid, dataUrl)}
            label={lang === 'en' ? 'Draw with your mouse or finger' : 'Tracez avec la souris ou le doigt'}
          />
        )}
      </div>

      {showCamera && (
        <WebcamCapture
          onCapture={(dataUrl) => savePhoto(user?.uid, dataUrl)}
          onClose={() => setShowCamera(false)}
          initial={photoUrl}
        />
      )}
    </div>
  )
}

function Field({ icon: Icon, label, value, onChange, type = 'text' }) {
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
        />
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition ${checked ? 'bg-brand-600' : 'bg-ink-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${checked ? 'translate-x-5' : ''}`} />
    </button>
  )
}
