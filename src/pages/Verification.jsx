import { useEffect, useState, useRef, Fragment } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download, Printer, FileText, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import PageHeader from '@/components/ui/PageHeader'
import Logo from '@/components/Logo'
import QRCode from '@/components/QRCode'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'

const gradePoints = { 'A': 4, 'B+': 3.5, 'B': 3, 'C+': 2.5, 'C': 2, 'D': 1, 'F': 0 }

export default function Verification() {
  const { type, id, ref: refParam } = useParams()
  const { user } = useAuth()
  const { results: allResults, signatures = {}, users = [], students = [] } = useData()
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)
  const [data, setData] = useState({ student: null, results: [], cgpa: '0.00', receipt: null, enrolment: null })
  const [error, setError] = useState(null)
  const ref = useRef()

  useEffect(() => {
    if (!id) {
      setError('Invalid verification link')
      setLoading(false)
      return
    }

    // Find student by ID
    const foundStudent = users.find(u => u.studentId === id) || students.find(s => s.studentId === id)
    
    if (!foundStudent) {
      setError('Student not found')
      setLoading(false)
      return
    }

    // Load data based on verification type
    let verificationData = {}
    
    switch (type) {
      case 'transcript':
        const studentResults = allResults.filter(r => r.studentId === id)
        const resultsData = studentResults.length > 0 ? studentResults : allResults.filter(r => !r.studentId)
        const cgpaCalc = resultsData.length
          ? (resultsData.reduce((s, r) => s + (gradePoints[r.grade] || 0), 0) / resultsData.length).toFixed(2)
          : '0.00'
        verificationData = {
          student: foundStudent,
          results: resultsData,
          cgpa: cgpaCalc,
        }
        break
        
      case 'results':
        const studentResults2 = allResults.filter(r => r.studentId === id)
        const resultsData2 = studentResults2.length > 0 ? studentResults2 : allResults.filter(r => !r.studentId)
        const cgpaCalc2 = resultsData2.length
          ? (resultsData2.reduce((s, r) => s + (gradePoints[r.grade] || 0), 0) / resultsData2.length).toFixed(2)
          : '0.00'
        verificationData = {
          student: foundStudent,
          results: resultsData2,
          cgpa: cgpaCalc2,
        }
        break
        
      case 'student':
        verificationData = {
          student: foundStudent,
        }
        break
        
      case 'receipt':
        verificationData = {
          student: foundStudent,
          receiptRef: refParam,
        }
        break
        
      case 'enrollment':
        verificationData = {
          student: foundStudent,
          enrolmentRef: refParam,
        }
        break
        
      default:
        setError('Unknown verification type')
        setLoading(false)
        return
    }
    
    setData(verificationData)
    setVerified(true)
    setLoading(false)
  }, [type, id, refParam])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-brand-600 animate-spin" />
          <p className="text-ink-600">Verifying document...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-soft border border-ink-100 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-ink-900 mb-2">Verification Failed</h2>
          <p className="text-ink-600 mb-6">{error}</p>
          <Link to="/" className="btn-primary w-full">Return to Home</Link>
        </div>
      </div>
    )
  }

  if (!verified) {
    return null
  }

  const { student, results = [], cgpa = '0.00', receiptRef, enrolmentRef } = data

  const handleDownload = async () => {
    toast.loading('Generating PDF…', { id: 'pdf' })
    try {
      const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: '#ffffff' })
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const w = pdf.internal.pageSize.getWidth()
      const h = (canvas.height * w) / canvas.width
      pdf.addImage(img, 'PNG', 0, 0, w, h)
      pdf.save(`SIARM_Verification_${type}_${id}.pdf`)
      toast.success('Verification PDF downloaded', { id: 'pdf' })
    } catch (err) {
      toast.error('Failed to generate PDF', { id: 'pdf' })
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'transcript': return 'Transcript'
      case 'results': return 'Results'
      case 'student': return 'Student ID'
      case 'receipt': return 'Receipt'
      case 'enrollment': return 'Enrollment'
      default: return 'Document'
    }
  }

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Public header - minimal */}
      <header className="bg-white border-b border-ink-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size={36} />
          <span className="text-xs text-ink-500">IUGET Verification Portal</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Verification Status Banner */}
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <ShieldCheck size={24} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-emerald-800">Document Verified</p>
            <p className="text-sm text-emerald-600">This {getTypeLabel().toLowerCase()} has been verified against IUGET official records</p>
          </div>
        </div>

        {/* Document */}
        <div ref={ref} className="bg-white rounded-2xl shadow-soft border border-ink-100 p-10">
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-ink-900">
            <Logo size={48} />
            <div className="text-right text-xs text-ink-500">
              <div className="font-semibold text-ink-900 text-base">IUGET — Institut Universitaire des Grandes Écoles des Tropiques</div>
              <div>Bonabéri Campus · BP 3000, Douala, Cameroon</div>
              <div>www.iuget.cm</div>
            </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-center mt-6">OFFICIAL {getTypeLabel().toUpperCase()} VERIFICATION</h2>
          <p className="text-center text-sm text-ink-500 mt-1">Verification Document — Not an Official Print Copy</p>

          {/* Student info */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 mt-8 text-sm">
            <div><span className="text-ink-500">Student Name:</span> <span className="font-medium">{student?.name}</span></div>
            <div><span className="text-ink-500">Student ID:</span> <span className="font-medium">{student?.studentId || '—'}</span></div>
            <div><span className="text-ink-500">Program:</span> <span className="font-medium">{student?.program || '—'}</span></div>
            <div><span className="text-ink-500">Level:</span> <span className="font-medium">{student?.level || '—'}</span></div>
            <div><span className="text-ink-500">Date Issued:</span> <span className="font-medium">{new Date().toLocaleDateString()}</span></div>
            <div><span className="text-ink-500">Document ID:</span> <span className="font-mono text-xs">IUGET-VF-{type.toUpperCase()}-{Date.now().toString(36).toUpperCase()}</span></div>
          </div>

          {/* Results table (if applicable) */}
          {results.length > 0 ? (
              <Fragment>
              <table className="w-full mt-8 text-sm">
                <thead>
                  <tr className="border-b-2 border-ink-900">
                    <th className="text-left py-2">Semester</th>
                    <th className="text-left py-2">Course</th>
                    <th className="text-right py-2">CA</th>
                    <th className="text-right py-2">Exam</th>
                    <th className="text-right py-2">Total</th>
                    <th className="text-right py-2">Grade</th>
                    <th className="text-right py-2">GP</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-b border-ink-100">
                      <td className="py-2 text-ink-600">{r.semester}</td>
                      <td className="py-2 font-medium">{r.course}</td>
                      <td className="py-2 text-right">{r.ca}</td>
                      <td className="py-2 text-right">{r.exam}</td>
                      <td className="py-2 text-right font-semibold">{r.total}</td>
                      <td className="py-2 text-right">{r.grade}</td>
                      <td className="py-2 text-right">{gradePoints[r.grade]?.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-ink-50 text-center">
                  <div className="text-xs text-ink-500">Courses</div>
                  <div className="text-xl font-bold">{results.length}</div>
                </div>
                <div className="p-4 rounded-xl bg-ink-50 text-center">
                  <div className="text-xs text-ink-500">Total Credits</div>
                  <div className="text-xl font-bold">{results.length * 3}</div>
                </div>
                <div className="p-4 rounded-xl bg-brand-50 text-center border border-brand-100">
                  <div className="text-xs text-brand-700">Cumulative GPA</div>
                  <div className="text-2xl font-display font-bold text-brand-700">{cgpa}</div>
                </div>
              </div>
              </Fragment>
          ) : null}

          {/* Signature + Verification QR */}
          <div className="mt-12 pt-6 border-t border-ink-200 grid grid-cols-3 gap-8 items-end">
            <div>
              <div className="h-14 flex items-end justify-center">
                {student?.signature
                  ? <img src={student.signature} alt="" className="h-14 object-contain" />
                  : <span className="text-[10px] text-ink-400 italic">(unsigned)</span>}
              </div>
              <div className="border-t border-ink-400 pt-2 text-xs text-ink-500">Registrar's Signature</div>
            </div>
            <div>
              <div className="h-14 flex items-end justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-brand-800 flex items-center justify-center text-[9px] font-bold text-brand-800 text-center leading-tight">
                  IUGET<br />OFFICIAL<br />SEAL
                </div>
              </div>
              <div className="border-t border-ink-400 pt-2 text-xs text-ink-500">Official Seal</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white p-1 rounded-lg border border-ink-200 shadow-soft">
                <QRCode value={`${window.location.origin}/verify/${type}/${id}`} size={100} />
              </div>
              <div className="text-[10px] text-ink-500 mt-1.5 text-center leading-tight">
                Scan to verify<br />
                <span className="font-mono">{window.location.origin}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-[10px] text-ink-400 text-center flex items-center justify-center gap-1.5">
            <FileText size={10} /> Generated by SIARM · IUGET Bonabéri · Verify at {window.location.origin}/verify/{type}/{id}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => window.print()} className="btn-secondary">
            <Printer size={16} /> Print Verification
          </button>
          <button onClick={handleDownload} className="btn-primary">
            <Download size={16} /> Download Verification PDF
          </button>
          <Link to="/" className="btn-secondary">
            <FileText size={16} /> Back to Home
          </Link>
        </div>
      </main>

      <footer className="bg-white border-t border-ink-100 py-4 mt-8">
        <p className="text-center text-xs text-ink-400">
          © {new Date().getFullYear()} SIARM · IUGET Bonaberi · Verification Portal
        </p>
      </footer>
    </div>
  )
}