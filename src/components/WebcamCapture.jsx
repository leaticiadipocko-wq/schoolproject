import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Camera, RefreshCw, Check, X, Upload } from 'lucide-react'
import { useLang } from '@/context/LanguageContext'

/**
 * Webcam-based profile photo capture.
 *
 * Props:
 *   - onCapture(dataUrl)   — called when the user accepts the snapshot
 *   - onClose()            — called when the user closes the modal
 *   - initial              — existing photo to preview (optional)
 *
 * Behaviour:
 *   - Requests camera access via navigator.mediaDevices.getUserMedia()
 *   - Shows a live preview, snapshot, retake, and confirm actions
 *   - Also offers an "Upload from file" fallback if the camera is denied
 *   - Crops to a centred square so the photo fits an avatar / ID card
 */
export default function WebcamCapture({ onCapture, onClose, initial }) {
  const { lang } = useLang()
  const videoRef  = useRef(null)
  const canvasRef = useRef(null)
  const fileRef   = useRef(null)
  const [stream, setStream]       = useState(null)
  const [snapshot, setSnapshot]   = useState(initial || null)
  const [error, setError]         = useState(null)

  // Start camera on mount
  useEffect(() => {
    let mediaStream
    const start = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 720 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false,
        })
        setStream(mediaStream)
        if (videoRef.current) videoRef.current.srcObject = mediaStream
      } catch (err) {
        setError(err?.message || 'Camera unavailable')
      }
    }
    start()
    return () => {
      if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const capture = () => {
    const v = videoRef.current
    if (!v || !v.videoWidth) return
    const c = canvasRef.current
    // Square crop centred on the video frame
    const size = Math.min(v.videoWidth, v.videoHeight)
    const sx = (v.videoWidth  - size) / 2
    const sy = (v.videoHeight - size) / 2
    c.width  = 512
    c.height = 512
    const ctx = c.getContext('2d')
    ctx.drawImage(v, sx, sy, size, size, 0, 0, 512, 512)
    setSnapshot(c.toDataURL('image/png'))
  }

  const retake = () => setSnapshot(null)

  const confirm = () => {
    if (!snapshot) return
    onCapture?.(snapshot)
    toast.success(lang === 'en' ? 'Photo saved' : 'Photo enregistrée')
    onClose?.()
  }

  const uploadFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setSnapshot(reader.result)
    reader.readAsDataURL(f)
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}>
      <div className="bg-white dark:bg-ink-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera size={20} className="text-brand-600" />
            <h2 className="font-display font-bold">
              {lang === 'en' ? 'Take a profile photo' : 'Prendre une photo de profil'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {/* Stage */}
          <div className="relative aspect-square w-full bg-ink-900 rounded-2xl overflow-hidden">
            {snapshot ? (
              <img src={snapshot} alt="Snapshot" className="absolute inset-0 w-full h-full object-cover" />
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                <X size={32} className="text-red-400 mb-2" />
                <div className="font-medium">{lang === 'en' ? 'Camera unavailable' : 'Caméra indisponible'}</div>
                <div className="text-xs text-white/70 mt-1">{error}</div>
                <button onClick={() => fileRef.current?.click()} className="mt-4 bg-white text-ink-900 hover:bg-ink-50 transition rounded-xl px-4 py-2 text-sm font-medium inline-flex items-center gap-2">
                  <Upload size={14} /> {lang === 'en' ? 'Upload an image' : 'Importer une image'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadFile} />
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
            )}
            {/* Square overlay guide */}
            {!snapshot && !error && (
              <div className="absolute inset-6 border-2 border-white/30 rounded-2xl pointer-events-none" />
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          <div className="mt-4 flex gap-2">
            {snapshot ? (
              <>
                <button onClick={retake} className="btn-secondary flex-1">
                  <RefreshCw size={14} /> {lang === 'en' ? 'Retake' : 'Reprendre'}
                </button>
                <button onClick={confirm} className="btn-primary flex-1">
                  <Check size={14} /> {lang === 'en' ? 'Use this photo' : 'Utiliser cette photo'}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => fileRef.current?.click()} className="btn-secondary flex-1">
                  <Upload size={14} /> {lang === 'en' ? 'Upload' : 'Importer'}
                </button>
                <button onClick={capture} disabled={!stream} className="btn-primary flex-1 disabled:opacity-50">
                  <Camera size={14} /> {lang === 'en' ? 'Take photo' : 'Prendre la photo'}
                </button>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadFile} />
          </div>

          <div className="mt-3 text-[11px] text-ink-500 text-center">
            {lang === 'en'
              ? 'Photos are stored locally in DEMO_MODE · uploaded to Firebase Storage in production.'
              : 'Les photos sont stockées localement en mode DÉMO · envoyées vers Firebase Storage en production.'}
          </div>
        </div>
      </div>
    </div>
  )
}
