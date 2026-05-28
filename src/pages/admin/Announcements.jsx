import { useState } from 'react'
import toast from 'react-hot-toast'
import { Send, Megaphone, Pin, Trash2 } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/ui/PageHeader'

export default function AdminAnnouncements() {
  const { user } = useAuth()
  const { announcements, addAnnouncement, togglePin, deleteAnnouncement } = useData()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState('all')
  const [pin, setPin] = useState(false)

  const publish = (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return toast.error('Title and body are required')
    addAnnouncement({
      title: title.trim(),
      body: body.trim(),
      audience,
      pinned: pin,
      author: user?.role === 'admin' ? (user?.title || 'Admin')
            : user?.role === 'staff' ? (user?.department || 'Staff')
            : user?.role === 'lecturer' ? user?.name
            : 'Admin',
    })
    toast.success(`Announcement published to ${audience}`)
    setTitle(''); setBody(''); setPin(false)
  }

  const onDelete = (id) => {
    if (confirm('Delete this announcement?')) {
      deleteAnnouncement(id)
      toast.success('Deleted')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Publish Announcements"
        subtitle="Reach the entire institution or specific audiences"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={publish} className="card lg:col-span-2 space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              className="input"
              placeholder="e.g. Exam schedule for June"
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea
              rows={6}
              className="input"
              placeholder="Write the announcement here…"
              value={body} onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Audience</label>
              <select className="input" value={audience} onChange={(e) => setAudience(e.target.value)}>
                <option value="all">Everyone</option>
                <option value="students">Students</option>
                <option value="lecturers">Lecturers</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="label">Pin this announcement?</label>
              <label className="flex items-center gap-2 mt-2.5">
                <input type="checkbox" className="rounded border-ink-300" checked={pin} onChange={(e) => setPin(e.target.checked)} />
                <span className="text-sm text-ink-600">Pin to top of feed</span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            <Send size={16} /> Publish
          </button>
        </form>

        <div className="card">
          <h3 className="font-display font-bold text-lg mb-3">Recent ({announcements.length})</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {announcements.map((a) => (
              <div key={a.id} className="p-3 rounded-xl border border-ink-100 group">
                <div className="flex items-center gap-2">
                  {a.pinned ? <Pin size={14} className="text-accent-500" /> : <Megaphone size={14} className="text-ink-400" />}
                  <span className="text-sm font-medium truncate flex-1">{a.title}</span>
                </div>
                <div className="text-[11px] text-ink-500 mt-1.5">{a.author} · {new Date(a.createdAt).toLocaleDateString()}</div>
                <div className="mt-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => togglePin(a.id)} className="text-xs px-2 py-1 rounded bg-ink-100 hover:bg-ink-200">
                    {a.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button onClick={() => onDelete(a.id)} className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700">
                    <Trash2 size={10} className="inline" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
