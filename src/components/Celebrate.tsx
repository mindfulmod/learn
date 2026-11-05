import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

/** Short burst of confetti plus an XP toast. Mount it when something is earned. */
export function Celebrate({ xp, label, onDone }: { xp: number; label?: string; onDone?: () => void }) {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false)
      onDone?.()
    }, 2600)
    return () => clearTimeout(t)
  }, [onDone])
  if (!show) return null
  const pieces = Array.from({ length: 28 })
  return (
    <div className="celebrate" aria-live="polite">
      <div className="confetti" aria-hidden="true">
        {pieces.map((_, i) => (
          <i key={i} style={{ ['--i' as string]: i, ['--h' as string]: (i * 47) % 360 }} />
        ))}
      </div>
      <div className="xp-toast pop">
        <Sparkles size={18} aria-hidden="true" />
        <b>+{xp} XP</b>
        {label && <span>{label}</span>}
      </div>
    </div>
  )
}
