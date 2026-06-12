import { useRef } from 'react'
import { Download, Printer, FileText } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import PageHeader from '@/components/ui/PageHeader'
import Logo from '@/components/Logo'
import QRCode from '@/components/QRCode'

const gradePoints = { 'A': 4, 'B+': 3.5, 'B': 3, 'C+': 2.5, 'C': 2, 'D': 1, 'F': 0 }

export default function Transcript() {
  const { user } = useAuth()
  const { results: allResults, signatures = {} } = useData()
  const registrarSig = signatures['registrar'] || signatures[user?.uid]
  const MOCK_RESULTS = allResults.filter((r) => !r.studentId)
  const ref = useRef()

  const cgpa = MOCK_RESULTS.length
    ? (MOCK_RESULTS.reduce((s, r) => s + (gradePoints[r.grade] || 0), 0) / MOCK_RESULTS.length).toFixed(2)
    : '0.00'

  const handleDownload = async () => {
    toast.loading('Generating PDF…', { id: 'pdf' })
    try {
      const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: '#ffffff' })
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const w = pdf.internal.pageSize.getWidth()
      const h = (canvas.height * w) / canvas.width
      pdf.addImage(img, 'PNG', 0, 0, w, h)
      pdf.save(`SIARM_Transcript_${user?.studentId || user?.uid}.pdf`)
      toast.success('Transcript downloaded', { id: 'pdf' })
    } catch (err) {
      toast.error('Failed to generate PDF', { id: 'pdf' })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Official Transcript"
        subtitle="Generate and download your academic transcript"
        actions={
          <>
            <button onClick={() => window.print()} className="btn-secondary"><Printer size={16} /> Print</button>
            <button onClick={handleDownload} className="btn-primary"><Download size={16} /> Download PDF</button>
          </>
        }
      />

      <div ref={ref} className="bg-white rounded-2xl shadow-soft border border-ink-100 p-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-ink-900">
          <Logo size={48} />
          <div className="text-right text-xs text-ink-500">
            <div className="font-semibold text-ink-900 text-base">IUGET — Institut Universitaire du Golfe de Guinée</div>
            <div>Bonabéri Campus · BP 3000, Douala, Cameroon</div>
            <div>www.iuget.cm</div>
          </div>
        </div>

        <h2 className="text-2xl font-display font-bold text-center mt-6">OFFICIAL ACADEMIC TRANSCRIPT</h2>

        {/* Student info */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 mt-8 text-sm">
          <div><span className="text-ink-500">Student Name:</span> <span className="font-medium">{user?.name}</span></div>
          <div><span className="text-ink-500">Student ID:</span> <span className="font-medium">{user?.studentId || '—'}</span></div>
          <div><span className="text-ink-500">Program:</span> <span className="font-medium">{user?.program || '—'}</span></div>
          <div><span className="text-ink-500">Level:</span> <span className="font-medium">{user?.level || '—'}</span></div>
          <div><span className="text-ink-500">Date Issued:</span> <span className="font-medium">{new Date().toLocaleDateString()}</span></div>
          <div><span className="text-ink-500">Document ID:</span> <span className="font-mono text-xs">IUGET-TR-{Date.now().toString(36).toUpperCase()}</span></div>
        </div>

        {/* Results */}
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
            {MOCK_RESULTS.map((r, i) => (
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
            <div className="text-xl font-bold">{MOCK_RESULTS.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-ink-50 text-center">
            <div className="text-xs text-ink-500">Total Credits</div>
            <div className="text-xl font-bold">{MOCK_RESULTS.length * 3}</div>
          </div>
          <div className="p-4 rounded-xl bg-brand-50 text-center border border-brand-100">
            <div className="text-xs text-brand-700">Cumulative GPA</div>
            <div className="text-2xl font-display font-bold text-brand-700">{cgpa}</div>
          </div>
        </div>

        {/* Signature + Verification QR */}
        <div className="mt-12 pt-6 border-t border-ink-200 grid grid-cols-3 gap-8 items-end">
          <div>
            <div className="h-14 flex items-end justify-center">
              {registrarSig
                ? <img src={registrarSig} alt="" className="h-14 object-contain" />
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
              <QRCode value={`https://verify.iuget.cm/transcript/${user?.studentId?.split('/').pop() || 'student'}`} size={100} />
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 text-center leading-tight">
              Scan to verify<br />
              <span className="font-mono">verify.iuget.cm</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-[10px] text-ink-400 text-center flex items-center justify-center gap-1.5">
          <FileText size={10} /> Generated by SIARM · IUGET Bonabéri · Verify authenticity at verify.iuget.cm/transcript/{user?.studentId?.split('/').pop() || 'student'}
        </div>
      </div>
    </div>
  )
}
