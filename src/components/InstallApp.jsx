import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

/**
 * InstallApp — a visible "Install app" button that installs SIARM as a
 * desktop / mobile app (PWA).
 *
 * It captures the browser's `beforeinstallprompt` event and, on click, shows
 * the native install dialog. The button hides itself once the app is already
 * installed (running standalone) or right after a successful install.
 *
 * Light (day) theme only.
 */
export default function InstallApp() {
  const [deferred, setDeferred] = useState(null)
  const [installed, setInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Already running as an installed app? Then there's nothing to offer.
    const standalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    if (standalone) setInstalled(true)

    const onPrompt = (e) => {
      e.preventDefault() // stop Chrome's mini-infobar; we drive it from our button
      setDeferred(e)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferred) return
    deferred.prompt()
    try {
      await deferred.userChoice
    } finally {
      setDeferred(null)
    }
  }

  if (installed) return null

  // Nothing to install with (event not fired yet, or unsupported browser),
  // or the user closed the pill this session.
  if (!deferred || dismissed) return null

  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-2xl border border-ink-200 bg-white px-3 py-2 shadow-soft">
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
      >
        <Download size={16} />
        Install app
      </button>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss install prompt"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition hover:bg-ink-100 hover:text-ink-600"
      >
        <X size={16} />
      </button>
    </div>
  )
}
