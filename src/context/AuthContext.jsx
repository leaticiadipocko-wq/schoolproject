import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '@/lib/api'
import { TokenStorage, JwtUtils, SessionManager } from '@/lib/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    initializeAuth()
    
    // Set up periodic token refresh check
    const interval = setInterval(() => {
      if (TokenStorage.isTokenExpired()) {
        handleTokenRefresh()
      }
    }, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])

  const initializeAuth = async () => {
    try {
      const session = await SessionManager.initializeSession()
      if (session.authenticated) {
        const userData = TokenStorage.getUserData()
        if (userData) {
          setUser(userData)
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTokenRefresh = async () => {
    if (refreshing) return
    setRefreshing(true)
    
    try {
      await SessionManager.extendSession()
    } catch (error) {
      console.warn('Token refresh failed, session continues:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await authApi.login(email, password, rememberMe)
      
      if (response.success && response.data) {
        const { token, refresh_token, user: userData, remember_me } = response.data
        
        // Store tokens and user data
        TokenStorage.setTokens({
          accessToken: token,
          refreshToken: refresh_token,
          rememberMe: rememberMe || remember_me
        })
        TokenStorage.setUserData(userData)
        
        setUser(userData)
        
        return userData
      }
      
      throw new Error(response.message || 'Login failed')
    } catch (error) {
      const message = error.message || 'Invalid email or password'
      console.warn(message)
      throw new Error(message)
    }
  }

  const register = async ({ email, password, name, role, phone }) => {
    try {
      const response = await authApi.register({ email, password, full_name: name, role, phone })
      
      if (response.success && response.data) {
        const { token, refresh_token, user: userData } = response.data
        
        // Store tokens and user data
        TokenStorage.setTokens({
          accessToken: token,
          refreshToken: refresh_token,
          rememberMe: false // Don't remember on registration
        })
        TokenStorage.setUserData(userData)
        
        setUser(userData)
        toast.success(`Welcome to SIARM, ${userData.full_name}!`)
        
        return userData
      }
      
      throw new Error(response.message || 'Registration failed')
    } catch (error) {
      const message = error.message || 'Registration failed'
      console.warn(message)
      throw new Error(message)
    }
  }

  const resetPassword = async (email) => {
    try {
      const response = await authApi.forgotPassword(email)
      
      if (response.success) {
        toast.success(response.message)
        return true
      }
      
      throw new Error(response.message || 'Failed to send reset link')
    } catch (error) {
      const message = error.message || 'Failed to process request'
      console.warn(message)
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
      console.warn(message)
      throw new Error(message)
    }
  }

  const logout = async () => {
    try {
      await SessionManager.endSession()
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null)
      toast.success('Logged out successfully')
    }
  }

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    TokenStorage.setUserData(updatedUser)
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
      isAuthenticated: !!user,
      refreshing
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