import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Search, LogOut, Settings, User as UserIcon, ChevronDown } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { ROLE_LABELS } from '@/lib/roles'

export default function Navbar({ onMenu, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef()

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
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

        {/* Search */}
        <div className="hidden md:flex relative w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-10 py-2 text-sm"
            placeholder="Search modules, courses, people…"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-ink-400 border border-ink-200 px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>

        <button className="relative p-2 rounded-xl hover:bg-ink-100 text-ink-600">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
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

          {open && (
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
