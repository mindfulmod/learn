import { createElement, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Compass, Eye, Flame, Map as MapIcon, Play, Target, Zap, type LucideIcon } from 'lucide-react'
import { getCareer } from '../data/careers'
import { pathsForInterests } from '../data/paths'
import { subjectName } from '../data/subjects'
import { AREA_META, CLUSTER_META, subjectIcon, tint } from '../design'
import { careerFit, hasSignal, rankCareers } from '../engine/careers'
import { scoreFinder } from '../engine/finder'
import { buildJourney } from '../engine/journey'
import { modeFor } from '../engine/mode'
import { goalPlan } from '../engine/plan'
import { buildProfile, todayKey, type MasteryLevel } from '../engine/profile'
import { homeState, type HomeCard, type HomeIcon } from '../engine/xp'
import { useStore } from '../store/store'
import type { Career } from '../types'
import { PageHeader } from '../components/PageHeader'
import { PathStrip } from '../components/PathStrip'
import { FuturePreview } from '../components/FuturePreview'
import { Interests } from '../components/Interests'
import { IconTile, LevelBadge, Meter, ScoreRing } from '../components/ui'
import { Screen } from '../components/Screen'
import { ContextRail } from '../components/ContextRail'
import '../styles/home.css'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const POPULAR = ['doctor', 'software-engineer', 'lawyer']

const HOME_ICON: Record<HomeIcon, LucideIcon> = { compass: Compass, target: Target, eye: Eye, play: Play, check: Check, flame: Flame }
const LEVEL_WORD: Record<MasteryLevel, string> = { strong: 'Strong', developing: 'Growing', 'needs-work': 'Needs work', 'not-practised': 'New' }

interface Now {
  kicker: string
  greeting: string
  hour: number
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

export function Dashboard() {
  const { state } = useStore()
  const [now] = useState<Now>(() => {
    const d = new Date()
    const h = d.getHours()
    return {
      kicker: `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`,
      greeting: h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening',
      hour: h,
      today: todayKey(),
    }
  })
  return modeFor(state.profile) === 'junior' ? <JuniorHome now={now} /> : <SeniorHome now={now} />
}

// ------------------------------------------------------------------ Resume card

const SENIOR_KICKER: Record<HomeCard['state'], string> = {
  new: 'Start here',
  'pick-goal': 'Your matches',
  preview: 'Next step',
  'first-round': 'Your first round',
  resume: 'Pick up where you left off',
  'done-today': 'Today',
  'streak-risk': 'Before the day ends',
}

const JUNIOR_KICKER: Record<HomeCard['state'], string> = {
  new: 'Start here',
  'pick-goal': 'Your matches',
  preview: 'Next quest',
  'first-round': 'First quest',
  resume: 'Your quest',
  'done-today': 'Today',
  'streak-risk': 'Quick quest',
}

/** Junior copy: ten words or fewer per line, no XP, no percentages. */
function juniorCopy(card: HomeCard): { title: string; line: string; cta: string } {
  const career = card.meta?.careerId ? getCareer(card.meta.careerId) : undefined
  const name = career ? short(career.title).toLowerCase() : 'grown-up'
  const n = card.meta?.streak ?? 0
  switch (card.state) {
    case 'new':
      return { title: 'Find your direction', line: 'Eight fun questions. Three futures to look at.', cta: 'Play the finder' }
    case 'pick-goal':
      return { title: clipWords(card.title.replace('Your top match', 'Top match'), 6), line: 'Pick a dream to aim at.', cta: 'See my matches' }
    case 'preview':
      return { title: 'Peek at your future', line: `Your life as a ${name}, year by year.`, cta: 'Take a peek' }
    case 'first-round':
      return { title: card.title, line: `Your first round. ${card.meta?.questions ?? 8} quick questions.`, cta: 'Start round' }
    case 'resume':
      return { title: card.title, line: `Round ${(card.meta?.rounds ?? 0) + 1}. Last time: ${card.meta?.correct ?? 0} of ${card.meta?.total ?? 0}.`, cta: 'Next round' }
    case 'done-today':
      return { title: 'All done for today', line: n >= 2 ? `${n} days in a row. Well done!` : 'Your streak starts today.', cta: clipWords(card.cta, 5) }
    case 'streak-risk':
      return { title: 'Keep your streak', line: `5 minutes keeps ${n} days going.`, cta: 'Next round' }
  }
}

/** Dots for the last round: filled for each correct answer. */
function RoundDots({ correct, total }: { correct: number; total: number }) {
  return (
    <span className="resume-dots" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < correct ? 'on' : ''} />
      ))}
    </span>
  )
}

