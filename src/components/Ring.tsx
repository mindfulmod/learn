import type { ReactNode } from 'react'

/** Circular progress ring. `value` is 0-100. Children render in the centre. */
export function Ring({ value, size = 64, stroke = 7, children, tone }: { value: number; size?: number; stroke?: number; children?: ReactNode; tone?: 'brand' | 'good' | 'warn' | 'tint' }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  const color = tone === 'good' ? 'var(--good)' : tone === 'warn' ? 'var(--warn)' : tone === 'tint' ? 'var(--tint)' : 'url(#ringGradient)'
  return (
    <span className="ring" style={{ width: size, height: size }} role="img" aria-label={`${pct} percent`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="hsl(258 85% 62%)" />
            <stop offset="1" stopColor="hsl(340 90% 66%)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        />
      </svg>
      <span className="ring-inner">{children}</span>
    </span>
  )
}
