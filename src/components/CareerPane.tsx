import { useMemo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Coins, Eye, GraduationCap, Star, Target, TrendingUp } from 'lucide-react'
import { bandForGrade, getBoard, STAGES, stageForGrade } from '../data/boards'
import { CLUSTER_NAMES, getCareer } from '../data/careers'
import { careerLife } from '../data/careerLife'
import { pathFor } from '../data/paths'
import { subjectsWithItems } from '../data/quizzes'
import { CLUSTER_META, tint } from '../design'
import { careerFit, hasSignal } from '../engine/careers'
import { modeFor } from '../engine/mode'
import { goalPlan } from '../engine/plan'
import { buildProfile } from '../engine/profile'
import { useStore } from '../store/store'
import { IconTile, LevelBadge, ScoreRing } from './ui'
import { PayBand, PayCoins } from './PayBand'
import '../styles/careers.css'

/** Split text into sentences and keep the first `n` (word budget: two at most). */
function sentences(text: string, n = 2): string {
  const parts = text.split(/(?<=[.!?])\s+/)
  return parts.slice(0, n).join(' ')
}

/** First sentence, capped at `max` words. */
function firstSentence(text: string, max = 14): string {
  const s = sentences(text, 1).trim()
  const words = s.split(/\s+/)
  if (words.length <= max) return s
  return words.slice(0, max).join(' ').replace(/[.,;:!?]+$/, '') + '…'
}

/** Title without the bracketed suffix, e.g. "Doctor (MBBS)" becomes "Doctor". */
function shortTitle(title: string): string {
  return title.split(' (')[0]
}

/** Drop bracketed numbers such as "(82%)" for the junior view. */
function plain(text: string): string {
  return text.replace(/\s*\([^)]*%[^)]*\)/g, '')
}

/**
 * One career, inline. Used inside the Explore detail pane and on the
 * /careers/:id deep-link page so both read the same.
 */
