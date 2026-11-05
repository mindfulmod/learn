import { useEffect, useRef, useState } from 'react'
import { INTERESTS } from '../data/paths'
import { useStore } from '../store/store'
import type { InterestId } from '../types'
import '../styles/home.css'

const MAX = 4

/** Tappable interest pills (up to four). They steer which paths we suggest. */
export function Interests() {
  const { state, setInterests } = useStore()
  const [shaking, setShaking] = useState<InterestId | null>(null)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const toggle = (id: InterestId) => {
    const on = state.interests.includes(id)
    if (on) {
      setInterests(state.interests.filter((i) => i !== id))
      return
    }
    if (state.interests.length >= MAX) {
      window.clearTimeout(timer.current)
      setShaking(id)
      timer.current = window.setTimeout(() => setShaking(null), 450)
      return
    }
    setInterests([...state.interests, id])
  }

  return (
    <div className="interests" role="group" aria-label="Interests, pick up to four">
      {INTERESTS.map(({ id, label, icon: Icon }) => {
        const on = state.interests.includes(id)
        return (
          <button key={id} type="button" className={`interest ${on ? 'on' : ''} ${shaking === id ? 'shake' : ''}`} aria-pressed={on} onClick={() => toggle(id)}>
            <Icon size={18} aria-hidden="true" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
