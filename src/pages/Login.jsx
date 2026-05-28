import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Info } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { roleHome } from '@/lib/roles'
import Logo from '@/components/Logo'

const DEMO_ACCOUNTS = [
  { label: 'Student',   email: 'student@iuget.cm',   color: 'bg-brand-100 text-brand-800' },
  { label: 'Lecturer',  email: 'lecturer@iuget.cm',  color: 'bg-accent-100 text-accent-700' },
  { label: 'Staff',     email: 'staff@iuget.cm',     color: 'bg-amber-100 text-amber-700' },
  { label: 'Admin',     email: 'admin@iuget.cm',     color: 'bg-emerald-100 text-emerald-700' },
]

export default function Login() {
  const { login, demoMode } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill in all fields')
    setLoading(true)
    try {
      const u = await login(email, password)
      toast.success(`Welcome back, ${u.name?.split(' ')[0] || 'friend'}!`)
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
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 text-white p-12 flex-col justify-between">
        <Logo withText={false} size={48} />
        <div>
          <h2 className="text-5xl font-display font-bold leading-tight">
            Welcome back to <br />the future of education.
          </h2>
          <p className="mt-6 text-lg text-white/80 max-w-md">
            Sign in to access your personalized dashboard — attendance,
            grades, AI tutor, and more.
          </p>
        </div>
        <div className="text-sm text-white/60">© {new Date().getFullYear()} SIARM</div>

        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent-300/20 rounded-full blur-3xl" />
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-ink-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center"><Logo /></div>

          <h1 className="text-3xl font-display font-bold">Sign in</h1>
          <p className="text-ink-500 mt-1.5">Continue to your SIARM dashboard.</p>

          {demoMode && (
            <div className="mt-6 p-4 rounded-xl bg-brand-50 border border-brand-100 text-sm">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-brand-900">Demo mode is on</div>
                  <div className="text-brand-700 mt-0.5">Click a role below to fill in demo credentials.</div>
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
              <label className="label">Email address</label>
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
              <label className="label">Password</label>
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
                Remember me
              </label>
              <a href="#" className="text-brand-600 hover:underline">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Signing in…' : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-600">
            New to SIARM?{' '}
            <Link to="/register" className="text-brand-600 font-medium hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
