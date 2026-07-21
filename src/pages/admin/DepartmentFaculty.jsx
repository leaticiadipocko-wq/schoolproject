import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Edit2, Building2, Users, GraduationCap, Banknote, X } from 'lucide-react'
import { DEPARTMENTS, FACULTIES } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'
import StatCard from '@/components/ui/StatCard'

export default function DepartmentFaculty() {
  const [departments, setDepartments] = useState(DEPARTMENTS)
  const [faculties] = useState(FACULTIES)
  const [activeTab, setActiveTab] = useState('departments')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ code: '', name: '', faculty: faculties[0]?.name || '', hod: '', budget: '' })

  const totalBudget = departments.reduce((s, d) => s + d.budget, 0)
  const totalStudents = departments.reduce((s, d) => s + d.students, 0)
  const totalLecturers = departments.reduce((s, d) => s + d.lecturers, 0)

  const openAdd = () => {
    setEditing(null)
    setForm({ code: '', name: '', faculty: faculties[0]?.name || '', hod: '', budget: '' })
    setShowForm(true)
  }

  const openEdit = (d) => {
    setEditing(d)
    setForm({ code: d.code, name: d.name, faculty: d.faculty, hod: d.hod, budget: String(d.budget) })
    setShowForm(true)
  }

  const onSave = (e) => {
    e.preventDefault()
    if (!form.name || !form.code) return toast.error('Name and code are required')
    const payload = { ...form, budget: Number(form.budget) || 0, students: 0, lecturers: 0, established: new Date().toISOString().split('T')[0] }
    if (editing) {
      setDepartments(prev => prev.map(d => d.id === editing.id ? { ...d, ...payload } : d))
      toast.success('Department updated')
    } else {
      const id = `dept-${Date.now()}`
      setDepartments(prev => [...prev, { id, ...payload }])
      toast.success('Department added')
    }
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments & Faculties"
        subtitle="Manage academic departments, faculties, and HOD assignments"
        actions={
          <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add department</button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Building2} label="Departments" value={departments.length} color="brand" />
        <StatCard icon={GraduationCap} label="Faculties" value={faculties.length} color="accent" />
        <StatCard icon={Users} label="Students" value={totalStudents} color="green" />
        <StatCard icon={Banknote} label="Budget" value={`${(totalBudget / 1e6).toFixed(0)}M`} color="amber" />
      </div>

      <div className="flex gap-1 bg-ink-100 rounded-xl p-1 w-fit mb-4">
        {['departments', 'faculties'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
              activeTab === t ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
            }`}
          >{t}</button>
        ))}
      </div>

      {activeTab === 'departments' && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Department</th>
                <th className="text-left p-3">Faculty</th>
                <th className="text-left p-3">HOD</th>
                <th className="text-right p-3">Students</th>
                <th className="text-right p-3">Lecturers</th>
                <th className="text-right p-3">Budget</th>
                <th className="p-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {departments.map(d => (
                <tr key={d.id} className="hover:bg-ink-50 transition">
                  <td className="p-3"><span className="font-mono text-xs bg-ink-100 px-2 py-0.5 rounded">{d.code}</span></td>
                  <td className="p-3 font-medium text-sm">{d.name}</td>
                  <td className="p-3 text-sm text-ink-600">{d.faculty}</td>
                  <td className="p-3 text-sm">{d.hod}</td>
                  <td className="p-3 text-sm text-right">{d.students}</td>
                  <td className="p-3 text-sm text-right">{d.lecturers}</td>
                  <td className="p-3 text-sm text-right font-medium">{(d.budget / 1e6).toFixed(1)}M</td>
                  <td className="p-3">
                    <button onClick={() => openEdit(d)} className="p-1.5 hover:bg-ink-200 rounded-lg transition text-ink-500">
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'faculties' && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Faculty</th>
                <th className="text-left p-3">Dean</th>
                <th className="text-left p-3">Departments</th>
                <th className="text-left p-3">Established</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {faculties.map(f => (
                <tr key={f.id} className="hover:bg-ink-50 transition">
                  <td className="p-3"><span className="font-mono text-xs bg-ink-100 px-2 py-0.5 rounded">{f.code}</span></td>
                  <td className="p-3 font-medium text-sm">{f.name}</td>
                  <td className="p-3 text-sm">{f.dean}</td>
                  <td className="p-3 text-sm">
                    <div className="flex gap-1 flex-wrap">
                      {f.departments.map(did => {
                        const dept = departments.find(d => d.id === did)
                        return dept ? <span key={did} className="bg-brand-50 text-brand-700 text-[10px] px-2 py-0.5 rounded-full font-medium">{dept.code}</span> : null
                      })}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-ink-500">{f.established}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg">{editing ? 'Edit Department' : 'Add Department'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-ink-100 rounded-lg transition"><X size={18} /></button>
            </div>
            <form onSubmit={onSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Code</label>
                  <input className="input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="CS" />
                </div>
                <div className="col-span-2">
                  <label className="label">Department name</label>
                  <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoFocus />
                </div>
                <div>
                  <label className="label">Faculty</label>
                  <select className="input" value={form.faculty} onChange={e => setForm({ ...form, faculty: e.target.value })}>
                    {faculties.map(f => <option key={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">HOD</label>
                  <input className="input" value={form.hod} onChange={e => setForm({ ...form, hod: e.target.value })} placeholder="Dr. Name" />
                </div>
                <div className="col-span-2">
                  <label className="label">Annual Budget (FCFA)</label>
                  <input type="number" className="input" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Save changes' : 'Add department'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
