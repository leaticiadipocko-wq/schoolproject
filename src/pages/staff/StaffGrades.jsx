import { useState, useMemo } from 'react'
import { FileSpreadsheet, TrendingUp, Users, Award, Search } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useLang } from '@/context/LanguageContext'

const SAMPLE_GRADES = [
  { course: 'CS501', avg: 72.4, enrolled: 24, passed: 20, failed: 4, passRate: 83, dist: { A: 3, B: 8, C: 7, D: 2, F: 4 } },
  { course: 'CS503', avg: 68.2, enrolled: 18, passed: 15, failed: 3, passRate: 83, dist: { A: 2, B: 6, C: 5, D: 2, F: 3 } },
  { course: 'CS505', avg: 75.8, enrolled: 22, passed: 19, failed: 3, passRate: 86, dist: { A: 5, B: 7, C: 5, D: 2, F: 3 } },
  { course: 'CS507', avg: 71.0, enrolled: 22, passed: 18, failed: 4, passRate: 82, dist: { A: 3, B: 7, C: 6, D: 2, F: 4 } },
  { course: 'CS509', avg: 69.5, enrolled: 14, passed: 11, failed: 3, passRate: 79, dist: { A: 1, B: 5, C: 4, D: 1, F: 3 } },
  { course: 'CS511', avg: 73.1, enrolled: 24, passed: 20, failed: 4, passRate: 83, dist: { A: 4, B: 8, C: 6, D: 2, F: 4 } },
]

export default function StaffGrades() {
  const { lang } = useLang()
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')

  const grades = SAMPLE_GRADES
  const filtered = grades.filter(g =>
    (courseFilter === 'all' || g.course === courseFilter) &&
    (!search.trim() || g.course.toLowerCase().includes(search.toLowerCase()))
  )

  const totals = useMemo(() => ({
    avg: grades.length ? (grades.reduce((s, g) => s + g.avg, 0) / grades.length).toFixed(1) : '0',
    enrolled: grades.reduce((s, g) => s + g.enrolled, 0),
    passed: grades.reduce((s, g) => s + g.passed, 0),
    failed: grades.reduce((s, g) => s + g.failed, 0),
  }), [])

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Grade Overview' : 'Aperçu des notes'}
        subtitle={lang === 'en' ? 'View grade distribution across courses' : 'Consulter la distribution des notes par cours'}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <TrendingUp size={18} className="text-brand-600 mb-2" />
          <div className="text-xs text-ink-500">{lang === 'en' ? 'Average Grade' : 'Moyenne générale'}</div>
          <div className="text-2xl font-display font-bold">{totals.avg}%</div>
        </div>
        <div className="card">
          <Users size={18} className="text-accent-600 mb-2" />
          <div className="text-xs text-ink-500">{lang === 'en' ? 'Total Enrolled' : 'Total inscrits'}</div>
          <div className="text-2xl font-display font-bold">{totals.enrolled}</div>
        </div>
        <div className="card">
          <Award size={18} className="text-emerald-600 mb-2" />
          <div className="text-xs text-ink-500">{lang === 'en' ? 'Passed' : 'Réussis'}</div>
          <div className="text-2xl font-display font-bold">{totals.passed}</div>
        </div>
        <div className="card">
          <FileSpreadsheet size={18} className="text-red-600 mb-2" />
          <div className="text-xs text-ink-500">{lang === 'en' ? 'Failed' : 'Échoués'}</div>
          <div className="text-2xl font-display font-bold">{totals.failed}</div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input className="input pl-8 text-sm" placeholder={lang === 'en' ? 'Search course...' : 'Rechercher...'} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1 flex-wrap">
            {['all', ...new Set(grades.map(g => g.course))].map(c => (
              <button key={c} onClick={() => setCourseFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${courseFilter === c ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}
              >{c === 'all' ? (lang === 'en' ? 'All' : 'Tous') : c}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="text-left p-3">{lang === 'en' ? 'Course' : 'Cours'}</th>
                <th className="text-center p-3">{lang === 'en' ? 'Avg' : 'Moy'}</th>
                <th className="text-center p-3">{lang === 'en' ? 'Enrolled' : 'Inscrits'}</th>
                <th className="text-center p-3">{lang === 'en' ? 'Passed' : 'Réussis'}</th>
                <th className="text-center p-3">{lang === 'en' ? 'Failed' : 'Échoués'}</th>
                <th className="text-center p-3">{lang === 'en' ? 'Rate' : 'Taux'}</th>
                <th className="text-center p-3">{lang === 'en' ? 'Distribution' : 'Répartition'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((g, i) => (
                <tr key={i} className="hover:bg-ink-50">
                  <td className="p-3 font-medium text-sm">{g.course}</td>
                  <td className="p-3 text-center font-semibold">{g.avg}%</td>
                  <td className="p-3 text-center">{g.enrolled}</td>
                  <td className="p-3 text-center text-emerald-600 font-medium">{g.passed}</td>
                  <td className="p-3 text-center text-red-600 font-medium">{g.failed}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${g.passRate >= 80 ? 'bg-emerald-100 text-emerald-700' : g.passRate >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {g.passRate}%
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 h-5">
                      {['A','B','C','D','F'].map(grade => {
                        const total = Object.values(g.dist).reduce((s, v) => s + v, 0)
                        const pct = (g.dist[grade] / total) * 100
                        const colors = { A: 'bg-emerald-500', B: 'bg-blue-500', C: 'bg-amber-500', D: 'bg-orange-500', F: 'bg-red-500' }
                        return <div key={grade} className={`h-full ${colors[grade]}`} style={{ width: `${pct}%` }} title={`${grade}: ${g.dist[grade]}`} />
                      })}
                    </div>
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
