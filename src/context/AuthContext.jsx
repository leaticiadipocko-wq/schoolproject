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
const ACCOUNTS_KEY = 'siarm.accounts'   // self-registered accounts (demo mode)
const ACTIVITY_KEY = 'siarm.lastActivity'
const IDLE_TIMEOUT_MS  = 30 * 60_000   // 30 minutes
const WARNING_BEFORE_MS = 2 * 60_000   // warn at T-2 min

/**
 * Accounts a user creates themselves are kept in localStorage so they can sign
 * back in with their OWN email + password (no default credentials imposed).
 * These entries take precedence over the seeded demo roster, which lets a user
 * also change the password of a built-in account via the reset flow.
 *
 * NOTE: passwords are stored locally only for the offline/demo build. The
 * production path (DEMO_MODE off) uses Firebase Authentication instead.
 */
function loadAccounts() {
  try {
    const raw = JSON.parse(localStorage.getItem(ACCOUNTS_KEY))
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

function saveAccounts(list) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list))
}

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
      const emailLower = email.trim().toLowerCase()
      // A user's own account (if any) takes precedence over the seeded roster,
      // so their chosen / reset password is what's checked.
      const candidate =
        loadAccounts().find((u) => u.email.toLowerCase() === emailLower) ||
        MOCK_USERS.find((u) => u.email.toLowerCase() === emailLower)
      if (!candidate || candidate.password !== password) {
        throw new Error('Invalid email or password')
      }
      const { password: _pw, ...safe } = candidate
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
      const emailLower = email.trim().toLowerCase()
      const accounts = loadAccounts()
      const taken =
        MOCK_USERS.some((u) => u.email.toLowerCase() === emailLower) ||
        accounts.some((u) => u.email.toLowerCase() === emailLower)
      if (taken) throw new Error('Email already in use')

      const account = {
        uid: `usr-${Date.now()}`,
        email: email.trim(),
        password,                       // the user's own chosen password
        name,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        createdAt: new Date().toISOString(),
      }
      // Persist the account so the user can sign in again later…
      saveAccounts([...accounts, account])
      // …and start the session now (without keeping the password in memory).
      const { password: _pw, ...safe } = account
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
      setUser(safe)
      return safe
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

  /**
   * Let any user set a new password for their own email. Works for both
   * self-registered accounts and the seeded roster (an override is stored).
   */
  const resetPassword = async (email, newPassword) => {
    const emailLower = (email || '').trim().toLowerCase()
    if (!emailLower) throw new Error('Email is required')
    if (!newPassword) throw new Error('A new password is required')

    if (DEMO_MODE) {
      const accounts = loadAccounts()
      const idx = accounts.findIndex((u) => u.email.toLowerCase() === emailLower)
      if (idx >= 0) {
        accounts[idx] = { ...accounts[idx], password: newPassword }
      } else {
        const base = MOCK_USERS.find((u) => u.email.toLowerCase() === emailLower)
        if (!base) throw new Error('No account found for that email')
        const { password: _pw, ...rest } = base
        accounts.push({ ...rest, password: newPassword, updatedAt: new Date().toISOString() })
      }
      saveAccounts(accounts)
      return true
    }
    // Production: Firebase handles password resets via emailed links.
    throw new Error('Password reset is handled by email in production')
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
    <AuthContext.Provider value={{ user, loading, login, register, resetPassword, logout, demoMode: DEMO_MODE }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
