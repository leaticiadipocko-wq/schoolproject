/**
 * SIARM Data Context - API Version
 * Connects to PHP backend for data persistence
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { userApi, lecturerApi, studentApi, api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [store, setStore] = useState({
    announcements: [],
    attendance: [],
    attendanceLog: [],
    results: [],
    enrolledCourses: [],
    timetable: [],
    users: [],
    notifications: [],
    theme: 'light',
    fees: {},
    payments: [],
    lessons: [],
    signatures: {},
    photos: {},
    auditLog: [],
    assignments: [],
    submissions: [],
    discussions: [],
    passwordResets: [],
  })
  const [loading, setLoading] = useState(false)

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated, user])

  const loadData = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      // Load data based on user role
      const promises = [
        fetchAnnouncements(),
        fetchUsers(),
        fetchTimetable(),
      ]

      if (user.role === 'student') {
        promises.push(fetchStudentData())
      } else if (user.role === 'lecturer') {
        promises.push(fetchLecturerData())
      } else if (user.role === 'admin' || user.role === 'staff') {
        promises.push(fetchAdminData())
      }

      await Promise.all(promises)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const response = await api.request('/announcements')
      if (response.success) {
        setStore(s => ({ ...s, announcements: response.data }))
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await userApi.getUsers()
      if (response.success) {
        setStore(s => ({ ...s, users: response.data }))
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const fetchTimetable = async () => {
    try {
      const response = await api.request('/timetable')
      if (response.success) {
        setStore(s => ({ ...s, timetable: response.data }))
      }
    } catch (error) {
      console.error('Failed to fetch timetable:', error)
    }
  }

  const fetchStudentData = async () => {
    if (!user) return
    
    try {
      // Get student profile
      const profileResponse = await studentApi.getProfile()
      if (profileResponse.success && profileResponse.data) {
        const studentId = profileResponse.data.id
        
        // Fetch student-specific data
        const [attendanceRes, resultsRes, feesRes] = await Promise.all([
          studentApi.getAttendance(studentId),
          studentApi.getResults(studentId),
          studentApi.getFees(studentId),
        ])

        setStore(s => ({
          ...s,
          attendance: attendanceRes.success ? attendanceRes.data.records : [],
          results: resultsRes.success ? resultsRes.data.results : [],
          fees: feesRes.success ? feesRes.data.fees : {},
          payments: feesRes.success ? feesRes.data.payments : [],
          enrolledCourses: attendanceRes.success 
            ? [...new Set(attendanceRes.data.records.map(r => r.course_id))] 
            : [],
        }))
      }
    } catch (error) {
      console.error('Failed to fetch student data:', error)
    }
  }

  const fetchLecturerData = async () => {
    // Lecturer-specific data loading
    try {
      const response = await api.request('/lecturer/courses')
      if (response.success) {
        setStore(s => ({ ...s, enrolledCourses: response.data }))
      }
    } catch (error) {
      console.error('Failed to fetch lecturer data:', error)
    }
  }

  const fetchAdminData = async () => {
    // Admin-specific data loading
  }

  // Announcements
  const addAnnouncement = useCallback(async (data) => {
    try {
      const response = await api.request('/announcements', {
        method: 'POST',
        body: { ...data, author: user?.full_name },
      })
      if (response.success) {
        setStore(s => ({ ...s, announcements: [response.data, ...s.announcements] }))
        toast.success('Announcement created')
        return response.data
      }
    } catch (error) {
      toast.error('Failed to create announcement')
    }
  }, [user])

  const togglePin = useCallback(async (id) => {
    try {
      const response = await api.request(`/announcements/${id}/pin`, { method: 'POST' })
      if (response.success) {
        setStore(s => ({
          ...s,
          announcements: s.announcements.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a)
        }))
      }
    } catch (error) {
      toast.error('Failed to toggle pin')
    }
  }, [])

  const deleteAnnouncement = useCallback(async (id) => {
    try {
      await api.request(`/announcements/${id}`, { method: 'DELETE' })
      setStore(s => ({ ...s, announcements: s.announcements.filter(a => a.id !== id) }))
      toast.success('Announcement deleted')
    } catch (error) {
      toast.error('Failed to delete announcement')
    }
  }, [])

  // Attendance
  const submitAttendance = useCallback(async ({ course, date, period, presentIds, totalStudents, lecturerId }) => {
    try {
      const response = await lecturerApi.markAttendance({
        course_id: course,
        date,
        slot_id: period,
        records: presentIds.map(studentId => ({ student_id: studentId, status: 'present' })),
      })

      if (response.success) {
        setStore(s => {
          const key = `${course}|${period || 'default'}`
          const existing = s.attendance.find(a => a.course === course && (a.period || 'default') === (period || 'default'))
          let next
          if (existing) {
            const newAttended = existing.attended + presentIds.length
            const newTotal = existing.total + totalStudents
            next = s.attendance.map(a =>
              (a.course === course && (a.period || 'default') === (period || 'default'))
                ? { ...a, attended: newAttended, total: newTotal, percent: Math.round((newAttended / newTotal) * 100) }
                : a
            )
          } else {
            const percent = Math.round((presentIds.length / totalStudents) * 100)
            next = [...s.attendance, { course, period: period || '', attended: presentIds.length, total: totalStudents, percent }]
          }
          return {
            ...s,
            attendance: next,
            attendanceLog: [
              { id: `att-${Date.now()}`, course, date, period: period || '', present: presentIds, lecturerId, createdAt: new Date().toISOString() },
              ...s.attendanceLog,
            ],
          }
        })
        toast.success(`Attendance saved · ${presentIds.length} / ${totalStudents} present`)
      }
    } catch (error) {
      toast.error('Failed to save attendance')
    }
  }, [])

  // Grades
  const submitGrades = useCallback(async ({ course, semester, students }) => {
    try {
      const response = await lecturerApi.submitGrades({
        course_id: course,
        semester_id: semester,
        grades: students,
      })
      if (response.success) {
        setStore(s => {
          const newResults = students.map(st => ({
            course,
            semester,
            ca: st.ca,
            exam: st.exam,
            total: st.ca + st.exam,
            grade: gradeFor(st.ca + st.exam),
            studentId: st.id,
          }))
          const cleaned = s.results.filter(r => !(r.course === course && r.semester === semester))
          return { ...s, results: [...cleaned, ...newResults] }
        })
        toast.success('Grades saved as draft')
      }
    } catch (error) {
      toast.error('Failed to save grades')
    }
  }, [])

  const publishGrades = useCallback(async (courseId, semesterId) => {
    try {
      const response = await lecturerApi.publishGrades(courseId, semesterId)
      if (response.success) {
        setStore(s => ({
          ...s,
          results: s.results.map(r => 
            r.course === courseId && r.semester === semesterId ? { ...r, is_published: true } : r
          )
        }))
        toast.success(`${response.data.published} grades published`)
      }
    } catch (error) {
      toast.error('Failed to publish grades')
    }
  }, [])

  // Courses
  const enrollCourse = useCallback(async (code) => {
    try {
      const response = await api.request('/courses/enroll', {
        method: 'POST',
        body: { course_id: code },
      })
      if (response.success) {
        setStore(s => ({
          ...s,
          enrolledCourses: s.enrolledCourses.includes(code) ? s.enrolledCourses : [...s.enrolledCourses, code],
        }))
        toast.success('Enrolled successfully')
      }
    } catch (error) {
      toast.error('Enrollment failed')
    }
  }, [])

  const unenrollCourse = useCallback(async (code) => {
    try {
      const response = await api.request('/courses/unenroll', {
        method: 'POST',
        body: { course_id: code },
      })
      if (response.success) {
        setStore(s => ({
          ...s,
          enrolledCourses: s.enrolledCourses.filter(c => c !== code),
        }))
        toast.success('Unenrolled successfully')
      }
    } catch (error) {
      toast.error('Unenrollment failed')
    }
  }, [])

  // Users
  const addUser = useCallback(async (userData) => {
    try {
      const response = await userApi.createUser(userData)
      if (response.success) {
        setStore(s => ({
          ...s,
          users: [{ id: response.data.id, ...userData }, ...s.users],
        }))
        toast.success('User added')
        return response.data
      }
    } catch (error) {
      toast.error('Failed to add user')
    }
  }, [])

  const updateUser = useCallback(async (uid, patch) => {
    try {
      const response = await userApi.updateUser(uid, patch)
      if (response.success) {
        setStore(s => ({
          ...s,
          users: s.users.map(u => u.id === uid ? { ...u, ...patch } : u),
        }))
        toast.success('User updated')
      }
    } catch (error) {
      toast.error('Failed to update user')
    }
  }, [])

  const deleteUser = useCallback(async (uid) => {
    try {
      const response = await userApi.deleteUser(uid)
      if (response.success) {
        setStore(s => ({ ...s, users: s.users.filter(u => u.id !== uid) }))
        toast.success('User deleted')
      }
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }, [])

  // Notifications
  const markNotificationRead = useCallback((id) => {
    setStore(s => ({
      ...s,
      notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    }))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setStore(s => ({
      ...s,
      notifications: s.notifications.map(n => ({ ...n, read: true })),
    }))
  }, [])

  // Timetable
  const setTimetableSlot = useCallback(async ({ day, time, course, room, lecturer }) => {
    try {
      const response = await api.request('/timetable', {
        method: 'POST',
        body: { day, time, course, room, lecturer },
      })
      if (response.success) {
        setStore(s => ({
          ...s,
          timetable: [
            ...s.timetable.filter(t => !(t.day === day && t.time === time)),
            { day, time, course, room, lecturer },
          ],
        }))
        toast.success('Timetable updated')
      }
    } catch (error) {
      toast.error('Failed to update timetable')
    }
  }, [])

  const removeTimetableSlot = useCallback(async (day, time) => {
    try {
      await api.request(`/timetable/${day}/${time}`, { method: 'DELETE' })
      setStore(s => ({
        ...s,
        timetable: s.timetable.filter(t => !(t.day === day && t.time === time)),
      }))
      toast.success('Timetable slot removed')
    } catch (error) {
      toast.error('Failed to remove timetable slot')
    }
  }, [])

  // Theme
  const toggleTheme = useCallback(() => {
    setStore(s => (s.theme === 'light' ? s : { ...s, theme: 'light' }))
  }, [])

  // Payments
  const processPayment = useCallback(async ({ amount, method, methodName, phone, reference }) => {
    await new Promise(r => setTimeout(r, 1800))
    const ok = true
    if (!ok) throw new Error('Payment provider declined')

    const ref = reference || `${method.toUpperCase()}-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const date = new Date().toISOString()
    const receipt = {
      id: `pay-${Date.now()}`,
      date,
      amount: Number(amount),
      method: methodName,
      methodId: method,
      phone: phone || '—',
      reference: ref,
      status: 'success',
    }

    setStore(s => ({
      ...s,
      payments: [receipt, ...s.payments],
      fees: {
        ...s.fees,
        paid: s.fees.paid + Number(amount),
        balance: Math.max(0, s.fees.balance - Number(amount)),
      },
    }))

    return receipt
  }, [])

  // Lessons
  const publishLesson = useCallback(async (lesson) => {
    try {
      const response = await api.request('/lessons', {
        method: 'POST',
        body: { ...lesson, publishedAt: new Date().toISOString() },
      })
      if (response.success) {
        setStore(s => ({ ...s, lessons: [response.data, ...s.lessons] }))
        toast.success('Lesson published')
      }
    } catch (error) {
      toast.error('Failed to publish lesson')
    }
  }, [])

  const deleteLesson = useCallback(async (id) => {
    try {
      await api.request(`/lessons/${id}`, { method: 'DELETE' })
      setStore(s => ({ ...s, lessons: s.lessons.filter(l => l.id !== id) }))
      toast.success('Lesson deleted')
    } catch (error) {
      toast.error('Failed to delete lesson')
    }
  }, [])

  // Signatures/Photos
  const saveSignature = useCallback((userId, dataUrl) => {
    setStore(s => ({ ...s, signatures: { ...s.signatures, [userId]: dataUrl } }))
  }, [])

  const savePhoto = useCallback((userId, dataUrl) => {
    setStore(s => ({ ...s, photos: { ...s.photos, [userId]: dataUrl } }))
  }, [])

  // Audit log
  const logAction = useCallback((entry) => {
    setStore(s => ({
      ...s,
      auditLog: [{ id: `al-${Date.now()}`, at: new Date().toISOString(), ...entry }, ...(s.auditLog || [])].slice(0, 1000),
    }))
  }, [])

  // Assignments
  const createAssignment = useCallback(async (data) => {
    try {
      const response = await api.request('/assignments', {
        method: 'POST',
        body: { ...data, createdAt: new Date().toISOString() },
      })
      if (response.success) {
        setStore(s => ({ ...s, assignments: [response.data, ...(s.assignments || [])] }))
        toast.success('Assignment created')
      }
    } catch (error) {
      toast.error('Failed to create assignment')
    }
  }, [])

  const submitAssignment = useCallback(async (data) => {
    try {
      const response = await api.request('/submissions', {
        method: 'POST',
        body: { ...data, submittedAt: new Date().toISOString() },
      })
      if (response.success) {
        setStore(s => ({ ...s, submissions: [response.data, ...(s.submissions || [])] }))
        toast.success('Assignment submitted')
      }
    } catch (error) {
      toast.error('Failed to submit assignment')
    }
  }, [])

  const gradeSubmission = useCallback(async (id, payload) => {
    try {
      const response = await api.request(`/submissions/${id}/grade`, {
        method: 'POST',
        body: { ...payload, gradedAt: new Date().toISOString() },
      })
      if (response.success) {
        setStore(s => ({
          ...s,
          submissions: (s.submissions || []).map(sub => sub.id === id ? { ...sub, ...payload, gradedAt: new Date().toISOString() } : sub),
        }))
        toast.success('Submission graded')
      }
    } catch (error) {
      toast.error('Failed to grade submission')
    }
  }, [])

  // Discussions
  const postDiscussion = useCallback(async (data) => {
    try {
      const response = await api.request('/discussions', {
        method: 'POST',
        body: { ...data, createdAt: new Date().toISOString(), replies: [] },
      })
      if (response.success) {
        setStore(s => ({ ...s, discussions: [response.data, ...(s.discussions || [])] }))
        toast.success('Discussion posted')
      }
    } catch (error) {
      toast.error('Failed to post discussion')
    }
  }, [])

  const replyToDiscussion = useCallback(async (discussionId, reply) => {
    try {
      const response = await api.request(`/discussions/${discussionId}/reply`, {
        method: 'POST',
        body: { ...reply, createdAt: new Date().toISOString() },
      })
      if (response.success) {
        setStore(s => ({
          ...s,
          discussions: (s.discussions || []).map(d =>
            d.id === discussionId
              ? { ...d, replies: [...(d.replies || []), response.data] }
              : d
          ),
        }))
        toast.success('Reply posted')
      }
    } catch (error) {
      toast.error('Failed to post reply')
    }
  }, [])

  // Password reset
  const requestPasswordReset = useCallback(async (email) => {
    try {
      const response = await authApi.forgotPassword(email)
      return response
    } catch (error) {
      throw error
    }
  }, [])

  const resetStore = useCallback(() => {
    localStorage.removeItem('siarm.store.v2')
    setStore(initialState)
  }, [])

  const value = {
    ...store,
    loading,
    addAnnouncement, togglePin, deleteAnnouncement,
    submitAttendance,
    submitGrades,
    publishGrades,
    publishLesson, deleteLesson,
    saveSignature, savePhoto,
    logAction,
    createAssignment, submitAssignment, gradeSubmission,
    postDiscussion, replyToDiscussion,
    requestPasswordReset,
    enrollCourse, unenrollCourse,
    addUser, updateUser, deleteUser,
    markNotificationRead, markAllNotificationsRead,
    setTimetableSlot, removeTimetableSlot,
    toggleTheme,
    processPayment,
    resetStore,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}

function gradeFor(total) {
  if (total >= 80) return 'A'
  if (total >= 70) return 'B+'
  if (total >= 60) return 'B'
  if (total >= 55) return 'C+'
  if (total >= 50) return 'C'
  if (total >= 40) return 'D'
  return 'F'
}

const initialState = {
  announcements: [],
  attendance: [],
  attendanceLog: [],
  results: [],
  enrolledCourses: [],
  timetable: [],
  users: [],
  notifications: [],
  theme: 'light',
  fees: {},
  payments: [],
  lessons: [],
  signatures: {},
  photos: {},
  auditLog: [],
  assignments: [],
  submissions: [],
  discussions: [],
  passwordResets: [],
}