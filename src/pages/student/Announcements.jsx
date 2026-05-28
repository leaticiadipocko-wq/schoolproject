import { useEffect, useState } from 'react'
import { Megaphone, Pin, WifiOff } from 'lucide-react'
import { MOCK_ANNOUNCEMENTS } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'

const CACHE_KEY = 'siarm.announcements.cache'

export default function Announcements() {
  const [items, setItems] = useState([])
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    // Try cache first (offline-first strategy)
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try { setItems(JSON.parse(cached)) } catch {}
    }
    // Refresh from "source"
    setItems(MOCK_ANNOUNCEMENTS)
    localStorage.setItem(CACHE_KEY, JSON.stringify(MOCK_ANNOUNCEMENTS))

    const onOnline = () => setOffline(false)
    const onOffline = () => setOffline(true)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const pinned = items.filter((a) => a.pinned)
  const recent = items.filter((a) => !a.pinned)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="University-wide notices and updates"
        actions={
          offline && <span className="badge-warning"><WifiOff size={12} /> Offline · showing cached</span>
        }
      />

      {pinned.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Pinned</div>
          <div className="space-y-3">
            {pinned.map((a) => (
              <div key={a.id} className="card border-l-4 border-l-amber-500">
                <div className="flex items-start gap-3">
                  <Pin size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-display font-bold">{a.title}</div>
                    <div className="text-sm text-ink-600 mt-1">{a.body}</div>
                    <div className="text-xs text-ink-400 mt-2">{a.author} · {new Date(a.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Recent</div>
        <div className="space-y-3">
          {recent.map((a) => (
            <div key={a.id} className="card">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                  <Megaphone size={18} />
                </div>
                <div className="flex-1">
                  <div className="font-display font-bold">{a.title}</div>
                  <div className="text-sm text-ink-600 mt-1">{a.body}</div>
                  <div className="text-xs text-ink-400 mt-2">{a.author} · {new Date(a.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
