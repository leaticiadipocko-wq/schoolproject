import { ArrowDown, ArrowUp } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, trend, color = 'brand' }) {
  const colorMap = {
    brand:  'bg-brand-100 text-brand-600',
    accent: 'bg-accent-100 text-accent-600',
    green:  'bg-green-100 text-green-600',
    amber:  'bg-amber-100 text-amber-600',
    red:    'bg-red-100 text-red-600',
  }
  return (
    <div className="card-hover">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-ink-500">{label}</div>
          <div className="text-3xl font-display font-bold mt-1">{value}</div>
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      {trend && (
        <div className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${
          trend.startsWith('-') ? 'text-red-600' : 'text-green-600'
        }`}>
          {trend.startsWith('-') ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
          {trend}
        </div>
      )}
    </div>
  )
}
