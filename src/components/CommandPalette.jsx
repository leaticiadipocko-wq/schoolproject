import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, ArrowRight, CornerDownLeft, ArrowUp, ArrowDown,
  LayoutDashboard, ClipboardCheck, CalendarClock, FileText, Megaphone,
  BookOpen, GraduationCap, FileSpreadsheet, Wallet, IdCard,
  Users, TrendingUp, UserCog, Settings, Moon, Sun, LogOut,
  Banknote, UserPlus,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'

/**
 * Global keyboard-driven command palette.
 * Open: ⌘K (Mac) or Ctrl+K (Win/Linux).
 * Navigate with ↑ ↓, select with Enter, close with Esc.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggleTheme, resetStore } = useData()
  const inputRef = useRef()

  // Build commands list dynamically per role
  const commands = useMemo(() => {
    const base = []
    if (!user) return base

    const role = user.role

    // Navigation per role
    if (role === 'student') {
      base.push(
        { id: 'nav-dash',   group: 'Navigate', icon: LayoutDashboard, label: 'Dashboard',      shortcut: 'G D', do: () => navigate('/student') },
        { id: 'nav-att',    group: 'Navigate', icon: ClipboardCheck, label: 'Attendance',      shortcut: 'G A', do: () => navigate('/student/attendance') },
        { id: 'nav-tt',     group: 'Navigate', icon: CalendarClock,  label: 'Timetable',       shortcut: 'G T', do: () => navigate('/student/timetable') },
        { id: 'nav-res',    group: 'Navigate', icon: FileText,       label: 'Results',         shortcut: 'G R', do: () => navigate('/student/results') },
        { id: 'nav-ann',    group: 'Navigate', icon: Megaphone,      label: 'Announcements',                 do: () => navigate('/student/announcements') },
        { id: 'nav-id',     group: 'Navigate', icon: IdCard,         label: 'My ID Card',      shortcut: 'G I', do: () => navigate('/student/idcard') },
        { id: 'nav-fees',   group: 'Navigate', icon: Wallet,         label: 'Tuition & Fees',  shortcut: 'G F', do: () => navigate('/student/fees') },
        { id: 'nav-trans',  group: 'Navigate', icon: FileSpreadsheet, label: 'Transcript',                    do: () => navigate('/student/transcript') },
        { id: 'nav-learn',  group: 'Navigate', icon: GraduationCap,  label: 'Mobile Learning',               do: () => navigate('/student/learning') },
        // Quick actions
        { id: 'act-pay',    group: 'Quick action', icon: Wallet, label: 'Pay tuition fees',               do: () => navigate('/student/fees') },
        { id: 'act-print',  group: 'Quick action', icon: IdCard, label: 'Print my ID card',               do: () => navigate('/student/idcard') },
      )
    }
    if (role === 'lecturer') {
      base.push(
        { id: 'nav-dash', group: 'Navigate', icon: LayoutDashboard, label: 'Dashboard',         do: () => navigate('/lecturer') },
        { id: 'nav-cls',  group: 'Navigate', icon: BookOpen,        label: 'My classes',        do: () => navigate('/lecturer/classes') },
        { id: 'nav-att',  group: 'Navigate', icon: ClipboardCheck,  label: 'Mark attendance',   do: () => navigate('/lecturer/attendance') },
        { id: 'nav-grd',  group: 'Navigate', icon: FileSpreadsheet, label: 'Enter grades',      do: () => navigate('/lecturer/grades') },
        { id: 'nav-ann',  group: 'Navigate', icon: Megaphone,       label: 'Announcements',     do: () => navigate('/lecturer/announcements') },
      )
    }
    if (role === 'staff' || role === 'admin') {
      const prefix = role === 'admin' ? '/admin' : '/staff'
      base.push(
        { id: 'nav-dash',   group: 'Navigate', icon: LayoutDashboard, label: 'Dashboard',          do: () => navigate(prefix) },
        { id: 'nav-anly',   group: 'Navigate', icon: TrendingUp,      label: 'Analytics',          do: () => navigate(`${prefix}/analytics`) },
        { id: 'nav-fin',    group: 'Navigate', icon: Banknote,        label: 'Tuition tracking',   shortcut: 'G $', do: () => navigate(`${prefix}/finance`) },
        { id: 'nav-enr',    group: 'Navigate', icon: UserPlus,        label: 'Enrol new student',  shortcut: 'G N', do: () => navigate(`${prefix}/enrollment`) },
        { id: 'nav-usr',    group: 'Navigate', icon: UserCog,         label: 'Users',              do: () => navigate(`${prefix}/users`) },
        { id: 'nav-tt',     group: 'Navigate', icon: CalendarClock,   label: 'Timetable Builder',  do: () => navigate(`${prefix}/timetable`) },
        { id: 'nav-ann',    group: 'Navigate', icon: Megaphone,       label: 'Announcements',      do: () => navigate(`${prefix}/announcements`) },
        ...(role === 'admin' ? [
          { id: 'nav-set', group: 'Navigate', icon: Settings, label: 'Settings', do: () => navigate('/admin/settings') },
        ] : []),
      )
    }

    // Universal
    base.push(
      { id: 'theme', group: 'Preferences', icon: theme === 'dark' ? Sun : Moon, label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`, do: toggleTheme },
      { id: 'reset', group: 'Preferences', icon: Settings, label: 'Reset demo data',
        do: () => { if (confirm('Reset all demo data to defaults?')) resetStore() } },
      { id: 'logout', group: 'Account', icon: LogOut, label: 'Sign out',
        do: async () => { await logout(); navigate('/login') } },
    )

    return base
  }, [user, theme, navigate, toggleTheme, logout, resetStore])

  // Filter by query (fuzzy-ish: every word in query must appear)
  const filtered = useMemo(() => {
    if (!query.trim()) return commands
    const words = query.toLowerCase().split(/\s+/)
    return commands.filter((c) => {
      const hay = `${c.label} ${c.group}`.toLowerCase()
      return words.every((w) => hay.includes(w))
    })
  }, [commands, query])

  // Group results
  const grouped = useMemo(() => {
    const g = {}
    for (const c of filtered) {
      if (!g[c.group]) g[c.group] = []
      g[c.group].push(c)
    }
    return g
  }, [filtered])

  // Flat indexed list for cursor navigation
  const flatList = useMemo(() => Object.values(grouped).flat(), [grouped])

  // Keyboard handler
  useEffect(() => {
    const onKey = (e) => {
      const isMeta = e.metaKey || e.ctrlKey
      if (isMeta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
        setQuery('')
        setCursor(0)
        return
      }
      if (!open) return
      if (e.key === 'Escape') { setOpen(false); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, flatList.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)) }
      if (e.key === 'Enter')     {
        e.preventDefault()
        const item = flatList[cursor]
        if (item) { item.do(); setOpen(false) }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, flatList, cursor])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => { setCursor(0) }, [query])

  if (!open) return null

  let runningIndex = -1

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4 animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-ink-100 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-ink-100">
          <Search size={18} className="text-ink-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules, actions, settings…"
            className="flex-1 bg-transparent outline-none text-sm placeholder-ink-400"
          />
          <kbd className="text-[10px] font-mono text-ink-400 bg-ink-100 px-1.5 py-0.5 rounded">esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {flatList.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink-500">
              No matches for "<span className="font-mono">{query}</span>"
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-1">
                <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  {group}
                </div>
                {items.map((item) => {
                  runningIndex++
                  const isActive = runningIndex === cursor
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setCursor(runningIndex)}
                      onClick={() => { item.do(); setOpen(false) }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition ${
                        isActive ? 'bg-brand-50 text-brand-900' : 'text-ink-700 hover:bg-ink-50'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-brand-800' : 'text-ink-400'} />
                      <span className="flex-1">{item.label}</span>
                      {item.shortcut && (
                        <kbd className="text-[10px] font-mono text-ink-400 bg-ink-100 px-1.5 py-0.5 rounded">
                          {item.shortcut}
                        </kbd>
                      )}
                      {isActive && <ArrowRight size={14} className="text-brand-800" />}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-t border-ink-100 bg-ink-50/50 text-[11px] text-ink-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><ArrowUp size={11} /><ArrowDown size={11} /> Navigate</span>
            <span className="flex items-center gap-1"><CornerDownLeft size={11} /> Select</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="font-mono bg-white border border-ink-200 px-1.5 py-0.5 rounded">⌘</kbd>
            <kbd className="font-mono bg-white border border-ink-200 px-1.5 py-0.5 rounded">K</kbd>
            <span>to open</span>
          </div>
        </div>
      </div>
    </div>
  )
}
