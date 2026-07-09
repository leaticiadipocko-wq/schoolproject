import { createContext, useContext, useState, useCallback } from 'react'

const ExamBoardContext = createContext(null)

export const EXAM_BOARD_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export function ExamBoardProvider({ children }) {
  const [exams, setExams] = useState([])

  const createExam = useCallback((data) => {
    const exam = {
      id: `exam-${Date.now()}`,
      status: EXAM_BOARD_STATUS.SCHEDULED,
      registeredStudents: [],
      createdAt: new Date().toISOString(),
      ...data,
    }
    setExams((prev) => [exam, ...prev])
    return exam
  }, [])

  const updateExamStatus = useCallback((examId, newStatus) => {
    setExams((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, status: newStatus } : e))
    )
  }, [])

  const publishResults = useCallback((examId) => {
    setExams((prev) =>
      prev.map((e) =>
        e.id === examId ? { ...e, resultsPublished: true, status: EXAM_BOARD_STATUS.COMPLETED } : e
      )
    )
  }, [])

  const getExamsByStatus = useCallback(
    (status) => exams.filter((e) => e.status === status),
    [exams]
  )

  return (
    <ExamBoardContext.Provider
      value={{ exams, createExam, updateExamStatus, publishResults, getExamsByStatus }}
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
