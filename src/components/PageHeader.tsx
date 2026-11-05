import type { ReactNode } from 'react'
import { Orb } from './Orb'

/**
 * Consistent page header: kicker, title, one-line lead, optional action.
 * `themed` paints it with the current section's hue (set on the shell) and
 * adds abstract art so each section is recognisable at a glance.
 */
export function PageHeader({ kicker, title, lead, action, themed, hue, variant = 2 }: { kicker?: string; title: ReactNode; lead?: ReactNode; action?: ReactNode; themed?: boolean; hue?: number; variant?: number }) {
  return (
    <header className={`page-header ${themed ? 'themed' : ''}`}>
      <div>
        {kicker && <span className="kicker">{kicker}</span>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
      {themed && !action && (
        <div className="page-art">
          <Orb hue={hue ?? 258} size={96} variant={variant} />
        </div>
      )}
    </header>
  )
}
