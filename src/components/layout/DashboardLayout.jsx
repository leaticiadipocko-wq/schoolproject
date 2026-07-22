import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import ChatBot from '@/pages/ChatBot'

function LoadingScreen() {
  return (
    <div className="flex-1 flex items-center justify-center bg-ink-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-ink-500 text-sm">Loading your data…</p>
      </div>
    </div>
  )
}

export default function DashboardLayout({ navItems }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { loading } = useData()
  const location = useLocation()

  // Derive page title from the active link
  const flat = navItems.flatMap((s) => s.links)
  const active = flat
    .slice()
    .sort((a, b) => b.to.length - a.to.length)
    .find((l) => location.pathname.startsWith(l.to))
  const title = active?.label || 'Dashboard'

  return (
    <div className="min-h-screen flex bg-ink-50">
      <Sidebar
        items={navItems}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenu={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-4 md:p-8 animate-fade-in">
          {loading ? <LoadingScreen /> : <Outlet />}
        </main>
      </div>
      <ChatBot />
    </div>
  )
}
