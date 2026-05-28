export default function Logo({ size = 36, withText = true, variant = 'color', className = '' }) {
  const src = variant === 'white' ? '/brand/iuget-logo-white.png' : '/brand/iuget-logo.png'
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={src}
        alt="IUGET"
        width={size}
        height={size}
        className="shrink-0 object-contain"
        style={{ height: size, width: 'auto' }}
      />
      {withText && (
        <div className="flex flex-col leading-none">
          <span className="font-display font-bold text-lg tracking-tight">SIARM</span>
          <span className="text-[10px] text-ink-500 mt-0.5">Smart Academic Platform · IUGET</span>
        </div>
      )}
    </div>
  )
}
