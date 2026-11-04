import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getBoard, STAGES, stageForGrade } from '../data/boards'
import { CLUSTER_NAMES, getCareer } from '../data/careers'
import { subjectsWithItems } from '../data/quizzes'
import { bandForGrade } from '../data/boards'
import { careerFit, hasSignal } from '../engine/careers'
import { goalPlan } from '../engine/plan'
import { buildProfile } from '../engine/profile'
import { useStore } from '../store/store'
import { LevelBadge, ScoreRing } from '../components/ui'

export function CareerDetail() {
  const { id } = useParams()
  const { state, setGoals } = useStore()
  const career = id ? getCareer(id) : undefined
  const p = state.profile!
  const profile = useMemo(() => buildProfile(state), [state])
  if (!career) return <Navigate to="/careers" replace />

  const plan = goalPlan(career, p, profile)
  const fit = hasSignal(state) ? careerFit(career, state, profile) : null
  const isGoal = state.goals.includes(career.id)
  const board = getBoard(p.boardId)
  const currentStage = stageForGrade(p.boardId, p.grade)
  const currentIdx = STAGES.findIndex((s) => s.id === currentStage)
  const practisable = subjectsWithItems(bandForGrade(p.boardId, p.grade))

  const toggleGoal = () => {
    if (isGoal) setGoals(state.goals.filter((g) => g !== career.id))
    else setGoals([career.id, ...state.goals.filter((g) => g !== career.id)])
  }

  return (
    <>
      <Link to="/careers" className="small">
        ← All careers
      </Link>
      <div className="row between" style={{ marginTop: 8, marginBottom: 4 }}>
        <div>
          <span className="badge">{CLUSTER_NAMES[career.cluster]}</span>
          <h1 style={{ marginTop: 6 }}>{career.title}</h1>
        </div>
        {fit && <ScoreRing value={fit.score} />}
      </div>
      <p className="muted">{career.summary}</p>
      <div className="row section">
        <button className={`btn ${isGoal ? '' : 'primary'}`} onClick={toggleGoal}>
          {isGoal ? 'Remove from my goals' : state.goals.length ? 'Make this my main goal' : 'Set as my goal'}
        </button>
      </div>

      {fit && (fit.reasons.length > 0 || fit.cautions.length > 0) && (
        <div className="card section">
          <h3>Why {fit.score}% fit</h3>
          <ul className="small">
            {fit.reasons.map((r) => (
              <li key={r}>✅ {r}</li>
            ))}
            {fit.cautions.map((r) => (
              <li key={r}>⚠️ {r}</li>
            ))}
          </ul>
          {!state.discovery && <p className="small muted">Take the discovery quiz for a fuller picture.</p>}
        </div>
      )}

      <div className="grid cols-2 section">
        <div className="card">
          <h3>A day in the life</h3>
          <p className="small">{career.dayInLife}</p>
          <h4 className="small">Degrees</h4>
          <ul className="small">
            {career.degrees.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <h4 className="small">Entrance tests</h4>
          <ul className="small">
            {career.entranceTests.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <h4 className="small">Where people study this</h4>
          <p className="small muted">{career.institutions.join(' · ')}</p>
        </div>

        <div className="card">
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
          {plan.streamMatches === false && <span className="badge bad">Your current group does not include every must-have subject</span>}

          <h4 className="small" style={{ marginTop: 14 }}>Subjects that matter</h4>
          <ul className="list">
            {plan.subjects.map((s) => (
              <li key={s.subjectId} className="row between">
                <span>
                  {practisable.includes(s.subjectId) ? <Link to={`/practice/${s.subjectId}`}>{s.name}</Link> : s.name}{' '}
                  <span className={`chip ${s.importance === 'must' ? 'must' : ''}`}>{s.importance === 'must' ? 'must-have' : 'helpful'}</span>
                </span>
                <LevelBadge level={s.level} accuracy={s.accuracy} />
              </li>
            ))}
          </ul>
        </div>
      </div>

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
                  {idx === currentIdx && <span className="badge primary" style={{ marginLeft: 8 }}>You are here</span>}
                </b>
                <ul className="small" style={{ marginTop: 4 }}>
                  {r.focus.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>

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