export function CareerPane({
  careerId,
  onPreview,
  relatedHref,
  onRelated,
  asPage,
}: {
  careerId: string
  onPreview: () => void
  /** Link target for a related career (deep-link page). */
  relatedHref?: (id: string) => string
  /** Click handler for a related career (Explore pane). */
  onRelated?: (id: string) => void
  /** Renders the title as the page h1. */
  asPage?: boolean
}) {
  const { state, setGoals } = useStore()
  const profile = useMemo(() => buildProfile(state), [state])
  const career = getCareer(careerId)
  const p = state.profile
  if (!career || !p) return null

  const life = careerLife(career.id)
  const plan = goalPlan(career, p, profile)
  const fit = hasSignal(state) ? careerFit(career, state, profile) : null
  const isGoal = state.goals.includes(career.id)
  const board = getBoard(p.boardId)
  const currentStage = stageForGrade(p.boardId, p.grade)
  const currentIdx = STAGES.findIndex((s) => s.id === currentStage)
  const practisable = subjectsWithItems(bandForGrade(p.boardId, p.grade))
  const junior = modeFor(p) === 'junior'
  const meta = CLUSTER_META[career.cluster]
  const hue = meta.hue
  const years = life ? life.yearsOfStudy + (life.training?.years ?? 0) : 0
  const Title = asPage ? 'h1' : 'h2'

  const toggleGoal = () => {
    if (isGoal) setGoals(state.goals.filter((g) => g !== career.id))
    else setGoals([career.id, ...state.goals.filter((g) => g !== career.id)])
  }

  const fitItems = fit
    ? [...fit.reasons.slice(0, fit.cautions.length ? 2 : 3).map((r) => ({ r, good: true })), ...fit.cautions.slice(0, 1).map((r) => ({ r, good: false }))]
    : []

  const fitCard = fit && fitItems.length > 0 && (
    <div className="card">
      <h3>{junior ? 'Why it fits you' : `Why ${fit.score}% fit`}</h3>
      <ul className="list small">
        {fitItems.map(({ r, good }) => (
          <li key={r}>
            <span className={`badge ${good ? 'good' : 'warn'}`} style={{ marginRight: 8 }}>
              {good ? '+' : '!'}
            </span>
            {junior ? plain(r) : r}
          </li>
        ))}
      </ul>
      {!state.discovery && <p className="small muted">Take the discovery quiz for a fuller picture.</p>}
    </div>
  )

  const detailCards = (
    <div className="cr-two">
      <div className="card">
        <h3>A day in the life</h3>
        <p className="small">{sentences(career.dayInLife, 2)}</p>
        <h4>Degrees</h4>
        <ul className="small">
          {career.degrees.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <h4>Entrance tests</h4>
        <ul className="small">
          {career.entranceTests.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <h4>Where people study this</h4>
        <p className="small muted">{career.institutions.join(' · ')}</p>
      </div>

      <div className="card soft">
        <h3>Your path on the {board.shortName} track</h3>
        <ul className="list small">
          <li>
            <b>{board.stageLabels.secondary}:</b> {plan.pathway.secondary}
          </li>
          <li>
            <b>{board.stageLabels['higher-secondary']}:</b> {plan.pathway.higherSecondary}
          </li>
        </ul>
        {plan.pathway.note && <p className="small muted">{sentences(plan.pathway.note, 2)}</p>}
        {plan.streamMatches === true && <span className="badge good">Your current group fits</span>}
        {plan.streamMatches === false && <span className="badge bad">Your group lacks a must-have subject</span>}

        <h4 style={{ marginTop: 14 }}>Subjects that matter</h4>
        <ul className="list">
          {plan.subjects.map((s) => (
            <li key={s.subjectId} className="row between">
              <span>
                {practisable.includes(s.subjectId) ? <Link to={`/practice/${s.subjectId}`}>{s.name}</Link> : s.name}{' '}
                <span className={`chip ${s.importance === 'must' ? 'must' : ''}`}>{s.importance === 'must' ? 'must-have' : 'helpful'}</span>
              </span>
              <LevelBadge level={s.level} accuracy={junior ? null : s.accuracy} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  const statTile = (key: string, tileHue: number, icon: ReactNode, big: ReactNode, sub: ReactNode) => (
    <div key={key} className="card pastel stat" style={tint(tileHue)}>
      <span className="icon" style={{ background: 'var(--surface)' }}>
        {icon}
      </span>
      <div>
        <b>{big}</b>
        <span>{sub}</span>
      </div>
    </div>
  )

  return (
    <div className="cr-pane" style={tint(hue)}>
      <section className="card pastel cr-head">
        <div className="cr-head-top">
          <IconTile hue={hue} icon={meta.icon} />
          <div className="cr-head-text">
            <span className="badge tinted">{junior ? pathFor(career.cluster).title : CLUSTER_NAMES[career.cluster]}</span>
            <Title className="cr-title">{junior ? shortTitle(career.title) : career.title}</Title>
          </div>
          {fit && !junior && (
            <span className="cr-fit" title="Your fit">
              <ScoreRing value={fit.score} />
            </span>
          )}
        </div>
        <p className="cr-summary">{junior ? firstSentence(career.summary, 14) : sentences(career.summary, 2)}</p>
        <div className="cr-actions">
          <button type="button" className="btn primary" onClick={onPreview}>
            <Eye size={18} aria-hidden="true" />
            Peer into your future
          </button>
          <button type="button" className="btn" onClick={toggleGoal} aria-pressed={isGoal}>
            {isGoal ? <Star size={18} fill="currentColor" aria-hidden="true" /> : <Target size={18} aria-hidden="true" />}
            {isGoal ? 'Remove from my goals' : state.goals.length ? 'Make this my main goal' : 'Set as my goal'}
          </button>
        </div>
      </section>

      {life && !junior && (
        <section className="card cr-pay" aria-label="Pay in Pakistan">
          <PayBand life={life} />
        </section>
      )}

      {life && (
        <div className="cr-stats">
          {statTile('study', 215, <GraduationCap size={22} />, junior ? `${years} years` : `${years} yrs`, junior ? 'of study' : 'study and training after grade 12')}
          {junior && statTile('pay', 42, <Coins size={22} />, <PayCoins life={life} />, 'when grown up')}
          {statTile('demand', 28, <TrendingUp size={22} />, <span style={{ textTransform: 'capitalize' }}>{life.demand}</span>, junior ? 'demand' : 'demand in Pakistan')}
          {!junior &&
            statTile(
              'hours',
              258,
              <Clock size={22} />,
              <span style={{ textTransform: 'capitalize' }}>{life.hours.split(';')[0].split(',')[0].toLowerCase()}</span>,
              'typical hours',
            )}
        </div>
      )}

      {!junior && fitCard}
      {!junior && detailCards}

      <div className="card">
        <h3>Roadmap by stage</h3>
        <ul className="timeline">
          {career.roadmap.map((r) => {
            const idx = STAGES.findIndex((s) => s.id === r.stage)
            const cls = idx < currentIdx ? 'done' : idx === currentIdx ? 'current' : ''
            return (
              <li key={r.stage} className={cls}>
                <b>
                  {board.stageLabels[r.stage]}
                  {idx === currentIdx && (
                    <span className="badge primary" style={{ marginLeft: 8 }}>
                      You are here
                    </span>
                  )}
                </b>
                <ul className="small" style={{ marginTop: 4 }}>
                  {(junior ? r.focus.filter((f) => !f.includes('%')).slice(0, 2) : r.focus).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>

      {junior && (
        <details className="cr-more">
          <summary>More details</summary>
          <div className="cr-more-body">
            {fitCard}
            {detailCards}
          </div>
        </details>
      )}

      {career.related.length > 0 && (
        <div>
          <h3>Related careers</h3>
          <div className="chips">
            {career.related.map((r) => {
              const c = getCareer(r)
              if (!c) return null
              const label = junior ? shortTitle(c.title) : c.title
              return onRelated ? (
                <button key={r} type="button" className="chip cr-chip" onClick={() => onRelated(r)}>
                  {label}
                </button>
              ) : (
                <Link key={r} to={relatedHref ? relatedHref(r) : `/careers/${r}`} className="chip">
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
