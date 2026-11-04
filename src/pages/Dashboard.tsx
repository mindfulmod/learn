import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBoard, gradeLabel, stageForGrade } from '../data/boards'
import { getCareer } from '../data/careers'
import { TRAIT_NAMES } from '../data/discovery'
import { getStream } from '../data/streams'
import { subjectName } from '../data/subjects'
import { CLUSTER_META, TRAIT_META, tint } from '../design'
import { careerFit, rankCareers } from '../engine/careers'
import { topTraits } from '../engine/discovery'
import { buildFeedback } from '../engine/feedback'
import { goalPlan } from '../engine/plan'
import { buildProfile, streak } from '../engine/profile'
import { useStore } from '../store/store'
import { FeedbackCard, LevelBadge, ScoreRing, SubjectTile, Tile } from '../components/ui'

const ART = ['🚀', '🎒', '🧠', '🌱', '🏆', '✨']

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
  const art = ART[(p.name.length + p.grade) % ART.length]
  const strongCount = Object.values(profile.subjects).filter((s) => s.level === 'strong').length

  return (
    <>
      <section className="hero section">
        <span className="eyebrow">
          {greeting} ☀️
        </span>
        <h1>{p.name.split(' ')[0]}, let's build your path</h1>
        <p>
          {gradeLabel(p.boardId, p.grade)} · {board.shortName} · {stream ? stream.shortName : board.stageLabels[stage]}
        </p>
        <div className="row" style={{ marginTop: 6 }}>
          <Link to="/practice" className="btn primary">
            Practise today
          </Link>
          {!state.discovery && (
            <Link to="/discover" className="btn ghost">
              Discover your strengths
            </Link>
          )}
        </div>
        <span className="hero-art" aria-hidden="true">
          {art}
        </span>
      </section>

      <div className="grid cols-3 section">
        <div className="card stat" style={tint(28)}>
          <span className="icon">🔥</span>
          <div>
            <b>{st.current}</b>
            <span>day streak{st.best > st.current ? ` · best ${st.best}` : ''}</span>
          </div>
        </div>
        <div className="card stat" style={tint(215)}>
          <span className="icon">🧩</span>
          <div>
            <b>{profile.totalItems}</b>
            <span>questions practised</span>
          </div>
        </div>
        <div className="card stat" style={tint(160)}>
          <span className="icon">🏅</span>
          <div>
            <b>{strongCount}</b>
            <span>strong subject{strongCount === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>

      <div className="grid cols-2 section">
        <section>
          <div className="section-head">
            <h2>Your goal</h2>
            <Link to="/careers">{goal ? 'Change' : 'Choose'}</Link>
          </div>
          {goal && plan && fit ? (
            <div className="card">
              <div className="row between" style={{ marginBottom: 14 }}>
                <div className="row" style={{ gap: 12 }}>
                  <Tile hue={CLUSTER_META[goal.cluster].hue}>{CLUSTER_META[goal.cluster].emoji}</Tile>
                  <div>
                    <h3 style={{ marginBottom: 2 }}>{goal.title}</h3>
                    <span className="small muted">{plan.stageLabel} stage</span>
                  </div>
                </div>
                <ScoreRing value={fit.score} />
              </div>
              <p className="small" style={{ color: 'var(--text-2)' }}>
                {fit.score >= 70 ? 'Strong fit so far. Keep going.' : fit.score >= 50 ? 'Reasonable fit. Keep building the key subjects.' : 'Early days. Practise the must-have subjects to see where you stand.'}
              </p>
              {plan.recommendedStreamName && (
                <p className="small">
                  <b>Group to aim for:</b> {plan.recommendedStreamName}{' '}
                  {plan.streamMatches === true && <span className="badge good">On track</span>}
                  {plan.streamMatches === false && <span className="badge bad">Different from yours</span>}
                </p>
              )}
              <h4 style={{ marginTop: 14 }}>Must-have subjects</h4>
              <ul className="list">
                {plan.subjects
                  .filter((s) => s.importance === 'must')
                  .map((s) => (
                    <li key={s.subjectId} className="row between">
                      <Link to={`/practice/${s.subjectId}`} style={{ fontWeight: 600 }}>
                        {s.name}
                      </Link>
                      <LevelBadge level={s.level} accuracy={s.accuracy} />
                    </li>
                  ))}
              </ul>
              {plan.currentFocus.length > 0 && (
                <>
                  <h4 style={{ marginTop: 14 }}>Focus this stage</h4>
                  <ul className="small" style={{ color: 'var(--text-2)' }}>
                    {plan.currentFocus.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </>
              )}
              <Link to={`/careers/${goal.id}`} className="btn sm" style={{ marginTop: 6 }}>
                Full roadmap →
              </Link>
            </div>
          ) : (
            <div className="card soft">
              <div className="row" style={{ gap: 12, marginBottom: 10 }}>
                <Tile hue={258}>🧭</Tile>
                <h3 style={{ margin: 0 }}>No goal yet</h3>
              </div>
              <p className="small" style={{ color: 'var(--text-2)' }}>
                A goal turns the curriculum into a roadmap: which group to choose, which subjects matter most, which tests to prepare for.
              </p>
              {suggestions.length > 0 ? (
                <>
                  <h4>Suggested for you</h4>
                  <ul className="list">
                    {suggestions.map((s) => (
                      <li key={s.career.id} className="row between">
                        <Link to={`/careers/${s.career.id}`} style={{ fontWeight: 600 }}>
                          {CLUSTER_META[s.career.cluster].emoji} {s.career.title}
                        </Link>
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
            <Link to="/progress">Details</Link>
          </div>
          <div className="card">
            {state.discovery && (
              <div className="chips" style={{ marginBottom: 14 }}>
                {topTraits(state.discovery.traits, 2).map((t) => (
                  <span key={t} className="chip tinted" style={tint(TRAIT_META[t].hue)}>
                    {TRAIT_META[t].emoji} {TRAIT_NAMES[t]}
                  </span>
                ))}
              </div>
            )}
            {Object.keys(profile.subjects).length ? (
              <ul className="list">
                {Object.values(profile.subjects)
                  .sort((a, b) => b.accuracy - a.accuracy)
                  .slice(0, 5)
                  .map((s) => (
                    <li key={s.subjectId} className="row between">
                      <span className="row" style={{ gap: 10 }}>
                        <SubjectTile subjectId={s.subjectId} />
                        <span style={{ fontWeight: 600 }}>
                          {subjectName(s.subjectId)}
                          {s.trend === 'up' && <span className="badge good" style={{ marginLeft: 6 }}>↑ improving</span>}
                          {s.trend === 'down' && <span className="badge warn" style={{ marginLeft: 6 }}>↓ slipping</span>}
                        </span>
                      </span>
                      <LevelBadge level={s.level} accuracy={s.accuracy} />
                    </li>
                  ))}
              </ul>
            ) : (
              <div className="empty" style={{ padding: '18px 0 6px' }}>
                <Tile hue={160} large>
                  🧩
                </Tile>
                <p className="small muted" style={{ margin: 0 }}>
                  Practise a subject to start building your strength profile.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Your coach says</h2>
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
