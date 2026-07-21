import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import {
  Plus, Search, MoreVertical, Trash2, Edit2, X, Users, UserCheck, UserX,
  Shield, Mail, Phone, Calendar, Key, Download, Filter, CheckSquare, Square,
  ChevronLeft, ChevronRight, AlertCircle,
} from 'lucide-react'
import { useData } from '@/context/DataContext'
import { ROLE_LABELS, ROLES } from '@/lib/roles'
import PageHeader from '@/components/ui/PageHeader'
import StatCard from '@/components/ui/StatCard'

const PAGE_SIZE = 10
const ROLE_COLORS = {
  student:  'bg-brand-100 text-brand-700',
  lecturer: 'bg-accent-100 text-accent-700',
  staff:    'bg-amber-100 text-amber-700',
  admin:    'bg-purple-100 text-purple-700',
}

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useData()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(new Set())
  const [detailedUser, setDetailedUser] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'student', password: '', phone: '', status: 'active' })
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status !== 'inactive').length,
    students: users.filter(u => u.role === 'student').length,
    lecturers: users.filter(u => u.role === 'lecturer').length,
    staff: users.filter(u => u.role === 'staff' || u.role === 'admin').length,
    admins: users.filter(u => u.role === 'admin').length,
  }), [users])

  const filtered = useMemo(() => {
    let items = users.filter(u =>
      (filter === 'all' || u.role === filter) &&
      (!query.trim() || u.name?.toLowerCase().includes(query.toLowerCase()) || u.email?.toLowerCase().includes(query) || u.phone?.includes(query))
    )
    items.sort((a, b) => {
      const av = (a[sortKey] || '').toString().toLowerCase()
      const bv = (b[sortKey] || '').toString().toLowerCase()
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return items
  }, [users, filter, query, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const openAdd = () => {
    setEditingUser(null)
    setForm({ name: '', email: '', role: 'student', password: '', phone: '', status: 'active' })
    setShowForm(true)
  }

  const openEdit = (u) => {
    setEditingUser(u)
    setForm({ name: u.name || u.full_name || '', email: u.email || '', role: u.role || 'student', password: '', phone: u.phone || '', status: u.status || 'active' })
    setShowForm(true)
    setOpenMenu(null)
  }

  const onSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email) return toast.error('Name and email are required')
    if (!editingUser && !form.password) return toast.error('Password is required for new users')
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      phone: form.phone,
      status: form.status,
      avatar: !editingUser ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(form.name)}` : undefined,
    }
    if (editingUser) {
      await updateUser(editingUser.uuid || editingUser.id, payload)
      toast.success('User updated')
    } else {
      await addUser({ ...payload, password: form.password })
      toast.success('User added')
    }
    setShowForm(false)
  }

  const handleDelete = async (u) => {
    await deleteUser(u.uuid || u.id)
    toast.success(`${u.name} deleted`)
    setConfirmDelete(null)
    setOpenMenu(null)
  }

  const toggleStatus = async (u) => {
    const newStatus = u.status === 'inactive' ? 'active' : 'inactive'
    await updateUser(u.uuid || u.id, { status: newStatus })
    toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`)
    setOpenMenu(null)
  }

  const toggleSelect = (uid) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(uid)) next.delete(uid); else next.add(uid)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === paged.length) setSelected(new Set())
    else setSelected(new Set(paged.map(u => u.uuid || u.id)))
  }

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} users?`)) return
    for (const id of selected) {
      const u = users.find(u => (u.uuid || u.id) === id)
      if (u) await deleteUser(u.uuid || u.id)
    }
    toast.success(`${selected.size} users deleted`)
    setSelected(new Set())
  }

  const bulkStatus = async (status) => {
    for (const id of selected) {
      const u = users.find(u => (u.uuid || u.id) === id)
      if (u) await updateUser(u.uuid || u.id, { status })
    }
    toast.success(`${selected.size} users ${status === 'active' ? 'activated' : 'deactivated'}`)
    setSelected(new Set())
  }

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Status', 'Phone', 'UID', 'Created']
    const rows = users.map(u => [u.name || u.full_name, u.email, u.role, u.status || 'active', u.phone || '', u.uuid || u.id, u.created_at || ''])
    const csv = [headers, ...rows].map(r => r.map(c => `"${(c||'').replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'siarm-users.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Users exported')
  }

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIcon = ({ k }) => (
    <span className="inline-block ml-1 text-[10px]">{sortKey === k ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</span>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle={`${users.length} users · Manage students, lecturers, and staff accounts`}
        actions={
          <div className="flex gap-2">
            <button onClick={exportCSV} className="btn-secondary"><Download size={16} /> Export</button>
            <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add user</button>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={Users} label="Total" value={stats.total} color="brand" />
        <StatCard icon={UserCheck} label="Active" value={stats.active} color="green" />
        <StatCard icon={Shield} label="Students" value={stats.students} color="accent" />
        <StatCard icon={Shield} label="Lecturers" value={stats.lecturers} color="purple" />
        <StatCard icon={Shield} label="Staff" value={stats.staff} color="amber" />
        <StatCard icon={Shield} label="Admins" value={stats.admins} color="red" />
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                value={query} onChange={(e) => { setQuery(e.target.value); setPage(0) }}
                placeholder="Search name, email, phone…"
                className="input pl-10 py-2 text-sm w-56 sm:w-72"
              />
            </div>
            <div className="flex gap-1 bg-ink-100 rounded-xl p-1 flex-wrap">
              {['all', 'student', 'lecturer', 'staff', 'admin'].map((r) => (
                <button key={r} onClick={() => { setFilter(r); setPage(0) }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition ${
                    filter === r ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
                  }`}
                >{r === 'all' ? 'All' : ROLE_LABELS[r]}</button>
              ))}
            </div>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-brand-50 border border-brand-200 flex items-center gap-3 text-sm flex-wrap">
            <span className="font-medium text-brand-800">{selected.size} selected</span>
            <button onClick={bulkDelete} className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-medium">Delete</button>
            <button onClick={() => bulkStatus('active')} className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs font-medium">Activate</button>
            <button onClick={() => bulkStatus('inactive')} className="px-3 py-1 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 text-xs font-medium">Deactivate</button>
            <button onClick={() => setSelected(new Set())} className="px-3 py-1 rounded-lg bg-ink-100 text-ink-600 hover:bg-ink-200 text-xs font-medium">Clear</button>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-ink-100">
          <table className="w-full min-w-[700px]">
            <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="p-3 w-10">
                  <button onClick={toggleSelectAll} className="p-1 hover:bg-ink-200 rounded">
                    {selected.size === paged.length ? <CheckSquare size={14} /> : <Square size={14} />}
                  </button>
                </th>
                <th className="text-left p-3 cursor-pointer hover:text-ink-700" onClick={() => toggleSort('name')}>User<SortIcon k="name" /></th>
                <th className="text-left p-3 cursor-pointer hover:text-ink-700" onClick={() => toggleSort('email')}>Email<SortIcon k="email" /></th>
                <th className="text-left p-3">Contact</th>
                <th className="text-left p-3 cursor-pointer hover:text-ink-700" onClick={() => toggleSort('role')}>Role<SortIcon k="role" /></th>
                <th className="text-left p-3 cursor-pointer hover:text-ink-700" onClick={() => toggleSort('status')}>Status<SortIcon k="status" /></th>
                <th className="text-left p-3 hidden lg:table-cell">Created</th>
                <th className="p-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {paged.map((u) => {
                const uid = u.uuid || u.id
                const isSelected = selected.has(uid)
                return (
                  <tr key={uid} className={`hover:bg-ink-50 transition ${isSelected ? 'bg-brand-50/40' : ''}`}>
                    <td className="p-3">
                      <button onClick={() => toggleSelect(uid)} className="p-1 hover:bg-ink-200 rounded">
                        {isSelected ? <CheckSquare size={14} className="text-brand-700" /> : <Square size={14} />}
                      </button>
                    </td>
                    <td className="p-3">
                      <button onClick={() => setDetailedUser(u)} className="flex items-center gap-3 text-left">
                        <img src={u.avatar} alt="" className="w-9 h-9 rounded-full ring-2 ring-ink-100" />
                        <div>
                          <div className="font-medium text-sm hover:text-brand-700">{u.name || u.full_name}</div>
                          <div className="text-[10px] text-ink-400 font-mono">{(u.uuid || u.id || '').slice(0, 12)}…</div>
                        </div>
                      </button>
                    </td>
                    <td className="p-3 text-sm text-ink-600">
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} className="text-ink-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-ink-600">
                      {u.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-ink-400 shrink-0" />
                          <span>{u.phone}</span>
                        </div>
                      ) : <span className="text-ink-300">—</span>}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${ROLE_COLORS[u.role] || 'bg-ink-100 text-ink-600'}`}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        u.status === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.status === 'inactive' ? <UserX size={10} /> : <UserCheck size={10} />}
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-ink-500 hidden lg:table-cell">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-3 relative">
                      <button onClick={() => setOpenMenu(openMenu === uid ? null : uid)}
                        className="p-1.5 rounded-lg hover:bg-ink-200 text-ink-500 transition">
                        <MoreVertical size={15} />
                      </button>
                      {openMenu === uid && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                          <div className="absolute right-2 top-full mt-1 z-20 w-44 bg-white border border-ink-100 rounded-xl shadow-lg p-1.5 animate-fade-in">
                            <button onClick={() => openEdit(u)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-ink-50 rounded-lg transition">
                              <Edit2 size={14} className="text-ink-500" /> Edit
                            </button>
                            <button onClick={() => { setDetailedUser(u); setOpenMenu(null) }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-ink-50 rounded-lg transition">
                              <Shield size={14} className="text-ink-500" /> View details
                            </button>
                            <button onClick={() => toggleStatus(u)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-ink-50 rounded-lg transition">
                              <Key size={14} className="text-ink-500" /> {u.status === 'inactive' ? 'Activate' : 'Deactivate'}
                            </button>
                            <hr className="my-1 border-ink-100" />
                            <button onClick={() => { setConfirmDelete(u); setOpenMenu(null) }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded-lg transition">
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
              {paged.length === 0 && (
                <tr><td colSpan={8} className="p-12 text-center text-ink-500 text-sm">No users match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-100">
            <div className="text-xs text-ink-500">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </div>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-ink-200 hover:bg-ink-50 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition ${page === i ? 'bg-brand-800 text-white' : 'hover:bg-ink-50 text-ink-600 border border-ink-200'}`}
                >{i + 1}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-ink-200 hover:bg-ink-50 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg">{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-ink-100 rounded-lg transition">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={onSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="label">Full name</label>
                  <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="label">Email</label>
                  <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="label">Phone</label>
                  <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="670000000" />
                </div>
                {!editingUser && (
                  <div className="col-span-2">
                    <label className="label">Password</label>
                    <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Set login password" />
                  </div>
                )}
                <div>
                  <label className="label">Role</label>
                  <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    {Object.values(ROLES).map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editingUser ? 'Save changes' : 'Add user'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm delete dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">Delete user?</h3>
            <p className="text-sm text-ink-600 mb-6">
              This will permanently remove <strong>{confirmDelete.name}</strong> ({confirmDelete.email}). This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex-1 transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* User detail slide-over */}
      {detailedUser && (
        <div className="fixed inset-0 z-50" onClick={() => setDetailedUser(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl animate-slide-left overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="font-display font-bold text-xl">User Details</h2>
                <button onClick={() => setDetailedUser(null)} className="p-1.5 hover:bg-ink-100 rounded-lg transition"><X size={18} /></button>
              </div>

              <div className="text-center mb-6">
                <img src={detailedUser.avatar} alt="" className="w-20 h-20 rounded-full mx-auto ring-4 ring-brand-100" />
                <h3 className="font-bold text-lg mt-3">{detailedUser.name || detailedUser.full_name}</h3>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[detailedUser.role] || 'bg-ink-100 text-ink-600'}`}>
                  {ROLE_LABELS[detailedUser.role] || detailedUser.role}
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-ink-50">
                    <div className="text-[10px] text-ink-500 uppercase tracking-wider">Email</div>
                    <div className="text-sm font-medium mt-0.5 break-all">{detailedUser.email}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-ink-50">
                    <div className="text-[10px] text-ink-500 uppercase tracking-wider">Phone</div>
                    <div className="text-sm font-medium mt-0.5">{detailedUser.phone || '—'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-ink-50">
                    <div className="text-[10px] text-ink-500 uppercase tracking-wider">Status</div>
                    <div className="text-sm font-medium mt-0.5 capitalize">{detailedUser.status || 'active'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-ink-50">
                    <div className="text-[10px] text-ink-500 uppercase tracking-wider">Role</div>
                    <div className="text-sm font-medium mt-0.5">{ROLE_LABELS[detailedUser.role]}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-ink-50 col-span-2">
                    <div className="text-[10px] text-ink-500 uppercase tracking-wider">UID</div>
                    <div className="text-xs font-mono mt-0.5 break-all">{detailedUser.uuid || detailedUser.id}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-ink-50">
                    <div className="text-[10px] text-ink-500 uppercase tracking-wider">Created</div>
                    <div className="text-sm font-medium mt-0.5">{detailedUser.created_at ? new Date(detailedUser.created_at).toLocaleString() : '—'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-ink-50">
                    <div className="text-[10px] text-ink-500 uppercase tracking-wider">Last Login</div>
                    <div className="text-sm font-medium mt-0.5">{detailedUser.last_login_at ? new Date(detailedUser.last_login_at).toLocaleString() : '—'}</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setDetailedUser(null); openEdit(detailedUser) }} className="btn-primary flex-1">
                    <Edit2 size={14} /> Edit user
                  </button>
                  <button onClick={() => { setDetailedUser(null); setConfirmDelete(detailedUser) }} className="btn-secondary text-red-600 flex-1">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
