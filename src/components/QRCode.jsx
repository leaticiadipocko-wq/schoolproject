import { useEffect, useRef, useState } from 'react'
import QRCodeLib from 'qrcode'

/**
 * Real, scannable QR code component (uses the `qrcode` library).
 *
 * Props:
 *   - value:   string encoded into the code (URL, identifier, anything)
 *   - size:    pixel size of the rendered canvas (default 100)
 *   - color:   foreground colour (default IUGET navy #1e3aa0)
 *   - bg:      background colour (default white)
 *   - level:   error-correction level — 'L' | 'M' | 'Q' | 'H' (default 'M')
 *   - label:   optional URL / caption rendered under the code
 *
 * Falls back gracefully if rendering fails — a printable text URL
 * appears in place of the code.
 */
export default function QRCode({
  value = '',
  size = 100,
  color = '#1e3aa0',
  bg = '#ffffff',
  level = 'M',
  label,
}) {
  const canvasRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!canvasRef.current || !value) return
    QRCodeLib.toCanvas(canvasRef.current, value, {
      errorCorrectionLevel: level,
      margin: 1,
      width: size,
      color: { dark: color, light: bg },
    }).catch((err) => {
      if (!cancelled) {
        console.warn('[QR] render failed:', err?.message)
        setFailed(true)
      }
    })
    return () => { cancelled = true }
  }, [value, size, color, bg, level])

  return (
    <div className="inline-flex flex-col items-center">
      {failed ? (
        <div
          style={{ width: size, height: size }}
          className="bg-ink-100 dark:bg-ink-800 rounded-lg flex items-center justify-center text-[10px] text-ink-500 p-2 text-center"
        >
          {value || 'QR'}
        </div>
      ) : (
        <canvas ref={canvasRef} width={size} height={size} className="rounded-lg" />
      )}
      {label && (
        <div className="text-[9px] text-ink-500 font-mono mt-1 max-w-[140px] text-center break-all">
          {label}
        </div>
      )}
    </div>
  )
}
