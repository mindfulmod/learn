import { Children, isValidElement, type ElementType, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import { Volume2 } from 'lucide-react'
import { speak } from '../engine/mode'

/** Plain text of a React tree, for read-aloud. */
function textOf(node: ReactNode): string {
  let out = ''
  Children.forEach(node, (child) => {
    if (typeof child === 'string' || typeof child === 'number') out += child
    else if (isValidElement<{ children?: ReactNode }>(child)) out += textOf(child.props.children)
  })
  return out
}

/**
 * Tap to hear. Wraps a piece of text in a button-like span that reads it
 * aloud (Khan Kids pattern: every word in the band is tappable). `as` sets
 * the outer element, so a heading keeps its semantics.
 */
export function Say({ text, as, className, children }: { text?: string; as?: ElementType; className?: string; children: ReactNode }) {
  const read = () => {
    const t = (text ?? textOf(children)).trim()
    if (t) speak(t)
  }
  const onClick = (e: MouseEvent) => {
    e.stopPropagation()
    read()
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      read()
    }
  }
  const inner = (
    <span className={`say${as ? '' : className ? ` ${className}` : ''}`} role="button" tabIndex={0} onClick={onClick} onKeyDown={onKeyDown}>
      {children}
      <Volume2 className="say-glyph" size={14} strokeWidth={2.4} aria-hidden="true" />
    </span>
  )
  if (!as) return inner
  const Tag = as
  return <Tag className={className}>{inner}</Tag>
}
