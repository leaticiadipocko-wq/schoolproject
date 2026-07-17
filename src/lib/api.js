/**
 * API Client for SIARM
 * Communicates with the PHP backend API
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api'

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE
    this.accessToken = null
    this.refreshToken = null
    this.refreshPromise = null
    this.initTokens()
  }

  initTokens() {
    // Try to get tokens from cookies first (HttpOnly), then localStorage
    this.accessToken = this.getCookie('siarm_access') || localStorage.getItem('siarm_access_token')
    this.refreshToken = this.getCookie('siarm_refresh') || localStorage.getItem('siarm_refresh_token')
  }

  getCookie(name) {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split('; ')
    const cookie = cookies.find(c => c.startsWith(`${name}=`))
    return cookie ? cookie.split('=')[1] : null
  }

  setTokens({ accessToken, refreshToken, rememberMe = false }) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken

    // Store in localStorage
    localStorage.setItem('siarm_access_token', accessToken)
    localStorage.setItem('siarm_refresh_token', refreshToken)

    // Also set cookies for HttpOnly support (requires backend to set HttpOnly cookies)
    if (typeof document !== 'undefined') {
      const cookieOptions = `Path=/; SameSite=Strict; Secure=${window.location.protocol === 'https:'}`
      const maxAge = 15 * 60 // 15 minutes for access token
      const refreshMaxAge = 30 * 24 * 60 * 60 // 30 days for refresh token
      
      document.cookie = `siarm_access=${accessToken}; Path=/; SameSite=Strict; Secure=${window.location.protocol === 'https:'}; Max-Age=${maxAge}`
      document.cookie = `siarm_refresh=${this.refreshToken}; Path=/; SameSite=Strict; Secure=${window.location.protocol === 'https:'}; Max-Age=${refreshMaxAge}`
    }
  }

  clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    localStorage.removeItem('siarm_access_token')
    localStorage.removeItem('siarm_refresh_token')
    
    // Clear cookies
    if (typeof document !== 'undefined') {
      document.cookie = 'siarm_access=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
      document.cookie = 'siarm_refresh=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
    }
  }

  getAccessToken() {
    return this.accessToken
  }

  getRefreshToken() {
    return this.refreshToken
  }

  isTokenExpired(token) {
    if (!token) return true
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      return Date.now() >= payload.exp * 1000
    } catch {
      return true
    }
  }

  async refreshAccessToken() {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      this.clearTokens()
      return null
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: this.refreshToken })
        })

        if (!response.ok) {
          this.clearTokens()
          return null
        }

        const data = await response.json()
        this.setTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token || this.refreshToken,
          rememberMe: true
        })

        return this.accessToken
      } catch (error) {
        console.error('Token refresh failed:', error)
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          this.clearTokens()
          throw new Error('Unable to reach server. Please check your connection and try again.')
        }
        this.clearTokens()
        return null
      } finally {
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    
    // Check if access token is expired and try to refresh
    if (this.accessToken && this.isTokenExpired(this.accessToken)) {
      const newToken = await this.refreshAccessToken()
      if (!newToken) {
        throw new Error('Session expired. Please log in again.')
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    const config = {
      ...options,
      headers,
    }

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body)
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config)
      
      // If 401, try to refresh token once
      if (response.status === 401) {
        const newToken = await this.refreshAccessToken()
        if (newToken) {
          // Retry original request with new token
          const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${this.accessToken}`
          }
          const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers
          })
          const retryData = await retryResponse.json()
          if (!retryResponse.ok) {
            throw new Error(retryData.message || `HTTP error! status: ${retryResponse.status}`)
          }
          return retryData
        }
        this.clearTokens()
        throw new Error('Session expired. Please log in again.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to reach server. Please check your connection and try again.')
      }
      throw error
    }
  }

  // Auth endpoints
  async login(email, password, rememberMe = false) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password, remember_me: rememberMe },
    })
  }

  async register(data) {
    return this.request('/auth/register', {
      method: 'POST',
      body: data,
    })
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' })
    } finally {
      this.clearTokens()
    }
  }

  async me() {
    return this.request('/auth/me')
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    })
  }

  async resetPassword(token, password, password_confirm) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: { token, password, password_confirm },
    })
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: { current_password: currentPassword, new_password: newPassword },
    })
  }

  // User endpoints
  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/users${query ? `?${query}` : ''}`)
  }

  async getUser(id) {
    return this.request(`/users/${id}`)
  }

  async createUser(data) {
    return this.request('/users', {
      method: 'POST',
      body: data,
    })
  }

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  async changeUserPassword(id, currentPassword, newPassword) {
    return this.request(`/users/${id}/password`, {
      method: 'POST',
      body: { current_password: currentPassword, new_password: newPassword },
    })
  }

  // Lecturer endpoints
  async getLecturerAttendanceRecords(courseId, date) {
    return this.request(`/lecturer/attendance/records?course_id=${courseId}&date=${date}`)
  }

  async markAttendance(data) {
    return this.request('/lecturer/attendance', {
      method: 'POST',
      body: data,
    })
  }

  async submitGrades(data) {
    return this.request('/lecturer/grades', {
      method: 'POST',
      body: data,
    })
  }

  async publishGrades(courseId, semesterId) {
    return this.request('/lecturer/publish-grades', {
      method: 'POST',
      body: { course_id: courseId, semester_id: semesterId },
    })
  }

  // Student endpoints
  async getStudentProfile(studentId) {
    return this.request(`/students/${studentId}`)
  }

  async getStudentTimetable(studentId) {
    return this.request(`/students/${studentId}/timetable`)
  }

  async getStudentAttendance(studentId, params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/students/${studentId}/attendance${query ? `?${query}` : ''}`)
  }

  async getStudentResults(studentId, params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/students/${studentId}/results${query ? `?${query}` : ''}`)
  }

  async getStudentTranscript(studentId) {
    return this.request(`/students/${studentId}/transcript`)
  }

  async getStudentFees(studentId) {
    return this.request(`/students/${studentId}/fees`)
  }

  async registerCourses(studentId, courseIds, semesterId, academicYearId) {
    return this.request(`/students/${studentId}/register`, {
      method: 'POST',
      body: { course_ids: courseIds, semester_id: semesterId, academic_year_id: academicYearId },
    })
  }

  async getAvailableCourses(studentId) {
    return this.request(`/students/${studentId}/available-courses`)
  }
}

export const api = new ApiClient()

// Convenience exports
export const authApi = {
  login: (email, password, rememberMe) => api.login(email, password, rememberMe),
  register: (data) => api.register(data),
  logout: () => api.logout(),
  me: () => api.me(),
  forgotPassword: (email) => api.forgotPassword(email),
  resetPassword: (token, password, password_confirm) => api.resetPassword(token, password, password_confirm),
  changePassword: (current, newPass) => api.changePassword(current, newPass),
}

export const userApi = {
  getUsers: (params) => api.getUsers(params),
  getUser: (id) => api.getUser(id),
  createUser: (data) => api.createUser(data),
  updateUser: (id, data) => api.updateUser(id, data),
  deleteUser: (id) => api.deleteUser(id),
  changePassword: (id, current, newPass) => api.changeUserPassword(id, current, newPass),
}

export const lecturerApi = {
  getAttendanceRecords: (courseId, date) => api.getLecturerAttendanceRecords(courseId, date),
  markAttendance: (data) => api.markAttendance(data),
  submitGrades: (data) => api.submitGrades(data),
  publishGrades: (courseId, semesterId) => api.publishGrades(courseId, semesterId),
}

export const studentApi = {
  getProfile: (id) => api.getStudentProfile(id),
  getTimetable: (id) => api.getStudentTimetable(id),
  getAttendance: (id, params) => api.getStudentAttendance(id, params),
  getResults: (id, params) => api.getStudentResults(id, params),
  getTranscript: (id) => api.getStudentTranscript(id),
  getFees: (id) => api.getStudentFees(id),
  registerCourses: (id, courseIds, semesterId, academicYearId) => api.registerCourses(id, courseIds, semesterId, academicYearId),
  getAvailableCourses: (id) => api.getAvailableCourses(id),
}

export default api