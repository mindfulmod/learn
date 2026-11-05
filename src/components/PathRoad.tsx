import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Briefcase, Flag, GraduationCap, Hourglass, MapPin, Star, type LucideIcon } from 'lucide-react'
import { tint } from '../design'
import type { Milestone } from '../engine/journey'

const ROAD_HUE: Record<Milestone['kind'], number> = { now: 258, school: 36, exam: 36, university: 215, training: 258, work: 160, future: 320 }
const ROAD_ICON: Record<Milestone['kind'], LucideIcon> = { now: MapPin, school: Flag, exam: Hourglass, university: GraduationCap, training: Star, work: Briefcase, future: Star }

/** Drop "(…)" asides so names stay plain. */
function plainTitle(text: string): string {
  return text.replace(/\s*\([^)]*\)/g, '').trim()
}

/** First `n` words, cut at a word boundary. */
function roadTitle(text: string, n = 4): string {
  const words = plainTitle(text).split(/\s+/)
  if (words.length <= n) return words.join(' ')
  const kept = words.slice(0, n)
  // Do not end on a filler word ("First job as a…").
  while (kept.length > 1 && /^(a|an|the|as|and|or|of|to|in|then|at|for|sit)$/i.test(kept[kept.length - 1].replace(/[.,;:!?]+$/, ''))) kept.pop()
  return kept.join(' ').replace(/[.,;:!?]+$/, '') + '…'
}

/** Split a short title into at most two lines of about `max` characters. */
function wrap(text: string, max: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    if (line && (line + ' ' + w).length > max && lines.length < 1) {
      lines.push(line)
      line = w
    } else line = line ? line + ' ' + w : w
  }
  if (line) lines.push(line)
  return lines
}

interface Pt {
  x: number
  y: number
}

interface Layout {
  mode: 'wide' | 'tall'
  width: number
  height: number
  points: Pt[]
  d: string
}

const R = 26 // node radius
const NARROW = 560

/**
 * Wide: the road snakes left to right in rows with U-turns at the ends.
 * Tall (phones): the road winds down the left edge; labels sit to the right.
 */
function layout(width: number, n: number, junior: boolean): Layout {
  if (width < NARROW) {
    const rowH = junior ? 84 : 96
    const top = 50
    const points = Array.from({ length: n }, (_, i) => ({ x: i % 2 === 0 ? 44 : 76, y: top + i * rowH }))
    let d = `M ${points[0].x} ${points[0].y - 34}`
    d += ` L ${points[0].x} ${points[0].y}`
    for (let i = 1; i < n; i++) {
      const a = points[i - 1]
      const b = points[i]
      d += ` C ${a.x} ${a.y + rowH / 2}, ${b.x} ${b.y - rowH / 2}, ${b.x} ${b.y}`
    }
    return { mode: 'tall', width, height: top + (n - 1) * rowH + 50, points, d }
  }
  const rowH = junior ? 150 : 190
  const turn = rowH / 2
  const margin = turn + 24
  const minGap = junior ? 120 : 160
  const usable = width - margin * 2
  const cols = Math.max(2, Math.min(n, Math.floor(usable / minGap) + 1))
  const gap = cols > 1 ? usable / (cols - 1) : 0
  const top = junior ? 56 : 64
  const points: Pt[] = []
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    const c = row % 2 === 0 ? col : cols - 1 - col
    points.push({ x: margin + c * gap, y: top + row * rowH })
  }
  let d = `M ${points[0].x - 40} ${points[0].y} L ${points[0].x} ${points[0].y}`
  for (let i = 1; i < n; i++) {
    const a = points[i - 1]
    const b = points[i]
    if (a.y === b.y) d += ` L ${b.x} ${b.y}`
    else {
      const rightSide = Math.floor((i - 1) / cols) % 2 === 0
      d += ` A ${turn} ${turn} 0 0 ${rightSide ? 1 : 0} ${b.x} ${b.y}`
    }
  }
  const rows = Math.ceil(n / cols)
  return { mode: 'wide', width, height: top + (rows - 1) * rowH + (junior ? 40 : 96), points, d }
}

