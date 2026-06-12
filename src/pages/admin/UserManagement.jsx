import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Search, MoreVertical, Trash2, Edit2, X } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { ROLE_LABELS, ROLES } from '@/lib/roles'
import PageHeader from '@/components/ui/PageHeader'

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useData()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'student' })

  const filtered = users.filter((u) =>
    (filter === 'all' || u.role === filter) &&
    (u.name?.toLowerCase().includes(query.toLowerCase()) || u.email?.includes(query))
  )

  const openAdd = () => {
    setEditingUser(null)
    setForm({ name: '', email: '', role: 'student' })
    setShowForm(true)
  }

  const openEdit = (u) => {
    setEditingUser(u)
    setForm({ name: u.name || '', email: u.email || '', role: u.role || 'student' })
    setShowForm(true)
    setOpenMenu(null)
  }

  const onSave = (e) => {
    e.preventDefault()
    if (!form.name || !form.email) return toast.error('Name and email are required')
    if (editingUser) {
      updateUser(editingUser.uid, form)
      toast.success('User updated')
    } else {
      addUser({
        ...form,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(form.name)}`,
      })
      toast.success('User added')
    }
    setShowForm(false)
  }

  const onDelete = (u) => {
    if (confirm(`Delete ${u.name}?`)) {
      deleteUser(u.uid)
      toast.success('User deleted')
      setOpenMenu(null)
    }
  }

  const toggleStatus = (u) => {
    updateUser(u.uid, { status: u.status === 'inactive' ? 'active' : 'inactive' })
    toast.success(`User ${u.status === 'inactive' ? 'activated' : 'deactivated'}`)
    setOpenMenu(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle={`${users.length} users · Manage students, lecturers, and staff accounts`}
        actions={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add user</button>}
      />

      <div className="card">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email…"
              className="input pl-10 py-2 text-sm"
            />
          </div>
          <div className="flex gap-1.5">
            {['all', 'student', 'lecturer', 'staff', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition capitalize ${
                  filter === r ? 'bg-brand-800 text-white' : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Status</th>
              <th className="p-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {filtered.map((u) => (
              <tr key={u.uid} className="hover:bg-ink-50/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt="" className="w-9 h-9 rounded-full" />
                    <div>
                      <div className="font-medium text-sm">{u.name}</div>
                      <div className="text-xs text-ink-500 font-mono">{u.uid}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-ink-600">{u.email}</td>
                <td className="p-4">
                  <span className="badge-info">{ROLE_LABELS[u.role]}</span>
                </td>
                <td className="p-4">
                  <span className={u.status === 'inactive' ? 'badge-danger' : 'badge-success'}>
                    {u.status || 'active'}
                  </span>
                </td>
                <td className="p-4 relative">
                  <button onClick={() => setOpenMenu(openMenu === u.uid ? null : u.uid)} className="p-2 rounded-lg hover:bg-ink-100 text-ink-500">
                    <MoreVertical size={16} />
                  </button>
                  {openMenu === u.uid && (
                    <div className="absolute right-2 mt-1 z-10 w-44 bg-white border border-ink-100 rounded-xl shadow-soft p-1">
                      <button onClick={() => openEdit(u)} className="w-full px-3 py-2 text-left text-sm hover:bg-ink-50 rounded-lg flex items-center gap-2">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => toggleStatus(u)} className="w-full px-3 py-2 text-left text-sm hover:bg-ink-50 rounded-lg">
                        {u.status === 'inactive' ? 'Activate' : 'Deactivate'}
                      </button>
                      <button onClick={() => onDelete(u)} className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-10 text-center text-ink-500 text-sm">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-soft" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg">{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-ink-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={onSave} className="space-y-4">
              <div>
                <label className="label">Full name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {Object.values(ROLES).map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editingUser ? 'Save' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
