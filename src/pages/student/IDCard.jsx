import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Printer, Download, Eye, RotateCcw, ShieldCheck, QrCode } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import PageHeader from '@/components/ui/PageHeader'
import QRCode from '@/components/QRCode'

export default function IDCard() {
  const { user } = useAuth()
  const { photos = {}, signatures = {} } = useData()
  const photoUrl = photos[user?.uid] || user?.avatar
  const sigUrl   = signatures[user?.uid]
  const [flipped, setFlipped] = useState(false)
  const cardRef = useRef()

  const issued = '2023-10-01'
  const expires = '2027-09-30'
  const bloodGroup = 'O+'
  const emergency = '+237 690 000 000'

  const printCard = () => window.print()

  const downloadPNG = async () => {
    const t = toast.loading('Generating image…')
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null })
      const link = document.createElement('a')
      link.download = `IUGET-IDCard-${user?.studentId?.replace(/\//g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('PNG downloaded', { id: t })
    } catch (err) {
      toast.error('Could not generate image', { id: t })
    }
  }

  const downloadPDF = async () => {
    const t = toast.loading('Generating PDF…')
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null })
      const img = canvas.toDataURL('image/png')
      // Standard ID-1 dimensions: 85.60 × 53.98 mm — but we'll render larger for clarity
      const pdf = new jsPDF('l', 'mm', [86, 54])
      pdf.addImage(img, 'PNG', 0, 0, 86, 54)
      pdf.save(`IUGET-IDCard-${user?.studentId?.replace(/\//g, '-')}.pdf`)
      toast.success('ID card PDF downloaded', { id: t })
    } catch (err) {
      toast.error('Could not generate PDF', { id: t })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Student ID Card"
        subtitle="Official IUGET student identification"
        actions={
          <>
            <button onClick={() => setFlipped(!flipped)} className="btn-secondary">
              <RotateCcw size={16} /> {flipped ? 'Show front' : 'Show back'}
            </button>
            <button onClick={printCard} className="btn-secondary"><Printer size={16} /> Print</button>
            <button onClick={downloadPNG} className="btn-secondary"><Download size={16} /> PNG</button>
            <button onClick={downloadPDF} className="btn-primary"><Download size={16} /> PDF</button>
          </>
        }
      />

      {/* Stage */}
      <div className="card flex items-center justify-center py-12 bg-gradient-to-br from-ink-100 to-ink-50">
        <div
          ref={cardRef}
          className="relative idcard-print"
          style={{ width: 560, height: 352, perspective: 1500 }}
        >
          <div
            className="absolute inset-0 transition-transform duration-700"
            style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
          >
            {/* ===== FRONT ===== */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900" />
              {/* Decorative angle */}
              <div className="absolute top-0 right-0 w-2/3 h-1/2 bg-accent-600 opacity-90"
                   style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }} />
              <div className="absolute top-0 right-0 w-2/3 h-1/2 bg-brand-800 opacity-60"
                   style={{ clipPath: 'polygon(35% 0, 100% 0, 100% 80%, 0 100%)' }} />

              {/* Header strip */}
              <div className="relative z-10 flex items-center gap-3 px-5 pt-4">
                <img src="/brand/iuget-logo-white.png" alt="IUGET" className="w-12 h-12 object-contain" />
                <div className="text-white leading-tight">
                  <div className="font-display font-bold text-sm">IUGET</div>
                  <div className="text-[9px] opacity-90">Institut Universitaire des Grandes Écoles des Tropiques</div>
                  <div className="text-[8px] opacity-75">Campus de Bonabéri · Douala, Cameroun</div>
                </div>
                <div className="ml-auto text-right text-white">
                  <div className="text-[9px] opacity-75 uppercase tracking-wider">Student Card</div>
                  <div className="text-[10px] font-semibold">2025 / 2026</div>
                </div>
              </div>

              {/* Photo + info */}
              <div className="relative z-10 flex gap-4 px-5 mt-3">
                <div className="w-28 h-32 rounded-lg bg-white p-1 shrink-0">
                  <img src={photoUrl} alt="" className="w-full h-full rounded-md object-cover bg-ink-100" />
                </div>
                <div className="flex-1 text-white pt-1">
                  <div className="text-[9px] uppercase tracking-wider opacity-75">Full name</div>
                  <div className="font-display font-bold text-lg leading-tight">{user?.name}</div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3 text-[10px]">
                    <div>
                      <div className="uppercase tracking-wider opacity-75">Student ID</div>
                      <div className="font-mono font-bold text-xs">{user?.studentId || 'IUGET/2023/CS/0142'}</div>
                    </div>
                    <div>
                      <div className="uppercase tracking-wider opacity-75">Level</div>
                      <div className="font-bold">{user?.level || 3}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="uppercase tracking-wider opacity-75">Programme</div>
                      <div className="font-medium">{user?.program || 'BSc Computer Science'}</div>
                    </div>
                    <div>
                      <div className="uppercase tracking-wider opacity-75">Issued</div>
                      <div>{new Date(issued).toLocaleDateString('en-GB')}</div>
                    </div>
                    <div>
                      <div className="uppercase tracking-wider opacity-75">Valid until</div>
                      <div>{new Date(expires).toLocaleDateString('en-GB')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom strip */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur px-5 py-2 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[9px] tracking-wider text-ink-700 truncate">
                    &lt;&lt;{user?.studentId?.replace(/\//g, '&lt;')}&lt;&lt;{user?.name?.toUpperCase().replace(/\s+/g, '&lt;')}&lt;&lt;
                  </div>
                </div>
                {sigUrl && (
                  <img src={sigUrl} alt="" className="h-7 object-contain" />
                )}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-800">
                  <ShieldCheck size={12} /> Verified
                </div>
              </div>
            </div>

            {/* ===== BACK ===== */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-ink-50 to-white"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              {/* Top stripe */}
              <div className="bg-brand-800 h-9 flex items-center px-5">
                <div className="text-white text-[9px] uppercase tracking-widest font-semibold">If found, please return to IUGET Registrar</div>
              </div>
              {/* Magnetic-stripe look */}
              <div className="h-9 bg-ink-900 mt-3" />

              <div className="px-5 py-3 grid grid-cols-2 gap-3">
                <div className="space-y-2 text-[10px]">
                  <div>
                    <div className="uppercase tracking-wider text-ink-500 text-[9px]">Email</div>
                    <div className="font-medium text-ink-800">{user?.email}</div>
                  </div>
                  <div>
                    <div className="uppercase tracking-wider text-ink-500 text-[9px]">Blood group</div>
                    <div className="font-bold text-accent-600">{bloodGroup}</div>
                  </div>
                  <div>
                    <div className="uppercase tracking-wider text-ink-500 text-[9px]">Emergency</div>
                    <div className="font-mono text-ink-800">{emergency}</div>
                  </div>
                  <div>
                    <div className="uppercase tracking-wider text-ink-500 text-[9px]">Department</div>
                    <div className="text-ink-800">Computer Science</div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white p-1.5 rounded-lg shadow border border-ink-200">
                    <QRCode value={`verify.iuget.cm/${user?.studentId?.split('/').pop() || 'student'}`} size={110} />
                  </div>
                  <div className="text-[8px] text-ink-500 mt-1 flex items-center gap-1">
                    <QrCode size={9} /> verify.iuget.cm
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 px-5 py-2 bg-ink-50 border-t border-ink-200 text-[8px] text-ink-500 leading-relaxed">
                This card remains the property of IUGET. It is non-transferable and must be presented on demand.
                Loss must be reported within 24 hours to the Registrar.
                <span className="float-right font-mono">SIARM · v1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center">
            <Eye size={18} />
          </div>
          <div className="text-sm text-ink-600">
            <span className="font-semibold text-ink-900">Tip:</span> Click "Show back" to view the back of your ID card,
            which contains your QR code for verification and emergency information.
            You can print this card on standard A4 paper (~85 × 54 mm), or save it as PNG/PDF for digital use.
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .idcard-print, .idcard-print * { visibility: visible; }
          .idcard-print { position: absolute; left: 50%; top: 30%; transform: translate(-50%, -50%); }
        }
      `}</style>
    </div>
  )
}
