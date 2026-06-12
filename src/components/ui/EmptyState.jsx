export default function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="text-center py-16 px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto">
          <Icon size={26} />
        </div>
      )}
      <h3 className="font-display font-bold text-lg mt-4">{title}</h3>
      {desc && <p className="text-ink-500 mt-1.5 max-w-sm mx-auto text-sm">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
