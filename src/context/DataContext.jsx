import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import {
  MOCK_ANNOUNCEMENTS, MOCK_ATTENDANCE, MOCK_RESULTS,
  MOCK_COURSES, MOCK_TIMETABLE, MOCK_USERS,
  MOCK_FEE_STRUCTURE, MOCK_PAYMENT_HISTORY,
} from '@/lib/mockData'
import { loadCloud, saveCloud, startPolling } from '@/lib/cloudStore'

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
  lessons: [
    {
      id: 'lesson-1',
      course: 'CS501',
      title: 'Introduction to Compiler Phases',
      body: 'Lexical analysis breaks the source into tokens. Syntax analysis verifies grammar. Semantic analysis checks types and scopes. Code generation finally produces the target.',
      lecturer: 'Mr Nkoma Ngouloure',
      attachmentName: null,
      publishedAt: '2026-05-26T10:00:00Z',
      duration: '12 min read',
    },
    {
      id: 'lesson-2',
      course: 'CS507',
      title: 'React Native — First App',
      body: 'Set up Expo CLI, scaffold a project, render your first component, and handle navigation with React Navigation.',
      lecturer: 'Mr Smith Wills',
      attachmentName: null,
      publishedAt: '2026-05-24T09:00:00Z',
      duration: '15 min read',
    },
  ],
  signatures: {},        // map of userId -> dataUrl
  photos:     {},        // map of userId -> dataUrl
  auditLog: [
    { id: 'al-1', actor: 'Mrs Linda Foncha', role: 'staff', action: 'student.enrol',     target: 'IUGET/2026/SWE/0237', at: new Date(Date.now() - 2 * 3600_000).toISOString() },
    { id: 'al-2', actor: 'Prof. James Murdza', role: 'admin', action: 'announcement.publish', target: 'Mid-semester closure',  at: new Date(Date.now() - 5 * 3600_000).toISOString() },
    { id: 'al-3', actor: 'Mr Nkoma Ngouloure', role: 'lecturer', action: 'grades.submit', target: 'CS501 — 38 students', at: new Date(Date.now() - 24 * 3600_000).toISOString() },
  ],
  assignments: [
    {
      id: 'as-1', course: 'CS501', title: 'Lexical Analyser Implementation', dueAt: new Date(Date.now() + 7 * 24 * 3600_000).toISOString(),
      description: 'Build a hand-written lexer for the toy language defined in lecture 3. Submit your source files as a ZIP.',
      lecturer: 'Mr Nkoma Ngouloure', maxPoints: 20, createdAt: new Date().toISOString(),
    },
    {
      id: 'as-2', course: 'CS507', title: 'Mobile App MVP', dueAt: new Date(Date.now() + 14 * 24 * 3600_000).toISOString(),
      description: 'Ship a 3-screen Expo app with navigation and one persisted state slice. Submit the GitHub URL.',
      lecturer: 'Mr Smith Wills', maxPoints: 30, createdAt: new Date().toISOString(),
    },
  ],
  submissions: [],       // { id, assignmentId, studentId, body, fileName, submittedAt, grade?, feedback? }
  discussions: [
    { id: 'd-1', course: 'CS501', author: 'Mr Nkoma Ngouloure', role: 'lecturer',
      body: 'Welcome to Compiler Design. Drop your questions about lexical analysis here this week.',
      createdAt: new Date(Date.now() - 24 * 3600_000).toISOString(), replies: [] },
  ],
  passwordResets: [],    // { token, email, expiresAt }
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
  // Becomes true once we've attempted to load the shared server store, after
  // which local changes are pushed back to the server. Guarding on this avoids
  // overwriting good server data with local defaults during the first paint.
  const cloudReady = useRef(false)

  // On mount: hydrate from the shared cloud store (if the API is reachable),
  // so every device that opens the app sees the same live data.
  useEffect(() => {
    let alive = true
    let stopPoll = null

    loadCloud().then((remote) => {
      if (alive && remote) setStore((s) => ({ ...initialState, ...remote }))
      cloudReady.current = true

      // Start polling for cross-device sync after initial load
      if (alive) {
        stopPoll = startPolling((remoteData) => {
          setStore((s) => ({ ...s, ...remoteData }))
        })
      }
    })

    return () => {
      alive = false
      if (stopPoll) stopPoll()
    }
  }, [])

  // Persist every change locally (offline resilience) and, once hydrated,
  // to the shared server store so other devices receive it.
  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
    if (cloudReady.current) saveCloud(store)
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

  // ---- Lessons (Mobile Learning) ----
  const publishLesson = useCallback((lesson) => {
    setStore((s) => ({
      ...s,
      lessons: [{
        id: `lesson-${Date.now()}`,
        publishedAt: new Date().toISOString(),
        duration: lesson.duration || '5 min read',
        ...lesson,
      }, ...s.lessons],
    }))
  }, [])

  const deleteLesson = useCallback((id) => {
    setStore((s) => ({ ...s, lessons: s.lessons.filter((l) => l.id !== id) }))
  }, [])

  // ---- Signatures + Photos ----
  const saveSignature = useCallback((userId, dataUrl) => {
    setStore((s) => ({ ...s, signatures: { ...s.signatures, [userId]: dataUrl } }))
  }, [])

  const savePhoto = useCallback((userId, dataUrl) => {
    setStore((s) => ({ ...s, photos: { ...s.photos, [userId]: dataUrl } }))
  }, [])

  // ---- Audit log ----
  const logAction = useCallback((entry) => {
    setStore((s) => ({
      ...s,
      auditLog: [{ id: `al-${Date.now()}`, at: new Date().toISOString(), ...entry }, ...(s.auditLog || [])].slice(0, 1000),
    }))
  }, [])

  // ---- Assignments ----
  const createAssignment = useCallback((data) => {
    setStore((s) => ({
      ...s,
      assignments: [{ id: `as-${Date.now()}`, createdAt: new Date().toISOString(), maxPoints: 20, ...data }, ...(s.assignments || [])],
    }))
  }, [])

  const submitAssignment = useCallback((data) => {
    setStore((s) => ({
      ...s,
      submissions: [{ id: `sub-${Date.now()}`, submittedAt: new Date().toISOString(), ...data }, ...(s.submissions || [])],
    }))
  }, [])

  const gradeSubmission = useCallback((id, payload) => {
    setStore((s) => ({
      ...s,
      submissions: (s.submissions || []).map((sub) => (sub.id === id ? { ...sub, ...payload, gradedAt: new Date().toISOString() } : sub)),
    }))
  }, [])

  // ---- Discussions ----
  const postDiscussion = useCallback((data) => {
    setStore((s) => ({
      ...s,
      discussions: [{ id: `d-${Date.now()}`, createdAt: new Date().toISOString(), replies: [], ...data }, ...(s.discussions || [])],
    }))
  }, [])

  const replyToDiscussion = useCallback((discussionId, reply) => {
    setStore((s) => ({
      ...s,
      discussions: (s.discussions || []).map((d) =>
        d.id === discussionId
          ? { ...d, replies: [...(d.replies || []), { id: `r-${Date.now()}`, createdAt: new Date().toISOString(), ...reply }] }
          : d
      ),
    }))
  }, [])

  // ---- Password reset (mock) ----
  const requestPasswordReset = useCallback((email) => {
    const token = Math.random().toString(36).slice(2, 10).toUpperCase()
    const expiresAt = new Date(Date.now() + 30 * 60_000).toISOString()
    setStore((s) => ({
      ...s,
      passwordResets: [{ token, email, expiresAt, used: false }, ...(s.passwordResets || []).slice(0, 19)],
    }))
    return { token, expiresAt }
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
