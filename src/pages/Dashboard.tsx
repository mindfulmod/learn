import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBoard, gradeLabel, stageForGrade } from '../data/boards'
import { getCareer } from '../data/careers'
import { TRAIT_NAMES } from '../data/discovery'
import { getStream } from '../data/streams'
import { subjectName } from '../data/subjects'
import { careerFit, rankCareers } from '../engine/careers'
import { topTraits } from '../engine/discovery'
import { buildFeedback } from '../engine/feedback'
import { goalPlan } from '../engine/plan'
import { buildProfile, streak } from '../engine/profile'
import { useStore } from '../store/store'
import { FeedbackCard, LevelBadge, ScoreRing } from '../components/ui'

export function Dashboard() {
  const { state } = useStore()
  const p = state.profile!
  const profile = useMemo(() => buildProfile(state), [state])
  const feedback = useMemo(() => buildFeedback(state, profile), [state, profile])
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined
  const plan = goal ? goalPlan(goal, p, profile) : null
  const fit = goal ? careerFit(goal, state, profile) : null
  const suggestions = useMemo(() => (state.discovery || state.attempts.length ? rankCareers(state, profile).slice(0, 3) : []), [state, profile])
  const st = streak(state.activeDays)
  const board = getBoard(p.boardId)
  const stream = getStream(p.streamId)
  const stage = stageForGrade(p.boardId, p.grade)
  const [hour] = useState(() => new Date().getHours())
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      <section className="hero section">
        <p className="small" style={{ marginBottom: 4, opacity: 0.9 }}>
          {greeting}
        </p>
        <h1>{p.name.split(' ')[0]}, here is your plan</h1>
        <p>
          {gradeLabel(p.boardId, p.grade)} · {board.shortName} · {stream ? stream.shortName : board.stageLabels[stage]}
        </p>
        <div className="row">
          <Link to="/practice" className="btn primary">
            Practise today
          </Link>
          {!state.discovery && (
            <Link to="/discover" className="btn" style={{ background: 'rgb(255 255 255 / 0.15)', color: '#fff', borderColor: 'rgb(255 255 255 / 0.4)' }}>
              Take discovery quiz
            </Link>
          )}
        </div>
      </section>

      <div className="grid cols-3 section">
        <div className="card stat">
          <b>{st.current}</b>
          <span>day streak{st.best > st.current ? ` · best ${st.best}` : ''}</span>
        </div>
        <div className="card stat">
          <b>{profile.totalItems}</b>
          <span>questions practised</span>
        </div>
        <div className="card stat">
          <b>{Object.values(profile.subjects).filter((s) => s.level === 'strong').length}</b>
          <span>strong subjects</span>
        </div>
      </div>

      <div className="grid cols-2 section">
        <section>
          <div className="section-head">
            <h2>Your goal</h2>
            <Link to="/careers" className="small">
              {goal ? 'Change' : 'Choose'}
            </Link>
          </div>
          {goal && plan && fit ? (
            <div className="card">
              <div className="row between" style={{ marginBottom: 12 }}>
                <div>
                  <h3 style={{ marginBottom: 2 }}>{goal.title}</h3>
                  <span className="small muted">{plan.stageLabel} stage</span>
                </div>
                <ScoreRing value={fit.score} />
              </div>
              <p className="small muted">
                {fit.score >= 70 ? 'Strong fit so far.' : fit.score >= 50 ? 'Reasonable fit; keep building the key subjects.' : 'Early days: practise the must-have subjects to see where you stand.'}
              </p>
              {plan.recommendedStreamName && (
                <p className="small">
                  <b>Group to aim for:</b> {plan.recommendedStreamName}
                  {plan.streamMatches === true && <span className="badge good" style={{ marginLeft: 8 }}>You are on track</span>}
                  {plan.streamMatches === false && <span className="badge bad" style={{ marginLeft: 8 }}>Different from yours</span>}
                </p>
              )}
              <h4 className="small" style={{ marginTop: 12 }}>Must-have subjects</h4>
              <ul className="list">
                {plan.subjects
                  .filter((s) => s.importance === 'must')
                  .map((s) => (
                    <li key={s.subjectId} className="row between">
                      <Link to={`/practice/${s.subjectId}`}>{s.name}</Link>
                      <LevelBadge level={s.level} accuracy={s.accuracy} />
                    </li>
                  ))}
              </ul>
              {plan.currentFocus.length > 0 && (
                <>
                  <h4 className="small" style={{ marginTop: 12 }}>Focus this stage</h4>
                  <ul className="small">
                    {plan.currentFocus.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </>
              )}
              <Link to={`/careers/${goal.id}`} className="btn sm" style={{ marginTop: 8 }}>
                Full roadmap
              </Link>
            </div>
          ) : (
            <div className="card soft">
              <h3>No goal set yet</h3>
              <p className="small muted">A goal turns the curriculum into a roadmap: which group to choose, which subjects matter most, which tests to prepare for.</p>
              {suggestions.length > 0 ? (
                <>
                  <p className="small">
                    <b>Suggested for you:</b>
                  </p>
                  <ul className="list">
                    {suggestions.map((s) => (
                      <li key={s.career.id} className="row between">
                        <Link to={`/careers/${s.career.id}`}>{s.career.title}</Link>
                        <span className="badge primary">{s.score}% fit</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link to="/discover" className="btn primary">
                  Discover what suits you
                </Link>
              )}
            </div>
          )}
        </section>

        <section>
          <div className="section-head">
            <h2>Your strengths</h2>
            <Link to="/progress" className="small">
              Details
            </Link>
          </div>
          <div className="card">
            {state.discovery && (
              <p className="small" style={{ marginBottom: 12 }}>
                <b>You are a:</b> {topTraits(state.discovery.traits, 2).map((t) => TRAIT_NAMES[t]).join(' and ')}
              </p>
            )}
            {Object.keys(profile.subjects).length ? (
              <ul className="list">
                {Object.values(profile.subjects)
                  .sort((a, b) => b.accuracy - a.accuracy)
                  .slice(0, 5)
                  .map((s) => (
                    <li key={s.subjectId} className="row between">
                      <span>
                        {subjectName(s.subjectId)}{' '}
                        {s.trend === 'up' && <span className="badge good">improving</span>}
                        {s.trend === 'down' && <span className="badge warn">slipping</span>}
                      </span>
                      <LevelBadge level={s.level} accuracy={s.accuracy} />
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="small muted" style={{ margin: 0 }}>
                Practise a subject to start building your strength profile.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Coach's notes</h2>
        </div>
        <div className="stack">
          {feedback.map((f, i) => (
            <FeedbackCard key={i} item={f} />
          ))}
        </div>
      </section>
    </>
  )
}
