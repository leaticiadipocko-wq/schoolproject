import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { 
  Award, TrendingUp, Target, FileText, Download, 
  Search, Info, Eye, EyeOff, 
  Printer, GraduationCap
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import PageHeader from '@/components/ui/PageHeader'
import StatCard from '@/components/ui/StatCard'
import Logo from '@/components/Logo'
import QRCode from '@/components/QRCode'
import { getResultsVerificationUrl } from '@/lib/verificationUrl'

const gradePoints = { 'A': 4, 'B+': 3.5, 'B': 3, 'C+': 2.5, 'C': 2, 'D': 1, 'F': 0 }

export default function ResultChecker() {
  const { user: authUser } = useAuth()
  const { results: storedResults, signatures = {} } = useData()
  const printRef = useRef()
  const [searchMatricule, setSearchMatricule] = useState('')
  const [step, setStep] = useState('search')
  const [studentData, setStudentData] = useState(null)
  const [studentResults, setStudentResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchMatricule.trim()) return toast.error('Please enter a matricule number')
    
    setLoading(true)
    try {
      const userResults = storedResults.filter(r => 
        r.studentId === searchMatricule || r.studentId === searchMatricule
      )
      if (userResults.length > 0) {
        setStudentResults(userResults)
        setStudentData({ 
          matricule: searchMatricule, 
          name: userResults[0].studentName || 'Student',
          program: userResults[0].program || 'Software Engineering',
          level: userResults[0].level || '1',
          studentId: searchMatricule
        })
        setStep('results')
        toast.success('Results found')
      } else {
        toast.error('No results found for this matricule')
      }
    } catch (err) {
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const print = () => window.print()

  const downloadPDF = async () => {
    const t = toast.loading('Generating PDF…')
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2, backgroundColor: '#ffffff' })
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const w = pdf.internal.pageSize.getWidth()
      const h = (canvas.height * w) / canvas.width
      pdf.addImage(img, 'PNG', 0, 0, w, h)
      pdf.save(`IUGET-Results-${studentData?.matricule?.replace(/\//g, '-') || 'results'}.pdf`)
      toast.success('Results PDF saved', { id: t })
    } catch (err) {
      toast.error('Could not generate PDF', { id: t })
    }
  }

  const gpa = studentResults.length
    ? (studentResults.reduce((s, r) => s + (gradePoints[r.grade] || 0), 0) / studentResults.length).toFixed(2)
    : '0.00'

  const passed = studentResults.filter((r) => r.total >= 50).length

  const bySemester = studentResults.reduce((acc, r) => {
    if (!acc[r.semester]) acc[r.semester] = []
    acc[r.semester].push(r)
    return acc
  }, {})

  const registrarSig = signatures['registrar']

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-center mb-8"><Logo size={56} /></div>

        {step === 'search' && (
          <div className="card">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold">Result Checker Portal</h1>
              <p className="text-ink-500 mt-2">Enter your matricule number to view your academic results</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-5 max-w-md mx-auto">
              <div>
                <label className="label">Matricule Number</label>
                <div className="relative">
                  <GraduationCap size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type="text" className="input pl-11"
                    placeholder="IUGET/2024/SWE/0001"
                    value={searchMatricule} onChange={(e) => setSearchMatricule(e.target.value)}
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Searching…' : <> <Search size={16} className="mr-2" /> Check Results</>}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-ink-600">
              <p>Need help? Contact the <a href="/help" className="text-brand-600 font-medium hover:underline">Support Center</a></p>
              <p className="mt-2">Don't have an account? <Link to="/register" className="text-brand-600 font-medium hover:underline">Register here</Link></p>
            </div>
          </div>
        )}

        {step === 'results' && studentData && (
          <div className="space-y-6">
            <div className="card bg-gradient-to-br from-brand-600 to-accent-600 text-white border-0">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-white/80 text-sm">Statement of Results</div>
                  <h2 className="text-3xl font-display font-bold mt-1">{studentData.name} 👋</h2>
                  <p className="text-white/80 mt-1.5">{studentData.program} · Level {studentData.level} · {studentData.studentId || studentData.matricule}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={print} className="bg-white/15 hover:bg-white/25 transition rounded-xl px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2">
                    <FileText size={16} /> Print
                  </button>
                  <button onClick={downloadPDF} className="bg-white text-brand-600 hover:bg-white/90 transition rounded-xl px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2">
                    <Download size={16} /> Download PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard icon={Award} label="Current GPA" value={gpa} color="brand" />
              <StatCard icon={TrendingUp} label="Highest Score" value={studentResults.length ? Math.max(...studentResults.map(r => r.total)) : '—'} color="green" />
              <StatCard icon={Target} label="Courses Passed" value={`${passed} / ${studentResults.length}`} color="accent" />
            </div>

            <div ref={printRef} className="card bg-white border border-ink-100 rounded-2xl p-8 print-section">
              <div className="flex items-start justify-between pb-4 border-b-2 border-brand-800">
                <Logo size={48} />
                <div className="text-right text-xs text-ink-600">
                  <div className="font-bold text-base text-ink-900">STATEMENT OF RESULTS</div>
                  <div>IUGET Bonabéri · Bursary Office</div>
                  <div>www.iuget.cm</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                <div><span className="text-ink-500">Student name:</span> <span className="font-medium">{studentData.name}</span></div>
                <div><span className="text-ink-500">Student ID:</span> <span className="font-mono font-medium">{studentData.studentId || studentData.matricule || '—'}</span></div>
                <div><span className="text-ink-500">Programme:</span> <span className="font-medium">{studentData.program || '—'}</span></div>
                <div><span className="text-ink-500">Level:</span> <span className="font-medium">{studentData.level || '—'}</span></div>
                <div><span className="text-ink-500">Issue date:</span> <span className="font-medium">{new Date().toLocaleDateString('en-GB')}</span></div>
                <div><span className="text-ink-500">Document ref:</span> <span className="font-mono text-xs">IUGET-RES-{Date.now().toString(36).toUpperCase()}</span></div>
              </div>

              {Object.entries(bySemester).map(([sem, list]) => {
                const semGpa = (list.reduce((s, r) => s + (gradePoints[r.grade] || 0), 0) / list.length).toFixed(2)
                return (
                  <div key={sem} className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-bold text-ink-900">{sem}</h3>
                      <span className="text-xs text-ink-500">{list.length} courses · GPA {semGpa}</span>
                    </div>
                    <table className="w-full text-sm border border-ink-200">
                      <thead className="bg-brand-50 text-xs">
                        <tr>
                          <th className="text-left p-2 border-b border-ink-200">Course</th>
                          <th className="text-right p-2 border-b border-ink-200 w-20">CA (30)</th>
                          <th className="text-right p-2 border-b border-ink-200 w-20">Exam (70)</th>
                          <th className="text-right p-2 border-b border-ink-200 w-20">Total</th>
                          <th className="text-right p-2 border-b border-ink-200 w-20">Grade</th>
                          <th className="text-right p-2 border-b border-ink-200 w-16">GP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((r, i) => (
                          <tr key={i} className="border-b border-ink-100">
                            <td className="p-2 font-medium">{r.course}</td>
                            <td className="p-2 text-right text-ink-600">{r.ca}</td>
                            <td className="p-2 text-right text-ink-600">{r.exam}</td>
                            <td className="p-2 text-right font-semibold">{r.total}</td>
                            <td className="p-2 text-right">
                              <span className={`badge ${
                                r.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                                r.grade.startsWith('B') ? 'bg-brand-100 text-brand-800' :
                                r.grade.startsWith('C') ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }`}>{r.grade}</span>
                            </td>
                            <td className="p-2 text-right text-ink-600">{gradePoints[r.grade]?.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              })}

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-ink-50 text-center">
                  <div className="text-xs text-ink-500">Courses</div>
                  <div className="text-xl font-bold">{studentResults.length}</div>
                </div>
                <div className="p-3 rounded-xl bg-ink-50 text-center">
                  <div className="text-xs text-ink-500">Passed</div>
                  <div className="text-xl font-bold text-emerald-600">{passed}</div>
                </div>
                <div className="p-3 rounded-xl bg-brand-50 text-center border border-brand-100">
                  <div className="text-xs text-brand-800">Cumulative GPA</div>
                  <div className="text-2xl font-display font-bold text-brand-800">{gpa}</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-ink-200 grid grid-cols-3 gap-6 text-xs text-ink-600 items-end">
                <div>
                  <div className="h-12 flex items-end justify-center">
                    {registrarSig
                      ? <img src={registrarSig} alt="" className="h-12 object-contain" />
                      : <span className="text-[10px] text-ink-400 italic">(unsigned)</span>}
                  </div>
                  <div className="border-t border-ink-400 pt-1.5">Registrar's signature</div>
                </div>
                <div>
                  <div className="h-12 flex items-end justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-brand-800 flex items-center justify-center text-[8px] font-bold text-brand-800 text-center leading-tight">
                      IUGET<br />OFFICIAL<br />SEAL
                    </div>
                  </div>
                  <div className="border-t border-ink-400 pt-1.5">Official seal</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white p-1 rounded-lg border border-ink-200 shadow-soft">
                    <QRCode value={getResultsVerificationUrl(studentData.studentId || studentData.matricule)} size={86} />
                  </div>
                  <div className="text-[9px] text-ink-500 mt-1 text-center leading-tight">
                    Scan to verify<br />
                    <span className="font-mono">{new URL(getResultsVerificationUrl(studentData.studentId || studentData.matricule)).origin}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-[9px] text-ink-400 text-center">
                Generated by SIARM · IUGET Bonabéri · Verify at verify.iuget.cm/results/{studentData.studentId?.split('/').pop() || studentData.matricule?.split('/').pop() || 'student'}
              </div>
            </div>

            <style>{`
              @media print {
                body * { visibility: hidden; }
                .print-section, .print-section * { visibility: visible; }
                .print-section { position: absolute; left: 0; top: 0; width: 100%; border: none; padding: 20mm; box-shadow: none; border-radius: 0; }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  )
}