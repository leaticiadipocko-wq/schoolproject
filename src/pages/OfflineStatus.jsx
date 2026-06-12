import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Wifi, WifiOff, Download, HardDrive, RefreshCw, Trash2,
  CheckCircle2, ShieldCheck, Smartphone, Clock, Database,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useLang } from '@/context/LanguageContext'
import { peek as peekQueue, clear as clearQueue, flush as flushQueue } from '@/lib/offlineQueue'

/**
 * Offline Status — shows the state of the PWA cache, the install
 * prompt, the offline action queue, and what works without a network.
 */
export default function OfflineStatus() {
  const { t, lang } = useLang()
  const [online, setOnline]       = useState(navigator.onLine)
  const [cacheInfo, setCacheInfo] = useState({ caches: [], total: 0 })
  const [queue, setQueue]         = useState(peekQueue())
  const [installPrompt, setInstallPrompt] = useState(null)
  const [storageInfo, setStorageInfo]     = useState(null)

  /* online/offline */
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  /* install prompt */
  useEffect(() => {
    const h = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])

  /* offline queue */
  useEffect(() => {
    const h = () => setQueue(peekQueue())
    window.addEventListener('siarm:queueChanged', h)
    return () => window.removeEventListener('siarm:queueChanged', h)
  }, [])

  /* cache inspection */
  const refreshCaches = async () => {
    if (!('caches' in window)) return
    const keys = await window.caches.keys()
    const out = []
    let total = 0
    for (const k of keys) {
      const c = await window.caches.open(k)
      const entries = await c.keys()
      out.push({ name: k, count: entries.length })
      total += entries.length
    }
    setCacheInfo({ caches: out.sort((a, b) => b.count - a.count), total })
  }

  /* storage estimate */
  const refreshStorage = async () => {
    if (navigator.storage && navigator.storage.estimate) {
      const s = await navigator.storage.estimate()
      setStorageInfo(s)
    }
  }

  useEffect(() => { refreshCaches(); refreshStorage() }, [])

  const install = async () => {
    if (!installPrompt) return toast.error(lang === 'en' ? 'Install prompt not available right now.' : 'L\'invite d\'installation n\'est pas disponible pour l\'instant.')
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') toast.success(lang === 'en' ? 'SIARM installed' : 'SIARM installée')
    setInstallPrompt(null)
  }

  const purge = async () => {
    if (!confirm(lang === 'en' ? 'Clear all cached SIARM data? You will need to re-visit each page online.' : 'Vider tout le cache SIARM ? Vous devrez revisiter chaque page en ligne.')) return
    if ('caches' in window) {
      const keys = await window.caches.keys()
      await Promise.all(keys.map((k) => window.caches.delete(k)))
    }
    refreshCaches()
    refreshStorage()
    toast.success(lang === 'en' ? 'Caches cleared' : 'Caches vidés')
  }

  const replayQueue = async () => {
    if (!online) return toast.error(lang === 'en' ? 'You are offline. Will retry when online.' : 'Vous êtes hors-ligne. Une nouvelle tentative aura lieu en ligne.')
    const { applied, failed } = await flushQueue(async () => {})  // no-op handler in demo
    setQueue(peekQueue())
    toast.success(lang === 'en' ? `${applied} applied, ${failed} failed` : `${applied} appliquées, ${failed} échouées`)
  }

  const fmtBytes = (n) => {
    if (!n) return '—'
    const u = ['B', 'KB', 'MB', 'GB']
    let i = 0
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++ }
    return `${n.toFixed(1)} ${u[i]}`
  }

  /* Available-offline pages */
  const features = lang === 'en' ? OFFLINE_FEATURES_EN : OFFLINE_FEATURES_FR

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Offline Mode' : 'Mode hors-ligne'}
        subtitle={lang === 'en' ? 'Run SIARM without an internet connection' : 'Utiliser SIARM sans connexion Internet'}
      />

      {/* Connection status */}
      <div className={`card ${online ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-gradient-to-br from-amber-500 to-red-600'} text-white border-0`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
              {online ? <Wifi size={26} /> : <WifiOff size={26} />}
            </div>
            <div>
              <div className="text-white/80 text-xs uppercase tracking-wider">{lang === 'en' ? 'Connection' : 'Connexion'}</div>
              <div className="text-2xl font-display font-bold">
                {online ? (lang === 'en' ? 'Online' : 'En ligne') : (lang === 'en' ? 'Offline' : 'Hors-ligne')}
              </div>
              <div className="text-sm text-white/80 mt-0.5">
                {online
                  ? (lang === 'en' ? 'Live data syncs in real time' : 'Les données se synchronisent en temps réel')
                  : (lang === 'en' ? 'Working from cache · actions are queued' : 'Données en cache · actions en file d\'attente')
                }
              </div>
            </div>
          </div>
          {installPrompt && (
            <button onClick={install} className="bg-white text-emerald-700 hover:bg-white/90 transition rounded-xl px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2">
              <Smartphone size={16} /> {lang === 'en' ? 'Install app' : 'Installer l\'application'}
            </button>
          )}
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={HardDrive} label={lang === 'en' ? 'Cache entries' : 'Entrées en cache'} value={cacheInfo.total} accent="bg-brand-100 text-brand-700" />
        <Card icon={Database}  label={lang === 'en' ? 'Storage used' : 'Stockage utilisé'} value={fmtBytes(storageInfo?.usage)} accent="bg-emerald-100 text-emerald-700" />
        <Card icon={Database}  label={lang === 'en' ? 'Storage quota' : 'Quota'}            value={fmtBytes(storageInfo?.quota)} accent="bg-amber-100 text-amber-700" />
        <Card icon={Clock}     label={lang === 'en' ? 'Queued actions' : 'Actions en attente'} value={queue.length}            accent="bg-accent-100 text-accent-700" />
      </div>

      {/* Available offline grid */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={20} className="text-emerald-600" />
          <h3 className="font-display font-bold text-lg">
            {lang === 'en' ? 'Available offline' : 'Disponible hors-ligne'}
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f) => (
            <div key={f.title} className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium text-sm">{f.title}</div>
                <div className="text-xs text-ink-600 mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Queue */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-accent-600" />
            <h3 className="font-display font-bold text-lg">
              {lang === 'en' ? 'Action queue' : 'File d\'actions'}
            </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={replayQueue} disabled={!queue.length} className="btn-secondary text-sm disabled:opacity-50">
              <RefreshCw size={14} /> {lang === 'en' ? 'Replay now' : 'Rejouer'}
            </button>
            <button onClick={() => { clearQueue(); setQueue([]) }} disabled={!queue.length} className="btn-ghost text-sm text-red-600 disabled:opacity-50">
              <Trash2 size={14} /> {lang === 'en' ? 'Clear' : 'Vider'}
            </button>
          </div>
        </div>
        {queue.length === 0 ? (
          <div className="text-center py-6 text-sm text-ink-500">
            {lang === 'en' ? 'No queued actions. Anything you do offline will appear here until you reconnect.'
                            : 'Aucune action en attente. Ce que vous ferez hors-ligne apparaîtra ici jusqu\'à la reconnexion.'}
          </div>
        ) : (
          <div className="space-y-2">
            {queue.map((q) => (
              <div key={q.id} className="p-3 rounded-lg border border-ink-100 bg-ink-50/50 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{q.type}</div>
                  <div className="text-xs text-ink-500 mt-0.5">{new Date(q.queuedAt).toLocaleString()}</div>
                </div>
                <span className="badge-warning">{lang === 'en' ? 'queued' : 'en attente'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Caches inspector */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HardDrive size={20} className="text-brand-600" />
            <h3 className="font-display font-bold text-lg">
              {lang === 'en' ? 'Service-worker caches' : 'Caches du Service Worker'}
            </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={refreshCaches} className="btn-secondary text-sm">
              <RefreshCw size={14} /> {lang === 'en' ? 'Refresh' : 'Actualiser'}
            </button>
            <button onClick={purge} className="btn-ghost text-sm text-red-600">
              <Trash2 size={14} /> {lang === 'en' ? 'Purge cache' : 'Vider le cache'}
            </button>
          </div>
        </div>
        {cacheInfo.caches.length === 0 ? (
          <div className="text-center py-6 text-sm text-ink-500">
            {lang === 'en' ? 'No caches found. Visit a few pages so they become available offline.' : 'Aucun cache. Visitez quelques pages pour les rendre disponibles hors-ligne.'}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {cacheInfo.caches.map((c) => (
              <div key={c.name} className="p-3 rounded-lg border border-ink-100 bg-ink-50/30">
                <div className="text-xs font-mono text-ink-500 truncate">{c.name}</div>
                <div className="text-xl font-bold text-brand-700 mt-0.5">{c.count}</div>
                <div className="text-[10px] text-ink-500">{lang === 'en' ? 'entries' : 'entrées'}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Install hint */}
      <div className="card bg-gradient-to-br from-brand-700 to-brand-900 text-white border-0">
        <div className="flex items-start gap-4">
          <Download size={28} />
          <div>
            <h3 className="font-display font-bold text-lg">
              {lang === 'en' ? 'Make SIARM truly offline' : 'Rendre SIARM totalement hors-ligne'}
            </h3>
            <p className="text-white/85 mt-1 text-sm">
              {lang === 'en'
                ? 'Install SIARM on your phone or laptop home screen and it will launch in one tap and work even without internet.'
                : 'Installez SIARM sur l\'écran d\'accueil de votre téléphone ou ordinateur pour la lancer en un toucher, même sans Internet.'}
            </p>
            <ul className="text-sm text-white/80 mt-3 space-y-1.5">
              <li><span className="font-semibold">Chrome / Edge:</span> {lang === 'en' ? 'click the install icon in the URL bar' : 'cliquez sur l\'icône d\'installation dans la barre d\'URL'}</li>
              <li><span className="font-semibold">iOS Safari:</span> {lang === 'en' ? 'Share → Add to Home Screen' : 'Partager → Sur l\'écran d\'accueil'}</li>
              <li><span className="font-semibold">Android Chrome:</span> {lang === 'en' ? 'Menu → Install app' : 'Menu → Installer l\'application'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ icon: Icon, label, value, accent }) {
  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon size={18} />
        </div>
        <div>
          <div className="text-xs text-ink-500">{label}</div>
          <div className="text-xl font-display font-bold mt-0.5">{value ?? '—'}</div>
        </div>
      </div>
    </div>
  )
}

/* What works offline — bilingual */
const OFFLINE_FEATURES_EN = [
  { title: 'Dashboard',       desc: 'Personalised dashboard renders from cached data.' },
  { title: 'Timetable',       desc: 'Bachelor + Levels 1/2 timetables fully cached.' },
  { title: 'Results',         desc: 'View and download already-fetched results as PDF.' },
  { title: 'Transcript',      desc: 'Generate transcript PDF entirely client-side.' },
  { title: 'Student ID card', desc: 'Render, print and PDF the ID card offline.' },
  { title: 'Announcements',   desc: 'Last-seen announcements remain readable.' },
  { title: 'Tuition & Fees',  desc: 'Receipt PDFs print without network.' },
  { title: 'Mobile Learning', desc: 'Cached lessons remain accessible.' },
  { title: 'Sign in / out',   desc: 'Demo-mode login works fully offline.' },
  { title: 'Profile + Help',  desc: 'Profile preferences and bilingual FAQ available offline.' },
  { title: 'Command palette', desc: 'Cmd/Ctrl+K navigation works offline.' },
  { title: 'Action queue',    desc: 'Attendance / grades / payments are queued and replay on reconnect.' },
]
const OFFLINE_FEATURES_FR = [
  { title: 'Tableau de bord', desc: 'Tableau personnalisé rendu depuis le cache.' },
  { title: 'Emploi du temps', desc: 'Bachelor + Niveaux 1/2 entièrement en cache.' },
  { title: 'Résultats',       desc: 'Consultation et téléchargement PDF des résultats déjà chargés.' },
  { title: 'Relevé de notes', desc: 'Génération PDF du relevé entièrement côté client.' },
  { title: 'Carte étudiant',  desc: 'Affichage, impression et PDF hors-ligne.' },
  { title: 'Annonces',        desc: 'Les dernières annonces restent lisibles.' },
  { title: 'Scolarité',       desc: 'Impression des reçus PDF sans réseau.' },
  { title: 'Apprentissage',   desc: 'Leçons en cache restent accessibles.' },
  { title: 'Connexion',       desc: 'La connexion en mode démo fonctionne hors-ligne.' },
  { title: 'Profil + Aide',   desc: 'Préférences et FAQ bilingue disponibles hors-ligne.' },
  { title: 'Palette commandes', desc: 'Cmd/Ctrl+K fonctionne hors-ligne.' },
  { title: 'File d\'actions', desc: 'Présences, notes, paiements en file d\'attente jusqu\'à la reconnexion.' },
]
