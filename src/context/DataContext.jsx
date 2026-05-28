import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  MOCK_ANNOUNCEMENTS, MOCK_ATTENDANCE, MOCK_RESULTS,
  MOCK_COURSES, MOCK_TIMETABLE, MOCK_RECOMMENDED_COURSES, MOCK_USERS,
} from '@/lib/mockData'

/**
 * Global persisted application store.
 * Every CRUD button across the app reads/writes through this context,
 * giving full end-to-end functionality with localStorage persistence
 * (no Firebase required for the defense demo).
 */
const DataContext = createContext(null)

const STORE_KEY = 'siarm.store.v1'

const initialState = {
  announcements: MOCK_ANNOUNCEMENTS,
  attendance: MOCK_ATTENDANCE,
  attendanceLog: [], // records each marked session: { id, course, date, present: [ids], lecturerId }
  results: MOCK_RESULTS,
  enrolledCourses: ['CS301', 'CS305', 'CS307', 'CS309', 'CS311'],
  recommendedCourses: MOCK_RECOMMENDED_COURSES,
  timetable: MOCK_TIMETABLE,
  users: MOCK_USERS.map(({ password, ...u }) => u),
  notifications: [
    { id: 'n1', text: 'New announcement from Registrar', read: false, time: '2 hours ago' },
    { id: 'n2', text: 'CS305 grades published', read: false, time: '1 day ago' },
    { id: 'n3', text: 'Library hours extended', read: true, time: '2 days ago' },
  ],
  theme: 'light',
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
      // Update attendance summary
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
      // Compute course average and add a summary result for the current user
      const newResults = students.map((st) => ({
        course,
        semester,
        ca: st.ca,
        exam: st.exam,
        total: st.ca + st.exam,
        grade: gradeFor(st.ca + st.exam),
        studentId: st.id,
      }))
      // Replace prior submissions for this course/semester
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

  // ---- Reset (for demo) ----
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
