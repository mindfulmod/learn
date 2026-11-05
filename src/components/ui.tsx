import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, type LucideIcon } from 'lucide-react'
import { subjectIcon, tint, AREA_META, FEEDBACK_ICON } from '../design'
import { getSubject } from '../data/subjects'
import type { FeedbackItem } from '../engine/feedback'
import type { MasteryLevel } from '../engine/profile'

export function Bar({ value, tone, label, hue }: { value: number; tone?: 'good' | 'warn' | 'bad' | 'accent' | 'tinted'; label?: string; hue?: number }) {
  const t = tone ?? (value >= 75 ? 'good' : value >= 50 ? 'warn' : value > 0 ? 'bad' : undefined)
  return (
    <div className={`bar ${t ?? ''}`} style={hue !== undefined ? tint(hue) : undefined} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

export function Meter({ label, value, right, tone, hue }: { label: ReactNode; value: number; right?: ReactNode; tone?: 'good' | 'warn' | 'bad' | 'accent' | 'tinted'; hue?: number }) {
  return (
    <div className="meter">
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span className="small muted">{right ?? `${value}%`}</span>
      <Bar value={value} tone={tone} hue={hue} />
    </div>
  )
}

export function LevelBadge({ level, accuracy }: { level: MasteryLevel; accuracy?: number | null }) {
  const map: Record<MasteryLevel, { cls: string; text: string }> = {
    strong: { cls: 'good', text: 'Strong' },
    developing: { cls: 'warn', text: 'Developing' },
    'needs-work': { cls: 'bad', text: 'Needs work' },
    'not-practised': { cls: '', text: 'Not practised' },
  }
  const m = map[level]
  return (
    <span className={`badge ${m.cls}`}>
      {m.text}
      {accuracy !== null && accuracy !== undefined ? ` · ${accuracy}%` : ''}
    </span>
  )
}

export function ScoreRing({ value }: { value: number }) {
  return (
    <div className="score-ring pop" style={{ ['--pct' as string]: value }} aria-label={`${value} percent`}>
      <span>{value}%</span>
    </div>
  )
}

/** Gradient icon tile tinted by a hue. */
export function Tile({ hue, children, large }: { hue: number; children: ReactNode; large?: boolean }) {
  return (
    <div className={`tile-icon ${large ? 'lg' : ''}`} style={tint(hue)} aria-hidden="true">
      {children}
    </div>
  )
}

/** Tile holding a lucide icon. */
export function IconTile({ hue, icon: Icon, large }: { hue: number; icon: LucideIcon; large?: boolean }) {
  return (
    <Tile hue={hue} large={large}>
      <Icon size={large ? 30 : 22} strokeWidth={2.2} />
    </Tile>
  )
}

export function SubjectTile({ subjectId, large }: { subjectId: string; large?: boolean }) {
  const s = getSubject(subjectId)
  const hue = s ? AREA_META[s.area].hue : 258
  return <IconTile hue={hue} icon={subjectIcon(subjectId, s?.area)} large={large} />
}

export function FeedbackCard({ item }: { item: FeedbackItem }) {
  const KindIcon = FEEDBACK_ICON[item.kind]
  return (
    <div className={`card feedback ${item.kind}`}>
      <h3>
        <span className="kind" aria-hidden="true">
          <KindIcon size={16} strokeWidth={2.2} />
        </span>
        {item.title}
      </h3>
      <p className="small" style={{ marginBottom: item.action ? 12 : 0, color: 'var(--text-2)' }}>
        {item.body}
      </p>
      {item.action && (
        <Link to={item.action.to} className="btn sm primary">
          {item.action.label}
        </Link>
      )}
    </div>
  )
}

export function Empty({ title, body, action, icon = Sparkles }: { title: string; body: string; action?: { to: string; label: string }; icon?: LucideIcon }) {
  return (
    <div className="card soft empty">
      <IconTile hue={258} icon={icon} large />
      <h3>{title}</h3>
      <p className="muted" style={{ maxWidth: 44 + 'ch', margin: '0 auto 14px' }}>
        {body}
      </p>
      {action && (
        <Link to={action.to} className="btn primary">
          {action.label}
        </Link>
      )}
    </div>
  )
}
