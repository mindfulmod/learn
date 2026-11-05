import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, Play, Star, Volume2 } from 'lucide-react'
import { CLUSTER_META, tint } from '../design'
import { TOWN_PLACES, type BuildingShape, type TownPlace } from '../data/town'
import { speak } from '../engine/mode'
import type { CareerCluster } from '../types'
import { Say } from './Say'

/** Below this map width the town switches to the tall layout. */
const TALL_BELOW = 680
const WIDE = { w: 1000, h: 620, scale: 1, road: 30 }
const TALL = { w: 620, h: 940, scale: 1.25, road: 34 }

const SIGN_LINE = 'Which would you rather do?'

/** A building silhouette centred on (0, 0), base at y = 40. */
function Building({ shape, hue }: { shape: BuildingShape; hue: number }): ReactNode {
  const fill = `hsl(${hue} 70% 90%)`
  const stroke = `hsl(${hue} 60% 45%)`
  const common = { fill, stroke, strokeWidth: 4, strokeLinejoin: 'round' as const }
  const door = <rect x="-12" y="14" width="24" height="26" rx="5" fill={stroke} opacity="0.85" />
  switch (shape) {
    case 'house':
      return (
        <>
          <rect x="-60" y="-30" width="120" height="70" rx="6" {...common} />
          <path d="M-72 -28 L0 -82 L72 -28 Z" {...common} />
          {door}
        </>
      )
    case 'dome':
      return (
        <>
          <rect x="-64" y="-22" width="128" height="62" rx="6" {...common} />
          <path d="M-50 -22 A50 50 0 0 1 50 -22 Z" {...common} />
          <path d="M0 -72 V-92 L16 -86 L0 -80" fill={stroke} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
          {door}
        </>
      )
    case 'hangar':
      return (
        <>
          <path d="M-78 40 V-8 Q0 -86 78 -8 V40 Z" {...common} />
          <path d="M-34 40 V2 H34 V40" fill="none" stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
          <path d="M-34 20 H34" stroke={stroke} strokeWidth="3" opacity="0.6" />
        </>
      )
    case 'tower':
      return (
        <>
          <rect x="-68" y="-14" width="136" height="54" rx="6" {...common} />
          <rect x="-28" y="-74" width="56" height="70" rx="5" {...common} />
          <path d="M-36 -72 L0 -98 L36 -72 Z" {...common} />
          {door}
        </>
      )
  }
}

type Pt = [number, number]

