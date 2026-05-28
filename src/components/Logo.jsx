export default function Logo({ size = 36, withText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#logoGrad)" />
        <path d="M16 24 L32 16 L48 24 L32 32 Z" fill="white" opacity="0.95" />
        <path d="M22 28 V38 C22 42 27 44 32 44 C37 44 42 42 42 38 V28" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="48" cy="26" r="2" fill="white" />
        <path d="M48 28 V36" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {withText && (
        <div className="flex flex-col leading-none">
          <span className="font-display font-bold text-lg tracking-tight">SIARM</span>
          <span className="text-[10px] text-ink-500 mt-0.5">Smart Academic Platform</span>
        </div>
      )}
    </div>
  )
}
