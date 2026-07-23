import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { Bell, Mail, Smartphone, BellRing } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'

export default function NotificationSettings() {
  const { user } = useAuth()
  const { notificationPrefs, updateNotificationPrefs, notifications = [] } = useData()

  const toggles = [
    { key: 'email', label: 'Email Notifications', desc: 'Receive email alerts for grades, fees, and announcements', icon: Mail },
    { key: 'sms', label: 'SMS Notifications', desc: 'Get SMS alerts on your phone for urgent updates', icon: Smartphone },
    { key: 'inApp', label: 'In-App Notifications', desc: 'Show notification badges and alerts within SIARM', icon: Bell },
  ]

  const recent = notifications.slice(0, 10)

  return (
    <div className="space-y-6">
      <PageHeader title="Notification Settings" subtitle="Manage how you receive alerts and updates" />

      <div className="card">
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <BellRing size={18} className="text-brand-600" />
          Notification Channels
        </h3>
        <div className="space-y-4">
          {toggles.map(t => {
            const Icon = t.icon
            return (
              <div key={t.key} className="flex items-center gap-4 p-4 rounded-xl border border-ink-100 hover:bg-ink-50 transition">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{t.label}</div>
                  <div className="text-sm text-ink-500">{t.desc}</div>
                </div>
                <button
                  onClick={() => updateNotificationPrefs({ [t.key]: !notificationPrefs?.[t.key] })}
                  className={`relative w-12 h-6 rounded-full transition ${
                    notificationPrefs?.[t.key] ? 'bg-brand-600' : 'bg-ink-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition ${
                    notificationPrefs?.[t.key] ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <h3 className="font-display font-bold text-lg mb-4">Recent Notifications</h3>
        {recent.length === 0 ? (
          <div className="text-center py-8 text-ink-500 text-sm">No notifications yet</div>
        ) : (
          <div className="space-y-2">
            {recent.map(n => (
              <div key={n.id} className={`p-3 rounded-xl border ${n.read ? 'border-ink-100' : 'border-brand-200 bg-brand-50'} flex items-start gap-3`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.read ? 'bg-ink-100 text-ink-500' : 'bg-brand-100 text-brand-700'}`}>
                  <Bell size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${n.read ? 'text-ink-600' : 'font-medium text-ink-900'}`}>{n.title}</div>
                  <div className="text-xs text-ink-500 mt-0.5">{n.body}</div>
                  <div className="text-[10px] text-ink-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}