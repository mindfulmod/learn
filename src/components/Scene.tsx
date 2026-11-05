import type { ReactNode } from 'react'
import type { SceneSpec } from '../data/pictureFinder'
import { tint } from '../design'

/** Background motif shapes, drawn in a 400 by 300 viewBox. */
function Motif({ motif, hue }: { motif: SceneSpec['motif']; hue: number }): ReactNode {
  const sun = 'hsl(45 95% 62%)'
  switch (motif) {
    case 'sky':
      return (
        <>
          <circle cx="322" cy="72" r="36" fill={sun} />
          <ellipse cx="96" cy="88" rx="64" ry="22" fill="#fff" opacity="0.7" />
          <ellipse cx="270" cy="236" rx="78" ry="24" fill="#fff" opacity="0.6" />
        </>
      )
    case 'room':
      return (
        <>
          <rect x="0" y="226" width="400" height="74" fill={`hsl(${hue} 40% 50% / 0.18)`} />
          <rect x="34" y="36" width="92" height="80" rx="10" fill="#fff" opacity="0.65" />
          <path d="M80 36 V116 M34 76 H126" stroke={`hsl(${hue} 45% 55% / 0.45)`} strokeWidth="5" />
        </>
      )
    case 'field':
      return (
        <>
          <circle cx="342" cy="58" r="22" fill={sun} />
          <ellipse cx="90" cy="320" rx="210" ry="110" fill="hsl(125 50% 55% / 0.5)" />
          <ellipse cx="330" cy="330" rx="200" ry="118" fill="hsl(140 45% 42% / 0.45)" />
        </>
      )
    case 'stage':
      return (
        <>
          <path d="M200 0 L120 300 H280 Z" fill="#fff" opacity="0.32" />
          <ellipse cx="200" cy="292" rx="110" ry="18" fill="#fff" opacity="0.35" />
          <path d="M0 0 H96 Q58 150 92 300 H0 Z" fill={`hsl(${hue} 45% 26% / 0.85)`} />
          <path d="M400 0 H304 Q342 150 308 300 H400 Z" fill={`hsl(${hue} 45% 26% / 0.85)`} />
          <rect x="0" y="0" width="400" height="22" fill={`hsl(${hue} 45% 22% / 0.9)`} />
        </>
      )
    case 'lab':
      return (
        <>
          <rect x="0" y="224" width="400" height="26" fill={`hsl(${hue} 30% 40% / 0.35)`} />
          <rect x="0" y="250" width="400" height="50" fill={`hsl(${hue} 30% 40% / 0.14)`} />
          <rect x="46" y="158" width="38" height="66" rx="12" fill={`hsl(${hue} 70% 58% / 0.45)`} />
          <rect x="310" y="176" width="48" height="48" rx="14" fill={`hsl(${(hue + 50) % 360} 70% 58% / 0.45)`} />
        </>
      )
    case 'street':
      return (
        <>
          <rect x="298" y="40" width="74" height="190" rx="6" fill={`hsl(${hue} 30% 50% / 0.25)`} />
          {[64, 104, 144, 184].map((y) => (
            <g key={y} fill="#fff" opacity="0.5">
              <rect x="312" y={y} width="16" height="18" rx="3" />
              <rect x="342" y={y} width="16" height="18" rx="3" />
            </g>
          ))}
          <rect x="0" y="230" width="400" height="70" fill="hsl(220 12% 40% / 0.35)" />
          {[20, 110, 200, 290].map((x) => (
            <rect key={x} x={x} y="262" width="50" height="7" rx="3" fill="#fff" opacity="0.7" />
          ))}
        </>
      )
  }
}

/**
 * An abstract illustrated scene for the picture finder: a tinted 4:3 card,
 * a motif layer, the main icon on a white disc and an optional prop. The SVG
 * draws the background; icons sit over it with absolute CSS. No text.
 */
export function Scene({ spec, size = 260 }: { spec: SceneSpec; size?: number }) {
  const Icon = spec.icon
  const Prop = spec.prop
  return (
    <span className="scene" style={{ ...tint(spec.hue), maxWidth: size }} aria-hidden="true">
      <svg className="scene-bg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" style={{ fill: 'var(--tint-soft)' }} />
        <Motif motif={spec.motif} hue={spec.hue} />
      </svg>
      <span className="scene-disc">
        <Icon size={Math.round(size * 0.34)} strokeWidth={2} color={`hsl(${spec.hue} 70% 42%)`} />
      </span>
      {Prop && (
        <span className="scene-prop">
          <Prop size={Math.round(size * 0.16)} strokeWidth={2.2} />
        </span>
      )}
    </span>
  )
}
