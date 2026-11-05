import type { ReactNode } from 'react'

/**
 * The one page frame. Header on top, main column, optional context rail on
 * wide screens (stacks under main on phones). Every page uses this so the
 * app reads as one product.
 */
export function Screen({ header, children, rail, wide }: { header?: ReactNode; children: ReactNode; rail?: ReactNode; wide?: boolean }) {
  return (
    <div className={`screen ${rail ? 'has-rail' : ''} ${wide ? 'wide' : ''}`}>
      {header}
      <div className="screen-body">
        <div className="screen-main">{children}</div>
        {rail && <aside className="screen-rail">{rail}</aside>}
      </div>
    </div>
  )
}
