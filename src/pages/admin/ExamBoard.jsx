import { useState } from 'react'
import { Plus, Edit2, Trash2, Check, AlertCircle } from 'lucide-react'
import { useExamBoard, EXAM_BOARD_STATUS } from '@/context/ExamBoardContext'
import { useCampus, CAMPUSES } from '@/context/CampusContext'
import PageHeader from '@/components/ui/PageHeader'
import toast from 'react-hot-toast'

/**
 * ExamBoard - National exam board management
 * Features:
 * - Cross-campus exam scheduling
 * - Student registration
 * - Invigilator assignment
 * - Results publication
 */
export default function ExamBoard() {
  const { exams, createExam, updateExamStatus, publishResults, getExamsByStatus } = useExamBoard()
  const { CAMPUSES: campusMap } = useCampus()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    campus: 'bonaberi',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    totalMarks: 100,
  })

  const handleCreateExam = (e) => {
    e.preventDefault()
    try {
      createExam(formData)
      toast.success('Exam created successfully')
      setFormData({
        title: '',
        course: '',
        campus: 'bonaberi',
        date: '',
        startTime: '',
        endTime: '',
        venue: '',
        totalMarks: 100,
      })
      setShowForm(false)
    } catch (error) {
      toast.error('Failed to create exam')
    }
  }

  const handleStatusChange = (examId, newStatus) => {
    updateExamStatus(examId, newStatus)
    toast.success(`Exam status updated to ${newStatus}`)
  }

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="National Exam Board" 
        description="Manage exams across Bonaberi and Bonamoussadi campuses"
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-ink-200">
          <p className="text-sm text-ink-500 mb-1">Scheduled</p>
          <p className="text-2xl font-bold text-ink-900">
            {getExamsByStatus(EXAM_BOARD_STATUS.SCHEDULED).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-ink-200">
          <p className="text-sm text-ink-500 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">
            {getExamsByStatus(EXAM_BOARD_STATUS.IN_PROGRESS).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-ink-200">
          <p className="text-sm text-ink-500 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {getExamsByStatus(EXAM_BOARD_STATUS.COMPLETED).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-ink-200">
          <p className="text-sm text-ink-500 mb-1">Total Registered</p>
          <p className="text-2xl font-bold text-brand-600">
            {exams.reduce((acc, e) => acc + e.registeredStudents.length, 0)}
          </p>
        </div>
      </div>

      {/* Create Exam Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-ink-900">Exams</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Exam
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-lg p-6 border border-ink-200">
          <h4 className="text-lg font-semibold mb-4 text-ink-900">Create New Exam</h4>
          <form onSubmit={handleCreateExam} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Exam Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="e.g., Final Programming"
                  required
                />
              </div>
              <div>
                <label className="label">Course</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="input"
                  placeholder="Course code"
                  required
                />
              </div>
              <div>
                <label className="label">Campus</label>
                <select
                  value={formData.campus}
                  onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                  className="input"
                >
                  {Object.values(CAMPUSES).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="input"
                  placeholder="Hall, Room number"
                  required
                />
              </div>
              <div>
                <label className="label">Total Marks</label>
                <input
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                  className="input"
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Exam
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Exams List */}
      <div className="bg-white rounded-lg border border-ink-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-ink-50 border-b border-ink-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-ink-900">Exam</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-ink-900">Campus</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-ink-900">Date & Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-ink-900">Registered</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-ink-900">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-ink-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map(exam => (
              <tr key={exam.id} className="border-b border-ink-100 hover:bg-ink-50 transition">
                <td className="px-6 py-4">
                  <p className="font-medium text-ink-900">{exam.title}</p>
                  <p className="text-sm text-ink-500">{exam.course}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {Object.values(CAMPUSES).find(c => c.id === exam.campus)?.code}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-ink-900">{exam.date}</p>
                  <p className="text-xs text-ink-500">{exam.startTime} - {exam.endTime}</p>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-ink-900">
                  {exam.registeredStudents.length}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={exam.status}
                    onChange={(e) => handleStatusChange(exam.id, e.target.value)}
                    className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${statusColors[exam.status]}`}
                  >
                    {Object.entries(EXAM_BOARD_STATUS).map(([key, value]) => (
                      <option key={key} value={value}>{value.replace('_', ' ')}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 hover:bg-ink-200 rounded transition" title="Edit">
                    <Edit2 size={16} className="text-ink-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {exams.length === 0 && (
          <div className="p-8 text-center text-ink-500">
            <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
            <p>No exams created yet. Create your first exam to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
