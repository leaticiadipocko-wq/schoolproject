import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, User, ArrowRight, GraduationCap, BookOpen, Briefcase, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { roleHome, ROLES } from '@/lib/roles'
import Logo from '@/components/Logo'
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthLabel } from '@/lib/auth'

const ROLE_CARDS = [
  { id: ROLES.STUDENT,  icon: GraduationCap, title: 'Student',  desc: 'Learn, view results, track attendance.' },
  { id: ROLES.LECTURER, icon: BookOpen,      title: 'Lecturer', desc: 'Teach, grade, manage classes.' },
  { id: ROLES.STAFF,    icon: Briefcase,     title: 'Staff',    desc: 'Operate the registrar and bursary.' },
  { id: ROLES.ADMIN,    icon: ShieldCheck,   title: 'Admin',    desc: 'Lead with analytics and insights.' },
]

export default function Register() {
  const { register } = useAuth()
  const { addNewUser } = useData()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState(ROLES.STUDENT)
  const [loading, setLoading] = useState(false)

  const passwordValidation = validatePassword(password)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) return toast.error('Please fill in all fields')
    if (!passwordValidation.isValid) return toast.error(passwordValidation.errors[0])
    if (!passwordsMatch) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      const u = await register({ name, email, password, role })
      addNewUser({ ...u, name: u.name || name, uid: u.uid || u.id, role: u.role || role })
      toast.success(`Welcome to SIARM, ${u.name.split(' ')[0]}!`)
      navigate(roleHome(u.role), { replace: true })
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-8"><Logo /></div>

        <div className="card">
          <h1 className="text-3xl font-display font-bold">Create your account</h1>
          <p className="text-ink-500 mt-1.5">Choose your role and join the platform.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Role selector */}
            <div>
              <label className="label">I am a…</label>
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
                <label className="label">Full name</label>
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
                <label className="label">Email</label>
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
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pl-11 pr-11"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-2">
                <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordValidation.strength)}`}
                    style={{ width: `${(passwordValidation.strength / 4) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[11px]">
                  <span className="text-ink-500">{getPasswordStrengthLabel(passwordValidation.strength)}</span>
                  {passwordValidation.errors.length > 0 && (
                    <span className="text-red-500">{passwordValidation.errors[0]}</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input pl-11 ${!passwordsMatch && confirmPassword.length > 0 ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              {!passwordsMatch && confirmPassword.length > 0 && (
                <div className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle size={10} /> Passwords do not match
                </div>
              )}
              {passwordsMatch && confirmPassword.length > 0 && (
                <div className="mt-1 text-[11px] text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Passwords match
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Creating account…' : <>Create account <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-600">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}