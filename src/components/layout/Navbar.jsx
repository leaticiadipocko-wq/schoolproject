import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Search, LogOut, Settings, User as UserIcon, ChevronDown, Moon, Sun, Check } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { ROLE_LABELS } from '@/lib/roles'

export default function Navbar({ onMenu, title }) {
  const { user, logout } = useAuth()
  const { notifications, markNotificationRead, markAllNotificationsRead, theme, toggleTheme } = useData()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const profileRef = useRef()
  const notifRef = useRef()

  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const close = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-ink-100">
      <div className="flex items-center justify-between gap-4 px-4 md:px-8 py-3.5">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button onClick={onMenu} className="lg:hidden text-ink-600 hover:text-ink-900">
            <Menu size={22} />
          </button>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-lg truncate">{title}</h1>
          </div>
        </div>

        {/* Search → opens command palette */}
        <button
          onClick={() => {
            // synthesize a ⌘K keydown to open the palette
            const ev = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
            window.dispatchEvent(ev)
          }}
          className="hidden md:flex items-center gap-3 w-72 px-3.5 py-2 rounded-xl bg-white border border-ink-200 text-sm text-ink-400 hover:border-brand-300 hover:text-ink-600 transition"
        >
          <Search size={16} />
          <span className="flex-1 text-left">Search anything…</span>
          <kbd className="text-[10px] font-mono text-ink-400 border border-ink-200 px-1.5 py-0.5 rounded bg-ink-50">⌘K</kbd>
        </button>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-ink-100 text-ink-600" title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-xl hover:bg-ink-100 text-ink-600">
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-accent-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between p-4 border-b border-ink-100">
                <div className="font-display font-bold">Notifications</div>
                {unread > 0 && (
                  <button onClick={markAllNotificationsRead} className="text-xs text-brand-700 hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-ink-500">No notifications</div>
                ) : notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`w-full text-left p-3 hover:bg-ink-50 transition border-b border-ink-50 last:border-0 ${
                      !n.read ? 'bg-brand-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-accent-500 mt-1.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-ink-800">{n.text}</div>
                        <div className="text-[11px] text-ink-500 mt-0.5">{n.time}</div>
                      </div>
                      {n.read && <Check size={14} className="text-ink-400 shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-ink-100 transition"
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-8 h-8 rounded-full ring-2 ring-brand-100"
            />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium leading-none">{user?.name}</div>
              <div className="text-[10px] text-ink-500 mt-0.5">{ROLE_LABELS[user?.role]}</div>
            </div>
            <ChevronDown size={14} className="text-ink-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-ink-100">
                <div className="flex items-center gap-3">
                  <img src={user?.avatar} className="w-10 h-10 rounded-full" alt="" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{user?.name}</div>
                    <div className="text-xs text-ink-500 truncate">{user?.email}</div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-ink-50 text-sm text-ink-700">
                  <UserIcon size={16} /> Profile
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-ink-50 text-sm text-ink-700">
                  <Settings size={16} /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
