import { useRef, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PenLine, Eraser, Check, Download } from 'lucide-react'
import { useLang } from '@/context/LanguageContext'

/**
 * Reusable canvas-based digital signature pad.
 *
 * Props:
 *   - width, height        — canvas dimensions (default 600 × 200)
 *   - onSave(dataUrl)      — called when the user clicks Save
 *   - initialValue         — data-URL of an existing signature to restore
 *   - label                — caption above the pad
 *
 * Supports mouse + touch + Pointer Events. The dataUrl returned is
 * a PNG base64 string suitable for storing in localStorage / Firestore.
 */
export default function SignaturePad({
  width = 600,
  height = 200,
  onSave,
  initialValue,
  label,
}) {
  const { lang } = useLang()
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const [isEmpty, setIsEmpty] = useState(!initialValue)

  // Initialise canvas
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    // Hi-DPI sharpness
    const dpr = window.devicePixelRatio || 1
    c.width = width * dpr
    c.height = height * dpr
    c.style.width = `${width}px`
    c.style.height = `${height}px`
    const ctx = c.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#1e3aa0'
    ctx.lineWidth = 2.2

    // Render the initial signature, if any
    if (initialValue) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, width, height)
      img.src = initialValue
    }
  }, [width, height, initialValue])

  const getPoint = (e) => {
    const c = canvasRef.current
    const rect = c.getBoundingClientRect()
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top
    return { x, y }
  }

  const start = (e) => {
    e.preventDefault()
    drawing.current = true
    last.current = getPoint(e)
    setIsEmpty(false)
  }
  const move = (e) => {
    if (!drawing.current) return
    e.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const p = getPoint(e)
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
  }
  const end = () => { drawing.current = false }

  const clear = () => {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
    setIsEmpty(true)
  }

  const save = () => {
    if (isEmpty) {
      toast.error(lang === 'en' ? 'Please sign before saving' : 'Veuillez signer avant d\'enregistrer')
      return
    }
    const dataUrl = canvasRef.current.toDataURL('image/png')
    onSave?.(dataUrl)
    toast.success(lang === 'en' ? 'Signature saved' : 'Signature enregistrée')
  }

  const download = () => {
    if (isEmpty) return
    const a = document.createElement('a')
    a.href = canvasRef.current.toDataURL('image/png')
    a.download = `signature-${Date.now()}.png`
    a.click()
  }

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center gap-1.5 text-sm font-medium text-ink-700">
          <PenLine size={14} /> {label}
        </div>
      )}
      <div className="relative border-2 border-dashed border-ink-200 rounded-xl bg-white">
        <canvas
          ref={canvasRef}
          className="rounded-xl cursor-crosshair touch-none block"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
        {/* Guide-line */}
        <div className="absolute bottom-6 left-6 right-6 border-b border-ink-300 border-dashed pointer-events-none" />
        <div className="absolute bottom-1.5 left-6 right-6 flex items-center justify-between pointer-events-none text-[10px] text-ink-400">
          <span>{lang === 'en' ? 'Sign here' : 'Signez ici'}</span>
          <span>{new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={clear} disabled={isEmpty} className="btn-ghost text-sm disabled:opacity-50">
          <Eraser size={14} /> {lang === 'en' ? 'Clear' : 'Effacer'}
        </button>
        <button type="button" onClick={download} disabled={isEmpty} className="btn-ghost text-sm disabled:opacity-50">
          <Download size={14} /> {lang === 'en' ? 'Download PNG' : 'Télécharger PNG'}
        </button>
        <button type="button" onClick={save} disabled={isEmpty} className="btn-primary text-sm disabled:opacity-50 ml-auto">
          <Check size={14} /> {lang === 'en' ? 'Save signature' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
