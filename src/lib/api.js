/**
 * API Client for SIARM
 * Communicates with the PHP backend API
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE
    this.token = localStorage.getItem('siarm_token')
  }

  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem('siarm_token', token)
    } else {
      localStorage.removeItem('siarm_token')
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const config = {
      ...options,
      headers,
    }

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
  }

  async register(data) {
    return this.request('/auth/register', {
      method: 'POST',
      body: data,
    })
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    })
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
  login: (email, password) => api.login(email, password),
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