/** Closed Catmull-Rom spline through the points, as an SVG path. */
function loopPath(pts: Pt[]): string {
  const n = pts.length
  const at = (i: number) => pts[(i + n) % n]
  let d = `M${at(0)[0].toFixed(1)} ${at(0)[1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return `${d} Z`
}

function posOf(p: TownPlace, tall: boolean): { x: number; y: number } {
  return tall ? p.phone : { x: p.x, y: p.y }
}

/**
 * The Town map: SVG for ground, road and buildings; an HTML layer on top
 * for the icon tiles and labels so lucide icons stay crisp and each place
 * is a real button with an 80px target.
 */
export function Town({
  top,
  stickers,
  signpost,
  onOpen,
  keys = true,
}: {
  top: CareerCluster[]
  stickers: CareerCluster[]
  signpost: boolean
  onOpen: (cluster: CareerCluster) => void
  /** Listen for digits 1 to 9 (off while a Visit is open). */
  keys?: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [tall, setTall] = useState(false)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => setTall(el.clientWidth < TALL_BELOW)
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const onOpenRef = useRef(onOpen)
  useEffect(() => {
    onOpenRef.current = onOpen
  }, [onOpen])
  useEffect(() => {
    if (!keys) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      const n = Number(e.key)
      if (Number.isInteger(n) && n >= 1 && n <= TOWN_PLACES.length) {
        e.preventDefault()
        onOpenRef.current(TOWN_PLACES[n - 1].cluster)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [keys])

  const m = tall ? TALL : WIDE
  const pts: Pt[] = TOWN_PLACES.map((p) => {
    const q = posOf(p, tall)
    return [(q.x / 100) * m.w, (q.y / 100) * m.h + 26 * m.scale]
  })
  const cx = m.w / 2
  const cy = m.h / 2

  return (
    <div className="town-wrap" ref={wrapRef}>
      <div className={`town-map ${tall ? 'tall' : 'wide'}`}>
        <svg className="town-svg" viewBox={`0 0 ${m.w} ${m.h}`} aria-hidden="true" focusable="false">
          <rect className="town-ground" x="0" y="0" width={m.w} height={m.h} rx="36" />
          {/* Hills along the top and a pond, schematic only. */}
          <ellipse className="town-hill" cx={m.w * 0.22} cy="0" rx={m.w * 0.32} ry={m.h * 0.11} />
          <ellipse className="town-hill far" cx={m.w * 0.7} cy="-8" rx={m.w * 0.38} ry={m.h * 0.13} />
          <ellipse className="town-hill" cx={m.w * 0.5} cy={m.h + 10} rx={m.w * 0.42} ry={m.h * 0.06} />
          <path className="town-road" d={loopPath(pts)} strokeWidth={m.road} />
          <path className="town-road-line" d={loopPath(pts)} />
          {/* Town square in the middle. */}
          <circle className="town-square" cx={cx} cy={cy} r={58 * m.scale} />
          <circle className="town-pond" cx={cx} cy={cy} r={26 * m.scale} />
          {[
            [0.31, 0.5],
            [0.69, 0.5],
            [0.5, tall ? 0.27 : 0.33],
            [0.5, tall ? 0.73 : 0.67],
          ].map(([tx, ty]) => (
            <g key={`${tx}-${ty}`} transform={`translate(${tx * m.w} ${ty * m.h}) scale(${m.scale})`}>
              <rect className="town-trunk" x="-3" y="2" width="6" height="14" rx="2" />
              <circle className="town-tree" cx="0" cy="-6" r="15" />
            </g>
          ))}
          {TOWN_PLACES.map((p, i) => (
            <g key={p.cluster} transform={`translate(${pts[i][0]} ${pts[i][1] - 34 * m.scale}) scale(${m.scale})`}>
              <Building shape={p.shape} hue={p.hue} />
            </g>
          ))}
        </svg>

        <div className="town-layer">
          {TOWN_PLACES.map((p, i) => {
            const q = posOf(p, tall)
            const Icon = CLUSTER_META[p.cluster].icon
            const isTop = top.includes(p.cluster)
            const has = stickers.includes(p.cluster)
            return (
              <button
                key={p.cluster}
                type="button"
                className={`town-place${isTop ? ' top' : ''}${has ? ' has' : ''}`}
                style={{ ...tint(p.hue), left: `${q.x}%`, top: `${q.y}%` }}
                onClick={() => onOpen(p.cluster)}
                aria-label={`${p.name}, ${p.word}${isTop ? ', a match for you' : ''}${has ? ', sticker earned' : ''}`}
                aria-keyshortcuts={String(i + 1)}
                title={p.name}
              >
                <span className="town-tile">
                  <Icon size={30} strokeWidth={2.2} aria-hidden="true" />
                  {isTop && (
                    <span className="town-star" aria-hidden="true">
                      <Star size={14} strokeWidth={2.6} fill="currentColor" />
                    </span>
                  )}
                  {has && (
                    <span className="town-badge" aria-hidden="true">
                      <Check size={16} strokeWidth={3.2} />
                    </span>
                  )}
                </span>
                <span className="town-label">{p.word}</span>
              </button>
            )
          })}

          {signpost && (
            <div className="town-sign">
              <Say as="p" className="town-sign-text">
                {SIGN_LINE}
              </Say>
              <div className="town-sign-actions">
                <Link to="/finder" className="btn primary town-sign-play">
                  <Play size={22} fill="currentColor" aria-hidden="true" />
                  Play
                </Link>
                <button type="button" className="btn town-sign-speak" onClick={() => speak(`${SIGN_LINE} Tap Play to find out.`)} aria-label="Read aloud">
                  <Volume2 size={22} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
