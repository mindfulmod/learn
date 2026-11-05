import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Compass, Eye, Map as MapIcon, Sparkles, Zap } from 'lucide-react'
import { getCareer } from '../data/careers'
import { pathsForInterests } from '../data/paths'
import { getSubject, subjectName } from '../data/subjects'
import { AREA_META, CLUSTER_META, subjectIcon, tint } from '../design'
import { careerFit, hasSignal, rankCareers } from '../engine/careers'
import { scoreFinder } from '../engine/finder'
import { buildJourney } from '../engine/journey'
import { modeFor } from '../engine/mode'
import { goalPlan } from '../engine/plan'
import { buildProfile } from '../engine/profile'
import { nextStep, type NextStep } from '../engine/xp'
import { useStore } from '../store/store'
import type { Career } from '../types'
import { PageHeader } from '../components/PageHeader'
import { Orb } from '../components/Orb'
import { PathStrip } from '../components/PathStrip'
import { FuturePreview } from '../components/FuturePreview'
import { Interests } from '../components/Interests'
import { IconTile, LevelBadge, Meter, ScoreRing } from '../components/ui'
import { Screen } from '../components/Screen'
import { ContextRail } from '../components/ContextRail'
import '../styles/home.css'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const KIND_HUE: Record<Exclude<NextStep['kind'], 'practice'>, number> = { finder: 320, preview: 215, discovery: 45, goal: 258 }
const KIND_VARIANT: Record<NextStep['kind'], number> = { practice: 0, finder: 1, preview: 2, discovery: 1, goal: 0 }
const POPULAR = ['doctor', 'software-engineer', 'lawyer']

interface Now {
  kicker: string
  greeting: string
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
    return {
      kicker: `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`,
      greeting: h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening',
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

function JuniorHome({ now }: { now: Now }) {
  const { state } = useStore()
  const p = state.profile!
  const step = useMemo(() => nextStep(state), [state])
  const paths = useMemo(() => pathsForInterests(state.interests), [state.interests])
  const firstName = p.name.split(' ')[0]

  return (
    <Screen header={<PageHeader kicker={now.kicker} title={`${now.greeting}, ${firstName}`} />} rail={<ContextRail />}>
      <div className="home-junior">
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
          <div className="grid cols-3 path-tiles">
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
      </div>
    </Screen>
  )
}

// ------------------------------------------------------------------ Senior

function SeniorHome({ now }: { now: Now }) {
  const { state } = useStore()
  const p = state.profile!
  const profile = useMemo(() => buildProfile(state), [state])
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
  const strengths = Object.values(profile.subjects)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 3)

  const [preview, setPreview] = useState<string | null>(null)
  const firstName = p.name.split(' ')[0]

  return (
    <Screen
      header={<PageHeader kicker={now.kicker} title={`${now.greeting}, ${firstName}`} lead={goal ? `Aiming for ${short(goal.title)}` : "No goal yet. Let's find one."} />}
      rail={<ContextRail />}
    >
      <div className="home-senior">
        {/* 1. Next step */}
        <section className="tile hero-tile section">
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

        <div className="home-pair section">
          {/* 2. Goal */}
          <section className="card tile">
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
                  <button className="btn sm" onClick={() => setPreview(goal.id)}>
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

          {/* 3. Your path */}
          <section className="card tile">
            <span className="tile-label">
              <MapIcon size={14} aria-hidden="true" /> Your path
            </span>
            {journey ? (
              <>
                <PathStrip milestones={journey} compact to="/path" />
                <Link to="/path" className="small tile-foot">
                  See every step <ArrowRight size={14} className="inline-icon" aria-hidden="true" />
                </Link>
              </>
            ) : (
              <>
                <p className="muted" style={{ margin: 0 }}>
                  Set a goal and your path appears here
                </p>
                <Link to="/finder" className="btn sm tile-foot" style={{ alignSelf: 'flex-start' }}>
                  <Compass size={16} aria-hidden="true" /> {state.finder ? 'See my matches' : 'Find a direction'}
                </Link>
              </>
            )}
          </section>
        </div>

        {/* 4. Strengths */}
        <section className="card tile strengths-tile">
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
            <p className="small muted" style={{ margin: 0 }}>
              Practise to build your profile. <Link to="/practice">Go to practice</Link>
            </p>
          )}
        </section>
      </div>

      {preview && <FuturePreview careerId={preview} onClose={() => setPreview(null)} />}
    </Screen>
  )
}
