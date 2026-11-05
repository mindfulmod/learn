import { Link } from 'react-router-dom'
import { Check, Flag, GraduationCap, Hourglass, MapPin, Briefcase, Star } from 'lucide-react'
import { tint } from '../design'
import type { Milestone } from '../engine/journey'

const KIND_HUE: Record<Milestone['kind'], number> = { now: 258, school: 36, exam: 36, university: 215, training: 258, work: 160, future: 320 }
const KIND_ICON = { now: MapPin, school: Flag, exam: Hourglass, university: GraduationCap, training: Star, work: Briefcase, future: Star }

/**
 * Horizontal chain of milestones. The first node is "now" and glows; the rest
 * fade toward the future. Compact enough for a bento tile; scrolls on phones.
 */
export function PathStrip({ milestones, to, compact }: { milestones: Milestone[]; to?: string; compact?: boolean }) {
  const items = compact ? [milestones[0], ...milestones.slice(1).filter((m) => m.kind !== 'training')].slice(0, 5) : milestones
  const inner = (
    <ol className={`path-strip ${compact ? 'compact' : ''}`}>
      {items.map((m, i) => {
        const Icon = i === 0 ? Check : KIND_ICON[m.kind]
        return (
          <li key={`${m.kind}-${i}`} className={i === 0 ? 'current' : ''} style={tint(KIND_HUE[m.kind])}>
            <span className="path-node">
              <Icon size={16} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span className="path-age">Age {m.age}</span>
            <span className="path-title">{m.title}</span>
            {!compact && <span className="path-detail small">{m.detail}</span>}
          </li>
        )
      })}
    </ol>
  )
  return to ? (
    <Link to={to} className="path-link" aria-label="Open your full path">
      {inner}
    </Link>
  ) : (
    inner
  )
}
