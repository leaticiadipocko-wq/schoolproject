import { useState } from 'react'
import toast from 'react-hot-toast'
import { CalendarDays, MapPin, Clock, Users, Plus, X, Sparkles } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'
import { CAMPUSES } from '@/lib/mockData'

export default function Events() {
  const { user } = useAuth()
  const { events, addEvent, rsvpEvent, campus } = useData()
  const { lang } = useLang()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', time: '', venue: '', description: '', organizer: user?.name || '', campus: 'bonaberi' })

  const campusEvents = events.filter(e => e.campus === campus || e.campus === campus)
  const upcoming = campusEvents.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date))

  const handleCreate = (e) => {
    e.preventDefault()
    addEvent(form)
    setShowForm(false)
    setForm({ title: '', date: '', time: '', venue: '', description: '', organizer: user?.name || '', campus: 'bonaberi' })
    toast.success(lang === 'en' ? 'Event created' : 'Événement créé')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Campus Events' : 'Événements du campus'}
        subtitle={lang === 'en' ? 'Upcoming activities across all campuses' : 'Activités à venir'}
        actions={user?.role === 'admin' || user?.role === 'staff' ? (
          <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> {lang === 'en' ? 'Create Event' : 'Créer'}</button>
        ) : null}
      />

      <div className="space-y-4">
        {upcoming.length === 0 ? (
          <div className="card text-center py-12 text-ink-500">
            <CalendarDays size={40} className="mx-auto text-ink-300 mb-3" />
            <p>{lang === 'en' ? 'No upcoming events.' : 'Aucun événement à venir.'}</p>
          </div>
        ) : upcoming.map(ev => (
          <div key={ev.id} className="card-hover">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex flex-col items-center justify-center shrink-0">
                <div className="text-lg font-bold">{new Date(ev.date).getDate()}</div>
                <div className="text-[10px] uppercase leading-tight">{new Date(ev.date).toLocaleString('default', { month: 'short' })}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{ev.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium text-white ${CAMPUSES.find(c => c.id === ev.campus)?.color || 'bg-ink-500'}`}>
                    {CAMPUSES.find(c => c.id === ev.campus)?.name || ev.campus}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-ink-500 flex-wrap">
                  <span className="flex items-center gap-1"><Clock size={12} /> {ev.time}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {ev.venue}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {ev.organizer}</span>
                </div>
                <p className="text-sm text-ink-600 mt-2">{ev.description}</p>
              </div>
              <button onClick={() => { rsvpEvent(ev.id); toast.success(lang === 'en' ? 'RSVP recorded!' : 'RSVP enregistré!') }}
                className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-700 transition shrink-0"
              >RSVP</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg"><Sparkles size={20} className="inline mr-2 text-brand-600" />{lang === 'en' ? 'New Event' : 'Nouvel événement'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-ink-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="label">{lang === 'en' ? 'Title' : 'Titre'}</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">{lang === 'en' ? 'Date' : 'Date'}</label><input type="date" className="input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required /></div>
                <div><label className="label">{lang === 'en' ? 'Time' : 'Heure'}</label><input className="input" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required /></div>
              </div>
              <div><label className="label">{lang === 'en' ? 'Venue' : 'Lieu'}</label><input className="input" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} required /></div>
              <div><label className="label">{lang === 'en' ? 'Description' : 'Description'}</label><textarea className="input min-h-[80px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div><label className="label">{lang === 'en' ? 'Campus' : 'Campus'}</label>
                <div className="flex gap-2">
                  {CAMPUSES.filter(c => c.id !== 'all').map(c => (
                    <button key={c.id} type="button" onClick={() => setForm({ ...form, campus: c.id })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition ${form.campus === c.id ? c.color + ' text-white border-transparent' : 'border-ink-200 text-ink-600'}`}
                    >{c.name}</button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-primary w-full"><Sparkles size={16} /> {lang === 'en' ? 'Create Event' : 'Créer'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
