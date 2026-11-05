import { Coins } from 'lucide-react'
import { formatPkr, type CareerLife } from '../data/careerLife'

/** Approximate national median monthly pay, PKR. Labour Force Survey based aggregators put it near 70k. */
const NATIONAL_MEDIAN_PKR = 70_000
const SCALE_MAX = 1_600_000

function pct(v: number): number {
  // Log scale so a 2.5M upper bound does not flatten the 30k to 150k region.
  const lo = Math.log(20_000)
  const hi = Math.log(SCALE_MAX)
  return Math.max(0, Math.min(100, ((Math.log(Math.max(20_000, Math.min(SCALE_MAX, v))) - lo) / (hi - lo)) * 100))
}

/** Three-coin verdict for juniors, from the experienced midpoint. */
function payLevel(life: CareerLife): { coins: 1 | 2 | 3; label: string } {
  const mid = (life.pay.experienced[0] + life.pay.experienced[1]) / 2
  if (mid < 200_000) return { coins: 1, label: 'Pays OK' }
  if (mid < 500_000) return { coins: 2, label: 'Pays well' }
  return { coins: 3, label: 'Pays very well' }
}

/**
 * Monthly pay in Pakistan as a band from entry to experienced, against the
 * national median. Labelled as an estimate.
 */
export function PayBand({ life, compact }: { life: CareerLife; compact?: boolean }) {
  const e = life.pay.entry
  const x = life.pay.experienced
  const left = pct(e[0])
  const right = pct(x[1])
  const entryRight = pct(e[1])
  const median = pct(NATIONAL_MEDIAN_PKR)
  return (
    <div className={`payband ${compact ? 'compact' : ''}`}>
      {!compact && (
        <div className="payband-head">
          <span className="tile-label">Pay in Pakistan</span>
          <span className="small muted">Estimate, 2025 · per month</span>
        </div>
      )}
      <div className="payband-track" role="img" aria-label={`Starting pay Rs ${formatPkr(e[0])} to ${formatPkr(e[1])} a month, rising to Rs ${formatPkr(x[0])} to ${formatPkr(x[1])} with experience. National median about Rs ${formatPkr(NATIONAL_MEDIAN_PKR)}.`}>
        <span className="payband-range" style={{ left: `${left}%`, width: `${right - left}%` }} />
        <span className="payband-entry" style={{ left: `${left}%`, width: `${entryRight - left}%` }} />
        <span className="payband-median" style={{ left: `${median}%` }} title="National median" />
      </div>
      <div className="payband-labels">
        <span>
          <b>Rs {formatPkr(e[0])}–{formatPkr(e[1])}</b>
          <small>starting</small>
        </span>
        <span className="payband-median-label" style={{ left: `${median}%` }}>
          <small>most people: Rs {formatPkr(NATIONAL_MEDIAN_PKR)}</small>
        </span>
        <span style={{ textAlign: 'right' }}>
          <b>Rs {formatPkr(x[0])}–{formatPkr(x[1])}</b>
          <small>10 years in</small>
        </span>
      </div>
    </div>
  )
}

/** Junior-friendly pay: one to three coins and two words. */
export function PayCoins({ life }: { life: CareerLife }) {
  const p = payLevel(life)
  return (
    <span className="paycoins" aria-label={p.label}>
      {[1, 2, 3].map((i) => (
        <Coins key={i} size={18} className={i <= p.coins ? 'on' : ''} aria-hidden="true" />
      ))}
      <span>{p.label}</span>
    </span>
  )
}
