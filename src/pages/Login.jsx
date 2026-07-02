import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Info, X, KeyRound, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { roleHome } from '@/lib/roles'
import Logo from '@/components/Logo'
import { useLang } from '@/context/LanguageContext'
import LangToggle from '@/components/LangToggle'

const DEMO_ACCOUNTS = [
  { label: 'Student',   email: 'student@iuget.cm',   color: 'bg-brand-100 text-brand-800' },
  { label: 'Lecturer',  email: 'lecturer@iuget.cm',  color: 'bg-accent-100 text-accent-700' },
  { label: 'Staff',     email: 'staff@iuget.cm',     color: 'bg-amber-100 text-amber-700' },
  { label: 'Admin',     email: 'admin@iuget.cm',     color: 'bg-emerald-100 text-emerald-700' },
]

export default function Login() {
  const { login, demoMode } = useAuth()
  const { requestPasswordReset } = useData()
  const { t, lang, toggle } = useLang()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)

  const from = location.state?.from?.pathname

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error(t('login.error.empty'))
    setLoading(true)
    try {
      const u = await login(email, password)
      toast.success(t('login.success', { name: u.name?.split(' ')[0] || '' }))
      navigate(from || roleHome(u.role), { replace: true })
    } catch (err) {
      toast.error(err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (acc) => {
    setEmail(acc.email)
    setPassword('password')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[linear-gradient(180deg,#fffdf7_0%,#f8f5ee_100%)] text-ink-900 p-12 flex-col justify-between border-r border-ink-100">
        {/* Logo on a white card so the IUGET emblem stays vivid */}
        <div className="inline-flex items-center bg-white rounded-2xl shadow-soft px-4 py-3 self-start">
          <Logo withText size={52} />
        </div>

        <div>
          <h2 className="text-5xl font-display font-bold leading-tight text-ink-900">
            {t('login.welcomeBack')} <br />
            <span className="text-accent-600">{t('login.tagline')}</span>
          </h2>
          <p className="mt-6 text-lg text-ink-600 max-w-md">
            {t('login.welcomeSub')}
          </p>
          <p className="mt-4 text-sm italic text-accent-700 font-medium">
            « Bien choisir c'est déjà réussir » — IUGET
          </p>
        </div>

        <div className="text-sm text-ink-500">© {new Date().getFullYear()} SIARM · IUGET Bonabéri</div>

        {/* Decorative warm blobs — gentle, never overpowering the logo */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-ink-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center"><Logo /></div>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-display font-bold">{t('login.title')}</h1>
            <LangToggle compact />
          </div>
          <p className="text-ink-500 mt-1.5">{t('login.subtitle')}</p>

          {demoMode && (
            <div className="mt-6 p-4 rounded-xl bg-brand-50 border border-brand-100 text-sm">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-brand-900">{t('login.demoMode')}</div>
                  <div className="text-brand-700 mt-0.5">{t('login.demoMode.sub')}</div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {DEMO_ACCOUNTS.map((a) => (
                      <button
                        key={a.email}
                        type="button"
                        onClick={() => fillDemo(a)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium hover:opacity-80 transition ${a.color}`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">{t('login.email')}</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  className="input pl-11"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label">{t('login.password')}</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={show ? 'text' : 'password'}
                  className="input pl-11 pr-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-600">
                <input type="checkbox" className="rounded border-ink-300" />
                {t('login.rememberMe')}
              </label>
              <button type="button" onClick={() => setShowForgot(true)} className="text-brand-600 hover:underline">{t('login.forgot')}</button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? t('login.signing') : <>{t('common.signIn')} <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-600">
            {t('login.newAccount')}{' '}
            <Link to="/register" className="text-brand-600 font-medium hover:underline">
              {t('login.createAccount')}
            </Link>
          </div>
          <div className="mt-3 text-center">
            <Link to="/parent" className="text-sm text-accent-700 hover:underline font-medium">
              {t('login.parentCta')}
            </Link>
          </div>
        </div>
      </div>

      {showForgot && (
        <ForgotPasswordModal
          lang={lang}
          initialEmail={email}
          onClose={() => setShowForgot(false)}
          onRequest={(addr) => requestPasswordReset(addr)}
        />
      )}
    </div>
  )
}

function ForgotPasswordModal({ lang, initialEmail, onClose, onRequest }) {
  const [step, setStep] = useState(1)        // 1: email, 2: confirm, 3: new password
  const [addr, setAddr] = useState(initialEmail || '')
  const [token, setToken] = useState(null)
  const [pwd, setPwd] = useState('')
  const [confirm, setConfirm] = useState('')

  const T = {
    title:   lang === 'en' ? 'Reset your password' : 'Réinitialiser votre mot de passe',
    email:   lang === 'en' ? 'Your university email' : 'Votre e-mail universitaire',
    send:    lang === 'en' ? 'Send reset link' : 'Envoyer le lien',
    sent:    lang === 'en' ? 'Reset link sent' : 'Lien envoyé',
    sentDetail: lang === 'en'
      ? 'In a production deployment, an email would be sent. For this demo, here is the one-time token:'
      : 'En production, un e-mail serait envoyé. Voici le jeton à usage unique pour la démo :',
    use:     lang === 'en' ? 'Use this token' : 'Utiliser ce jeton',
    newPwd:  lang === 'en' ? 'New password' : 'Nouveau mot de passe',
    confirm: lang === 'en' ? 'Confirm new password' : 'Confirmer le nouveau mot de passe',
    reset:   lang === 'en' ? 'Reset password' : 'Réinitialiser',
    cancel:  lang === 'en' ? 'Cancel' : 'Annuler',
    success: lang === 'en' ? 'Password updated. You can now sign in.' : 'Mot de passe mis à jour. Vous pouvez vous connecter.',
    weak:    lang === 'en' ? 'Use at least 8 characters' : 'Utilisez au moins 8 caractères',
    mismatch: lang === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas',
  }

  return (
    <div className="fixed inset-0 bg-ink-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white dark:bg-ink-900 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound size={20} className="text-brand-600" />
            <h2 className="font-display font-bold text-lg">{T.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="label">{T.email}</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input className="input pl-9" type="email" placeholder="you@iuget.cm" value={addr} onChange={(e) => setAddr(e.target.value)} autoFocus />
                </div>
              </div>
              <button
                onClick={() => {
                  if (!addr) return toast.error(lang === 'en' ? 'Email required' : 'E-mail requis')
                  const { token } = onRequest(addr)
                  setToken(token)
                  setStep(2)
                }}
                className="btn-primary w-full"
              >
                <ArrowRight size={14} /> {T.send}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
                <div className="font-display font-bold mt-3">{T.sent}</div>
                <div className="text-sm text-ink-600 dark:text-ink-300 mt-2">{T.sentDetail}</div>
                <div className="mt-3 mx-auto bg-ink-100 dark:bg-ink-800 rounded-xl p-3 inline-block">
                  <code className="font-mono text-lg font-bold tracking-widest text-brand-700">{token}</code>
                </div>
                <div className="text-[11px] text-ink-500 mt-2">
                  {lang === 'en' ? 'Expires in 30 minutes' : 'Expire dans 30 minutes'}
                </div>
              </div>
              <button onClick={() => setStep(3)} className="btn-primary w-full">
                <ArrowRight size={14} /> {T.use}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="label">{T.newPwd}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input type="password" className="input pl-9" value={pwd} onChange={(e) => setPwd(e.target.value)} autoFocus />
                </div>
              </div>
              <div>
                <label className="label">{T.confirm}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input type="password" className="input pl-9" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                </div>
              </div>
              <button
                onClick={() => {
                  if (pwd.length < 8)  return toast.error(T.weak)
                  if (pwd !== confirm) return toast.error(T.mismatch)
                  toast.success(T.success)
                  onClose()
                }}
                className="btn-primary w-full"
              >
                <CheckCircle2 size={14} /> {T.reset}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
