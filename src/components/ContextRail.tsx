import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Flame, MessageCircle, Target, Trophy, Volume2, Zap } from 'lucide-react'
import { getCareer } from '../data/careers'
import { FEEDBACK_ICON } from '../design'
import { buildFeedback } from '../engine/feedback'
import { modeFor, speak } from '../engine/mode'
import { buildProfile, streak } from '../engine/profile'
import { levelFor, nextStep, totalXp, weeklyMissions, type Mission, type NextStep } from '../engine/xp'
import { useStore } from '../store/store'
import { Ring } from './Ring'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface Day {
  key: string
  letter: string
  name: string
}

interface StepRow {
  title: string
  span: string
  to: string
}

function short(title: string): string {
  return title.split(' (')[0]
}

function clipWords(text: string, n: number): string {
  const words = text.trim().split(/\s+/)
  if (words.length <= n) return text.trim()
  return words.slice(0, n).join(' ').replace(/[.,;:!?]+$/, '') + '…'
}

function juniorStepTitle(step: NextStep): string {
  if (step.kind === 'preview') return 'Peek at your future'
  return clipWords(step.title, 6)
}

function juniorStepSpan(step: NextStep): string {
  switch (step.kind) {
    case 'practice':
      return '8 quick questions.'
    case 'finder':
      return 'Eight fun questions.'
    case 'preview':
      return 'Your life, year by year.'
    case 'discovery':
      return '24 quick questions about you.'
    case 'goal':
      return 'Pick a dream to aim at.'
  }
}

/** Short, number-free copy for each mission in junior mode. */
function juniorMission(m: Mission): { title: string; span: string } {
  switch (m.id) {
    case 'goal-subject':
      return { title: 'Practise a goal subject', span: 'One round this week.' }
    case 'set-goal':
      return { title: 'Pick a goal', span: 'Preview a career, then set it.' }
    case 'two-rounds':
      return { title: 'Two rounds this week', span: m.detail }
    case 'new-subject':
      return { title: 'Try a new subject', span: clipWords(m.detail, 8) }
    case 'preview':
      return { title: 'Peer into a future', span: 'Preview any career, start to finish.' }
    case 'discovery':
      return { title: 'Take the discovery quiz', span: '24 quick questions about you.' }
    case 'beat':
      return { title: 'Beat your best score', span: 'Any round counts.' }
    default:
      return { title: clipWords(m.title, 6), span: '' }
  }
}

/**
 * The right-hand context rail on Today, Practice and Progress: streak, the
 * week's missions (or three small steps for juniors), one coach line and,
 * for seniors, the level. Stacks under the main column on phones.
 */
