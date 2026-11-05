import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { getCareer } from '../data/careers'
import { subjectName } from '../data/subjects'
import { modeFor } from '../engine/mode'
import { streak, todayKey } from '../engine/profile'
import { homeState, weeklyMissions } from '../engine/xp'
import { useStore } from '../store/store'
import '../styles/home.css'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface Day {
  key: string
  letter: string
  name: string
}

interface Row {
  title: string
  span: string
  to: string
}

interface RailNow {
  week: Day[]
  hour: number
  today: string
}

function short(title: string): string {
  return title.split(' (')[0]
}

/**
 * The right-hand context rail on Today, Practice and Progress. It never
 * repeats the hero: streak dots with one line, then "This week" (senior) or
 * two "Also try" rows that are not the hero's action (junior). Plain groups
 * separated by space, not stacked cards. Stacks under the main column on
 * phones.
 *
 * `level` and `coach` are kept for callers written against the older rail;
 * the level and coach groups were removed in iteration 5.
 */
export function ContextRail(_props: { level?: boolean; coach?: boolean } = {}) {
  const { state } = useStore()
  const { pathname } = useLocation()
  const junior = modeFor(state.profile) === 'junior'
  const [now] = useState<RailNow>(() => {
    const ms = Date.now()
    const week = Array.from({ length: 7 }, (_, i) => {
      const key = new Date(ms - (6 - i) * 86400000).toISOString().slice(0, 10)
      const wd = new Date(key + 'T00:00:00Z').getUTCDay()
      return { key, letter: DAYS[wd].slice(0, 1), name: DAYS[wd] }
    })
    return { week, hour: new Date(ms).getHours(), today: todayKey() }
  })
  const card = useMemo(() => homeState(state, now), [state, now])
  const missions = useMemo(() => weeklyMissions(state), [state])
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined

  const alsoTry = useMemo<Row[]>(() => {
    const practised = new Set(state.attempts.map((a) => a.subjectId))
    const unseen = missions.find((m) => m.id === 'new-subject')
    const unseenId = unseen?.to.split('/')[2]
    const candidates: Row[] = []
    if (goal && !state.previewed.includes(goal.id)) candidates.push({ title: 'See your future', span: `Your life as a ${short(goal.title).toLowerCase()}.`, to: `/careers/${goal.id}?preview=1` })
    if (unseenId && !practised.has(unseenId)) candidates.push({ title: `Try ${subjectName(unseenId)}`, span: 'A subject you have not tried.', to: unseen!.to })
    candidates.push({ title: 'Peer into a future', span: 'Pick a path and take a look.', to: '/careers' })
    if (state.attempts.length) candidates.push({ title: 'See how far you came', span: 'Your wins so far.', to: '/progress' })
    candidates.push({ title: 'Practise anything', span: 'Pick any subject you like.', to: '/practice' })
    const seen = new Set<string>()
    return candidates
      .filter((r) => {
        const path = r.to.split('?')[0]
        if (r.to === card.to || path === pathname || seen.has(path)) return false
        seen.add(path)
        return true
      })
      .slice(0, 2)
  }, [missions, goal, state.previewed, state.attempts, card.to, pathname])

  const st = streak(state.activeDays)
  const active = new Set(state.activeDays)
  const today = now.week[6].key
  const doneCount = missions.filter((m) => m.done).length

  return (
    <div className="rail-groups">
      <section className="rail-group" aria-label="Streak">
        <span className="kicker">Streak</span>
        <div className="streak-days" aria-label="Last seven days">
          {now.week.map((d) => (
            <span key={d.key} className={`${active.has(d.key) ? 'on' : ''} ${d.key === today ? 'today' : ''}`} title={`${d.name}${active.has(d.key) ? ', practised' : ''}`}>
              {d.letter}
            </span>
          ))}
        </div>
        <p className="rail-group-line">
          {st.current > 0 ? `${st.current} day${st.current === 1 ? '' : 's'} in a row` : 'Start today'}
          {!junior && st.best > st.current && <span className="muted"> · best {st.best}</span>}
        </p>
      </section>

      {junior ? (
        alsoTry.length > 0 && (
          <section className="rail-group" aria-label="Also try">
            <span className="kicker">Also try</span>
            <ul className="rail-rows">
              {alsoTry.map((r) => (
                <li key={r.to}>
                  <Link to={r.to}>
                    <span className="rail-row-body">
                      <b>{r.title}</b>
                      <span>{r.span}</span>
                    </span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      ) : (
        <section className="rail-group" aria-label="This week">
          <span className="kicker rail-group-head">
            <span>This week</span>
            <span className="rail-count">
              {doneCount} of {missions.length}
            </span>
          </span>
          <ul className="rail-rows">
            {missions.map((m) => (
              <li key={m.id} className={m.done ? 'done' : ''}>
                <Link to={m.to}>
                  <span className={`rail-check ${m.done ? 'on' : ''}`} aria-label={m.done ? 'Done' : 'Not done yet'}>
                    {m.done && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                  </span>
                  <span className="rail-row-body">
                    <b>{m.title}</b>
                  </span>
                  <span className="rail-xp">+{m.xp} XP</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
