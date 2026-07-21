import { useState } from 'react'
import toast from 'react-hot-toast'
import { Building2, Users, BookOpen, Globe, RefreshCw, CheckCircle, Radio, MapPin } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'
import { CAMPUSES, MOCK_CAMPUS_DATA } from '@/lib/mockData'

export default function CampusOverview() {
  const { user } = useAuth()
  const { campus, setCampus, announcements } = useData()
  const { lang } = useLang()
  const [syncing, setSyncing] = useState(false)
  const [syncEnabled, setSyncEnabled] = useState(true)

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      toast.success(lang === 'en' ? 'Campuses synchronized successfully!' : 'Campus synchronisés!')
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Campus Management' : 'Gestion des campus'}
        subtitle={lang === 'en' ? 'Multi-campus synchronization & oversight' : 'Synchronisation et supervision multi-campus'}
      />

      {/* Campus selector */}
      <div className="card">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-3">
          {lang === 'en' ? 'Active Campus View' : 'Vue campus actif'}
        </div>
        <div className="flex gap-2 flex-wrap">
          {CAMPUSES.filter(c => c.id !== 'all').map(c => (
            <button key={c.id} onClick={() => setCampus(c.id)}
              className={`px-5 py-3 rounded-xl border-2 text-left transition flex-1 min-w-[200px] ${campus === c.id ? c.color + ' text-white border-transparent' : 'border-ink-200 hover:border-brand-300'}`}
            >
              <div className="font-bold">{c.name}</div>
              <div className="text-xs mt-0.5 opacity-80">{c.fullName}</div>
              <div className="text-xs mt-2 flex items-center gap-1">
                <Users size={12} /> {MOCK_CAMPUS_DATA[c.id]?.stats?.students || 0} students
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Campus details */}
      {campus !== 'all' && MOCK_CAMPUS_DATA[campus] && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <Users size={20} className="text-brand-600 mb-2" />
            <div className="text-xs text-ink-500">{lang === 'en' ? 'Students' : 'Étudiants'}</div>
            <div className="text-3xl font-display font-bold">{MOCK_CAMPUS_DATA[campus].stats.students}</div>
          </div>
          <div className="card">
            <BookOpen size={20} className="text-accent-600 mb-2" />
            <div className="text-xs text-ink-500">{lang === 'en' ? 'Lecturers' : 'Enseignants'}</div>
            <div className="text-3xl font-display font-bold">{MOCK_CAMPUS_DATA[campus].stats.lecturers}</div>
          </div>
          <div className="card">
            <Building2 size={20} className="text-amber-600 mb-2" />
            <div className="text-xs text-ink-500">{lang === 'en' ? 'Staff' : 'Personnel'}</div>
            <div className="text-3xl font-display font-bold">{MOCK_CAMPUS_DATA[campus].stats.staff}</div>
          </div>
          <div className="card">
            <Globe size={20} className="text-emerald-600 mb-2" />
            <div className="text-xs text-ink-500">{lang === 'en' ? 'Programs' : 'Programmes'}</div>
            <div className="text-3xl font-display font-bold">{MOCK_CAMPUS_DATA[campus].stats.programs}</div>
          </div>
        </div>
      )}

      {/* Synchronization controls */}
      <div className="card border-brand-200 bg-gradient-to-br from-brand-50 to-accent-50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
            <Radio size={22} />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg">
              {lang === 'en' ? 'Campus Synchronization' : 'Synchronisation des campus'}
            </h3>
            <p className="text-sm text-ink-600 mt-1">
              {lang === 'en'
                ? 'When enabled, announcements, results, timetable, and events published on one campus are automatically replicated to all other campuses. This ensures students and staff at Bonabéri and Bonamoussadi always see the same information.'
                : 'Lorsqu\'elle est activée, les annonces, résultats, emplois du temps et événements publiés sur un campus sont automatiquement répliqués sur tous les autres campus.'}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-10 h-6 rounded-full transition-colors relative ${syncEnabled ? 'bg-brand-600' : 'bg-ink-300'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-soft transition-transform ${syncEnabled ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                  <input type="checkbox" checked={syncEnabled} onChange={() => setSyncEnabled(!syncEnabled)} className="sr-only" />
                </div>
                <span className="text-sm font-medium">{syncEnabled ? (lang === 'en' ? 'Sync enabled' : 'Sync activée') : (lang === 'en' ? 'Sync disabled' : 'Sync désactivée')}</span>
              </label>
              {user?.role === 'admin' && (
                <button onClick={handleSync} disabled={syncing}
                  className="btn-primary text-sm"
                ><RefreshCw size={16} className={syncing ? 'animate-spin' : ''} /> {syncing ? (lang === 'en' ? 'Syncing...' : 'Synchronisation...') : (lang === 'en' ? 'Sync Now' : 'Synchroniser')}</button>
              )}
            </div>
            {syncEnabled && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
                <CheckCircle size={14} />
                {lang === 'en'
                  ? 'All campuses are synchronized. Data published on any campus appears everywhere.'
                  : 'Tous les campus sont synchronisés. Les données publiées apparaissent partout.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cross-campus stats */}
      <div className="card">
        <h3 className="font-display font-bold text-lg mb-4">
          {lang === 'en' ? 'Campus Directors' : 'Directeurs de campus'}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {CAMPUSES.filter(c => c.id !== 'all').map(c => {
            const data = MOCK_CAMPUS_DATA[c.id]
            if (!data) return null
            return (
              <div key={c.id} className="p-4 rounded-xl border border-ink-100">
                <div className={`w-3 h-3 rounded-full ${c.color} mb-2`} />
                <div className="font-semibold">{c.fullName}</div>
                <div className="text-sm text-ink-600 mt-2 space-y-1">
                  <div><span className="text-ink-400">Director:</span> {data.heads.director}</div>
                  <div><span className="text-ink-400">Registrar:</span> {data.heads.registrar}</div>
                  <div><span className="text-ink-400">Librarian:</span> {data.heads.librarian}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