/**
 * A winding road with one node per milestone. The current step ("now") has a
 * ring; later steps are muted. Click or use the arrow keys to select a node.
 */
export function PathRoad({ milestones, selected, onSelect, junior }: { milestones: Milestone[]; selected: number; onSelect: (i: number) => void; junior?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(SVGGElement | null)[]>([])
  const [width, setWidth] = useState(720)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => setWidth(Math.max(280, Math.round(el.getBoundingClientRect().width)))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (!milestones.length) return null
  const L = layout(width, milestones.length, !!junior)
  const nowIndex = Math.max(0, milestones.findIndex((m) => m.kind === 'now'))

  const move = (i: number) => {
    const next = Math.max(0, Math.min(milestones.length - 1, i))
    onSelect(next)
    nodeRefs.current[next]?.focus()
  }
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    const k = e.key
    if (k === 'ArrowRight' || k === 'ArrowDown') move(selected + 1)
    else if (k === 'ArrowLeft' || k === 'ArrowUp') move(selected - 1)
    else if (k === 'Home') move(0)
    else if (k === 'End') move(milestones.length - 1)
    else return
    e.preventDefault()
  }

  const labelX = 124
  const maxChars = L.mode === 'wide' ? 16 : Math.max(14, Math.floor((L.width - labelX - 8) / 8))

  return (
    <div ref={wrapRef} className={`road ${L.mode} ${junior ? 'junior' : ''}`}>
      <svg
        className="road-svg"
        viewBox={`0 0 ${L.width} ${L.height}`}
        width={L.width}
        height={L.height}
        role="listbox"
        aria-label="Your path, step by step"
        onKeyDown={onKey}
      >
        <path className="road-base" d={L.d} />
        <path className="road-line" d={L.d} />
        {milestones.map((m, i) => {
          const p = L.points[i]
          const Icon = ROAD_ICON[m.kind]
          const future = i > nowIndex
          const isNow = i === nowIndex
          const isSel = i === selected
          const lines = junior ? [] : wrap(roadTitle(m.title), maxChars)
          const wide = L.mode === 'wide'
          const ageX = wide ? p.x : labelX
          const ageY = wide ? p.y - R - 16 : p.y - (lines.length ? 12 : -4)
          const ageW = `Age ${m.age}`.length * 7.6 + 18
          return (
            <g
              key={`${m.kind}-${i}`}
              id={`road-node-${i}`}
              ref={(el) => {
                nodeRefs.current[i] = el
              }}
              className={`road-node ${future ? 'future' : ''} ${isNow ? 'now' : ''} ${isSel ? 'selected' : ''}`}
              style={tint(ROAD_HUE[m.kind])}
              role="option"
              aria-selected={isSel}
              aria-label={`Age ${m.age}: ${plainTitle(m.title)}`}
              tabIndex={isSel ? 0 : -1}
              onClick={() => move(i)}
            >
              <circle className="road-hit" cx={p.x} cy={p.y} r={R + 14} />
              {isNow && <circle className="road-ring" cx={p.x} cy={p.y} r={R + 7} />}
              <circle className="road-focus" cx={p.x} cy={p.y} r={R + 11} />
              <circle className="road-dot" cx={p.x} cy={p.y} r={R} />
              <g transform={`translate(${p.x - 11} ${p.y - 11})`}>
                <Icon className="road-icon" size={22} strokeWidth={2.2} aria-hidden="true" />
              </g>
              <g className="road-age">
                <rect x={wide ? ageX - ageW / 2 : ageX} y={ageY - 11} width={ageW} height={22} rx={11} />
                <text x={wide ? ageX : ageX + ageW / 2} y={ageY + 4} textAnchor="middle">
                  Age {m.age}
                </text>
              </g>
              {lines.map((line, j) =>
                wide ? (
                  <text key={j} className="road-title" x={p.x} y={p.y + R + 22 + j * 18} textAnchor="middle">
                    {line}
                  </text>
                ) : (
                  <text key={j} className="road-title" x={labelX} y={p.y + 16 + j * 18}>
                    {line}
                  </text>
                ),
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
