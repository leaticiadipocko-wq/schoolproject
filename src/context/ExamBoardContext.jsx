import { createContext, useContext, useState, useEffect } from 'react'

const ExamBoardContext = createContext(null)

const STORE_KEY = 'siarm.examBoard.v1'

/**
 * Canonical exam lifecycle statuses used across the National Exam Board.
 */
export const EXAM_BOARD_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

const SEED_EXAMS = [
  {
    id: 'exam-1',
    title: 'Final Programming',
    course: 'CS501',
    campus: 'bonaberi',
    date: '2026-07-20',
    startTime: '10:00',
    endTime: '12:00',
    venue: 'Hall A',
    totalMarks: 100,
    status: EXAM_BOARD_STATUS.SCHEDULED,
    registeredStudents: ['s1', 's2'],
    results: [],
    createdAt: '2026-06-01T09:00:00.000Z',
  },
  {
    id: 'exam-2',
    title: 'Mobile Development',
    course: 'CS507',
    campus: 'bonamoussadi',
    date: '2026-07-22',
    startTime: '14:00',
    endTime: '16:00',
    venue: 'Hall B',
    totalMarks: 100,
    status: EXAM_BOARD_STATUS.COMPLETED,
    registeredStudents: ['s3', 's4'],
    results: [],
    createdAt: '2026-06-01T09:00:00.000Z',
  },
]

function load() {
  try {
    const stored = localStorage.getItem(STORE_KEY)
    if (!stored) return SEED_EXAMS
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : SEED_EXAMS
  } catch {
    return SEED_EXAMS
  }
}

/**
 * ExamBoardContext - National exam board management
 * Features:
 * - Cross-campus exam scheduling
 * - Student registration
 * - Status lifecycle (scheduled → in_progress → completed / cancelled)
 * - Results publication
 */
export function ExamBoardProvider({ children }) {
  const [exams, setExams] = useState(() => load())

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(exams))
  }, [exams])

  const createExam = (data) => {
    const exam = {
      id: `exam-${Date.now()}`,
      title: data.title || 'Untitled Exam',
      course: data.course || '',
      campus: data.campus || 'bonaberi',
      date: data.date || '',
      startTime: data.startTime || '',
      endTime: data.endTime || '',
      venue: data.venue || '',
      totalMarks: Number(data.totalMarks) || 100,
      status: data.status || EXAM_BOARD_STATUS.SCHEDULED,
      registeredStudents: data.registeredStudents || [],
      results: data.results || [],
      createdAt: new Date().toISOString(),
    }
    setExams((prev) => [exam, ...prev])
    return exam
  }

  const updateExamStatus = (examId, newStatus) => {
    setExams((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, status: newStatus } : e))
    )
  }

  const registerStudent = (examId, studentId) => {
    setExams((prev) =>
      prev.map((e) =>
        e.id === examId && !e.registeredStudents.includes(studentId)
          ? { ...e, registeredStudents: [...e.registeredStudents, studentId] }
          : e
      )
    )
  }

  const publishResults = (examId, results) => {
    setExams((prev) =>
      prev.map((e) =>
        e.id === examId
          ? {
              ...e,
              results: results || e.results,
              status: EXAM_BOARD_STATUS.COMPLETED,
              resultsPublishedAt: new Date().toISOString(),
            }
          : e
      )
    )
  }

  const deleteExam = (examId) => {
    setExams((prev) => prev.filter((e) => e.id !== examId))
  }

  const getExamsByStatus = (status) => exams.filter((e) => e.status === status)

  return (
    <ExamBoardContext.Provider
      value={{
        exams,
        EXAM_BOARD_STATUS,
        createExam,
        updateExamStatus,
        registerStudent,
        publishResults,
        deleteExam,
        getExamsByStatus,
      }}
    >
      {children}
    </ExamBoardContext.Provider>
  )
}

export const useExamBoard = () => {
  const ctx = useContext(ExamBoardContext)
  if (!ctx) throw new Error('useExamBoard must be used inside <ExamBoardProvider>')
  return ctx
}
