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
      const storeRaw = localStorage.getItem('siarm.store.v2')
      const overrides = storeRaw ? JSON.parse(storeRaw).passwordOverrides || {} : {}
      const overridePwd = overrides[email.toLowerCase()]
      const found = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || (overridePwd && overridePwd === password))
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

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoMode: DEMO_MODE }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
