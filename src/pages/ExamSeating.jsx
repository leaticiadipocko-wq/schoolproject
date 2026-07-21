import { useState } from 'react'
import { MapPin, Calendar, Clock, Users, Printer, Download } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'

export default function ExamSeating() {
  const { examSeating } = useData()
  const { lang } = useLang()
  const [selected, setSelected] = useState(Object.keys(examSeating)[0] || '')

  const rooms = Object.entries(examSeating).map(([code, data]) => ({ code, ...data }))
  const current = examSeating[selected]

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Exam Seating' : 'Placement aux examens'}
        subtitle={lang === 'en' ? 'View your examination venue and seat' : 'Voir votre salle et place'}
      />

      <div className="flex gap-2 flex-wrap">
        {rooms.map(r => (
          <button key={r.code} onClick={() => setSelected(r.code)}
            className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition ${selected === r.code ? 'border-brand-600 bg-brand-50 text-brand-800' : 'border-ink-200 hover:border-brand-300'}`}
          >{r.code} — {r.course}</button>
        ))}
      </div>

      {current && (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card"><Calendar size={18} className="text-brand-600 mb-2" /><div className="text-xs text-ink-500">{lang === 'en' ? 'Date' : 'Date'}</div><div className="font-semibold">{new Date(current.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
            <div className="card"><Clock size={18} className="text-accent-600 mb-2" /><div className="text-xs text-ink-500">{lang === 'en' ? 'Time' : 'Heure'}</div><div className="font-semibold">{current.time}</div></div>
            <div className="card"><MapPin size={18} className="text-amber-600 mb-2" /><div className="text-xs text-ink-500">{lang === 'en' ? 'Venue' : 'Lieu'}</div><div className="font-semibold">{current.venue}</div></div>
          </div>

          <div className="card overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg">{lang === 'en' ? 'Seating Arrangement' : 'Placement'}</h3>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="btn-secondary text-xs"><Printer size={14} /> Print</button>
              </div>
            </div>
            <table className="w-full min-w-[600px]">
              <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="text-left p-3 w-20">{lang === 'en' ? 'Row' : 'Rangée'}</th>
                  {current.rows[0]?.seats.map(s => <th key={s} className="text-center p-3 w-24">{s}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {current.rows.map((row, i) => (
                  <tr key={row.row} className={i % 2 === 0 ? 'bg-white' : 'bg-ink-50/50'}>
                    <td className="p-3 font-bold text-brand-700">{row.row}</td>
                    {row.seats.map((seat, si) => (
                      <td key={seat} className="p-2 text-center">
                        <div className="inline-flex items-center justify-center w-full px-2 py-2 rounded-lg text-xs font-medium bg-white border border-ink-200">
                          {row.students[si] || '—'}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center gap-2 mt-4 text-xs text-ink-500">
              <Users size={14} /> {current.rows.reduce((sum, r) => sum + r.students.filter(Boolean).length, 0)} {lang === 'en' ? 'registered students' : 'étudiants inscrits'}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
