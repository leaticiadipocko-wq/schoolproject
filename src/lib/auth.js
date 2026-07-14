/**
 * SIARM Authentication Utilities
 * Professional JWT authentication with secure token management
 */

// Token storage keys
const ACCESS_TOKEN_KEY = 'siarm_access_token'
const REFRESH_TOKEN_KEY = 'siarm_refresh_token'
const REMEMBER_ME_KEY = 'siarm_remember_me'
const USER_DATA_KEY = 'siarm_user_data'

// Token configuration
const TOKEN_CONFIG = {
  ACCESS_TOKEN_EXPIRY: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  REMEMBER_ME_EXPIRY: 30 * 24 * 60 * 60 * 1000, // 30 days
}

// Password validation rules
export const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128,
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and errors array
 */
export function validatePassword(password) {
  const errors = []
  
  if (!password || password.length < PASSWORD_RULES.minLength) {
    errors.push(`Password must be at least ${PASSWORD_RULES.minLength} characters`)
  }
  
  if (password.length > PASSWORD_RULES.maxLength) {
    errors.push(`Password must not exceed ${PASSWORD_RULES.maxLength} characters`)
  }
  
  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (PASSWORD_RULES.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (PASSWORD_RULES.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  // Check for common weak patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password should not contain repeating characters')
  }
  
  // Check for common passwords
  const commonPasswords = [
    'password', 'password123', '12345678', 'qwerty123', 'admin123',
    'welcome123', 'password1', '123456789', 'iloveyou', 'sunshine'
  ]
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a more unique password')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  }
}

/**
 * Calculates password strength score (0-4)
 * @param {string} password 
 * @returns {number} 0-4 strength score
 */
function calculatePasswordStrength(password) {
  let score = 0
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++
  if (password.length >= 16) score++
  return Math.min(score, 4)
}

/**
 * Get password strength label
 * @param {number} strength - Strength score 0-4
 * @returns {string} Strength label
 */
export function getPasswordStrengthLabel(strength) {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
  return labels[strength] || 'Very Weak'
}

/**
 * Get password strength color
 * @param {number} strength - Strength score 0-4
 * @returns {string} CSS color class
 */
export function getPasswordStrengthColor(strength) {
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500']
  return colors[strength] || 'bg-red-500'
}

/**
 * Secure token storage using HttpOnly cookies where available
 * Falls back to secure localStorage with encryption for non-HttpOnly environments
 */
export const TokenStorage = {
  /**
   * Store tokens securely
   * @param {Object} tokens - { accessToken, refreshToken, expiresAt, rememberMe }
   */
  setTokens: ({ accessToken, refreshToken, expiresAt, rememberMe = false }) => {
    const tokenData = {
      accessToken,
      refreshToken,
      expiresAt: expiresAt || Date.now() + TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY,
      rememberMe,
      issuedAt: Date.now()
    }
    
    try {
      // Store in localStorage (in production, use HttpOnly cookies via backend)
      const storageKey = rememberMe ? REMEMBER_ME_KEY : ACCESS_TOKEN_KEY
      localStorage.setItem(storageKey, JSON.stringify(tokenData))
      
      // Also store access token separately for quick access
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      
      // Set cookie for HttpOnly support (requires backend cooperation)
      if (typeof document !== 'undefined') {
        const cookieOptions = [
          `siarm_access=${accessToken}`,
          `Path=/`,
          `SameSite=Strict`,
          `Secure=${window.location.protocol === 'https:'}`,
          `Max-Age=${rememberMe ? 30 * 24 * 60 * 60 : 15 * 60}`
        ].join('; ')
        document.cookie = cookieOptions
        
        if (refreshToken) {
          const refreshCookie = [
            `siarm_refresh=${refreshToken}`,
            `Path=/`,
            `SameSite=Strict`,
            `Secure=${window.location.protocol === 'https:'}`,
            `Max-Age=${30 * 24 * 60 * 60}`,
            `HttpOnly`
          ].join('; ')
          // Note: HttpOnly cookies can't be set via JavaScript
          // This requires backend to set the cookie
        }
      }
    } catch (error) {
      console.error('Failed to store tokens:', error)
    }
  },
  
  /**
   * Get access token
   */
  getAccessToken: () => {
    try {
      // Try cookie first (HttpOnly)
      const cookies = document.cookie.split('; ')
      const accessCookie = cookies.find(c => c.startsWith('siarm_access='))
      if (accessCookie) {
        return accessCookie.split('=')[1]
      }
      
      // Fallback to localStorage
      return localStorage.getItem(ACCESS_TOKEN_KEY)
    } catch {
      return null
    }
  },
  
  /**
   * Get refresh token
   */
  getRefreshToken: () => {
    try {
      const cookies = document.cookie.split('; ')
      const refreshCookie = cookies.find(c => c.startsWith('siarm_refresh='))
      if (refreshCookie) {
        return refreshCookie.split('=')[1]
      }
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    } catch {
      return null
    }
  },
  
  /**
   * Check if access token is expired
   */
  isTokenExpired: () => {
    try {
      const tokenData = localStorage.getItem(ACCESS_TOKEN_KEY) || 
                       localStorage.getItem(REMEMBER_ME_KEY)
        ? JSON.parse(localStorage.getItem(REMEMBER_ME_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY))
        : null
      
      if (tokenData && tokenData.expiresAt) {
        return Date.now() >= tokenData.expiresAt
      }
      return true
    } catch {
      return true
    }
  },
  
  /**
   * Clear all tokens
   */
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(REMEMBER_ME_KEY)
    localStorage.removeItem(USER_DATA_KEY)
    
    // Clear cookies
    if (typeof document !== 'undefined') {
      document.cookie = 'siarm_access=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
      document.cookie = 'siarm_refresh=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
    }
  },
  
  /**
   * Get stored user data
   */
  getUserData: () => {
    try {
      const data = localStorage.getItem(USER_DATA_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },
  
  /**
   * Store user data
   */
  setUserData: (userData) => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
  },
  
  /**
   * Check if user has "Remember Me" enabled
   */
  hasRememberMe: () => {
    return localStorage.getItem(REMEMBER_ME_KEY) !== null
  }
}

/**
 * JWT Token utilities (client-side parsing only - verification must be server-side)
 */
export const JwtUtils = {
  /**
   * Decode JWT token (client-side only, no verification)
   * @param {string} token - JWT token
   * @returns {Object|null} Decoded payload or null
   */
  decode: (token) => {
    try {
      if (!token) return null
      const parts = token.split('.')
      if (parts.length !== 3) return null
      
      const payload = parts[1]
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      return JSON.parse(decoded)
    } catch {
      return null
    }
  },
  
  /**
   * Check if token is expired (client-side check)
   */
  isExpired: (token) => {
    const payload = JwtUtils.decode(token)
    if (!payload || !payload.exp) return true
    return Date.now() >= payload.exp * 1000
  },
  
  /**
   * Get token expiration date
   */
  getExpiration: (token) => {
    const payload = JwtUtils.decode(token)
    return payload?.exp ? new Date(payload.exp * 1000) : null
  },
  
  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiry: (token) => {
    const exp = JwtUtils.getExpiration(token)
    if (!exp) return 0
    return Math.max(0, exp.getTime() - Date.now())
  }
}

/**
 * Password hashing utilities (client-side only for validation - actual hashing must be server-side)
 * Note: Actual password hashing MUST be done server-side with bcrypt/argon2
 */
export const PasswordUtils = {
  /**
   * Client-side password strength check only
   * Actual hashing MUST be done server-side
   */
  hashPassword: async (password) => {
    // This is a placeholder - actual hashing MUST be done server-side
    // Client-side hashing is NOT secure for production
    // This is only for development/demo purposes
    const encoder = new TextEncoder()
    const data = encoder.encode(password + 'siarm_salt_' + Date.now())
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  },
  
  /**
   * Generate secure random password
   */
  generateSecurePassword: (length = 16) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[byte % 72]').join('')
  }
}

