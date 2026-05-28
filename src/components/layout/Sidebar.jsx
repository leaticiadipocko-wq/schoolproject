import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import Logo from '@/components/Logo'

export default function Sidebar({ items, open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 bg-white border-r border-ink-100 z-40 flex flex-col
          transform transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-ink-100">
          <Logo />
          <button onClick={onClose} className="lg:hidden text-ink-500">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {items.map((section, sIdx) => (
            <div key={sIdx} className="mt-3">
              {section.title && (
                <div className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-ink-400 uppercase">
                  {section.title}
                </div>
              )}
              {section.links.map(({ to, label, icon: Icon, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={section.links.length === 1 || to.split('/').length <= 2}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className={isActive ? 'text-brand-600' : ''} />
                      <span className="flex-1">{label}</span>
                      {badge && (
                        <span className="badge-info">{badge}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-ink-100">
          <div className="rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white p-4">
            <div className="font-display font-bold text-sm">SIARM Pro</div>
            <div className="text-xs text-white/80 mt-1">Unlock AI insights & advanced analytics.</div>
            <button className="mt-3 w-full bg-white/15 hover:bg-white/25 transition rounded-lg py-1.5 text-xs font-medium">
              Learn more
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