export function ContextRail({ level: showLevel = true, coach: showCoach = true }: { level?: boolean; coach?: boolean }) {
  const { state } = useStore()
  const junior = modeFor(state.profile) === 'junior'
  const [week] = useState<Day[]>(() => {
    const ms = Date.now()
    return Array.from({ length: 7 }, (_, i) => {
      const key = new Date(ms - (6 - i) * 86400000).toISOString().slice(0, 10)
      const wd = new Date(key + 'T00:00:00Z').getUTCDay()
      return { key, letter: DAYS[wd].slice(0, 1), name: DAYS[wd] }
    })
  })
  const profile = useMemo(() => buildProfile(state), [state])
  const coach = useMemo(() => buildFeedback(state, profile)[0], [state, profile])
  const step = useMemo(() => nextStep(state), [state])
  const missions = useMemo(() => weeklyMissions(state), [state])
  const xp = useMemo(() => totalXp(state), [state])
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined

  const rows = useMemo<StepRow[]>(() => {
    const first: StepRow = { title: juniorStepTitle(step), span: juniorStepSpan(step), to: step.to }
    const third: StepRow =
      goal && !state.previewed.includes(goal.id) && step.kind !== 'preview'
        ? { title: 'See your future', span: `Your life as a ${short(goal.title).toLowerCase()}.`, to: `/careers/${goal.id}?preview=1` }
        : { title: 'Peer into a future', span: 'Pick a path and take a look.', to: '/careers' }
    const m = missions.find((x) => !x.done && x.to !== first.to && x.to !== third.to)
    const second: StepRow = m ? { ...juniorMission(m), to: m.to } : first.to === '/practice' ? { title: 'See how far you came', span: 'Your wins so far.', to: '/progress' } : { title: 'Practise anything', span: 'Pick any subject you like.', to: '/practice' }
    return [first, second, third]
  }, [step, missions, goal, state.previewed])

  const st = streak(state.activeDays)
  const active = new Set(state.activeDays)
  const today = week[6].key
  const lv = levelFor(xp)
  const doneCount = missions.filter((m) => m.done).length
  const CoachIcon = coach ? FEEDBACK_ICON[coach.kind] : null

  return (
    <>
      <section className="card rail-card" aria-label="Streak">
        <span className="tile-label">
          <Flame size={14} aria-hidden="true" /> Streak
        </span>
        <div className="streak-days" aria-label="Last seven days">
          {week.map((d) => (
            <span key={d.key} className={`${active.has(d.key) ? 'on' : ''} ${d.key === today ? 'today' : ''}`} title={`${d.name}${active.has(d.key) ? ', practised' : ''}`}>
              {d.letter}
            </span>
          ))}
        </div>
        <p className="rail-line">
          {st.current > 0 ? `${st.current} day${st.current === 1 ? '' : 's'} in a row` : 'Start today'}
          {!junior && st.best > 0 && <span className="muted"> · best {st.best}</span>}
        </p>
      </section>

      {!junior && showLevel && (
        <Link to="/progress" className="card rail-card rail-level">
          <Ring value={lv.progress} size={56} stroke={6}>
            <Zap size={18} aria-hidden="true" />
          </Ring>
          <span className="rail-level-body">
            <span className="tile-label">
              <Trophy size={14} aria-hidden="true" /> Level {lv.index + 1}
            </span>
            <b>{lv.name}</b>
            <span className="small muted">{lv.next !== null ? `${lv.next - xp} XP to ${levelFor(lv.next).name}` : 'Top level reached'}</span>
          </span>
        </Link>
      )}

      {junior ? (
        <section className="card rail-card" aria-label="Next small steps">
          <span className="tile-label">
            <Target size={14} aria-hidden="true" /> Next small steps
          </span>
          <ul className="steps">
            {rows.map((r, i) => (
              <li key={i}>
                <Link to={r.to}>
                  <span className="num">{i + 1}</span>
                  <span className="step-body">
                    <b>{r.title}</b>
                    {r.span && <span>{r.span}</span>}
                  </span>
                  <span className="go" aria-hidden="true">
                    <ArrowRight size={16} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="card rail-card" aria-label="This week">
          <span className="tile-label rail-head">
            <span>
              <Target size={14} aria-hidden="true" /> This week
            </span>
            <span className="rail-count">
              {doneCount}/{missions.length}
            </span>
          </span>
          <ul className="steps">
            {missions.map((m, i) => (
              <li key={m.id} className={m.done ? 'done' : ''}>
                <Link to={m.to}>
                  <span className={`num ${m.done ? 'done' : ''}`}>{m.done ? <Check size={16} strokeWidth={3} aria-label="Done" /> : i + 1}</span>
                  <span className="step-body">
                    <b>{m.title}</b>
                  </span>
                  <span className="badge primary">+{m.xp}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {showCoach && coach && CoachIcon && (
        <section className={`card rail-card feedback rail-coach ${coach.kind}`} aria-label="Your coach says">
          <span className="tile-label">
            <MessageCircle size={14} aria-hidden="true" /> Coach
          </span>
          <div className="rail-coach-row">
            <span className="kind" aria-hidden="true">
              <CoachIcon size={16} strokeWidth={2.2} />
            </span>
            <b>{coach.title}</b>
          </div>
          {(coach.action || junior) && (
            <div className="rail-coach-actions">
              {junior && (
                <button type="button" className="btn sm" onClick={() => speak(coach.title)} aria-label="Read aloud">
                  <Volume2 size={16} aria-hidden="true" />
                </button>
              )}
              {coach.action && (
                <Link to={coach.action.to} className="btn sm">
                  {coach.action.label}
                </Link>
              )}
            </div>
          )}
        </section>
      )}
    </>
  )
}
