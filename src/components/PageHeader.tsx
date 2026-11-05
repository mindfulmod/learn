import type { ReactNode } from 'react'

/** Consistent page header: kicker, title, one-line lead, optional action. */
export function PageHeader({ kicker, title, lead, action }: { kicker?: string; title: ReactNode; lead?: ReactNode; action?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        {kicker && <span className="kicker">{kicker}</span>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </header>
  )
}
