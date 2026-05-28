import { useState } from 'react'
import { Plus, Search, MoreVertical, UserCog } from 'lucide-react'
import { MOCK_USERS } from '@/lib/mockData'
import { ROLE_LABELS } from '@/lib/roles'
import PageHeader from '@/components/ui/PageHeader'

const seed = [
  ...MOCK_USERS.map(({ password, ...u }) => u),
  ...Array.from({ length: 14 }, (_, i) => ({
    uid: `usr-${i}`,
    name: ['Sophia Lema', 'Mark Ndip', 'Joy Bate', 'Felix Anye', 'Grace Mfor',
           'Daniel Tah', 'Ruth Foncha', 'Bryan Etame', 'Anna Wirba', 'Caleb Tagne',
           'Mary Akem', 'Peter Nkeng', 'Lilian Mbah', 'Joshua Tane'][i],
    email: `user${i}@siarm.edu`,
    role: ['student', 'lecturer', 'staff'][i % 3],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=u${i}`,
    status: i % 5 === 0 ? 'inactive' : 'active',
  })),
]

export default function UserManagement() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = seed.filter((u) =>
    (filter === 'all' || u.role === filter) &&
    (u.name?.toLowerCase().includes(query.toLowerCase()) || u.email.includes(query))
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage students, lecturers, and staff accounts"
        actions={<button className="btn-primary"><Plus size={16} /> Add user</button>}
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
                  filter === r ? 'bg-brand-600 text-white' : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-50'
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
                <td className="p-4">
                  <button className="p-2 rounded-lg hover:bg-ink-100 text-ink-500">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
