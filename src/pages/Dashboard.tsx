import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Clock, Compass, Eye, Flame, Map as MapIcon, Sparkles, Target, Trophy, Volume2, Zap } from 'lucide-react'
import { getCareer } from '../data/careers'
import { pathsForInterests } from '../data/paths'
import { getSubject, subjectName } from '../data/subjects'
import { AREA_META, CLUSTER_META, FEEDBACK_ICON, subjectIcon, tint } from '../design'
import { careerFit, hasSignal, rankCareers } from '../engine/careers'
import { buildFeedback, type FeedbackItem } from '../engine/feedback'
import { scoreFinder } from '../engine/finder'
import { buildJourney } from '../engine/journey'
import { modeFor, speak } from '../engine/mode'
import { goalPlan } from '../engine/plan'
import { buildProfile, streak } from '../engine/profile'
import { levelFor, nextStep, totalXp, weeklyMissions, type Mission, type NextStep } from '../engine/xp'
import { useStore } from '../store/store'
import type { Career } from '../types'
import { PageHeader } from '../components/PageHeader'
import { Ring } from '../components/Ring'
import { Orb } from '../components/Orb'
import { PathStrip } from '../components/PathStrip'
import { FuturePreview } from '../components/FuturePreview'
import { Interests } from '../components/Interests'
import { FeedbackCard, IconTile, LevelBadge, Meter, ScoreRing } from '../components/ui'
import '../styles/home.css'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const KIND_HUE: Record<Exclude<NextStep['kind'], 'practice'>, number> = { finder: 320, preview: 215, discovery: 45, goal: 258 }
const KIND_VARIANT: Record<NextStep['kind'], number> = { practice: 0, finder: 1, preview: 2, discovery: 1, goal: 0 }
const POPULAR = ['doctor', 'software-engineer', 'lawyer']

interface Now {
  kicker: string
  greeting: string
  week: { key: string; letter: string; name: string }[]
  today: string
}

function short(title: string): string {
  return title.split(' (')[0]
}

/** Keep the first `n` words; add an ellipsis when something was cut. */
function clipWords(text: string, n: number): string {
  const words = text.trim().split(/\s+/)
  if (words.length <= n) return text.trim()
  return words.slice(0, n).join(' ').replace(/[.,;:!?]+$/, '') + '…'
}

function stepHueFor(step: NextStep): number {
  if (step.kind !== 'practice') return KIND_HUE[step.kind]
  const s = step.subjectId ? getSubject(step.subjectId) : undefined
  return s ? AREA_META[s.area].hue : 258
}

export function Dashboard() {
  const { state } = useStore()
  const [now] = useState<Now>(() => {
    const d = new Date()
    const h = d.getHours()
    const ms = d.getTime()
    const week = Array.from({ length: 7 }, (_, i) => {
      const key = new Date(ms - (6 - i) * 86400000).toISOString().slice(0, 10)
      const wd = new Date(key + 'T00:00:00Z').getUTCDay()
      return { key, letter: DAYS[wd].slice(0, 1), name: DAYS[wd] }
    })
    return {
      kicker: `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`,
      greeting: h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening',
      week,
      today: week[6].key,
    }
  })
  return modeFor(state.profile) === 'junior' ? <JuniorHome now={now} /> : <SeniorHome now={now} />
}

// ------------------------------------------------------------------ Junior

function juniorHeroTitle(step: NextStep): string {
  if (step.kind === 'preview') return 'Peek at your future'
  return clipWords(step.title, 6)
}

