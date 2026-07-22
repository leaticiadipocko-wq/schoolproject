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
    conversations: [
      {
        id: 'conv-1',
        type: 'direct',
        name: 'Chituh Innocentia',
        participants: [
          { uid: 'lec-001', name: 'Mr Nkoma Ngouloure', role: 'lecturer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nkoma' },
          { uid: 'stu-001', name: 'Chituh Innocentia', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Innocentia' },
        ],
        unread: 0,
        updatedAt: new Date(Date.now() - 600000).toISOString(),
      },
      {
        id: 'conv-2',
        type: 'direct',
        name: 'Nkwenti Deshnic',
        participants: [
          { uid: 'lec-001', name: 'Mr Nkoma Ngouloure', role: 'lecturer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nkoma' },
          { uid: 'stu-002', name: 'Nkwenti Deshnic', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deshnic' },
        ],
        unread: 2,
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'conv-3',
        type: 'group',
        name: 'SWE - Compiler Design Group',
        participants: [
          { uid: 'lec-001', name: 'Mr Nkoma Ngouloure', role: 'lecturer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nkoma' },
          { uid: 'stu-001', name: 'Chituh Innocentia', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Innocentia' },
          { uid: 'stu-002', name: 'Nkwenti Deshnic', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deshnic' },
          { uid: 'stu-003', name: 'Wandji Adrien', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adrien' },
        ],
        unread: 5,
        updatedAt: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: 'conv-4',
        type: 'direct',
        name: 'Winner Chinuere',
        participants: [
          { uid: 'sta-001', name: 'Winner Chinuere', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Winner' },
          { uid: 'stu-001', name: 'Chituh Innocentia', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Innocentia' },
        ],
        unread: 0,
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    messages: [
      { id: 'msg-1', conversationId: 'conv-1', sender: { uid: 'stu-001', name: 'Chituh Innocentia' }, text: 'Good morning Mr Nkoma! I had a question about the Compiler Design assignment.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
      { id: 'msg-2', conversationId: 'conv-1', sender: { uid: 'lec-001', name: 'Mr Nkoma Ngouloure' }, text: 'Good morning Innocentia. Sure, what is your question?', timestamp: new Date(Date.now() - 3000000).toISOString(), read: true },
      { id: 'msg-3', conversationId: 'conv-1', sender: { uid: 'stu-001', name: 'Chituh Innocentia' }, text: 'I am working on the LR parser construction and I am stuck on the parsing table. Could you help me understand the reduce actions?', timestamp: new Date(Date.now() - 2400000).toISOString(), read: true },
      { id: 'msg-4', conversationId: 'conv-1', sender: { uid: 'lec-001', name: 'Mr Nkoma Ngouloure' }, text: 'Of course. Let me explain... The reduce action is taken when we have a handle on top of the stack. Look at the item set I₀ — when we see a follow symbol that appears in the FOLLOW of the LHS non-terminal, we reduce by that production.', timestamp: new Date(Date.now() - 1800000).toISOString(), read: true },
      { id: 'msg-5', conversationId: 'conv-1', sender: { uid: 'lec-001', name: 'Mr Nkoma Ngouloure' }, text: 'I will also share an example in class tomorrow. Keep up the good work!', timestamp: new Date(Date.now() - 1200000).toISOString(), read: false },
      { id: 'msg-6', conversationId: 'conv-1', sender: { uid: 'stu-001', name: 'Chituh Innocentia' }, text: 'Thank you sir! That makes sense now. I will practice more examples.', timestamp: new Date(Date.now() - 600000).toISOString(), read: false },
      { id: 'msg-7', conversationId: 'conv-2', sender: { uid: 'stu-002', name: 'Nkwenti Deshnic' }, text: 'Sir, I will not be able to attend the Saturday class. I have a family event.', timestamp: new Date(Date.now() - 7200000).toISOString(), read: true },
      { id: 'msg-8', conversationId: 'conv-2', sender: { uid: 'lec-001', name: 'Mr Nkoma Ngouloure' }, text: 'Noted Deshnic. Please make sure to catch up on the Design Project work with your group mates.', timestamp: new Date(Date.now() - 6000000).toISOString(), read: true },
      { id: 'msg-9', conversationId: 'conv-2', sender: { uid: 'stu-002', name: 'Nkwenti Deshnic' }, text: 'Yes sir, I have already coordinated with my group. Thank you!', timestamp: new Date(Date.now() - 4800000).toISOString(), read: true },
      { id: 'msg-10', conversationId: 'conv-2', sender: { uid: 'stu-002', name: 'Nkwenti Deshnic' }, text: 'Also, could you please send me the Research Methodology slides? I missed the last lecture.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
      { id: 'msg-11', conversationId: 'conv-2', sender: { uid: 'lec-001', name: 'Mr Nkoma Ngouloure' }, text: 'Sure, I will upload them to the portal this evening.', timestamp: new Date(Date.now() - 1800000).toISOString(), read: false },
      { id: 'msg-12', conversationId: 'conv-3', sender: { uid: 'stu-001', name: 'Chituh Innocentia' }, text: 'Good evening everyone! Has anyone started on the Compiler Design assignment?', timestamp: new Date(Date.now() - 7200000).toISOString(), read: true },
      { id: 'msg-13', conversationId: 'conv-3', sender: { uid: 'stu-002', name: 'Nkwenti Deshnic' }, text: 'I started it yesterday. The LR parsing table is quite challenging.', timestamp: new Date(Date.now() - 6000000).toISOString(), read: true },
      { id: 'msg-14', conversationId: 'conv-3', sender: { uid: 'stu-003', name: 'Wandji Adrien' }, text: 'Same here! I spent 3 hours on it and still confused about the shift/reduce conflicts.', timestamp: new Date(Date.now() - 5400000).toISOString(), read: true },
      { id: 'msg-15', conversationId: 'conv-3', sender: { uid: 'lec-001', name: 'Mr Nkoma Ngouloure' }, text: 'Everyone, I see you are struggling. I will dedicate the first 20 minutes of Thursday class to go over the tricky parts. In the meantime, review the example in Chapter 4 of the textbook.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
      { id: 'msg-16', conversationId: 'conv-3', sender: { uid: 'stu-001', name: 'Chituh Innocentia' }, text: 'Thank you sir! That will help a lot.', timestamp: new Date(Date.now() - 3000000).toISOString(), read: true },
      { id: 'msg-17', conversationId: 'conv-3', sender: { uid: 'stu-002', name: 'Nkwenti Deshnic' }, text: 'Thanks Mr Nkoma!', timestamp: new Date(Date.now() - 2400000).toISOString(), read: true },
      { id: 'msg-18', conversationId: 'conv-3', sender: { uid: 'lec-001', name: 'Mr Nkoma Ngouloure' }, text: 'Also, please form groups of 3 for the Design Project. Submit your group composition by Friday.', timestamp: new Date(Date.now() - 1800000).toISOString(), read: false },
      { id: 'msg-19', conversationId: 'conv-3', sender: { uid: 'stu-003', name: 'Wandji Adrien' }, text: 'Noted sir!', timestamp: new Date(Date.now() - 1200000).toISOString(), read: false },
      { id: 'msg-20', conversationId: 'conv-3', sender: { uid: 'stu-001', name: 'Chituh Innocentia' }, text: 'We are already a group of 3! Innocentia, Deshnic and I.', timestamp: new Date(Date.now() - 600000).toISOString(), read: false },
      { id: 'msg-21', conversationId: 'conv-4', sender: { uid: 'stu-005', name: 'Winner Chinuere' }, text: 'Hey Innocentia! Are you coming to the study group tonight?', timestamp: new Date(Date.now() - 90000000).toISOString(), read: true },
      { id: 'msg-22', conversationId: 'conv-4', sender: { uid: 'stu-001', name: 'Chituh Innocentia' }, text: 'Hi Winner! Yes I will be there at 6pm in the library.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true },
    ],
    results: [
      { id: 1, studentId: 'IUGET/2024/SWE/0001', studentName: 'John Doe', course: 'Mathematics', semester: 'Semester 1', ca: 28, exam: 65, total: 93, grade: 'A' },
      { id: 2, studentId: 'IUGET/2024/SWE/0001', studentName: 'John Doe', course: 'Physics', semester: 'Semester 1', ca: 25, exam: 58, total: 83, grade: 'A' },
      { id: 3, studentId: 'IUGET/2024/SWE/0001', studentName: 'John Doe', course: 'Programming', semester: 'Semester 1', ca: 30, exam: 70, total: 100, grade: 'A' },
      { id: 4, studentId: 'IUGET/2024/SWE/0001', studentName: 'John Doe', course: 'Database Systems', semester: 'Semester 2', ca: 27, exam: 62, total: 89, grade: 'A' },
      { id: 5, studentId: 'IUGET/2024/SWE/0001', studentName: 'John Doe', course: 'Web Development', semester: 'Semester 2', ca: 26, exam: 55, total: 81, grade: 'A' },
      { id: 6, studentId: 'IUGET/2024/SWE/0001', studentName: 'John Doe', course: 'Software Engineering', semester: 'Semester 2', ca: 24, exam: 50, total: 74, grade: 'B+' },
      { id: 7, studentId: 'IUGET/2024/SWE/0002', studentName: 'Jane Smith', course: 'Mathematics', semester: 'Semester 1', ca: 22, exam: 45, total: 67, grade: 'B' },
      { id: 8, studentId: 'IUGET/2024/SWE/0002', studentName: 'Jane Smith', course: 'Physics', semester: 'Semester 1', ca: 20, exam: 40, total: 60, grade: 'B' },
      { id: 9, studentId: 'IUGET/2024/SWE/0002', studentName: 'Jane Smith', course: 'Programming', semester: 'Semester 1', ca: 28, exam: 60, total: 88, grade: 'A' },
    ],
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
    libraryBooks: [],
    borrowings: [],
    complaints: [],
    examSeating: {},
    alumni: [],
    events: [],
    campus: 'bonaberi',
  })
  const [loading, setLoading] = useState(false)

  // Lazy data loading — fires in background so login/nav is instant
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => loadData(), 100)
    }
  }, [isAuthenticated, user])

  const loadData = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      const promises = [
        fetchAnnouncements(),
        fetchUsers(),
        fetchTimetable(),
        fetchLibraryData(),
        fetchComplaints(),
        fetchAlumni(),
        fetchEvents(),
        fetchExamSeating(),
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

  const fetchLibraryData = async () => {
    try {
      const response = await api.request('/library/books')
      if (response.success) {
        setStore(s => ({ ...s, libraryBooks: response.data.books, borrowings: response.data.borrowings }))
      }
    } catch (error) {
      console.error('Failed to fetch library data:', error)
    }
  }

  const fetchComplaints = async () => {
    try {
      const response = await api.request('/complaints')
      if (response.success) {
        setStore(s => ({ ...s, complaints: response.data }))
      }
    } catch (error) {
      console.error('Failed to fetch complaints:', error)
    }
  }

  const fetchAlumni = async () => {
    try {
      const response = await api.request('/alumni')
      if (response.success) {
        setStore(s => ({ ...s, alumni: response.data }))
      }
    } catch (error) {
      console.error('Failed to fetch alumni:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await api.request('/events')
      if (response.success) {
        setStore(s => ({ ...s, events: response.data }))
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  const fetchExamSeating = async () => {
    try {
      const response = await api.request('/exam-seating')
      if (response.success) {
        setStore(s => ({ ...s, examSeating: response.data }))
      }
    } catch (error) {
      console.error('Failed to fetch exam seating:', error)
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
      console.warn('Failed to create announcement')
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
      console.warn('Failed to toggle pin')
    }
  }, [])

  const deleteAnnouncement = useCallback(async (id) => {
    try {
      await api.request(`/announcements/${id}`, { method: 'DELETE' })
      setStore(s => ({ ...s, announcements: s.announcements.filter(a => a.id !== id) }))
      toast.success('Announcement deleted')
    } catch (error) {
      console.warn('Failed to delete announcement')
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
      console.warn('Failed to save attendance')
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
      console.warn('Failed to save grades')
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
      console.warn('Failed to publish grades')
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
      console.warn('Enrollment failed')
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
      console.warn('Unenrollment failed')
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
      console.warn('Failed to add user')
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
      console.warn('Failed to update user')
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
      console.warn('Failed to delete user')
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
      console.warn('Failed to update timetable')
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
      console.warn('Failed to remove timetable slot')
    }
  }, [])

  // Theme
  const toggleTheme = useCallback(() => {
    setStore(s => (s.theme === 'light' ? s : { ...s, theme: 'light' }))
  }, [])

  // Payments — real Paystack integration
  const processPayment = useCallback(async ({ amount, method, methodName, phone }) => {
    let initResponse
    try {
      initResponse = await api.request('/api/payments/initialize', {
        method: 'POST',
        body: { amount, method, methodName, phone },
      })
      if (!initResponse.success) throw new Error(initResponse.message || 'Failed to initialize payment')
    } catch (err) {
      throw new Error(err.message || 'Payment gateway unavailable')
    }

    const { authorization_url, access_code, reference, publicKey } = initResponse.data

    // For mobile money (MTN/Orange) — open Paystack SDK inline
    if (['momo', 'om'].includes(method)) {
      return new Promise((resolve, reject) => {
        const handler = window.PaystackPop?.setup({
          key: publicKey,
          email: user?.email || 'student@iuget.cm',
          amount: Math.round(amount * 100),
          ref: reference,
          access_code,
          currency: 'XAF',
          channels: ['mobile_money'],
          mobile_money: { provider: method === 'momo' ? 'mtn' : 'orange' },
          onSuccess: async (txn) => {
            try {
              const verifyResp = await api.request('/api/payments/verify', {
                method: 'POST',
                body: { reference: txn.reference || reference },
              })
              if (!verifyResp.success) throw new Error('Verification failed')
              const receipt = {
                id: `pay-${Date.now()}`,
                date: new Date().toISOString(),
                amount: Number(amount),
                method: methodName,
                methodId: method,
                phone: phone || '—',
                reference: txn.reference || reference,
                status: 'success',
              }
              setStore(s => ({
                ...s,
                payments: [receipt, ...s.payments],
                fees: { ...s.fees, paid: s.fees.paid + Number(amount), balance: Math.max(0, s.fees.balance - Number(amount)) },
              }))
              resolve(receipt)
            } catch (e) {
              reject(e)
            }
          },
          onCancel: () => reject(new Error('Payment cancelled')),
          onError: (err) => reject(new Error(err?.message || 'Payment failed')),
        })
        if (!handler) {
          window.open(authorization_url, '_blank')
          reject(new Error('Paystack popup blocked. Please try again.'))
        }
      })
    }

    // For card / bank — open Paystack checkout modal
    return new Promise((resolve, reject) => {
      const handler = window.PaystackPop?.setup({
        key: publicKey,
        email: user?.email || 'student@iuget.cm',
        amount: Math.round(amount * 100),
        ref: reference,
        access_code,
        currency: 'XAF',
        onSuccess: async (txn) => {
          try {
            const verifyResp = await api.request('/api/payments/verify', {
              method: 'POST',
              body: { reference: txn.reference || reference },
            })
            const receipt = {
              id: `pay-${Date.now()}`,
              date: new Date().toISOString(),
              amount: Number(amount),
              method: methodName,
              methodId: method,
              phone: phone || '—',
              reference: txn.reference || reference,
              status: 'success',
            }
            setStore(s => ({
              ...s,
              payments: [receipt, ...s.payments],
              fees: { ...s.fees, paid: s.fees.paid + Number(amount), balance: Math.max(0, s.fees.balance - Number(amount)) },
            }))
            resolve(receipt)
          } catch (e) {
            reject(e)
          }
        },
        onCancel: () => reject(new Error('Payment cancelled')),
        onError: (err) => reject(new Error(err?.message || 'Payment failed')),
      })
      if (!handler) {
        window.open(authorization_url, '_blank')
        reject(new Error('Paystack popup blocked. Please try again.'))
      }
    })
  }, [user])

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
      console.warn('Failed to publish lesson')
    }
  }, [])

  const deleteLesson = useCallback(async (id) => {
    try {
      await api.request(`/lessons/${id}`, { method: 'DELETE' })
      setStore(s => ({ ...s, lessons: s.lessons.filter(l => l.id !== id) }))
      toast.success('Lesson deleted')
    } catch (error) {
      console.warn('Failed to delete lesson')
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
      console.warn('Failed to create assignment')
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
      console.warn('Failed to submit assignment')
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
      console.warn('Failed to grade submission')
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
      console.warn('Failed to post discussion')
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
      console.warn('Failed to post reply')
    }
  }, [])

  // Chat
  const sendMessage = useCallback((conversationId, text) => {
    if (!text.trim()) return
    const newMsg = {
      id: `msg-${Date.now()}`,
      conversationId,
      sender: { uid: user?.uid, name: user?.name, avatar: user?.avatar },
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    }
    setStore(s => ({
      ...s,
      messages: [...s.messages, newMsg],
      conversations: s.conversations.map(c =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: { text: text.trim(), timestamp: newMsg.timestamp, sender: user?.name },
              unread: 0,
              updatedAt: newMsg.timestamp,
            }
          : c
      ),
    }))
    if (window.siarmSyncMessage) window.siarmSyncMessage(newMsg)
    return newMsg
  }, [user])

  const createConversation = useCallback((participants, type = 'direct', name = '') => {
    const convId = `conv-${Date.now()}`
    const newConv = {
      id: convId,
      type,
      name: name || participants.map(p => p.name).join(', '),
      participants,
      unread: 0,
      updatedAt: new Date().toISOString(),
    }
    setStore(s => ({ ...s, conversations: [newConv, ...s.conversations] }))
    if (window.siarmSyncConv) window.siarmSyncConv(newConv)
    return convId
  }, [])

  const markConversationRead = useCallback((conversationId) => {
    setStore(s => ({
      ...s,
      conversations: s.conversations.map(c =>
        c.id === conversationId ? { ...c, unread: 0 } : c
      ),
    }))
  }, [])

  const addNewUser = useCallback((userData) => {
    const newUser = {
      id: userData.uid || userData.id || `user-${Date.now()}`,
      uid: userData.uid || userData.id || `user-${Date.now()}`,
      name: userData.name || userData.full_name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone || '',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(userData.name || userData.email).replace(/[^a-zA-Z0-9]/g, '')}`,
      createdAt: new Date().toISOString(),
    }
    setStore(s => ({
      ...s,
      users: [newUser, ...s.users.filter(u => u.id !== newUser.id)],
    }))
    return newUser
  }, [])

  // Sync chat data with API
  useEffect(() => {
    const syncMsg = async (msg) => {
      try {
        await fetch('/api/chats/' + msg.conversationId + '/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msg),
        })
      } catch (e) { console.error('Chat sync error:', e) }
    }
    const syncConv = async (conv) => {
      try {
        await fetch('/api/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(conv),
        })
      } catch (e) { console.error('Chat sync error:', e) }
    }
    window.siarmSyncMessage = syncMsg
    window.siarmSyncConv = syncConv
    return () => {
      delete window.siarmSyncMessage
      delete window.siarmSyncConv
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

  // ── Campus ──────────────────────────────────────────────────
  const setCampus = useCallback((campusId) => {
    setStore(s => ({ ...s, campus: campusId }))
  }, [])

  // ── Library ─────────────────────────────────────────────────
  const borrowBook = useCallback(async ({ bookId, userId, userName }) => {
    const book = store.libraryBooks.find(b => b.id === bookId)
    if (!book || book.available < 1) throw new Error('No copies available')
    const borrowing = {
      id: `br-${Date.now()}`,
      bookId, userId, userName,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
      returned: false,
    }
    setStore(s => ({
      ...s,
      borrowings: [...s.borrowings, borrowing],
      libraryBooks: s.libraryBooks.map(b =>
        b.id === bookId ? { ...b, available: b.available - 1 } : b
      ),
    }))
    return borrowing
  }, [store.libraryBooks])

  const returnBook = useCallback((borrowingId) => {
    setStore(s => {
      const br = s.borrowings.find(b => b.id === borrowingId)
      if (!br) return s
      return {
        ...s,
        borrowings: s.borrowings.map(b =>
          b.id === borrowingId ? { ...b, returned: true, returnedDate: new Date().toISOString().split('T')[0] } : b
        ),
        libraryBooks: s.libraryBooks.map(b =>
          b.id === br.bookId ? { ...b, available: b.available + 1 } : b
        ),
      }
    })
  }, [])

  const addLibraryBook = useCallback((book) => {
    setStore(s => ({
      ...s,
      libraryBooks: [{ ...book, id: `bk-${Date.now()}` }, ...s.libraryBooks],
    }))
  }, [])

  // ── Complaints ──────────────────────────────────────────────
  const submitComplaint = useCallback(async ({ category, subject, description, priority }) => {
    const complaint = {
      id: `cp-${Date.now()}`,
      userId: user?.uid,
      userName: user?.name,
      category, subject, description,
      status: 'open', priority: priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setStore(s => ({ ...s, complaints: [complaint, ...s.complaints] }))
    return complaint
  }, [user])

  const updateComplaintStatus = useCallback((id, status, resolution) => {
    setStore(s => ({
      ...s,
      complaints: s.complaints.map(c =>
        c.id === id ? { ...c, status, resolution: resolution || c.resolution, updatedAt: new Date().toISOString() } : c
      ),
    }))
  }, [])

  // ── Events ──────────────────────────────────────────────────
  const addEvent = useCallback((event) => {
    setStore(s => ({
      ...s,
      events: [{ ...event, id: `ev-${Date.now()}` }, ...s.events],
    }))
  }, [])

  const rsvpEvent = useCallback((eventId) => {
    // Simple toggle RSVP (would be per-user in real system)
    toast.success('RSVP recorded')
  }, [])

  // ── Alumni ──────────────────────────────────────────────────
  const registerAlumni = useCallback((data) => {
    const alumni = {
      id: `al-${Date.now()}`,
      ...data,
      graduationYear: parseInt(data.graduationYear) || new Date().getFullYear(),
    }
    setStore(s => ({ ...s, alumni: [alumni, ...s.alumni] }))
    toast.success('Registered as alumni!')
    return alumni
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
    sendMessage, createConversation, markConversationRead, addNewUser,
    requestPasswordReset,
    enrollCourse, unenrollCourse,
    addUser, updateUser, deleteUser,
    markNotificationRead, markAllNotificationsRead,
    setTimetableSlot, removeTimetableSlot,
    toggleTheme,
    processPayment,
    setCampus,
    borrowBook, returnBook, addLibraryBook,
    submitComplaint, updateComplaintStatus,
    addEvent, rsvpEvent,
    registerAlumni,
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
  announcements: [
    { id: 1, title: 'Welcome to SIARM', body: 'Welcome to the new academic year!', author: 'Admin', createdAt: new Date().toISOString(), pinned: true },
    { id: 2, title: 'Exam Schedule', body: 'Final exams start next week.', author: 'Registrar', createdAt: new Date(Date.now() - 86400000).toISOString(), pinned: false },
  ],
  attendance: [
    { course:'Mathematics', period:'Semester 1', attended:22, total:24, percent:92 },
    { course:'Physics', period:'Semester 1', attended:20, total:24, percent:83 },
    { course:'Programming', period:'Semester 1', attended:23, total:24, percent:96 },
    { course:'Database Systems', period:'Semester 2', attended:18, total:20, percent:90 },
    { course:'Web Development', period:'Semester 2', attended:19, total:20, percent:95 },
    { course:'Software Engineering', period:'Semester 2', attended:17, total:20, percent:85 },
  ],
  attendanceLog: [
    { id:'att-1', course:'Mathematics', date:'2026-05-18', period:'18:00 - 20:00', present:['stu-001','stu-002','stu-003'], lecturerId:'lec-001', createdAt:'2026-05-18T18:05:00Z' },
    { id:'att-2', course:'Physics', date:'2026-05-19', period:'20:00 - 22:00', present:['stu-001','stu-003'], lecturerId:'lec-002', createdAt:'2026-05-19T20:05:00Z' },
  ],
  results: [
    { id: 1, studentId: 'IUGET/2025/SWE/0142', studentName: 'Chituh Innocentia', course: 'Mathematics', semester: 'Semester 1', ca: 28, exam: 65, total: 93, grade: 'A' },
    { id: 2, studentId: 'IUGET/2025/SWE/0142', studentName: 'Chituh Innocentia', course: 'Physics', semester: 'Semester 1', ca: 25, exam: 58, total: 83, grade: 'A' },
    { id: 3, studentId: 'IUGET/2025/SWE/0142', studentName: 'Chituh Innocentia', course: 'Programming', semester: 'Semester 1', ca: 30, exam: 65, total: 95, grade: 'A' },
    { id: 4, studentId: 'IUGET/2025/SWE/0142', studentName: 'Chituh Innocentia', course: 'Database Systems', semester: 'Semester 2', ca: 27, exam: 62, total: 89, grade: 'A' },
    { id: 5, studentId: 'IUGET/2025/SWE/0142', studentName: 'Chituh Innocentia', course: 'Web Development', semester: 'Semester 2', ca: 26, exam: 55, total: 81, grade: 'A' },
    { id: 6, studentId: 'IUGET/2025/SWE/0142', studentName: 'Chituh Innocentia', course: 'Software Engineering', semester: 'Semester 2', ca: 24, exam: 50, total: 74, grade: 'B+' },
    { id: 7, studentId: 'IUGET/2025/SWE/0142', studentName: 'Chituh Innocentia', course: 'Compiler Design', semester: 'Semester 2', ca: 22, exam: 45, total: 67, grade: 'B' },
    { id: 8, studentId: 'IUGET/2025/SWE/0142', studentName: 'Chituh Innocentia', course: 'Research Methodology', semester: 'Semester 2', ca: 29, exam: 60, total: 89, grade: 'A' },
    { id: 9, studentId: 'IUGET/2026/SWE/0011', studentName: 'Result Check Student', course: 'Mathematics', semester: 'Semester 1', ca: 25, exam: 60, total: 85, grade: 'A' },
    { id: 10, studentId: 'IUGET/2026/SWE/0011', studentName: 'Result Check Student', course: 'Physics', semester: 'Semester 1', ca: 28, exam: 55, total: 83, grade: 'A' },
    { id: 11, studentId: 'IUGET/2026/SWE/0011', studentName: 'Result Check Student', course: 'Programming', semester: 'Semester 1', ca: 30, exam: 50, total: 80, grade: 'A' },
    { id: 12, studentId: 'IUGET/2026/SWE/0011', studentName: 'Result Check Student', course: 'Database Systems', semester: 'Semester 2', ca: 22, exam: 48, total: 70, grade: 'B+' },
    { id: 13, studentId: 'IUGET/2026/SWE/0011', studentName: 'Result Check Student', course: 'Web Development', semester: 'Semester 2', ca: 25, exam: 45, total: 70, grade: 'B+' },
    { id: 14, studentId: 'IUGET/2026/SWE/0011', studentName: 'Result Check Student', course: 'Software Engineering', semester: 'Semester 2', ca: 20, exam: 40, total: 60, grade: 'B' },
  ],
  enrolledCourses: ['MATH101', 'PHY101', 'CS101', 'DB101', 'WEB101', 'SE101'],
  timetable: [
    { id:1, day:'Monday', time:'08:00-10:00', course:'Mathematics', room:'A101', lecturer:'Dr. Smith', specialty:'SWE', track:'bachelor-evening' },
    { id:2, day:'Monday', time:'10:30-12:30', course:'Physics', room:'B202', lecturer:'Dr. Johnson', specialty:'SWE', track:'bachelor-evening' },
    { id:3, day:'Tuesday', time:'08:00-10:00', course:'Programming', room:'C303', lecturer:'Prof. Williams', specialty:'SWE', track:'bachelor-evening' },
    { id:4, day:'Wednesday', time:'14:00-16:00', course:'Database Systems', room:'D404', lecturer:'Dr. Brown', specialty:'SWE', track:'bachelor-evening' },
    { id:5, day:'Thursday', time:'10:30-12:30', course:'Web Development', room:'E505', lecturer:'Dr. Davis', specialty:'SWE', track:'bachelor-evening' },
    { id:6, day:'Friday', time:'08:00-10:00', course:'Software Engineering', room:'F606', lecturer:'Dr. Wilson', specialty:'SWE', track:'bachelor-evening' },
  ],
  users: [
    { id:1, uid:'stu-001', name:'Chituh Innocentia', email:'student@iuget.cm', role:'student', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Innocentia', phone:'670000001', status:'active', createdAt:'2025-09-01T08:00:00Z' },
    { id:2, uid:'lec-001', name:'Dr. Nkengafac Mfortaw', email:'lecturer@iuget.cm', role:'lecturer', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Mfortaw', phone:'670000002', status:'active', createdAt:'2025-09-01T08:00:00Z' },
    { id:3, uid:'stf-001', name:'Veronica Munteng', email:'staff@iuget.cm', role:'staff', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Munteng', phone:'670000003', status:'active', createdAt:'2025-09-01T08:00:00Z' },
    { id:4, uid:'adm-001', name:'Prof. Fonkem', email:'admin@iuget.cm', role:'admin', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Fonkem', phone:'670000000', status:'active', createdAt:'2025-09-01T08:00:00Z' },
  ],
  notifications: [
    { id:'notif-1', title:'New grade published', body:'Your Mathematics CA result is now available.', read:false, createdAt:new Date(Date.now()-3600000).toISOString() },
    { id:'notif-2', title:'Exam schedule updated', body:'Final exams start next week. Check your timetable.', read:false, createdAt:new Date(Date.now()-86400000).toISOString() },
    { id:'notif-3', title:'Fee payment reminder', body:'Tuition balance of 150,000 FCFA is due by June 30.', read:true, createdAt:new Date(Date.now()-172800000).toISOString() },
  ],
  theme: 'light',
  fees: { total:500000, paid:350000, balance:150000, currency:'FCFA', academicYear:'2025 / 2026' },
  payments: [
    { id:'pay-1', date:'2025-10-15T10:30:00Z', amount:200000, method:'MTN Mobile Money', methodId:'momo', phone:'670000001', reference:'PAYSTACK-REF-001', status:'success' },
    { id:'pay-2', date:'2026-01-20T14:15:00Z', amount:150000, method:'Orange Money', methodId:'om', phone:'670000001', reference:'PAYSTACK-REF-002', status:'success' },
  ],
  lessons: [
    { id:'ls-1', title:'Introduction to Compiler Design', body:'Compilers are programs that translate source code into machine code. The compilation process consists of several phases: lexical analysis, syntax analysis, semantic analysis, intermediate code generation, optimization, and code generation.', course:'Compiler Design', lecturer:'Mr Nkoma Ngouloure', duration:'15 min', publishedAt:new Date(Date.now()-604800000).toISOString(), attachmentName:'CD_Chapter1.pdf' },
    { id:'ls-2', title:'LR Parsing Tables', body:'LR parsing is a bottom-up parsing technique. The LR parser uses a parsing table constructed from the LR items of the grammar. There are three types: SLR(1), CLR(1), and LALR(1).', course:'Compiler Design', lecturer:'Mr Nkoma Ngouloure', duration:'20 min', publishedAt:new Date(Date.now()-432000000).toISOString() },
  ],
  signatures: {},
  photos: {},
  auditLog: [],
  assignments: [
    { id:'as-1', title:'LR Parser Construction', course:'Compiler Design', description:'Construct an LR parsing table for the given grammar and parse the input string.', dueDate:new Date(Date.now()+604800000).toISOString(), lecturer:'Mr Nkoma Ngouloure', createdAt:new Date(Date.now()-86400000).toISOString() },
  ],
  submissions: [],
  discussions: [],
  passwordResets: [],
  libraryBooks: [
    { id:'bk-1', title:'Compilers: Principles, Techniques, and Tools', author:'Aho, Lam, Sethi, Ullman', isbn:'978-0321548463', total:5, available:3, category:'Computer Science' },
    { id:'bk-2', title:'Introduction to Algorithms', author:'Cormen, Leiserson, Rivest, Stein', isbn:'978-0262033848', total:3, available:1, category:'Computer Science' },
    { id:'bk-3', title:'Database System Concepts', author:'Silberschatz, Korth, Sudarshan', isbn:'978-0078022159', total:4, available:2, category:'Database' },
  ],
  borrowings: [
    { id:'br-1', bookId:'bk-1', userId:'stu-001', userName:'Chituh Innocentia', borrowDate:'2026-05-01', dueDate:'2026-05-22', returned:false },
  ],
  complaints: [
    { id:'cp-1', userId:'stu-001', userName:'Chituh Innocentia', category:'Academic', subject:'Grade discrepancy', description:'My CA score for Mathematics appears lower than expected.', status:'open', priority:'high', createdAt:new Date(Date.now()-172800000).toISOString(), updatedAt:new Date(Date.now()-172800000).toISOString() },
  ],
  examSeating: {
    'MAT101': { venue:'Hall A', date:'2026-06-15', time:'08:00 - 11:00', seat:'A-042' },
    'PHY101': { venue:'Hall B', date:'2026-06-17', time:'08:00 - 11:00', seat:'B-018' },
  },
  alumni: [],
  events: [
    { id:'ev-1', title:'End of Semester Exams', date:'2026-06-15', description:'Final examinations for Semester 2 begin.', type:'academic' },
    { id:'ev-2', title:'Project Defense', date:'2026-07-10', description:'Level 3 student project presentations.', type:'academic' },
    { id:'ev-3', title:'Graduation Ceremony', date:'2026-08-20', description:'Graduation ceremony for the 2025/2026 academic year.', type:'social' },
  ],
  campus: 'bonaberi',
}