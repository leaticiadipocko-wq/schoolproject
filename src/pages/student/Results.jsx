import { useRef } from 'react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Award, TrendingUp, Target, Printer, Download } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import PageHeader from '@/components/ui/PageHeader'
import StatCard from '@/components/ui/StatCard'
import Logo from '@/components/Logo'
import QRCode from '@/components/QRCode'

const gradePoints = { 'A': 4, 'B+': 3.5, 'B': 3, 'C+': 2.5, 'C': 2, 'D': 1, 'F': 0 }

export default function Results() {
  const { user } = useAuth()
  const { results: storedResults, signatures = {} } = useData()
  const registrarSig = signatures['registrar'] || signatures[user?.uid]
  const printRef = useRef()

  const results = storedResults.filter((r) => !r.studentId)
  const gpa = results.length
    ? (results.reduce((s, r) => s + (gradePoints[r.grade] || 0), 0) / results.length).toFixed(2)
    : '0.00'
  const best = results.length ? results.reduce((m, r) => (r.total > m.total ? r : m), results[0]) : null
  const passed = results.filter((r) => r.total >= 50).length

  // Group by semester for printable sheet
  const bySemester = results.reduce((acc, r) => {
    if (!acc[r.semester]) acc[r.semester] = []
    acc[r.semester].push(r)
    return acc
  }, {})

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
      pdf.save(`IUGET-Results-${user?.studentId?.replace(/\//g, '-')}.pdf`)
      toast.success('Results PDF saved', { id: t })
    } catch (err) {
      toast.error('Could not generate PDF', { id: t })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Results"
        subtitle="Cumulative performance across semesters"
        actions={
          <>
            <button onClick={print} className="btn-secondary"><Printer size={16} /> Print</button>
            <button onClick={downloadPDF} className="btn-primary"><Download size={16} /> Download PDF</button>
          </>
        }
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={Award} label="Current GPA" value={gpa} color="brand" />
        <StatCard icon={TrendingUp} label="Highest Score" value={best ? `${best.total} (${best.course})` : '—'} color="green" />
        <StatCard icon={Target} label="Courses Passed" value={`${passed} / ${results.length}`} color="accent" />
      </div>

      {/* Printable section */}
      <div ref={printRef} className="bg-white border border-ink-100 rounded-2xl p-8 print-section">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-brand-800">
          <Logo size={48} />
          <div className="text-right text-xs text-ink-600">
            <div className="font-bold text-base text-ink-900">STATEMENT OF RESULTS</div>
            <div>IUGET Bonabéri · Bursary Office</div>
            <div>www.iuget.cm</div>
          </div>
        </div>

        {/* Student info */}
        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
          <div><span className="text-ink-500">Student name:</span> <span className="font-medium">{user?.name}</span></div>
          <div><span className="text-ink-500">Student ID:</span> <span className="font-mono font-medium">{user?.studentId || '—'}</span></div>
          <div><span className="text-ink-500">Programme:</span> <span className="font-medium">{user?.program || '—'}</span></div>
          <div><span className="text-ink-500">Level:</span> <span className="font-medium">{user?.level || '—'}</span></div>
          <div><span className="text-ink-500">Issue date:</span> <span className="font-medium">{new Date().toLocaleDateString('en-GB')}</span></div>
          <div><span className="text-ink-500">Document ref:</span> <span className="font-mono text-xs">IUGET-RES-{Date.now().toString(36).toUpperCase()}</span></div>
        </div>

        {/* Results per semester */}
        {Object.entries(bySemester).map(([sem, list]) => {
          const semGpa = (list.reduce((s, r) => s + (gradePoints[r.grade] || 0), 0) / list.length).toFixed(2)
          const semTotal = list.reduce((s, r) => s + r.total, 0)
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

        {/* Summary */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-ink-50 text-center">
            <div className="text-xs text-ink-500">Courses</div>
            <div className="text-xl font-bold">{results.length}</div>
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

        {/* Footer with QR verification */}
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
              <QRCode value={`https://verify.iuget.cm/results/${user?.studentId?.split('/').pop() || 'student'}`} size={86} />
            </div>
            <div className="text-[9px] text-ink-500 mt-1 text-center leading-tight">
              Scan to verify<br />
              <span className="font-mono">verify.iuget.cm</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-[9px] text-ink-400 text-center">
          Generated by SIARM · IUGET Bonabéri · Verify at verify.iuget.cm/results/{user?.studentId?.split('/').pop() || 'student'}
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
  )
}
