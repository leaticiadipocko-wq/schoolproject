import { useEffect, useState } from 'react'
import { Wifi, WifiOff, Download } from 'lucide-react'

/**
 * Top-of-page indicator showing online/offline state.
 * Also surfaces a "ready to install" prompt when the browser fires
 * beforeinstallprompt (PWA installability).
 */
export default function OfflineIndicator() {
  const [online, setOnline] = useState(navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showOnlineBanner, setShowOnlineBanner] = useState(false)

  useEffect(() => {
    const onOnline = () => {
      setOnline(true)
      setShowOnlineBanner(true)
      setTimeout(() => setShowOnlineBanner(false), 3000)
    }
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    const beforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', beforeInstall)

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('beforeinstallprompt', beforeInstall)
    }
  }, [])

  const install = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstallPrompt(null)
  }

  return (
    <>
      {/* Persistent banner when offline */}
      {!online && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-500 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-center gap-2 shadow-soft">
          <WifiOff size={14} /> You're offline — using cached data. Changes will sync when reconnected.
        </div>
      )}

      {/* Transient banner when reconnected */}
      {online && showOnlineBanner && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-emerald-500 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-center gap-2 shadow-soft animate-fade-in">
          <Wifi size={14} /> Back online
        </div>
      )}

      {/* Install-prompt pill (bottom right) */}
      {installPrompt && (
        <button
          onClick={install}
          className="fixed bottom-4 right-4 z-[60] bg-brand-800 hover:bg-brand-900 text-white rounded-full px-4 py-2.5 shadow-glow flex items-center gap-2 text-sm font-medium animate-slide-up"
        >
          <Download size={16} /> Install SIARM
        </button>
      )}
    </>
  )
}