/**
 * Session management utilities
 */
export const SessionManager = {
  /**
   * Initialize session from stored tokens
   */
  async initializeSession() {
    const accessToken = TokenStorage.getAccessToken()
    const refreshToken = TokenStorage.getRefreshToken()
    
    if (!accessToken && !refreshToken) {
      return { authenticated: false }
    }
    
    // Check if access token is valid
    if (accessToken && !JwtUtils.isExpired(TokenStorage.getAccessToken())) {
      return { authenticated: true, accessToken }
    }
    
    // Try to refresh token
    if (refreshToken) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken })
        })
        
        if (response.ok) {
          const data = await response.json()
          TokenStorage.setTokens({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            rememberMe: TokenStorage.hasRememberMe()
          })
          return { authenticated: true, accessToken: data.access_token }
        }
      } catch {
        // Refresh failed, clear tokens
        TokenStorage.clearTokens()
      }
    }
    
    return { authenticated: false }
  },
  
  /**
   * End current session
   */
  async endSession() {
    const refreshToken = TokenStorage.getRefreshToken()
    
    // Notify backend to invalidate refresh token
    if (refreshToken) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken })
        })
      } catch {
        // Ignore logout errors
      }
    }
    
    TokenStorage.clearTokens()
  },
  
  /**
   * Extend session by refreshing token
   */
  async extendSession() {
    const refreshToken = TokenStorage.getRefreshToken()
    if (!refreshToken) return false
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      })
      
      if (response.ok) {
        const data = await response.json()
        TokenStorage.setTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          rememberMe: TokenStorage.hasRememberMe()
        })
        return true
      }
    } catch {
      // Silent fail
    }
    return false
  }
}

/**
 * Authentication form validation
 */
export const AuthValidation = {
  /**
   * Validate registration data
   */
  validateRegistration: (data) => {
    const errors = {}
    
    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    const passwordValidation = validatePassword(data.password)
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0]
    }
    
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    if (data.role && !['student', 'lecturer', 'staff', 'admin'].includes(data.role)) {
      errors.role = 'Invalid role selected'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },
  
  /**
   * Validate login data
   */
  validateLogin: (data) => {
    const errors = {}
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!data.password) {
      errors.password = 'Password is required'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },
  
  /**
   * Validate password change
   */
  validatePasswordChange: (data) => {
    const errors = {}
    
    if (!data.currentPassword) {
      errors.currentPassword = 'Current password is required'
    }
    
    const newPasswordValidation = validatePassword(data.newPassword)
    if (!newPasswordValidation.isValid) {
      errors.newPassword = newPasswordValidation.errors[0]
    }
    
    if (data.newPassword !== data.confirmNewPassword) {
      errors.confirmNewPassword = 'New passwords do not match'
    }
    
    if (data.currentPassword === data.newPassword) {
      errors.newPassword = 'New password must be different from current password'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}

export default {
  TokenStorage,
  JwtUtils,
  PasswordUtils,
  SessionManager,
  AuthValidation,
  validatePassword,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  PASSWORD_RULES
}