function juniorHeroLine(step: NextStep): string {
  switch (step.kind) {
    case 'practice':
      return '8 quick questions. About 6 minutes.'
    case 'finder':
      return 'Eight fun questions. Three futures to look at.'
    case 'preview': {
      const id = step.to.split('/')[2]?.split('?')[0]
      const c = id ? getCareer(id) : undefined
      return `See your life as a ${c ? short(c.title).toLowerCase() : 'grown-up'}, year by year.`
    }
    case 'discovery':
      return '24 quick questions about you.'
    case 'goal':
      return 'Pick a dream to aim at.'
  }
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

/** Short, number-free copy for each mission on the junior home. */
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

interface StepRow {
  title: string
  span: string
  to: string
}

function JuniorHome({ now }: { now: Now }) {
  const { state } = useStore()
  const p = state.profile!
  const profile = useMemo(() => buildProfile(state), [state])
  const coach = useMemo(() => buildFeedback(state, profile)[0], [state, profile])
  const step = useMemo(() => nextStep(state), [state])
  const missions = useMemo(() => weeklyMissions(state), [state])
  const paths = useMemo(() => pathsForInterests(state.interests), [state.interests])
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined

  const rows = useMemo<StepRow[]>(() => {
    const first: StepRow = { title: juniorHeroTitle(step), span: juniorStepSpan(step), to: step.to }
    const third: StepRow =
      goal && !state.previewed.includes(goal.id) && step.kind !== 'preview'
        ? { title: 'See your future', span: `Your life as a ${short(goal.title).toLowerCase()}.`, to: `/careers/${goal.id}?preview=1` }
        : { title: 'Peer into a future', span: 'Pick a path and take a look.', to: '/careers' }
    const m = missions.find((x) => !x.done && x.to !== first.to && x.to !== third.to)
    const second: StepRow = m ? { ...juniorMission(m), to: m.to } : first.to === '/practice' ? { title: 'See how far you came', span: 'Your wins so far.', to: '/progress' } : { title: 'Practise anything', span: 'Pick any subject you like.', to: '/practice' }
    return [first, second, third]
  }, [step, missions, goal, state.previewed])

  const firstName = p.name.split(' ')[0]
  const CoachIcon = coach ? FEEDBACK_ICON[coach.kind] : null

  return (
    <div className="home-junior">
      <PageHeader kicker={now.kicker} title={`${now.greeting}, ${firstName}`} />

      <section className="tile hero-tile section">
        <Orb hue={stepHueFor(step)} size={200} variant={KIND_VARIANT[step.kind]} />
        <div className="hero-copy">
          <span className="tile-label" style={{ color: 'rgb(255 255 255 / 0.85)' }}>
            Today
          </span>
          <h2>{juniorHeroTitle(step)}</h2>
          <p>{juniorHeroLine(step)}</p>
          <Link to={step.to} className="btn primary">
            {step.cta} <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head stacked">
          <h2>What are you curious about?</h2>
          <p className="muted">Pick a few. Change them any time.</p>
        </div>
        <Interests />
      </section>

      <section className="section">
        <div className="section-head">
          <h2>A few paths for you</h2>
        </div>
        <div className="grid cols-3">
          {paths.map((path) => (
            <div key={path.cluster} className="card pastel path-tile" style={tint(path.hue)}>
              <IconTile hue={path.hue} icon={CLUSTER_META[path.cluster].icon} />
              <h3>{path.title}</h3>
              <p>{path.promise}</p>
              <Link to={`/careers?path=${path.cluster}`} className="btn sm">
                Explore <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="card section">
        <h3>Your next small steps</h3>
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
                  <ArrowRight size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {coach && CoachIcon && (
        <section className={`card soft coach-line feedback ${coach.kind}`} aria-label="Your coach says">
          <span className="kind" aria-hidden="true">
            <CoachIcon size={18} strokeWidth={2.2} />
          </span>
          <b className="coach-title">{coach.title}</b>
          <span className="coach-actions">
            <button type="button" className="btn sm" onClick={() => speak(coach.title)} aria-label="Read aloud">
              <Volume2 size={16} aria-hidden="true" />
            </button>
            {coach.action && (
              <Link to={coach.action.to} className="btn sm primary">
                {coach.action.label}
              </Link>
            )}
          </span>
        </section>
      )}
    </div>
  )
}

// ------------------------------------------------------------------ Senior

function SeniorHome({ now }: { now: Now }) {
  const { state } = useStore()
  const p = state.profile!
  const profile = useMemo(() => buildProfile(state), [state])
  const feedback = useMemo<FeedbackItem[]>(() => buildFeedback(state, profile).slice(0, 3).map((f) => ({ ...f, body: clipWords(f.body, 18) })), [state, profile])
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined
  const journey = useMemo(() => (goal ? buildJourney(goal, p) : null), [goal, p])
  const plan = useMemo(() => (goal ? goalPlan(goal, p, profile) : null), [goal, p, profile])
  const signal = hasSignal(state)
  const fit = useMemo(() => (goal && signal ? careerFit(goal, state, profile) : null), [goal, signal, state, profile])
  const suggestions = useMemo<Career[]>(() => {
    if (goal) return []
    if (signal) return rankCareers(state, profile).slice(0, 3).map((f) => f.career)
    if (state.finder) return scoreFinder(state.finder, state, profile).careers.slice(0, 3).map((c) => c.career)
    return POPULAR.map((id) => getCareer(id)).filter((c): c is Career => !!c)
  }, [goal, signal, state, profile])
  const step = useMemo(() => nextStep(state), [state])
  const missions = useMemo(() => weeklyMissions(state), [state])
  const xp = useMemo(() => totalXp(state), [state])
  const level = levelFor(xp)
  const st = streak(state.activeDays)
  const strengths = Object.values(profile.subjects)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 3)

  const [preview, setPreview] = useState<string | null>(null)

  const active = new Set(state.activeDays)
  const doneCount = missions.filter((m) => m.done).length
  const firstName = p.name.split(' ')[0]

  return (
    <>
      <PageHeader kicker={now.kicker} title={`${now.greeting}, ${firstName}`} lead={goal ? `Aiming for ${short(goal.title)}` : "No goal yet. Let's find one."} />

      <div className="bento section">
        {/* 1. Next step */}
        <section className="tile hero-tile span-2 row-2">
          <Orb hue={stepHueFor(step)} size={220} variant={KIND_VARIANT[step.kind]} />
          <div className="hero-copy">
            <span className="tile-label" style={{ color: 'rgb(255 255 255 / 0.85)' }}>
              Next step
            </span>
            <h2>{step.title}</h2>
            <p>{clipWords(step.detail, 12)}</p>
            <div className="hero-meta">
              <span className="badge">
                <Clock size={14} className="inline-icon" aria-hidden="true" />
                {step.minutes} min
              </span>
              <span className="badge">
                <Sparkles size={14} className="inline-icon" aria-hidden="true" />+{step.xp} XP
              </span>
            </div>
            <Link to={step.to} className="btn primary">
              {step.cta} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* 2. Streak */}
        <section className="card tile">
          <span className="tile-label">
            <Flame size={14} aria-hidden="true" /> Streak
          </span>
          <span className="big">
            {st.current}
            <small>{st.current === 1 ? 'day' : 'days'}</small>
          </span>
          <div className="streak-days" aria-label="Last seven days">
            {now.week.map((d) => (
              <span key={d.key} className={`${active.has(d.key) ? 'on' : ''} ${d.key === now.today ? 'today' : ''}`} title={`${d.name}${active.has(d.key) ? ', practised' : ''}`}>
                {d.letter}
              </span>
            ))}
          </div>
        </section>

        {/* 3. Level */}
        <Link to="/progress" className="card tile">
          <span className="tile-label">
            <Trophy size={14} aria-hidden="true" /> Level {level.index + 1}
          </span>
          <div className="level-row">
            <Ring value={level.progress} size={72} stroke={7}>
              <Zap size={22} aria-hidden="true" />
            </Ring>
            <div>
              <h3>{level.name}</h3>
              <span className="small muted">{xp} XP</span>
            </div>
          </div>
        </Link>

        {/* 4. Your path */}
        <section className="card tile span-2">
          <span className="tile-label">
            <MapIcon size={14} aria-hidden="true" /> Your path
          </span>
          {journey ? (
            <>
              <PathStrip milestones={journey} compact to="/path" />
              <span className="small muted">Tap to see every step</span>
            </>
          ) : (
            <>
              <p className="muted" style={{ margin: 0 }}>
                Set a goal and your path appears here
              </p>
              <Link to="/finder" className="btn sm primary tile-foot" style={{ alignSelf: 'flex-start' }}>
                <Compass size={16} aria-hidden="true" /> {state.finder ? 'See my matches' : 'Find a direction'}
              </Link>
            </>
          )}
        </section>

        {/* 5. Goal */}
        <section className="card tile span-2">
          {goal && plan ? (
            <>
              <span className="tile-label">Your goal</span>
              <div className="goal-head">
                <IconTile hue={CLUSTER_META[goal.cluster].hue} icon={CLUSTER_META[goal.cluster].icon} />
                <div>
                  <h3>{goal.title}</h3>
                  {plan.recommendedStreamName && (
                    <span className="small muted">
                      Group: {plan.recommendedStreamName}{' '}
                      {plan.streamMatches === true && <span className="badge good">On track</span>}
                      {plan.streamMatches === false && <span className="badge warn">Different from yours</span>}
                    </span>
                  )}
                </div>
                {fit && <ScoreRing value={fit.score} />}
              </div>
              <div className="goal-subjects" aria-label="Must-have subjects">
                {plan.subjects
                  .filter((s) => s.importance === 'must')
                  .map((s) => (
                    <Link key={s.subjectId} to={`/practice/${s.subjectId}`} className={s.level === 'not-practised' ? 'plain' : ''}>
                      {s.name}
                      {s.level !== 'not-practised' && <LevelBadge level={s.level} />}
                    </Link>
                  ))}
              </div>
              <div className="row tile-foot">
                <button className="btn sm primary" onClick={() => setPreview(goal.id)}>
                  <Eye size={16} aria-hidden="true" /> Peer into your future
                </button>
                <Link to="/careers" className="btn sm">
                  Change
                </Link>
              </div>
            </>
          ) : (
            <>
              <span className="tile-label">Futures to try</span>
              <ul className="suggest-list">
                {suggestions.map((c) => (
                  <li key={c.id}>
                    <IconTile hue={CLUSTER_META[c.cluster].hue} icon={CLUSTER_META[c.cluster].icon} />
                    <b>{short(c.title)}</b>
                    <button className="btn sm" onClick={() => setPreview(c.id)}>
                      <Eye size={16} aria-hidden="true" /> Preview
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* 6. Missions */}
        <section className="card tile wide-sm">
          <span className="tile-label">
            <Target size={14} aria-hidden="true" /> This week
          </span>
          <ul className="missions">
            {missions.map((m) => (
              <li key={m.id} className={m.done ? 'done' : ''}>
                <Link to={m.to}>
                  <span className={`mission-check ${m.done ? 'done' : ''}`}>
                    <Check size={14} strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="mission-text">
                    <b>{m.title}</b>
                  </span>
                </Link>
                <span className="badge primary">+{m.xp}</span>
              </li>
            ))}
          </ul>
          <span className="small muted tile-foot">
            {doneCount}/{missions.length} done
          </span>
        </section>

        {/* 7. Strengths */}
        <section className="card tile wide-sm">
          <span className="tile-label">
            <Zap size={14} aria-hidden="true" /> Strengths
          </span>
          {strengths.length ? (
            <div className="strength-meters">
              {strengths.map((s) => {
                const Icon = subjectIcon(s.subjectId, s.area)
                return (
                  <Meter
                    key={s.subjectId}
                    label={
                      <>
                        <Icon size={14} aria-hidden="true" />
                        {subjectName(s.subjectId)}
                      </>
                    }
                    value={s.accuracy}
                    tone="tinted"
                    hue={AREA_META[s.area].hue}
                  />
                )
              })}
            </div>
          ) : (
            <>
              <p className="small muted" style={{ margin: 0 }}>
                Practise to build your profile
              </p>
              <Link to="/practice" className="small tile-foot">
                Go to practice
              </Link>
            </>
          )}
        </section>
      </div>

      <section className="card section">
        <h3>What are you curious about?</h3>
        <Interests />
      </section>

      {feedback.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Your coach says</h2>
          </div>
          <div className="coach-rail">
            {feedback.map((f, i) => (
              <FeedbackCard key={i} item={f} />
            ))}
          </div>
        </section>
      )}

      {preview && <FuturePreview careerId={preview} onClose={() => setPreview(null)} />}
    </>
  )
}
