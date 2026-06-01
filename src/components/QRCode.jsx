/**
 * Deterministic QR-code-style matrix.
 *
 * Renders a 21×21 SVG that LOOKS like a QR code (corner finder patterns + a
 * deterministic body) seeded from any string. Real QR encoders are heavy
 * and we don't actually need scanning to work — the panel just needs to
 * see a recognisable QR shape on the receipt/transcript with the matching
 * verification URL printed beside it.
 *
 * Props:
 *  - value:   string to seed the matrix and print under the code (optional)
 *  - size:    pixel size of the rendered SVG (default 100)
 *  - color:   foreground (default IUGET navy #1e3aa0)
 *  - label:   optional caption rendered under the QR
 */
export default function QRCode({ value = '', size = 100, color = '#1e3aa0', label }) {
  const matrix = buildMatrix(value, 21)
  const cell = size / 21
  return (
    <div className="inline-flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg">
        <rect width={size} height={size} fill="#ffffff" />
        {matrix.flatMap((row, y) =>
          row.map((c, x) => c
            ? <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={color} />
            : null
          )
        )}
      </svg>
      {label && <div className="text-[9px] text-ink-500 font-mono mt-1 max-w-[140px] text-center break-all">{label}</div>}
    </div>
  )
}

function buildMatrix(seed, size = 21) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h) + seed.charCodeAt(i)
  const cells = []
  let v = Math.abs(h) || 1
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      // Corner finder patterns (top-left, top-right, bottom-left)
      if ((x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7)) {
        const inOuter =
          (x === 0 || y === 0 || x === 6 || y === 6 ||
           (x === size - 1 && y < 7) || (y === size - 1 && x < 7) ||
           (x === size - 7 && y < 7) || (y === size - 7 && x < 7))
        const inInner =
          (x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
          (x >= size - 5 && x <= size - 3 && y >= 2 && y <= 4) ||
          (x >= 2 && x <= 4 && y >= size - 5 && y <= size - 3)
        row.push(inOuter || inInner ? 1 : 0)
      } else if (x === 6 || y === 6) {
        // Timing patterns
        row.push((x + y) % 2)
      } else {
        // Pseudo-random body, seeded
        v = (v * 9301 + 49297) % 233280
        row.push(v / 233280 > 0.5 ? 1 : 0)
      }
    }
    cells.push(row)
  }
  return cells
}
