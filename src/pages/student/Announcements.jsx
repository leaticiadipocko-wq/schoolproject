import { useEffect, useState } from 'react'
import { Megaphone, Pin, WifiOff } from 'lucide-react'
import { useData } from '@/context/DataContext'
import PageHeader from '@/components/ui/PageHeader'

export default function Announcements() {
  const { announcements } = useData()
  const [offline, setOffline] = useState(!navigator.onLine)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onOnline = () => setOffline(false)
    const onOffline = () => setOffline(true)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.body.toLowerCase().includes(query.toLowerCase())
  )
  const pinned = filtered.filter((a) => a.pinned)
  const recent = filtered.filter((a) => !a.pinned)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="University-wide notices and updates"
        actions={
          offline && <span className="badge-warning"><WifiOff size={12} /> Offline · showing cached</span>
        }
      />

      <input
        value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder="Search announcements…"
        className="input"
      />

      {pinned.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Pinned</div>
          <div className="space-y-3">
            {pinned.map((a) => (
              <div key={a.id} className="card border-l-4 border-l-accent-500">
                <div className="flex items-start gap-3">
                  <Pin size={18} className="text-accent-500 shrink-0 mt-0.5" />
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
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center shrink-0">
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
          {recent.length === 0 && (
            <div className="card text-center py-10 text-ink-500 text-sm">No announcements found</div>
          )}
        </div>
      </div>
    </div>
  )
}
