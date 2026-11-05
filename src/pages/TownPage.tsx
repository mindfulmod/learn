import { useCallback, useEffect, useMemo, useState } from 'react'
import { Sun } from 'lucide-react'
import { Say } from '../components/Say'
import { Town } from '../components/Town'
import { Visit } from '../components/Visit'
import { isPictureAnswers } from '../data/pictureFinder'
import { scorePictureFinder } from '../engine/finder'
import { buildProfile } from '../engine/profile'
import { useStore } from '../store/store'
import type { CareerCluster } from '../types'
import '../styles/town.css'

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/** The seven day keys (UTC, like todayKey) of the week containing `now`, Monday first. */
function weekKeys(now: number): string[] {
  const d = new Date(now)
  const today = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  const offset = (d.getUTCDay() + 6) % 7
  return Array.from({ length: 7 }, (_, i) => new Date(today + (i - offset) * 86400000).toISOString().slice(0, 10))
}

function WeekSuns({ activeDays }: { activeDays: string[] }) {
  // Computed once on mount: no clock reads during render.
  const [{ keys, todayKey }] = useState(() => {
    const now = Date.now()
    return { keys: weekKeys(now), todayKey: new Date(now).toISOString().slice(0, 10) }
  })
  const played = keys.filter((k) => activeDays.includes(k)).length
  const line = played === 0 ? 'Play today to light a sun.' : played === 1 ? 'You played on one day this week.' : `You played on ${played} days this week.`
  return (
    <Say className="town-week" text={line}>
      {keys.map((k, i) => {
        const on = activeDays.includes(k)
        const today = k === todayKey
        return (
          <span key={k} className={`town-sun${on ? ' on' : ''}${today ? ' today' : ''}`} title={DAY_NAMES[i]}>
            <Sun size={30} strokeWidth={2.2} aria-hidden="true" />
          </span>
        )
      })}
      <span className="sr-only">{line}</span>
    </Say>
  )
}

/**
 * Rahnuma Town: home and explore for grades 1 to 5. A greeting, the week as
 * seven suns, and the map. Tapping a place opens its Visit.
 */
export function TownPage() {
  const { state } = useStore()
  const [selected, setSelected] = useState<CareerCluster | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const top = useMemo<CareerCluster[]>(() => {
    if (!state.finder || !isPictureAnswers(state.finder)) return []
    return scorePictureFinder(state.finder, state, buildProfile(state)).topClusters
  }, [state])

  const first = state.profile?.name.split(' ')[0] ?? ''
  const close = useCallback(() => setSelected(null), [])

  return (
    <div className="town-page">
      <header className="town-head">
        <Say as="h1" className="town-hello">
          {first ? `Hello, ${first}` : 'Hello'}
        </Say>
        <WeekSuns activeDays={state.activeDays} />
      </header>
      <Town top={top} stickers={state.stickers} signpost={state.finder === null} onOpen={setSelected} keys={selected === null} />
      {selected && <Visit key={selected} cluster={selected} onClose={close} />}
    </div>
  )
}
