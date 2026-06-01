import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  MOCK_ANNOUNCEMENTS, MOCK_ATTENDANCE, MOCK_RESULTS,
  MOCK_COURSES, MOCK_TIMETABLE, MOCK_USERS,
  MOCK_FEE_STRUCTURE, MOCK_PAYMENT_HISTORY,
} from '@/lib/mockData'

/**
 * Global persisted application store.
 * Every CRUD button across the app reads/writes through this context,
 * giving full end-to-end functionality with localStorage persistence
 * (no Firebase required for the defense demo).
 */
const DataContext = createContext(null)

const STORE_KEY = 'siarm.store.v2'

const initialState = {
  announcements: MOCK_ANNOUNCEMENTS,
  attendance: MOCK_ATTENDANCE,
  attendanceLog: [],
  results: MOCK_RESULTS,
  enrolledCourses: ['CS501', 'CS503', 'CS505', 'CS507', 'CS509', 'CS511'],
  timetable: MOCK_TIMETABLE,
  users: MOCK_USERS.map(({ password, ...u }) => u),
  notifications: [
    { id: 'n1', text: 'New announcement from Registrar', read: false, time: '2 hours ago' },
    { id: 'n2', text: 'CS505 grades published', read: false, time: '1 day ago' },
    { id: 'n3', text: 'Library hours extended', read: true, time: '2 days ago' },
  ],
  theme: 'light',
  fees: MOCK_FEE_STRUCTURE,
  payments: MOCK_PAYMENT_HISTORY,
}

function load() {
  try {
    const stored = localStorage.getItem(STORE_KEY)
    if (!stored) return initialState
    return { ...initialState, ...JSON.parse(stored) }
  } catch {
    return initialState
  }
}

export function DataProvider({ children }) {
  const [store, setStore] = useState(() => load())

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
  }, [store])

  // ---- Announcements ----
  const addAnnouncement = useCallback((data) => {
    setStore((s) => ({
      ...s,
      announcements: [
        {
          id: `a-${Date.now()}`,
          author: data.author || 'Admin',
          createdAt: new Date().toISOString(),
          pinned: false,
          ...data,
        },
        ...s.announcements,
      ],
    }))
  }, [])

  const togglePin = useCallback((id) => {
    setStore((s) => ({
      ...s,
      announcements: s.announcements.map((a) => a.id === id ? { ...a, pinned: !a.pinned } : a),
    }))
  }, [])

  const deleteAnnouncement = useCallback((id) => {
    setStore((s) => ({
      ...s,
      announcements: s.announcements.filter((a) => a.id !== id),
    }))
  }, [])

  // ---- Attendance ----
  const submitAttendance = useCallback(({ course, date, presentIds, totalStudents, lecturerId }) => {
    setStore((s) => {
      const existing = s.attendance.find((a) => a.course === course)
      let next
      if (existing) {
        const newAttended = existing.attended + presentIds.length
        const newTotal = existing.total + totalStudents
        next = s.attendance.map((a) =>
          a.course === course
            ? { ...a, attended: newAttended, total: newTotal, percent: Math.round((newAttended / newTotal) * 100) }
            : a
        )
      } else {
        const percent = Math.round((presentIds.length / totalStudents) * 100)
        next = [...s.attendance, { course, attended: presentIds.length, total: totalStudents, percent }]
      }
      return {
        ...s,
        attendance: next,
        attendanceLog: [
          { id: `att-${Date.now()}`, course, date, present: presentIds, lecturerId, createdAt: new Date().toISOString() },
          ...s.attendanceLog,
        ],
      }
    })
  }, [])

  // ---- Grades / Results ----
  const submitGrades = useCallback(({ course, semester, students }) => {
    setStore((s) => {
      const newResults = students.map((st) => ({
        course,
        semester,
        ca: st.ca,
        exam: st.exam,
        total: st.ca + st.exam,
        grade: gradeFor(st.ca + st.exam),
        studentId: st.id,
      }))
      const cleaned = s.results.filter((r) => !(r.course === course && r.semester === semester))
      return { ...s, results: [...cleaned, ...newResults] }
    })
  }, [])

  // ---- Courses / Enrollment ----
  const enrollCourse = useCallback((code) => {
    setStore((s) => ({
      ...s,
      enrolledCourses: s.enrolledCourses.includes(code) ? s.enrolledCourses : [...s.enrolledCourses, code],
    }))
  }, [])

  const unenrollCourse = useCallback((code) => {
    setStore((s) => ({
      ...s,
      enrolledCourses: s.enrolledCourses.filter((c) => c !== code),
    }))
  }, [])

  // ---- Users (admin) ----
  const addUser = useCallback((user) => {
    setStore((s) => ({
      ...s,
      users: [{ uid: `usr-${Date.now()}`, status: 'active', ...user }, ...s.users],
    }))
  }, [])

  const updateUser = useCallback((uid, patch) => {
    setStore((s) => ({
      ...s,
      users: s.users.map((u) => u.uid === uid ? { ...u, ...patch } : u),
    }))
  }, [])

  const deleteUser = useCallback((uid) => {
    setStore((s) => ({ ...s, users: s.users.filter((u) => u.uid !== uid) }))
  }, [])

  // ---- Notifications ----
  const markNotificationRead = useCallback((id) => {
    setStore((s) => ({
      ...s,
      notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
    }))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setStore((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }))
  }, [])

  // ---- Timetable ----
  const setTimetableSlot = useCallback(({ day, time, course, room, lecturer }) => {
    setStore((s) => ({
      ...s,
      timetable: [
        ...s.timetable.filter((t) => !(t.day === day && t.time === time)),
        { day, time, course, room, lecturer },
      ],
    }))
  }, [])

  const removeTimetableSlot = useCallback((day, time) => {
    setStore((s) => ({
      ...s,
      timetable: s.timetable.filter((t) => !(t.day === day && t.time === time)),
    }))
  }, [])

  // ---- Theme ----
  const toggleTheme = useCallback(() => {
    setStore((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', store.theme === 'dark')
  }, [store.theme])

  // ---- Fees / Payments ----
  /**
   * Simulate a payment. In production this calls the MoMo / OM API.
   * Returns { receipt } on success.
   */
  const processPayment = useCallback(async ({ amount, method, methodName, phone, reference }) => {
    // Simulated network round-trip
    await new Promise((r) => setTimeout(r, 1800))

    // Simulate 95% success rate (always success in demo for predictability)
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

    setStore((s) => ({
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

  // ---- Reset ----
  const resetStore = useCallback(() => {
    localStorage.removeItem(STORE_KEY)
    setStore(initialState)
  }, [])

  const value = {
    ...store,
    addAnnouncement, togglePin, deleteAnnouncement,
    submitAttendance,
    submitGrades,
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
