import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  BookOpen, MapPin, UserCheck, Plus, Save, Trash2, Filter, Search,
  CheckCircle2, AlertCircle, Building2,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'
import { MOCK_COURSES, MOCK_USERS, TIMETABLE_TRACKS, SPECIALTIES } from '@/lib/mockData'

/* Halls available at IUGET Bonabéri */
const HALLS = [
  { id: 'A', name: 'Hall A',     capacity: 80, building: 'Main building',  floor: '1st' },
  { id: 'B', name: 'Hall B',     capacity: 60, building: 'Main building',  floor: '2nd' },
  { id: 'C', name: 'Hall C',     capacity: 50, building: 'Annex',          floor: 'Ground' },
  { id: 'D', name: 'Lab 1',      capacity: 30, building: 'IT block',       floor: '1st' },
  { id: 'E', name: 'Lab 2',      capacity: 30, building: 'IT block',       floor: '1st' },
  { id: 'F', name: 'Lab 3',      capacity: 30, building: 'IT block',       floor: '2nd' },
  { id: 'G', name: 'Studio',     capacity: 25, building: 'Design block',   floor: '1st' },
  { id: 'H', name: 'Auditorium', capacity: 200,building: 'Main building',  floor: 'Ground' },
]

const LECTURERS = MOCK_USERS.filter((u) => u.role === 'lecturer').concat([
  { uid: 'lec-002', name: 'Eng Fotseu Julien',  department: 'Embedded Systems' },
  { uid: 'lec-003', name: 'Mr Smith Wills',     department: 'Mobile Development' },
  { uid: 'lec-004', name: 'Dr Romeo Mougnol',   department: 'Design Project' },
  { uid: 'lec-005', name: 'Mr Asongafack Patrick', department: 'OOP' },
  { uid: 'lec-006', name: 'Engr Malobe Lottin',    department: 'Linux Programming' },
  { uid: 'lec-007', name: 'Mr Kamdem Arnaud',      department: 'Geotechnical Engineering' },
])

