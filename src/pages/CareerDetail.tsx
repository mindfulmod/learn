import { useMemo, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Banknote, Clock, Eye, GraduationCap, Star, Target, TrendingUp } from 'lucide-react'
import { getBoard, STAGES, stageForGrade } from '../data/boards'
import { CLUSTER_NAMES, getCareer } from '../data/careers'
import { careerLife, formatPkr } from '../data/careerLife'
import { FuturePreview } from '../components/FuturePreview'
import { subjectsWithItems } from '../data/quizzes'
import { bandForGrade } from '../data/boards'
import { careerFit, hasSignal } from '../engine/careers'
import { goalPlan } from '../engine/plan'
import { modeFor } from '../engine/mode'
import { buildProfile } from '../engine/profile'
import { pathFor } from '../data/paths'
import { useStore } from '../store/store'
import { IconTile, LevelBadge, ScoreRing } from '../components/ui'
import { CLUSTER_META, tint } from '../design'
import { PageHeader } from '../components/PageHeader'

/** First clause of a summary, kept to about twelve words for the header lead. */
function oneLine(text: string, max = 12): string {
  const first = text.split(/(?<=\.)\s/)[0].replace(/\.$/, '')
  const words = first.split(/\s+/)
  if (words.length <= max) return `${first}.`
  const head = words.slice(0, max).join(' ').replace(/[,;:]$/, '')
  const comma = head.lastIndexOf(',')
  return comma > 20 ? `${head.slice(0, comma)}.` : `${head}…`
}

/** Drop bracketed numbers such as "(82%)" for the junior view. */
function plain(text: string): string {
  return text.replace(/\s*\([^)]*%[^)]*\)/g, '')
}

export function CareerDetail() {
  const { id } = useParams()
  const { state, setGoals } = useStore()
  const career = id ? getCareer(id) : undefined
  const p = state.profile!
  const profile = useMemo(() => buildProfile(state), [state])
  const [params, setParams] = useSearchParams()
  const [localPreview, setLocalPreview] = useState(false)
  const preview = localPreview || params.get('preview') === '1'
  const setPreview = (open: boolean) => {
    setLocalPreview(open)
    if (!open && params.has('preview')) setParams({}, { replace: true })
  }
  const closePreview = () => setPreview(false)
  if (!career) return <Navigate to="/careers" replace />

  const life = careerLife(career.id)
  const plan = goalPlan(career, p, profile)
  const fit = hasSignal(state) ? careerFit(career, state, profile) : null
  const isGoal = state.goals.includes(career.id)
  const board = getBoard(p.boardId)
  const currentStage = stageForGrade(p.boardId, p.grade)
  const currentIdx = STAGES.findIndex((s) => s.id === currentStage)
  const practisable = subjectsWithItems(bandForGrade(p.boardId, p.grade))

  const junior = modeFor(p) === 'junior'
  const hue = CLUSTER_META[career.cluster].hue

  const toggleGoal = () => {
    if (isGoal) setGoals(state.goals.filter((g) => g !== career.id))
    else setGoals([career.id, ...state.goals.filter((g) => g !== career.id)])
  }

  const fitItems = fit
    ? [...fit.reasons.slice(0, fit.cautions.length ? 2 : 3).map((r) => ({ r, good: true })), ...fit.cautions.slice(0, 1).map((r) => ({ r, good: false }))]
    : []

  const fitCard = fit && fitItems.length > 0 && (
    <div className={`card ${junior ? '' : 'pastel'} section`}>
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
    <div className="grid cols-2 section">
      <div className="card">
        <h3>A day in the life</h3>
        {oneLine(career.summary) !== career.summary && <p className="small muted">{career.summary}</p>}
        <p className="small">{career.dayInLife}</p>
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
        {plan.pathway.note && <p className="small muted">{plan.pathway.note}</p>}
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

  const years = life ? life.yearsOfStudy + (life.training?.years ?? 0) : 0

  return (
    <>
      <Link to="/careers" className="small" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 40, fontWeight: 600 }}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Explore
      </Link>
      <div style={tint(hue)}>
        <PageHeader
          themed
          hue={hue}
          variant={1}
          kicker={junior ? pathFor(career.cluster).title : CLUSTER_NAMES[career.cluster]}
          title={
            <span className="row" style={{ gap: 14, flexWrap: 'nowrap', alignItems: 'center' }}>
              <IconTile hue={hue} icon={CLUSTER_META[career.cluster].icon} />
              <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{career.title}</span>
            </span>
          }
          lead={oneLine(career.summary)}
          action={
            <button className="btn primary" onClick={() => setPreview(true)}>
              <Eye size={18} aria-hidden="true" />
              Peer into your future
            </button>
          }
        />
      </div>
      <div className="row section" style={{ alignItems: 'center' }}>
        <button className="btn" onClick={toggleGoal}>
          {isGoal ? <Star size={18} fill="currentColor" aria-hidden="true" /> : <Target size={18} aria-hidden="true" />}
          {isGoal ? 'Remove from my goals' : state.goals.length ? 'Make this my main goal' : 'Set as my goal'}
        </button>
        {fit && !junior && (
          <span className="row" style={{ gap: 10, marginLeft: 'auto' }}>
            <span className="small muted">Your fit</span>
            <ScoreRing value={fit.score} />
          </span>
        )}
      </div>
      {preview && <FuturePreview careerId={career.id} onClose={closePreview} />}

      {life && (
        <div className={`grid ${junior ? 'cols-2' : 'cols-3'} section`}>
          {statTile('study', 215, <GraduationCap size={22} />, junior ? `${years} years` : `${years} yrs`, junior ? 'of study' : 'study and training after grade 12')}
          {!junior &&
            statTile(
              'pay',
              160,
              <Banknote size={22} />,
              `Rs ${formatPkr(life.pay.entry[0])}–${formatPkr(life.pay.entry[1])}`,
              `per month to start · up to ${formatPkr(life.pay.experienced[1])} later`,
            )}
          {statTile(
            'demand',
            28,
            <TrendingUp size={22} />,
            <span style={{ textTransform: 'capitalize' }}>{life.demand}</span>,
            junior ? (
              'demand'
            ) : (
              <>
                demand · <Clock size={12} className="inline-icon" aria-hidden="true" />
                {life.hours.split(';')[0].split(',')[0].toLowerCase()}
              </>
            ),
          )}
        </div>
      )}

      {!junior && fitCard}
      {!junior && detailCards}

      <div className="card section">
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
        <details className="section">
          <summary>More details</summary>
          {fitCard}
          {detailCards}
        </details>
      )}

      {career.related.length > 0 && (
        <div className="section">
          <h3>Related careers</h3>
          <div className="chips">
            {career.related.map((r) => {
              const c = getCareer(r)
              return c ? (
                <Link key={r} to={`/careers/${r}`} className="chip">
                  {c.title}
                </Link>
              ) : null
            })}
          </div>
        </div>
      )}
    </>
  )
}
