import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, User, ArrowRight, GraduationCap, BookOpen, Briefcase, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { roleHome, ROLES } from '@/lib/roles'
import Logo from '@/components/Logo'
import { useLang } from '@/context/LanguageContext'
import LangToggle from '@/components/LangToggle'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const { t, lang } = useLang()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(ROLES.STUDENT)
  const [loading, setLoading] = useState(false)

  const ROLE_CARDS = [
    { id: ROLES.STUDENT,  icon: GraduationCap, title: lang === 'en' ? 'Student' : 'Étudiant',  desc: lang === 'en' ? 'Learn, view results, track attendance.' : 'Apprendre, voir les résultats, suivre les présences.' },
    { id: ROLES.LECTURER, icon: BookOpen,      title: lang === 'en' ? 'Lecturer' : 'Enseignant', desc: lang === 'en' ? 'Teach, grade, manage classes.' : 'Enseigner, noter, gérer les cours.' },
    { id: ROLES.STAFF,    icon: Briefcase,     title: lang === 'en' ? 'Staff' : 'Personnel',    desc: lang === 'en' ? 'Operate the registrar and bursary.' : 'Gérer le secrétariat et la bourse.' },
    { id: ROLES.ADMIN,    icon: ShieldCheck,   title: lang === 'en' ? 'Admin' : 'Direction',    desc: lang === 'en' ? 'Lead with analytics and insights.' : 'Piloter avec des analyses et des données.' },
  ]

  const T = {
    title: lang === 'en' ? 'Create your account' : 'Créez votre compte',
    subtitle: lang === 'en' ? 'Choose your role and join the platform.' : 'Choisissez votre rôle et rejoignez la plateforme.',
    roleLabel: lang === 'en' ? 'I am a…' : 'Je suis…',
    fullName: lang === 'en' ? 'Full name' : 'Nom complet',
    email: lang === 'en' ? 'Email' : 'E-mail',
    password: lang === 'en' ? 'Password' : 'Mot de passe',
    passwordHint: lang === 'en' ? 'At least 6 characters' : 'Au moins 6 caractères',
    creating: lang === 'en' ? 'Creating account…' : 'Création du compte…',
    submit: lang === 'en' ? 'Create account' : 'Créer le compte',
    hasAccount: lang === 'en' ? 'Already have an account?' : 'Vous avez déjà un compte ?',
    signIn: lang === 'en' ? 'Sign in' : 'Se connecter',
    fillError: lang === 'en' ? 'Please fill in all fields' : 'Veuillez remplir tous les champs',
    pwdError: lang === 'en' ? 'Password must be at least 6 characters' : 'Le mot de passe doit comporter au moins 6 caractères',
    welcome: lang === 'en' ? 'Welcome to SIARM, {name}!' : 'Bienvenue sur SIARM, {name} !',
    regError: lang === 'en' ? 'Registration failed' : 'Échec de l\'inscription',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) return toast.error(T.fillError)
    if (password.length < 6) return toast.error(T.pwdError)
    setLoading(true)
    try {
      const u = await register({ name, email, password, role })
      toast.success(T.welcome.replace('{name}', u.name.split(' ')[0]))
      navigate(roleHome(u.role), { replace: true })
    } catch (err) {
      toast.error(err.message || T.regError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <Logo />
            <LangToggle compact />
          </div>
        </div>

        <div className="card">
          <h1 className="text-3xl font-display font-bold">{T.title}</h1>
          <p className="text-ink-500 mt-1.5">{T.subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Role selector */}
            <div>
              <label className="label">{T.roleLabel}</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {ROLE_CARDS.map(({ id, icon: Icon, title, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setRole(id)}
                    className={`text-left p-4 rounded-xl border-2 transition ${
                      role === id
                        ? 'border-brand-500 bg-brand-50 shadow-soft'
                        : 'border-ink-200 hover:border-brand-300 bg-white'
                    }`}
                  >
                    <Icon size={20} className={role === id ? 'text-brand-600' : 'text-ink-500'} />
                    <div className="font-semibold mt-2 text-sm">{title}</div>
                    <div className="text-[11px] text-ink-500 mt-0.5 leading-snug">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">{T.fullName}</label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type="text" className="input pl-11"
                    placeholder="John Doe"
                    value={name} onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="label">{T.email}</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type="email" className="input pl-11"
                    placeholder="you@university.edu"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="label">{T.password}</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="password" className="input pl-11"
                  placeholder={T.passwordHint}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? T.creating : <>{T.submit} <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-600">
            {T.hasAccount}{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">
              {T.signIn}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
