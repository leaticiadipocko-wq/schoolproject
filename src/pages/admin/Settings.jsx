import PageHeader from '@/components/ui/PageHeader'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Settings() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution Settings"
        subtitle="Configure SIARM for your university"
        actions={<button onClick={() => toast.success('Settings saved')} className="btn-primary"><Save size={16} /> Save</button>}
      />

      <div className="card space-y-4 max-w-2xl">
        <h3 className="font-display font-bold">Institution</h3>
        <div>
          <label className="label">Name</label>
          <input className="input" defaultValue="SIARM University" />
        </div>
        <div>
          <label className="label">Address</label>
          <input className="input" defaultValue="BP 3000, Bonaberi, Douala, Cameroon" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Academic Year</label>
            <input className="input" defaultValue="2026 / 2027" />
          </div>
          <div>
            <label className="label">Current Semester</label>
            <select className="input">
              <option>Semester 1</option>
              <option>Semester 2</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card space-y-4 max-w-2xl">
        <h3 className="font-display font-bold">Grading System</h3>
        <p className="text-sm text-ink-500">CGPA scale: 4.00 · Pass mark: 50%</p>
      </div>
    </div>
  )
}
