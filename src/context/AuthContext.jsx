import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '@/lib/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const STORAGE_KEY = 'siarm_user'
const TOKEN_KEY = 'siarm_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token and user on app load
    const token = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(STORAGE_KEY)
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(TOKEN_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password)
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data
        
        // Store token and user
        localStorage.setItem(TOKEN_KEY, token)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
        
        setUser(userData)
        toast.success(`Welcome back, ${userData.full_name}!`)
        
        return userData
      }
      
      throw new Error(response.message || 'Login failed')
    } catch (error) {
      const message = error.message || 'Invalid email or password'
      toast.error(message)
      throw new Error(message)
    }
  }

  const register = async ({ email, password, name, role, phone }) => {
    try {
      const response = await authApi.register({ email, password, full_name: name, role, phone })
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data
        
        localStorage.setItem(TOKEN_KEY, token)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
        
        setUser(userData)
        toast.success(`Welcome to SIARM, ${userData.full_name}!`)
        
        return userData
      }
      
      throw new Error(response.message || 'Registration failed')
    } catch (error) {
      const message = error.message || 'Registration failed'
      toast.error(message)
      throw new Error(message)
    }
  }

  const resetPassword = async (email, newPassword) => {
    try {
      const response = await authApi.forgotPassword(email)
      
      if (response.success) {
        toast.success(response.message)
        return true
      }
      
      throw new Error(response.message || 'Failed to send reset link')
    } catch (error) {
      const message = error.message || 'Failed to process request'
      toast.error(message)
      throw new Error(message)
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authApi.changePassword(currentPassword, newPassword)
      
      if (response.success) {
        toast.success('Password changed successfully')
        return true
      }
      
      throw new Error(response.message || 'Failed to change password')
    } catch (error) {
      const message = error.message || 'Failed to change password'
      toast.error(message)
      throw new Error(message)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TOKEN_KEY)
      setUser(null)
      toast.success('Logged out successfully')
    }
  }

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      resetPassword,
      changePassword,
      logout,
      updateUser,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}