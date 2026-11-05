import { tint } from '../design'

/**
 * Abstract geometric illustration built from the tint system. Used as hero
 * art instead of cartoon imagery. `variant` picks a composition.
 */
export function Orb({ hue = 258, size = 160, variant = 0 }: { hue?: number; size?: number; variant?: number }) {
  const v = variant % 3
  return (
    <svg className="orb" width={size} height={size} viewBox="0 0 160 160" style={tint(hue)} aria-hidden="true">
      <defs>
        <linearGradient id={`orbA${hue}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 85% 66%)`} />
          <stop offset="1" stopColor={`hsl(${(hue + 40) % 360} 85% 62%)`} />
        </linearGradient>
        <linearGradient id={`orbB${hue}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`hsl(${(hue + 300) % 360} 90% 70%)`} />
          <stop offset="1" stopColor={`hsl(${hue} 80% 60%)`} />
        </linearGradient>
      </defs>
      {v === 0 && (
        <>
          <circle cx="92" cy="72" r="54" fill={`url(#orbA${hue})`} />
          <circle cx="52" cy="104" r="34" fill={`url(#orbB${hue})`} opacity="0.9" />
          <circle cx="118" cy="118" r="14" fill="#fff" opacity="0.8" />
          <path d="M20 60 a60 60 0 0 1 60 -40" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      {v === 1 && (
        <>
          <rect x="30" y="30" width="100" height="100" rx="34" fill={`url(#orbA${hue})`} transform="rotate(12 80 80)" />
          <circle cx="58" cy="60" r="18" fill="#fff" opacity="0.85" />
          <circle cx="104" cy="104" r="26" fill={`url(#orbB${hue})`} />
          <path d="M40 124 q40 -20 80 0" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      {v === 2 && (
        <>
          <circle cx="80" cy="80" r="60" fill="none" stroke={`url(#orbA${hue})`} strokeWidth="14" />
          <circle cx="80" cy="80" r="30" fill={`url(#orbB${hue})`} />
          <circle cx="126" cy="46" r="12" fill="#fff" opacity="0.9" />
          <circle cx="34" cy="118" r="8" fill="#fff" opacity="0.7" />
        </>
      )}
    </svg>
  )
}
