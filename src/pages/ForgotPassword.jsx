import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Mail, KeyRound, CheckCircle2, ArrowLeft, Lock, Eye, EyeOff, ShieldCheck,
} from 'lucide-react'
import Logo from '@/components/Logo'
import LangToggle from '@/components/LangToggle'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'

/**
 * Three-step forgot-password flow:
 *   1. Enter email → receive token (mock; in production an email is sent)
 *   2. Enter the token + new password
 *   3. Success — return to login
 */
export default function ForgotPassword() {
  const { requestPasswordReset } = useData()
  const { lang } = useLang()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [issuedToken, setIssuedToken] = useState(null)
  const [pwd, setPwd] = useState('')
  const [pwd2, setPwd2] = useState('')
  const [show, setShow] = useState(false)

  const T = {
    title:     lang === 'en' ? 'Reset password' : 'Réinitialiser le mot de passe',
    sub:       lang === 'en' ? 'We\'ll send a reset code to your university email.' : 'Nous envoyons un code de réinitialisation à votre e-mail universitaire.',
    email:     lang === 'en' ? 'Email address' : 'Adresse e-mail',
    send:      lang === 'en' ? 'Send reset code' : 'Envoyer le code',
    sent:      lang === 'en' ? 'Reset code sent' : 'Code envoyé',
    enter:     lang === 'en' ? 'Enter the 8-character code from your email' : 'Entrez le code de 8 caractères reçu par e-mail',
    code:      lang === 'en' ? 'Reset code' : 'Code de réinitialisation',
    newPwd:    lang === 'en' ? 'New password' : 'Nouveau mot de passe',
    confirm:   lang === 'en' ? 'Confirm new password' : 'Confirmez le nouveau mot de passe',
    verify:    lang === 'en' ? 'Set new password' : 'Définir le mot de passe',
    success:   lang === 'en' ? 'Password reset' : 'Mot de passe réinitialisé',
    successSub:lang === 'en' ? 'You can now sign in with your new password.' : 'Vous pouvez maintenant vous connecter avec le nouveau mot de passe.',
    backToLogin: lang === 'en' ? 'Back to sign in' : 'Retour à la connexion',
    note:      lang === 'en'
      ? 'In demo mode the code is shown below. In production it is delivered to the inbox you entered.'
      : 'En mode démo le code est affiché ci-dessous. En production il est envoyé dans votre boîte e-mail.',
  }

  const send = (e) => {
    e.preventDefault()
    if (!email.includes('@')) return toast.error(lang === 'en' ? 'Enter a valid email' : 'Saisissez un e-mail valide')
    const t = requestPasswordReset(email)
    setIssuedToken(t.token)
    setStep(2)
    toast.success(T.sent)
  }

  const reset = (e) => {
    e.preventDefault()
    if (token.toUpperCase() !== issuedToken) {
      return toast.error(lang === 'en' ? 'Invalid reset code' : 'Code invalide')
    }
    if (pwd.length < 6) return toast.error(lang === 'en' ? 'Password must be at least 6 characters' : 'Mot de passe trop court (6 caractères min.)')
    if (pwd !== pwd2)  return toast.error(lang === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas')
    setStep(3)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[linear-gradient(180deg,#fffdf7_0%,#f8f5ee_100%)] p-12 flex-col justify-between border-r border-ink-100">
        <div className="inline-flex items-center bg-white rounded-2xl shadow-soft px-4 py-3 self-start">
          <Logo withText size={52} />
        </div>
        <div>
          <h2 className="text-4xl font-display font-bold text-ink-900">
            {lang === 'en' ? 'Forgot your' : 'Mot de passe'} <br />
            <span className="text-accent-600">{lang === 'en' ? 'password?' : 'oublié ?'}</span>
          </h2>
          <p className="mt-4 text-lg text-ink-600 max-w-md">
            {lang === 'en'
              ? 'It happens. Three quick steps and you\'re back in.'
              : 'Cela arrive. Trois étapes et vous êtes de retour.'}
          </p>
        </div>
        <div className="text-sm text-ink-500">© {new Date().getFullYear()} SIARM · IUGET Bonabéri</div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-ink-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center"><Logo /></div>

          <div className="flex items-center justify-between">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-brand-700">
              <ArrowLeft size={14} /> {T.backToLogin}
            </Link>
            <LangToggle compact />
          </div>

          {/* Stepper */}
          <div className="mt-6 flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full ${step >= s ? 'bg-brand-600' : 'bg-ink-200'}`} />
            ))}
          </div>

          {step === 1 && (
            <form onSubmit={send} className="mt-8 space-y-5">
              <div>
                <h1 className="text-3xl font-display font-bold flex items-center gap-2">
                  <KeyRound className="text-brand-600" /> {T.title}
                </h1>
                <p className="text-ink-500 mt-1.5">{T.sub}</p>
              </div>
              <div>
                <label className="label">{T.email}</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type="email"
                    className="input pl-11"
                    placeholder="you@iuget.cm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3">{T.send}</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={reset} className="mt-8 space-y-5">
              <div>
                <div className="badge-success inline-flex mb-2">
                  <CheckCircle2 size={12} /> {T.sent}
                </div>
                <h1 className="text-2xl font-display font-bold">{T.enter}</h1>
                <p className="text-ink-500 mt-1.5">{email}</p>
                <div className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-200">
                  {T.note}<br />
                  <span className="font-mono font-bold text-lg block mt-2 tracking-widest text-amber-700">{issuedToken}</span>
                </div>
              </div>
              <div>
                <label className="label">{T.code}</label>
                <input
                  className="input font-mono tracking-widest text-center text-lg"
                  placeholder="XXXXXXXX"
                  maxLength={8}
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  autoFocus
                />
              </div>
              <div>
                <label className="label">{T.newPwd}</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type={show ? 'text' : 'password'}
                    className="input pl-11 pr-11"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">{T.confirm}</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type={show ? 'text' : 'password'}
                    className="input pl-11"
                    value={pwd2}
                    onChange={(e) => setPwd2(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3">
                <ShieldCheck size={16} /> {T.verify}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="mt-12 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="text-3xl font-display font-bold mt-4">{T.success}</h1>
              <p className="text-ink-500 mt-2 max-w-sm mx-auto">{T.successSub}</p>
              <Link to="/login" className="btn-primary mt-6 inline-flex">
                {T.backToLogin}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
