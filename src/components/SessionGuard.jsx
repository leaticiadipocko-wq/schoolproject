import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Clock, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'

const IDLE_MINUTES   = 30   // total inactivity before forced logout
const WARN_MINUTES   = 2    // show warning banner this many minutes before timeout

/**
 * Watches for user activity (mouse, keyboard, touch). After
 * IDLE_MINUTES of inactivity the user is signed out. A 2-minute
 * warning lets them stay signed in if they're still around.
 */
export default function SessionGuard() {
  const { user, logout } = useAuth()
  const { lang } = useLang()
  const navigate = useNavigate()
  const lastActivity = useRef(Date.now())
  const [secondsLeft, setSecondsLeft] = useState(null)

  // Reset timer on user activity
  useEffect(() => {
    if (!user) return
    const bump = () => {
      lastActivity.current = Date.now()
      if (secondsLeft !== null) setSecondsLeft(null)  // dismiss warning
    }
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }))
    return () => events.forEach((e) => window.removeEventListener(e, bump))
  }, [user, secondsLeft])

  // Tick every second
  useEffect(() => {
    if (!user) return
    const id = setInterval(() => {
      const idleMs = Date.now() - lastActivity.current
      const timeoutMs = IDLE_MINUTES * 60_000
      const warnMs    = (IDLE_MINUTES - WARN_MINUTES) * 60_000
      if (idleMs >= timeoutMs) {
        clearInterval(id)
        logout().then(() => {
          toast.error(lang === 'en'
            ? 'Signed out due to inactivity'
            : 'Déconnexion pour inactivité')
          navigate('/login', { replace: true })
        })
      } else if (idleMs >= warnMs) {
        setSecondsLeft(Math.ceil((timeoutMs - idleMs) / 1000))
      }
    }, 1000)
    return () => clearInterval(id)
  }, [user, logout, navigate, lang])

  if (!user || secondsLeft === null) return null

  const m = Math.floor(secondsLeft / 60)
  const s = secondsLeft % 60

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 border border-amber-300 dark:border-amber-700 rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-3 max-w-md animate-fade-in">
      <Clock size={20} className="text-amber-700 dark:text-amber-300 shrink-0" />
      <div className="flex-1 text-sm">
        <div className="font-bold">
          {lang === 'en' ? 'Still there?' : 'Toujours là ?'}
        </div>
        <div className="mt-0.5">
          {lang === 'en'
            ? `You'll be signed out in ${m}:${String(s).padStart(2, '0')} for inactivity.`
            : `Vous serez déconnecté dans ${m}:${String(s).padStart(2, '0')} pour inactivité.`}
        </div>
      </div>
      <button
        onClick={() => { lastActivity.current = Date.now(); setSecondsLeft(null) }}
        className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-3 py-2 text-xs font-medium inline-flex items-center gap-1.5"
      >
        <ShieldCheck size={14} /> {lang === 'en' ? 'Stay signed in' : 'Rester connecté'}
      </button>
    </div>
  )
}
