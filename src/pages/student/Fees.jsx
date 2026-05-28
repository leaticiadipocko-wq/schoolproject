import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  Wallet, CreditCard, Smartphone, Building2, CheckCircle2, X, Loader2,
  ArrowRight, Printer, Download, Receipt, AlertCircle,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { PAYMENT_METHODS } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'
import StatCard from '@/components/ui/StatCard'
import Logo from '@/components/Logo'

const formatFCFA = (n) => new Intl.NumberFormat('fr-CM').format(n) + ' FCFA'

const METHOD_ICONS = {
  momo: Smartphone,
  om:   Smartphone,
  visa: CreditCard,
  bank: Building2,
}

export default function Fees() {
  const { user } = useAuth()
  const { fees, payments, processPayment } = useData()

  const [step, setStep] = useState('idle')  // idle | choose | form | processing | success
  const [method, setMethod] = useState(null)
  const [amount, setAmount] = useState(fees.balance)
  const [phone, setPhone] = useState('')
  const [card, setCard] = useState({ number: '', exp: '', cvc: '' })
  const [bank, setBank] = useState('Afriland First Bank')
  const [receipt, setReceipt] = useState(null)
  const [error, setError] = useState('')
  const receiptRef = useRef()

  const openPay = () => {
    setMethod(null); setAmount(fees.balance); setStep('choose')
    setPhone(''); setError('')
  }

  const selectMethod = (m) => {
    setMethod(m); setStep('form')
  }

  const submit = async (e) => {
    e?.preventDefault()
    setError('')

    if (!amount || amount <= 0) return setError('Enter a valid amount')
    if (amount > fees.balance) return setError(`Amount cannot exceed balance of ${formatFCFA(fees.balance)}`)
    if (['momo', 'om'].includes(method.id)) {
      if (!/^6[2-9]\d{7}$/.test(phone.replace(/\s/g, ''))) return setError('Enter a valid Cameroonian phone number (e.g. 690 123 456)')
    }
    if (method.id === 'visa') {
      if (!/^\d{16}$/.test(card.number.replace(/\s/g, ''))) return setError('Card number must be 16 digits')
      if (!/^\d{2}\/\d{2}$/.test(card.exp)) return setError('Expiry format MM/YY')
      if (!/^\d{3,4}$/.test(card.cvc)) return setError('CVC must be 3 or 4 digits')
    }

    setStep('processing')
    try {
      const r = await processPayment({
        amount,
        method: method.id,
        methodName: method.name,
        phone: ['momo', 'om'].includes(method.id) ? phone : null,
      })
      setReceipt(r)
      setStep('success')
      toast.success('Payment successful!')
    } catch (err) {
      setStep('form')
      setError(err.message || 'Payment failed. Please try again.')
    }
  }

  const close = () => {
    setStep('idle'); setMethod(null); setReceipt(null)
  }

  const downloadReceipt = async () => {
    if (!receiptRef.current) return
    const t = toast.loading('Generating PDF…')
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff' })
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const w = pdf.internal.pageSize.getWidth()
      const h = (canvas.height * w) / canvas.width
      pdf.addImage(img, 'PNG', 0, 0, w, h)
      pdf.save(`SIARM-Receipt-${receipt.reference}.pdf`)
      toast.success('Receipt downloaded', { id: t })
    } catch (err) {
      toast.error('Could not generate PDF', { id: t })
    }
  }

  const printReceipt = () => window.print()

  const paidPercent = Math.round((fees.paid / fees.total) * 100)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tuition & Fees"
        subtitle={`Academic Year ${fees.academicYear}`}
        actions={
          fees.balance > 0 && (
            <button onClick={openPay} className="btn-primary">
              <Wallet size={16} /> Pay now
            </button>
          )
        }
      />

      {/* Hero card with balance */}
      <div className="card bg-gradient-to-br from-brand-800 to-brand-950 text-white border-0">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="text-white/70 text-sm">Outstanding balance</div>
            <div className="text-5xl font-display font-bold mt-1">{formatFCFA(fees.balance)}</div>
            <div className="text-sm text-white/80 mt-2">
              Deadline: <strong>{new Date(fees.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </div>
            {fees.balance > 0 ? (
              <button onClick={openPay} className="mt-4 bg-white text-brand-900 hover:bg-white/90 transition rounded-xl px-5 py-2.5 text-sm font-bold inline-flex items-center gap-2">
                Make a payment <ArrowRight size={16} />
              </button>
            ) : (
              <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-200 rounded-xl px-3 py-2 text-sm">
                <CheckCircle2 size={16} /> Fully paid — thank you!
              </div>
            )}
          </div>

          <div className="w-full md:w-72">
            <div className="text-xs text-white/70 mb-2">Payment progress · {paidPercent}%</div>
            <div className="h-3 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-500 to-amber-400 rounded-full transition-all" style={{ width: `${paidPercent}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/80">
              <div>Paid: <strong className="text-white">{formatFCFA(fees.paid)}</strong></div>
              <div className="text-right">Total: <strong className="text-white">{formatFCFA(fees.total)}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee breakdown + history */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-display font-bold text-lg mb-4">Fee Breakdown</h3>
          <div className="space-y-2">
            {[
              { label: 'Tuition',          v: fees.tuition },
              { label: 'Registration',     v: fees.registration },
              { label: 'Exam fee',         v: fees.examFee },
              { label: 'Library fee',      v: fees.libraryFee },
              { label: 'Student Union',    v: fees.studentUnion },
            ].map((r) => (
              <div key={r.label} className="flex justify-between py-2 border-b border-ink-100 text-sm">
                <span className="text-ink-600">{r.label}</span>
                <span className="font-medium">{formatFCFA(r.v)}</span>
              </div>
            ))}
            <div className="flex justify-between py-3 text-base font-bold">
              <span>Total</span>
              <span>{formatFCFA(fees.total)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-display font-bold text-lg mb-4">Payment History</h3>
          {payments.length === 0 ? (
            <div className="text-sm text-ink-500 py-8 text-center">No payments yet</div>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="p-3 rounded-xl border border-ink-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Receipt size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{formatFCFA(p.amount)} · {p.method}</div>
                    <div className="text-xs text-ink-500">{new Date(p.date).toLocaleDateString()} · Ref: <span className="font-mono">{p.reference}</span></div>
                  </div>
                  <span className="badge-success">{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== Payment modal ===== */}
      {step !== 'idle' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={step === 'processing' ? undefined : close}>
          <div className="bg-white rounded-2xl shadow-soft max-w-lg w-full overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between bg-gradient-to-r from-brand-50 to-accent-50">
              <div>
                <div className="text-xs text-ink-500">
                  {step === 'choose'    && 'Step 1 of 2'}
                  {step === 'form'      && 'Step 2 of 2'}
                  {step === 'processing'&& 'Processing payment'}
                  {step === 'success'   && 'Payment confirmation'}
                </div>
                <div className="font-display font-bold text-lg">
                  {step === 'choose'    && 'Choose a payment method'}
                  {step === 'form'      && method?.name}
                  {step === 'processing'&& 'Please wait…'}
                  {step === 'success'   && 'Payment successful!'}
                </div>
              </div>
              {step !== 'processing' && (
                <button onClick={close} className="p-1 hover:bg-ink-100 rounded-lg"><X size={18} /></button>
              )}
            </div>

            {/* Body — choose method */}
            {step === 'choose' && (
              <div className="p-6 space-y-3">
                <div className="text-sm text-ink-600 mb-2">
                  Outstanding: <strong>{formatFCFA(fees.balance)}</strong>
                </div>
                {PAYMENT_METHODS.map((m) => {
                  const Icon = METHOD_ICONS[m.id]
                  return (
                    <button
                      key={m.id}
                      onClick={() => selectMethod(m)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-ink-200 hover:border-brand-400 hover:bg-brand-50/40 transition text-left"
                    >
                      <div className={`w-12 h-12 rounded-xl ${m.color} text-white flex items-center justify-center shrink-0`}>
                        <Icon size={22} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold">{m.name}</div>
                        <div className="text-xs text-ink-500">{m.subtitle}{m.code && ` · USSD ${m.code}`}</div>
                      </div>
                      <ArrowRight size={16} className="text-ink-400" />
                    </button>
                  )
                })}
              </div>
            )}

            {/* Body — form */}
            {step === 'form' && method && (
              <form onSubmit={submit} className="p-6 space-y-4">
                <div>
                  <label className="label">Amount to pay (FCFA)</label>
                  <input
                    type="number" min={1000} max={fees.balance} step={1000}
                    className="input text-lg font-bold"
                    value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                  />
                  <div className="flex gap-2 mt-2">
                    <button type="button" onClick={() => setAmount(fees.balance)} className="text-xs px-2 py-1 rounded-full bg-brand-100 text-brand-800 font-medium">
                      Pay full ({formatFCFA(fees.balance)})
                    </button>
                    <button type="button" onClick={() => setAmount(Math.floor(fees.balance / 2))} className="text-xs px-2 py-1 rounded-full bg-ink-100 text-ink-600 font-medium">
                      Pay half
                    </button>
                  </div>
                </div>

                {['momo', 'om'].includes(method.id) && (
                  <div>
                    <label className="label">Phone number (Cameroon)</label>
                    <input
                      type="tel" placeholder="e.g. 690 123 456"
                      className="input"
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                    />
                    <p className="text-xs text-ink-500 mt-1">
                      You will receive a {method.name} prompt on this number to confirm the transaction.
                    </p>
                  </div>
                )}

                {method.id === 'visa' && (
                  <>
                    <div>
                      <label className="label">Card number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                        className="input font-mono"
                        value={card.number}
                        onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19) })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Expiry</label>
                        <input type="text" placeholder="MM/YY" maxLength={5}
                          className="input font-mono"
                          value={card.exp}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '')
                            if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4)
                            setCard({ ...card, exp: v })
                          }}
                        />
                      </div>
                      <div>
                        <label className="label">CVC</label>
                        <input type="text" placeholder="123" maxLength={4}
                          className="input font-mono"
                          value={card.cvc}
                          onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '') })}
                        />
                      </div>
                    </div>
                  </>
                )}

                {method.id === 'bank' && (
                  <div>
                    <label className="label">Select your bank</label>
                    <select className="input" value={bank} onChange={(e) => setBank(e.target.value)}>
                      <option>Afriland First Bank</option>
                      <option>UBA Cameroon</option>
                      <option>Ecobank Cameroon</option>
                      <option>BICEC</option>
                      <option>SGBC</option>
                    </select>
                    <div className="mt-3 p-3 rounded-xl bg-ink-50 text-xs">
                      <div className="font-semibold mb-1">Transfer to:</div>
                      <div>Account: <span className="font-mono">IUGET-BURSARY</span></div>
                      <div>IBAN: <span className="font-mono">CM21 1000 0000 0142 3567 8901 234</span></div>
                      <div>Reference: <span className="font-mono font-bold text-brand-800">{user?.studentId}</span></div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setStep('choose')} className="btn-secondary flex-1">Back</button>
                  <button type="submit" className="btn-primary flex-1">
                    Pay {formatFCFA(amount)}
                  </button>
                </div>
              </form>
            )}

            {/* Body — processing */}
            {step === 'processing' && (
              <div className="p-10 text-center space-y-4">
                <Loader2 size={48} className="mx-auto text-brand-800 animate-spin" />
                <div className="font-display font-bold text-lg">Contacting {method?.name}…</div>
                <div className="text-sm text-ink-500">
                  {['momo', 'om'].includes(method?.id)
                    ? `Please confirm on your phone (${phone}).`
                    : 'Processing your transaction securely.'}
                </div>
                <div className="text-xs text-ink-400 font-mono mt-4">Do not close this window</div>
              </div>
            )}

            {/* Body — success (the receipt) */}
            {step === 'success' && receipt && (
              <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <div className="font-display font-bold text-xl mt-3">Payment successful!</div>
                  <div className="text-sm text-ink-500">A receipt has been generated below.</div>
                </div>

                {/* Receipt body — also rendered for PDF */}
                <div ref={receiptRef} className="bg-white border-2 border-ink-200 rounded-xl p-6 receipt-print">
                  <div className="flex items-start justify-between pb-4 border-b-2 border-brand-800">
                    <Logo size={42} />
                    <div className="text-right text-xs text-ink-600">
                      <div className="font-bold text-base text-ink-900">PAYMENT RECEIPT</div>
                      <div>IUGET Bursary Office</div>
                      <div>BP 3000 · Bonabéri, Douala</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="text-ink-500">Reference</div>
                    <div className="font-mono font-bold text-right">{receipt.reference}</div>
                    <div className="text-ink-500">Date & time</div>
                    <div className="text-right">{new Date(receipt.date).toLocaleString()}</div>
                    <div className="text-ink-500">Method</div>
                    <div className="text-right">{receipt.method}</div>
                    {receipt.phone !== '—' && (<>
                      <div className="text-ink-500">Phone</div>
                      <div className="text-right font-mono">{receipt.phone}</div>
                    </>)}
                  </div>

                  <div className="mt-4 pt-4 border-t border-ink-200 text-sm">
                    <div className="font-semibold mb-2">Student</div>
                    <div className="grid grid-cols-2 gap-y-1.5">
                      <div className="text-ink-500">Name</div>
                      <div className="text-right font-medium">{user?.name}</div>
                      <div className="text-ink-500">Student ID</div>
                      <div className="text-right font-mono">{user?.studentId}</div>
                      <div className="text-ink-500">Program</div>
                      <div className="text-right">{user?.program}</div>
                      <div className="text-ink-500">Level</div>
                      <div className="text-right">{user?.level}</div>
                      <div className="text-ink-500">Academic Year</div>
                      <div className="text-right">{fees.academicYear}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-ink-200">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-ink-600">Amount paid</span>
                      <span className="text-3xl font-display font-bold text-brand-800">{formatFCFA(receipt.amount)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-ink-200 text-xs text-ink-500 text-center">
                    This is an electronically generated receipt. No signature required.<br />
                    Verify authenticity at verify.iuget.cm/receipt/{receipt.reference}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={printReceipt} className="btn-secondary flex-1">
                    <Printer size={16} /> Print
                  </button>
                  <button onClick={downloadReceipt} className="btn-primary flex-1">
                    <Download size={16} /> Download PDF
                  </button>
                </div>
                <button onClick={close} className="btn-ghost w-full">Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .receipt-print, .receipt-print * { visibility: visible; }
          .receipt-print { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  )
}
