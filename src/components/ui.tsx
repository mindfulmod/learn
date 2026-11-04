import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { FeedbackItem } from '../engine/feedback'
import type { MasteryLevel } from '../engine/profile'

export function Bar({ value, tone, label }: { value: number; tone?: 'good' | 'warn' | 'bad' | 'accent'; label?: string }) {
  const t = tone ?? (value >= 75 ? 'good' : value >= 50 ? 'warn' : value > 0 ? 'bad' : undefined)
  return (
    <div className={`bar ${t ?? ''}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

export function Meter({ label, value, right, tone }: { label: ReactNode; value: number; right?: ReactNode; tone?: 'good' | 'warn' | 'bad' | 'accent' }) {
  return (
    <div className="meter">
      <span>{label}</span>
      <span className="small muted">{right ?? `${value}%`}</span>
      <Bar value={value} tone={tone} />
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
    <div className="score-ring" style={{ ['--pct' as string]: value }} aria-label={`${value} percent`}>
      <span>{value}%</span>
    </div>
  )
}

export function FeedbackCard({ item }: { item: FeedbackItem }) {
  return (
    <div className={`card feedback ${item.kind}`}>
      <h3>{item.title}</h3>
      <p className="small" style={{ marginBottom: item.action ? 10 : 0 }}>{item.body}</p>
      {item.action && (
        <Link to={item.action.to} className="btn sm primary">
          {item.action.label}
        </Link>
      )}
    </div>
  )
}

export function Empty({ title, body, action }: { title: string; body: string; action?: { to: string; label: string } }) {
  return (
    <div className="card soft" style={{ textAlign: 'center', padding: 28 }}>
      <h3>{title}</h3>
      <p className="muted">{body}</p>
      {action && (
        <Link to={action.to} className="btn primary">
          {action.label}
        </Link>
      )}
    </div>
  )
}
