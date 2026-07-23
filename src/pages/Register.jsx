import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, User, Phone, ArrowRight, GraduationCap, BookOpen, Briefcase, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { roleHome, ROLES } from '@/lib/roles'
import { SPECIALTIES } from '@/lib/mockData'
import Logo from '@/components/Logo'
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthLabel } from '@/lib/auth'

const ROLE_CARDS = [
  { id: ROLES.STUDENT,  icon: GraduationCap, title: 'Student',  desc: 'Learn, view results, track attendance.' },
  { id: ROLES.LECTURER, icon: BookOpen,      title: 'Lecturer', desc: 'Teach, grade, manage classes.' },
  { id: ROLES.STAFF,    icon: Briefcase,     title: 'Staff',    desc: 'Operate the registrar and bursary.' },
  { id: ROLES.ADMIN,    icon: ShieldCheck,   title: 'Admin',    desc: 'Lead with analytics and insights.' },
]

const SPECIALTY_OPTIONS = Object.entries(SPECIALTIES).map(([k, v]) => ({ id: k, name: v.name }))

export default function Register() {
  const { register } = useAuth()
  const { addNewUser } = useData()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState(ROLES.STUDENT)
  const [specialty, setSpecialty] = useState('SWE')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const passwordValidation = validatePassword(password)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Full name is required'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format'
    if (!phone.trim()) errs.phone = 'Phone number is required'
    else if (!/^6\d{8}$/.test(phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid Cameroonian number (e.g. 670000000)'
    if (!password) errs.password = 'Password is required'
    else if (passwordValidation.strength < 2) errs.password = 'Password is too weak'
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (!agreeTerms) errs.terms = 'You must agree to the terms'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const u = await register({ name: name.trim(), email: email.trim(), password, role, phone: phone.replace(/\s/g, '') })
      addNewUser({ ...u, name: u.name || name, uid: u.uid || u.id, role: u.role || role, phone, specialty })
      setSubmitted(true)
      toast.success(`Welcome to SIARM, ${(u.name || name).split(' ')[0]}!`)
      setTimeout(() => navigate(roleHome(u.role), { replace: true }), 500)
    } catch (err) {
      console.warn('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce-in">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-display font-bold mt-6">Account created!</h2>
          <p className="text-ink-500 mt-2">Welcome to SIARM. Redirecting to your dashboard...</p>
          <Loader2 size={24} className="animate-spin mx-auto mt-6 text-brand-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-8"><Logo /></div>

        <div className="card">
          <h1 className="text-3xl font-display font-bold">Create your account</h1>
          <p className="text-ink-500 mt-1.5">Choose your role and join the platform.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
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
                        ? 'border-brand-500 bg-brand-50 shadow-soft ring-2 ring-brand-200'
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
                <label className="label">Full name <span className="text-red-400">*</span></label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type="text" className={`input pl-11 ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
                    placeholder="John Doe"
                    value={name} onChange={(e) => { setName(e.target.value); setErrors(e => ({ ...e, name: '' })) }}
                  />
                </div>
                {errors.name && <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</p>}
              </div>
              <div>
                <label className="label">Email <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type="email" className={`input pl-11 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                    placeholder="you@university.edu"
                    value={email} onChange={(e) => { setEmail(e.target.value); setErrors(e => ({ ...e, email: '' })) }}
                  />
                </div>
                {errors.email && <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="label">Phone number <span className="text-red-400">*</span></label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="tel" className={`input pl-11 ${errors.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="670000000"
                  value={phone} onChange={(e) => { setPhone(e.target.value); setErrors(e => ({ ...e, phone: '' })) }}
                />
              </div>
              {errors.phone && <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.phone}</p>}
            </div>

            {role === ROLES.STUDENT && (
              <div>
                <label className="label">Specialty / Programme</label>
                <select className="input" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                  {SPECIALTY_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`input pl-11 pr-11 ${errors.password ? 'border-red-300 focus:border-red-500' : ''}`}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(e => ({ ...e, password: '' })) }}
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
                    <span className={errors.password ? 'text-red-500' : 'text-ink-500'}>
                      {errors.password || getPasswordStrengthLabel(passwordValidation.strength)}
                    </span>
                    {passwordValidation.errors.length > 0 && !errors.password && (
                      <span className="text-red-500">{passwordValidation.errors[0]}</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Confirm password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`input pl-11 ${errors.confirmPassword || (!passwordsMatch && confirmPassword.length > 0) ? 'border-red-300 focus:border-red-500' : ''}`}
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
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => { setAgreeTerms(e.target.checked); setErrors(e => ({ ...e, terms: '' })) }}
                className="mt-0.5 rounded border-ink-300 text-brand-700 focus:ring-brand-500" />
              <span className="text-sm text-ink-600">
                I agree to the{' '}
                <button type="button" className="text-brand-600 hover:underline font-medium">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-brand-600 hover:underline font-medium">Privacy Policy</button>
              </span>
            </label>
            {errors.terms && <p className="text-[11px] text-red-500 flex items-center gap-1 -mt-3"><AlertCircle size={10} /> {errors.terms}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Creating account…</span> : <>Create account <ArrowRight size={18} className="inline" /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink-100 text-center text-sm text-ink-600">
            Already have an account?{' '}
            <a href="/login" className="text-brand-600 font-medium hover:underline">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}