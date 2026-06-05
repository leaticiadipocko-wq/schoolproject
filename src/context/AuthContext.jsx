import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db, DEMO_MODE } from '@/lib/firebase'
import { MOCK_USERS } from '@/lib/mockData'

const AuthContext = createContext(null)

const STORAGE_KEY = 'siarm.demoUser'
const ACTIVITY_KEY = 'siarm.lastActivity'
const IDLE_TIMEOUT_MS  = 30 * 60_000   // 30 minutes
const WARNING_BEFORE_MS = 2 * 60_000   // warn at T-2 min

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (DEMO_MODE) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const snap = await getDoc(doc(db, 'users', fbUser.uid))
        const profile = snap.exists() ? snap.data() : {}
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName || profile.name || 'User',
          ...profile,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async (email, password) => {
    if (DEMO_MODE) {
      const found = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )
      if (!found) throw new Error('Invalid email or password')
      const { password: _pw, ...safe } = found
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
      setUser(safe)
      return safe
    }
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const snap = await getDoc(doc(db, 'users', cred.user.uid))
    return { uid: cred.user.uid, ...(snap.data() || {}) }
  }

  const register = async ({ email, password, name, role }) => {
    if (DEMO_MODE) {
      if (MOCK_USERS.find((u) => u.email === email)) {
        throw new Error('Email already in use')
      }
      const newUser = {
        uid: `demo-${Date.now()}`,
        email,
        name,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      setUser(newUser)
      return newUser
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    const profile = {
      uid: cred.user.uid, email, name, role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
    }
    await setDoc(doc(db, 'users', cred.user.uid), profile)
    return profile
  }

  const logout = async () => {
    if (DEMO_MODE) {
      localStorage.removeItem(STORAGE_KEY)
      setUser(null)
      return
    }
    await signOut(auth)
  }

  /* ─── Session timeout (idle auto-logout) ──────────────────── */
  const [idleWarning, setIdleWarning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(WARNING_BEFORE_MS / 1000)

  useEffect(() => {
    if (!user) return

    const touch = () => {
      try { localStorage.setItem(ACTIVITY_KEY, String(Date.now())) } catch {}
      setIdleWarning(false)
    }
    const EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    EVENTS.forEach((e) => window.addEventListener(e, touch, { passive: true }))
    touch()

    const id = setInterval(() => {
      const last = Number(localStorage.getItem(ACTIVITY_KEY) || Date.now())
      const idleMs = Date.now() - last
      if (idleMs >= IDLE_TIMEOUT_MS) {
        EVENTS.forEach((e) => window.removeEventListener(e, touch))
        clearInterval(id)
        setIdleWarning(false)
        logout()
      } else if (idleMs >= IDLE_TIMEOUT_MS - WARNING_BEFORE_MS) {
        setIdleWarning(true)
        setSecondsLeft(Math.max(0, Math.round((IDLE_TIMEOUT_MS - idleMs) / 1000)))
      }
    }, 1000)

    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, touch))
      clearInterval(id)
    }
  }, [user])  // eslint-disable-line

  const extendSession = () => {
    try { localStorage.setItem(ACTIVITY_KEY, String(Date.now())) } catch {}
    setIdleWarning(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoMode: DEMO_MODE, idleWarning, secondsLeft, extendSession }}>
      {children}
      {idleWarning && user && (
        <IdleWarningOverlay seconds={secondsLeft} onStay={extendSession} onLogout={logout} />
      )}
    </AuthContext.Provider>
  )
}

function IdleWarningOverlay({ seconds, onStay, onLogout }) {
  return (
    <div className="fixed inset-0 bg-ink-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center text-2xl">
          ⏱
        </div>
        <h3 className="font-display font-bold text-lg mt-3">You will be signed out</h3>
        <p className="text-sm text-ink-600 dark:text-ink-300 mt-1">
          For security, your session ends after 30 minutes of inactivity. Auto-logout in <span className="font-bold text-red-600">{seconds}s</span>.
        </p>
        <div className="mt-4 flex gap-2">
          <button onClick={onLogout} className="btn-secondary flex-1">Sign out now</button>
          <button onClick={onStay} className="btn-primary flex-1">Stay signed in</button>
        </div>
      </div>
    </div>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
