import { useState } from 'react'
import toast from 'react-hot-toast'
import { Send, Megaphone, Pin } from 'lucide-react'
import { MOCK_ANNOUNCEMENTS } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'

export default function AdminAnnouncements() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState('all')

  const publish = (e) => {
    e.preventDefault()
    if (!title || !body) return toast.error('Title and body are required')
    toast.success(`Announcement published to ${audience}`)
    setTitle(''); setBody('')
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
                <input type="checkbox" className="rounded border-ink-300" />
                <span className="text-sm text-ink-600">Pin to top of feed</span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            <Send size={16} /> Publish
          </button>
        </form>

        <div className="card">
          <h3 className="font-display font-bold text-lg mb-3">Recent</h3>
          <div className="space-y-3">
            {MOCK_ANNOUNCEMENTS.map((a) => (
              <div key={a.id} className="p-3 rounded-xl border border-ink-100">
                <div className="flex items-center gap-2">
                  {a.pinned ? <Pin size={14} className="text-amber-500" /> : <Megaphone size={14} className="text-ink-400" />}
                  <span className="text-sm font-medium truncate">{a.title}</span>
                </div>
                <div className="text-[11px] text-ink-500 mt-1.5">{a.author} · {new Date(a.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
