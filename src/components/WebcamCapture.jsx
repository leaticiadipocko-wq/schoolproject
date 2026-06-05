import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Camera, RefreshCw, Check, X, Upload, AlertCircle, Image as ImgIcon,
} from 'lucide-react'
import { useLang } from '@/context/LanguageContext'

/**
 * Profile-photo capture modal.
 *
 *  - The user always sees both options: "Take with camera" and "Upload file".
 *  - The camera is only requested when the user clicks the camera tab.
 *  - If camera permission is denied or unavailable, the file-upload pane is
 *    shown automatically with a clear explanation.
 *  - Snapshots are cropped to a centred square at 512 × 512 for the avatar.
 */
export default function WebcamCapture({ onCapture, onClose, initial }) {
  const { lang } = useLang()
  const videoRef  = useRef(null)
  const canvasRef = useRef(null)
  const fileRef   = useRef(null)
  const [mode, setMode]       = useState('upload')   // 'upload' | 'camera'
  const [stream, setStream]   = useState(null)
  const [snapshot, setSnapshot] = useState(initial || null)
  const [error, setError]     = useState(null)

  /* Start / stop camera based on mode */
  useEffect(() => {
    let mediaStream = null
    const stop = () => { if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop()) }

    if (mode !== 'camera') { stop(); setStream(null); return }
    if (snapshot) return  // already have a shot

    const start = async () => {
      setError(null)
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(lang === 'en'
          ? 'Your browser does not support camera access. Please use the upload option.'
          : 'Votre navigateur ne supporte pas l\'accès à la caméra. Utilisez l\'option import.')
        return
      }
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 720 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false,
        })
        setStream(mediaStream)
        if (videoRef.current) videoRef.current.srcObject = mediaStream
      } catch (err) {
        const name = err?.name
        let msg
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          msg = lang === 'en'
            ? 'Camera permission was denied. Click the camera icon in the address bar to allow it, or use the upload option below.'
            : 'L\'accès à la caméra a été refusé. Cliquez sur l\'icône caméra dans la barre d\'adresse, ou utilisez l\'option import ci-dessous.'
        } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
          msg = lang === 'en' ? 'No camera detected on this device.' : 'Aucune caméra détectée.'
        } else if (name === 'NotReadableError') {
          msg = lang === 'en' ? 'Another application is using the camera.' : 'Une autre application utilise la caméra.'
        } else {
          msg = err?.message || (lang === 'en' ? 'Camera unavailable' : 'Caméra indisponible')
        }
        setError(msg)
      }
    }
    start()
    return stop
  }, [mode, snapshot, lang])

  const capture = () => {
    const v = videoRef.current
    if (!v || !v.videoWidth) return
    const c = canvasRef.current
    const size = Math.min(v.videoWidth, v.videoHeight)
    const sx = (v.videoWidth  - size) / 2
    const sy = (v.videoHeight - size) / 2
    c.width = 512; c.height = 512
    const ctx = c.getContext('2d')
    ctx.translate(512, 0); ctx.scale(-1, 1)  // un-mirror the video
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
    if (!f.type.startsWith('image/')) {
      toast.error(lang === 'en' ? 'Please choose an image file' : 'Veuillez choisir un fichier image')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      // Re-encode through a canvas to ensure square 512×512 and to strip EXIF
      const img = new Image()
      img.onload = () => {
        const c = document.createElement('canvas')
        c.width = 512; c.height = 512
        const ctx = c.getContext('2d')
        const size = Math.min(img.width, img.height)
        const sx = (img.width  - size) / 2
        const sy = (img.height - size) / 2
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 512, 512)
        setSnapshot(c.toDataURL('image/png'))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(f)
  }

  const T = {
    title:       lang === 'en' ? 'Profile photo' : 'Photo de profil',
    upload:      lang === 'en' ? 'Upload file' : 'Importer un fichier',
    camera:      lang === 'en' ? 'Use camera' : 'Utiliser la caméra',
    take:        lang === 'en' ? 'Take photo' : 'Prendre la photo',
    retake:      lang === 'en' ? 'Retake' : 'Reprendre',
    use:         lang === 'en' ? 'Use this photo' : 'Utiliser cette photo',
    chooseFile:  lang === 'en' ? 'Choose an image' : 'Choisir une image',
    drag:        lang === 'en' ? 'PNG, JPG or WEBP · up to 5 MB' : 'PNG, JPG ou WEBP · jusqu\'à 5 Mo',
    cancel:      lang === 'en' ? 'Cancel' : 'Annuler',
    privacy:     lang === 'en'
      ? 'Photos are stored locally in DEMO_MODE · uploaded to Firebase Storage in production.'
      : 'Les photos sont stockées localement en mode DÉMO · envoyées vers Firebase Storage en production.',
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}>
      <div className="bg-white dark:bg-ink-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImgIcon size={20} className="text-brand-600" />
            <h2 className="font-display font-bold">{T.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="px-5 pt-4">
          <div className="inline-flex w-full bg-ink-100 dark:bg-ink-800 rounded-xl p-1">
            <button
              onClick={() => { setMode('upload'); setSnapshot(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2 transition ${
                mode === 'upload' ? 'bg-white dark:bg-ink-700 text-brand-700 shadow-soft' : 'text-ink-600 dark:text-ink-300'
              }`}
            >
              <Upload size={14} /> {T.upload}
            </button>
            <button
              onClick={() => { setMode('camera'); setSnapshot(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2 transition ${
                mode === 'camera' ? 'bg-white dark:bg-ink-700 text-brand-700 shadow-soft' : 'text-ink-600 dark:text-ink-300'
              }`}
            >
              <Camera size={14} /> {T.camera}
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="relative aspect-square w-full bg-ink-900 rounded-2xl overflow-hidden">
            {snapshot ? (
              <img src={snapshot} alt="Snapshot" className="absolute inset-0 w-full h-full object-cover" />
            ) : mode === 'upload' ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center hover:bg-ink-800 transition"
              >
                <Upload size={36} className="text-white/70 mb-3" />
                <div className="font-display font-bold">{T.chooseFile}</div>
                <div className="text-xs text-white/60 mt-1">{T.drag}</div>
              </button>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                <AlertCircle size={32} className="text-amber-400 mb-2" />
                <div className="font-medium text-sm leading-snug">{error}</div>
                <button onClick={() => setMode('upload')} className="mt-4 bg-white text-ink-900 hover:bg-ink-50 transition rounded-xl px-4 py-2 text-sm font-medium inline-flex items-center gap-2">
                  <Upload size={14} /> {T.upload}
                </button>
              </div>
            ) : !stream ? (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <Camera size={28} className="animate-pulse" />
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
            )}
            {!snapshot && mode === 'camera' && !error && stream && (
              <div className="absolute inset-6 border-2 border-white/30 rounded-2xl pointer-events-none" />
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadFile} />

          <div className="mt-4 flex gap-2">
            {snapshot ? (
              <>
                <button onClick={retake} className="btn-secondary flex-1">
                  <RefreshCw size={14} /> {T.retake}
                </button>
                <button onClick={confirm} className="btn-primary flex-1">
                  <Check size={14} /> {T.use}
                </button>
              </>
            ) : mode === 'upload' ? (
              <>
                <button onClick={onClose} className="btn-ghost flex-1">{T.cancel}</button>
                <button onClick={() => fileRef.current?.click()} className="btn-primary flex-1">
                  <Upload size={14} /> {T.chooseFile}
                </button>
              </>
            ) : (
              <>
                <button onClick={onClose} className="btn-ghost flex-1">{T.cancel}</button>
                <button onClick={capture} disabled={!stream} className="btn-primary flex-1 disabled:opacity-50">
                  <Camera size={14} /> {T.take}
                </button>
              </>
            )}
          </div>

          <div className="mt-3 text-[11px] text-ink-500 text-center">{T.privacy}</div>
        </div>
      </div>
    </div>
  )
}
