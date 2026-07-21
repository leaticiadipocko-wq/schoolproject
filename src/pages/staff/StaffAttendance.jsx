import { useState } from 'react'
import { Search, ClipboardCheck, Users, Calendar, Filter, Download } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'
import { MOCK_COURSES } from '@/lib/mockData'

export default function StaffAttendance() {
  const { attendance } = useData()
  const { lang } = useLang()
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')

  const records = attendance.length > 0 ? attendance : [
    { course: 'CS501', period: '10:00 - 12:00', total: 24, attended: 22, percent: 92 },
    { course: 'CS503', period: '08:00 - 10:00', total: 18, attended: 17, percent: 94 },
    { course: 'CS505', period: '10:00 - 12:00', total: 22, attended: 19, percent: 86 },
    { course: 'CS507', period: '13:00 - 15:00', total: 22, attended: 21, percent: 95 },
    { course: 'CS509', period: '15:00 - 17:00', total: 14, attended: 13, percent: 93 },
    { course: 'CS511', period: '10:00 - 12:00', total: 24, attended: 20, percent: 83 },
  ]

  const filtered = records.filter(r =>
    (courseFilter === 'all' || r.course === courseFilter) &&
    (!search.trim() || r.course.toLowerCase().includes(search.toLowerCase()))
  )

  const totalAvg = records.length ? Math.round(records.reduce((s, r) => s + r.percent, 0) / records.length) : 0

  return (
    <div className="space-y-6">
      <PageHeader title={lang === 'en' ? 'Attendance Records' : "Registres d'assiduité"} subtitle={lang === 'en' ? 'View attendance across all courses' : "Voir l'assiduité par cours"} />

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card"><ClipboardCheck size={18} className="text-brand-600 mb-2" /><div className="text-xs text-ink-500">{lang === 'en' ? 'Average Attendance' : 'Moyenne'}</div><div className="text-2xl font-display font-bold">{totalAvg}%</div></div>
        <div className="card"><Users size={18} className="text-accent-600 mb-2" /><div className="text-xs text-ink-500">{lang === 'en' ? 'Total Students' : 'Total étudiants'}</div><div className="text-2xl font-display font-bold">{records.reduce((s, r) => s + r.total, 0)}</div></div>
        <div className="card"><Calendar size={18} className="text-amber-600 mb-2" /><div className="text-xs text-ink-500">{lang === 'en' ? 'Courses' : 'Cours'}</div><div className="text-2xl font-display font-bold">{records.length}</div></div>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input className="input pl-8 text-sm" placeholder={lang === 'en' ? 'Search course...' : 'Rechercher...'} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1 flex-wrap">
            {['all', ...new Set(records.map(r => r.course))].map(c => (
              <button key={c} onClick={() => setCourseFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${courseFilter === c ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}
              >{c === 'all' ? (lang === 'en' ? 'All' : 'Tous') : c}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr><th className="text-left p-3">{lang === 'en' ? 'Course' : 'Cours'}</th><th className="text-left p-3">{lang === 'en' ? 'Period' : 'Période'}</th><th className="text-center p-3">{lang === 'en' ? 'Total' : 'Total'}</th><th className="text-center p-3">{lang === 'en' ? 'Attended' : 'Présents'}</th><th className="text-center p-3">{lang === 'en' ? 'Rate' : 'Taux'}</th><th className="text-center p-3">{lang === 'en' ? 'Status' : 'Statut'}</th></tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-ink-50">
                  <td className="p-3 font-medium text-sm">{r.course}</td>
                  <td className="p-3 text-sm text-ink-600">{r.period}</td>
                  <td className="p-3 text-center">{r.total}</td>
                  <td className="p-3 text-center">{r.attended}</td>
                  <td className="p-3 text-center font-semibold">{r.percent}%</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${r.percent >= 90 ? 'bg-emerald-100 text-emerald-700' : r.percent >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {r.percent >= 90 ? 'Excellent' : r.percent >= 75 ? 'Good' : 'Needs improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
