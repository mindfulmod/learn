import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Clock, Compass, Eye, Flame, Map as MapIcon, Sparkles, Target, Trophy, X, Zap } from 'lucide-react'
import { getCareer } from '../data/careers'
import { TRAIT_NAMES } from '../data/discovery'
import { getSubject, subjectName } from '../data/subjects'
import { AREA_META, CLUSTER_META, TRAIT_META, subjectIcon, tint } from '../design'
import { careerFit, hasSignal, rankCareers } from '../engine/careers'
import { topTraits } from '../engine/discovery'
import { buildFeedback } from '../engine/feedback'
import { scoreFinder } from '../engine/finder'
import { buildJourney } from '../engine/journey'
import { goalPlan } from '../engine/plan'
import { buildProfile, streak } from '../engine/profile'
import { levelFor, nextStep, totalXp, weeklyMissions, type NextStep } from '../engine/xp'
import { useStore } from '../store/store'
import type { Career } from '../types'
import { PageHeader } from '../components/PageHeader'
import { Ring } from '../components/Ring'
import { Orb } from '../components/Orb'
import { PathStrip } from '../components/PathStrip'
import { FuturePreview } from '../components/FuturePreview'
import { FeedbackCard, IconTile, LevelBadge, Meter, ScoreRing } from '../components/ui'
import '../styles/home.css'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const KIND_HUE: Record<Exclude<NextStep['kind'], 'practice'>, number> = { finder: 320, preview: 215, discovery: 45, goal: 258 }
const KIND_VARIANT: Record<NextStep['kind'], number> = { practice: 0, finder: 1, preview: 2, discovery: 1, goal: 0 }
const POPULAR = ['doctor', 'software-engineer', 'lawyer']

function short(title: string): string {
  return title.split(' (')[0]
}

export function Dashboard() {
  const { state } = useStore()
  const p = state.profile!
  const profile = useMemo(() => buildProfile(state), [state])
  const feedback = useMemo(() => buildFeedback(state, profile).slice(0, 3), [state, profile])
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

  const [now] = useState(() => {
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

  const [showGuide, setShowGuide] = useState(() => {
    try {
      return localStorage.getItem('rahnuma.guide') !== 'done'
    } catch {
      return true
    }
  })
  const dismissGuide = () => {
    setShowGuide(false)
    try {
      localStorage.setItem('rahnuma.guide', 'done')
    } catch {
      // Storage may be unavailable; the strip just reappears next visit.
    }
  }

  const [preview, setPreview] = useState<string | null>(null)

  const stepSubject = step.kind === 'practice' && step.subjectId ? getSubject(step.subjectId) : undefined
  const stepHue = step.kind === 'practice' ? (stepSubject ? AREA_META[stepSubject.area].hue : 258) : KIND_HUE[step.kind]
  const active = new Set(state.activeDays)
  const doneCount = missions.filter((m) => m.done).length
  const firstName = p.name.split(' ')[0]

  return (
    <>
      <PageHeader kicker={now.kicker} title={`${now.greeting}, ${firstName}`} lead={goal ? `Aiming for ${short(goal.title)}` : "No goal yet. Let's find one."} />

      {showGuide && (
        <section className="card accent guide-strip" aria-label="How Rahnuma works">
          <h3>How Rahnuma works</h3>
          <div className="guide-steps">
            <Link to="/finder">
              <Compass size={18} aria-hidden="true" /> Find a direction
            </Link>
            <ArrowRight size={16} className="sep" aria-hidden="true" />
            <Link to="/careers">
              <Eye size={18} aria-hidden="true" /> Peer into the future
            </Link>
            <ArrowRight size={16} className="sep" aria-hidden="true" />
            <Link to="/practice">
              <Target size={18} aria-hidden="true" /> Train for it
            </Link>
          </div>
          <button className="btn sm" onClick={dismissGuide} aria-label="Dismiss guide">
            <X size={14} aria-hidden="true" /> Got it
          </button>
        </section>
      )}

      <div className="bento section">
        {/* 1. Next step */}
        <section className="tile hero-tile span-2 row-2">
          <Orb hue={stepHue} size={220} variant={KIND_VARIANT[step.kind]} />
          <div className="hero-copy">
            <span className="tile-label" style={{ color: 'rgb(255 255 255 / 0.85)' }}>
              Next step
            </span>
            <h2>{step.title}</h2>
            <p>{step.detail}</p>
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
          <span className="small muted tile-foot">{st.current >= 3 ? 'Keep the chain going' : st.current === 0 ? 'A round today restarts it' : 'Nice start'}</span>
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
              <span className="small muted">{level.next ? `${xp} XP · ${level.next - xp} to ${levelFor(level.next).name}` : `${xp} XP · Top level`}</span>
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
                    <Link key={s.subjectId} to={`/practice/${s.subjectId}`}>
                      {s.name}
                      <LevelBadge level={s.level} accuracy={s.accuracy} />
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
                    <span>{m.detail}</span>
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
          {state.discovery && (
            <div className="chips">
              {topTraits(state.discovery.traits, 2).map((t) => {
                const TraitIcon = TRAIT_META[t].icon
                return (
                  <span key={t} className="chip tinted" style={tint(TRAIT_META[t].hue)}>
                    <TraitIcon size={14} className="inline-icon" aria-hidden="true" />
                    {TRAIT_NAMES[t]}
                  </span>
                )
              })}
            </div>
          )}
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