function cardIcon(card: HomeCard): LucideIcon {
  return card.meta?.subject && (card.state === 'resume' || card.state === 'first-round') ? subjectIcon(card.meta.subject) : HOME_ICON[card.icon]
}

function ResumeCard({ card, junior }: { card: HomeCard; junior?: boolean }) {
  const copy = junior ? juniorCopy(card) : { title: card.title, line: card.line, cta: card.cta }
  const kicker = (junior ? JUNIOR_KICKER : SENIOR_KICKER)[card.state]
  const done = card.state === 'done-today'
  const showDots = card.state === 'resume' && card.meta?.total
  const emptyDots = card.state === 'first-round' && card.meta?.questions

  return (
    <section className={`resume-card section is-${card.state}`} style={tint(card.hue)} aria-label="Today">
      <div className="resume-body">
        <span className="kicker">{kicker}</span>
        <h2>{copy.title}</h2>
        <p className="resume-line">{copy.line}</p>
        {showDots ? <RoundDots correct={card.meta!.correct ?? 0} total={card.meta!.total!} /> : null}
        {emptyDots ? <RoundDots correct={0} total={card.meta!.questions!} /> : null}
        <div className="resume-actions">
          {done ? (
            <>
              <span className="small muted">{junior ? 'Want one more?' : 'One more, if you like:'}</span>
              <Link to={card.to} className="btn sm">
                {copy.cta} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </>
          ) : (
            <Link to={card.to} className="btn primary">
              {copy.cta} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
      <span className="resume-icon" aria-hidden="true">
        {createElement(cardIcon(card), { size: junior ? 40 : 36, strokeWidth: 2 })}
      </span>
    </section>
  )
}

// ------------------------------------------------------------------ Junior

function JuniorHome({ now }: { now: Now }) {
  const { state } = useStore()
  const p = state.profile!
  const card = useMemo(() => homeState(state, now), [state, now])
  const paths = useMemo(() => pathsForInterests(state.interests), [state.interests])
  const firstName = p.name.split(' ')[0]

  return (
    <Screen header={<PageHeader kicker={now.kicker} title={`${now.greeting}, ${firstName}`} />} rail={<ContextRail />}>
      <div className="home-junior">
        <ResumeCard card={card} junior />

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
  const card = useMemo(() => homeState(state, now), [state, now])
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
        <ResumeCard card={card} />

        <div className="home-pair section">
          {/* Goal: one number at most (the fit ring). */}
          <section className="card tile">
            {goal && plan ? (
              <>
                <span className="tile-label">Your goal</span>
                <div className="goal-head">
                  <IconTile hue={CLUSTER_META[goal.cluster].hue} icon={CLUSTER_META[goal.cluster].icon} />
                  <div>
                    <h3>{short(goal.title)}</h3>
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
                  {card.state !== 'preview' && (
                    <button className="btn sm" onClick={() => setPreview(goal.id)}>
                      <Eye size={16} aria-hidden="true" /> Peer into your future
                    </button>
                  )}
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

          {/* Path */}
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
                  Set a goal and your path appears here.
                </p>
                <Link to="/careers" className="btn sm tile-foot" style={{ alignSelf: 'flex-start' }}>
                  <Compass size={16} aria-hidden="true" /> Browse careers
                </Link>
              </>
            )}
          </section>
        </div>

        {/* Strengths: words, not numbers; a zero state with a Start button. */}
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
                    right={LEVEL_WORD[s.level]}
                    tone="tinted"
                    hue={AREA_META[s.area].hue}
                  />
                )
              })}
            </div>
          ) : (
            <div className="strength-zero">
              <p style={{ margin: 0 }}>
                <b>No rounds yet</b>
                <span className="small muted"> · Your strengths show up after one round.</span>
              </p>
              <Link to="/practice" className="btn sm">
                Start <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>
      </div>

      {preview && <FuturePreview careerId={preview} onClose={() => setPreview(null)} />}
    </Screen>
  )
}