export default function Assignments() {
  const { t, lang } = useLang()
  const { timetable, setTimetableSlot } = useData()
  const [filter, setFilter]     = useState({ specialty: 'all', track: 'bachelor-evening' })
  const [search, setSearch]     = useState('')
  const [editing, setEditing]   = useState(null) // { course, day, time, ... }

  // Build a list of all course-slot assignments to display
  const slots = useMemo(() => {
    return timetable
      .filter((s) => (s.track || 'bachelor-evening') === filter.track)
      .filter((s) => filter.specialty === 'all' || s.specialty === filter.specialty)
      .filter((s) =>
        !search ||
        (s.course || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.lecturer || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.room || '').toLowerCase().includes(search.toLowerCase())
      )
  }, [timetable, filter, search])

  const startNew = () => {
    setEditing({ day: 'Monday', time: '18:00 - 20:00', course: '', specialty: 'SWE', lecturer: '', room: '' })
  }

  const startEdit = (slot) => setEditing({ ...slot })

  const saveSlot = () => {
    if (!editing.course || !editing.lecturer || !editing.room) {
      return toast.error(lang === 'en' ? 'Course, lecturer and hall are required' : 'Cours, enseignant et salle sont requis')
    }
    setTimetableSlot({ ...editing, track: filter.track })
    toast.success(lang === 'en' ? 'Assignment saved' : 'Affectation enregistrée')
    setEditing(null)
  }

  const track = TIMETABLE_TRACKS[filter.track]
  const allTimes = [...(track?.weekdaySlots || []), ...(track?.saturdaySlots || [])]
  const allDays  = track?.days || []
  const allCourses = MOCK_COURSES.filter((c) => c.track === filter.track)

  // Conflict detection: same hall used by another slot at the same time
  const conflicts = useMemo(() => {
    const map = {}
    timetable.forEach((s) => {
      const key = `${s.day}|${s.time}|${s.room}`
      if (!map[key]) map[key] = []
      map[key].push(s)
    })
    return Object.values(map).filter((v) => v.length > 1)
  }, [timetable])

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Course & Hall Assignments' : 'Affectations Cours & Salles'}
        subtitle={lang === 'en'
          ? 'Assign a lecturer and a hall to every course slot'
          : 'Attribuer un enseignant et une salle à chaque créneau'}
        actions={
          <button onClick={startNew} className="btn-primary">
            <Plus size={16} /> {lang === 'en' ? 'New assignment' : 'Nouvelle affectation'}
          </button>
        }
      />

      {/* Filters */}
      <div className="card">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="label">{lang === 'en' ? 'Track' : 'Section'}</label>
            <select className="input" value={filter.track} onChange={(e) => setFilter((f) => ({ ...f, track: e.target.value }))}>
              {Object.values(TIMETABLE_TRACKS).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{lang === 'en' ? 'Specialty' : 'Spécialité'}</label>
            <select className="input" value={filter.specialty} onChange={(e) => setFilter((f) => ({ ...f, specialty: e.target.value }))}>
              <option value="all">{lang === 'en' ? 'All specialties' : 'Toutes spécialités'}</option>
              {Object.values(SPECIALTIES).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="label">{lang === 'en' ? 'Search' : 'Rechercher'}</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input className="input pl-9" placeholder={lang === 'en' ? 'Course, lecturer, hall…' : 'Cours, enseignant, salle…'} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Conflicts banner */}
      {conflicts.length > 0 && (
        <div className="card bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-bold text-amber-900 dark:text-amber-200">
              {conflicts.length} {lang === 'en' ? 'scheduling conflict(s) detected' : 'conflit(s) d\'emploi du temps détecté(s)'}
            </div>
            <div className="text-amber-800 dark:text-amber-300 mt-0.5">
              {lang === 'en' ? 'Two or more courses share the same hall at the same time. Review the highlighted rows below.' : 'Deux cours partagent la même salle au même moment. Vérifiez les lignes en surbrillance.'}
            </div>
          </div>
        </div>
      )}

      {/* Assignments table */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-lg">
            {lang === 'en' ? 'Current assignments' : 'Affectations actuelles'}
          </h3>
          <span className="badge-info">
            <Filter size={12} /> {slots.length} {lang === 'en' ? 'slots' : 'créneaux'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-500 uppercase tracking-wider border-b border-ink-100 dark:border-ink-800">
                <th className="py-2.5 px-3">{lang === 'en' ? 'Day' : 'Jour'}</th>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Time' : 'Horaire'}</th>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Course' : 'Cours'}</th>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Specialty' : 'Spécialité'}</th>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Lecturer' : 'Enseignant'}</th>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Hall' : 'Salle'}</th>
                <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Actions' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {slots.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-ink-500">
                  {lang === 'en' ? 'No assignments for these filters.' : 'Aucune affectation pour ces filtres.'}
                </td></tr>
              ) : slots.map((s, i) => {
                const conflicted = conflicts.some((c) => c.some((cc) => cc.day === s.day && cc.time === s.time && cc.room === s.room))
                return (
                  <tr key={i} className={`border-b border-ink-50 dark:border-ink-800 ${conflicted ? 'bg-amber-50/60 dark:bg-amber-900/20' : 'hover:bg-ink-50/50 dark:hover:bg-ink-800/50'}`}>
                    <td className="py-2.5 px-3 font-medium">{s.day}</td>
                    <td className="py-2.5 px-3 text-ink-600 font-mono text-xs">{s.time}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-mono text-xs text-brand-700">{s.course}</div>
                      <div className="text-[11px] text-ink-500">{MOCK_COURSES.find((c) => c.code === s.course)?.name}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={SPECIALTIES[s.specialty]?.chip || 'badge-info'}>
                        {s.specialty || '—'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 inline-flex items-center gap-1.5 text-ink-700">
                      <UserCheck size={12} className="text-emerald-600" /> {s.lecturer || '—'}
                    </td>
                    <td className="py-2.5 px-3 inline-flex items-center gap-1.5">
                      <MapPin size={12} className={conflicted ? 'text-amber-600' : 'text-brand-600'} /> {s.room || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button onClick={() => startEdit(s)} className="btn-ghost text-xs">
                        {lang === 'en' ? 'Edit' : 'Modifier'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Halls overview */}
      <div className="card">
        <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
          <Building2 size={20} className="text-brand-600" />
          {lang === 'en' ? 'IUGET Bonabéri halls & rooms' : 'Salles IUGET Bonabéri'}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {HALLS.map((h) => {
            const used = timetable.filter((s) => s.room?.startsWith(h.name) || s.room === h.name).length
            return (
              <div key={h.id} className="p-3 rounded-xl border border-ink-100 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-800/30">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{h.name}</div>
                  <span className="badge-info">{h.capacity} {lang === 'en' ? 'seats' : 'places'}</span>
                </div>
                <div className="text-xs text-ink-500 mt-1">{h.building} · {h.floor}</div>
                <div className="text-[11px] mt-1 text-emerald-700 dark:text-emerald-400">
                  {used} {lang === 'en' ? 'slot(s) booked' : 'créneau(x) réservé(s)'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 bg-ink-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setEditing(null) }}>
          <div className="bg-white dark:bg-ink-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-ink-100 dark:border-ink-800">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-brand-600" />
                <h2 className="font-display font-bold text-lg">
                  {lang === 'en' ? 'Assign a slot' : 'Affecter un créneau'}
                </h2>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">{lang === 'en' ? 'Day' : 'Jour'}</label>
                  <select className="input" value={editing.day} onChange={(e) => setEditing((s) => ({ ...s, day: e.target.value }))}>
                    {allDays.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">{lang === 'en' ? 'Time' : 'Horaire'}</label>
                  <select className="input" value={editing.time} onChange={(e) => setEditing((s) => ({ ...s, time: e.target.value }))}>
                    {allTimes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">{lang === 'en' ? 'Course' : 'Cours'}</label>
                  <select className="input" value={editing.course} onChange={(e) => setEditing((s) => ({ ...s, course: e.target.value }))}>
                    <option value="">— {lang === 'en' ? 'choose' : 'choisir'} —</option>
                    {allCourses.map((c) => <option key={c.code} value={c.code}>{c.code} · {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">{lang === 'en' ? 'Specialty' : 'Spécialité'}</label>
                  <select className="input" value={editing.specialty || ''} onChange={(e) => setEditing((s) => ({ ...s, specialty: e.target.value }))}>
                    <option value="">{lang === 'en' ? 'All' : 'Toutes'}</option>
                    {(track?.specialties || []).map((sp) => <option key={sp} value={sp}>{sp}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">{lang === 'en' ? 'Lecturer' : 'Enseignant'}</label>
                  <select className="input" value={editing.lecturer} onChange={(e) => setEditing((s) => ({ ...s, lecturer: e.target.value }))}>
                    <option value="">— {lang === 'en' ? 'choose' : 'choisir'} —</option>
                    {LECTURERS.map((l) => <option key={l.uid} value={l.name}>{l.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">{lang === 'en' ? 'Hall' : 'Salle'}</label>
                  <select className="input" value={editing.room} onChange={(e) => setEditing((s) => ({ ...s, room: e.target.value }))}>
                    <option value="">— {lang === 'en' ? 'choose' : 'choisir'} —</option>
                    {HALLS.map((h) => <option key={h.id} value={h.name}>{h.name} ({h.capacity})</option>)}
                  </select>
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-2.5 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                {lang === 'en'
                  ? 'Saving this assignment publishes it immediately to the student timetable.'
                  : 'L\'enregistrement publie l\'affectation immédiatement dans l\'emploi du temps étudiant.'}
              </div>
            </div>
            <div className="p-4 border-t border-ink-100 dark:border-ink-800 flex justify-end gap-2 bg-ink-50/50 dark:bg-ink-950/50">
              <button onClick={() => setEditing(null)} className="btn-ghost">{lang === 'en' ? 'Cancel' : 'Annuler'}</button>
              <button onClick={saveSlot} className="btn-primary">
                <Save size={14} /> {lang === 'en' ? 'Save assignment' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
