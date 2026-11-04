import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AREA_NAMES } from '../data/discovery'
import { subjectName } from '../data/subjects'
import { AREAS } from '../engine/discovery'
import { buildFeedback } from '../engine/feedback'
import { buildProfile, streak } from '../engine/profile'
import { useStore } from '../store/store'
import { Empty, FeedbackCard, LevelBadge, Meter } from '../components/ui'
import { AREA_META, subjectEmoji, tint } from '../design'

export function Progress() {
  const { state } = useStore()
  const profile = useMemo(() => buildProfile(state), [state])
  const feedback = useMemo(() => buildFeedback(state, profile), [state, profile])
  const st = streak(state.activeDays)
  const subjects = Object.values(profile.subjects).sort((a, b) => b.accuracy - a.accuracy)
  const recent = [...state.attempts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12)

  return (
    <>
      <span className="kicker">Growth</span>
      <h1>Progress</h1>
      <p className="lead">Where you stand, where you are growing, and what to do next.</p>

      <div className="grid cols-3 section">
        <div className="card stat" style={tint(258)}>
          <span className="icon">🧩</span>
          <div>
            <b>{state.attempts.length}</b>
            <span>practice rounds</span>
          </div>
        </div>
        <div className="card stat" style={tint(160)}>
          <span className="icon">🎯</span>
          <div>
            <b>{profile.totalItems ? Math.round((state.attempts.reduce((s, a) => s + a.correct, 0) / profile.totalItems) * 100) : 0}%</b>
            <span>overall accuracy</span>
          </div>
        </div>
        <div className="card stat" style={tint(28)}>
          <span className="icon">🔥</span>
          <div>
            <b>{st.current}</b>
            <span>day streak · best {st.best}</span>
          </div>
        </div>
      </div>

      {!subjects.length ? (
        <Empty emoji="🧩" title="No practice yet" body="Your strength profile builds from practice rounds. Each one is eight questions." action={{ to: '/practice', label: 'Start practising' }} />
      ) : (
        <div className="grid cols-2 section">
          <div className="card">
            <h3>Subjects</h3>
            <div className="stack">
              {subjects.map((s) => (
                <div key={s.subjectId}>
                  <Meter
                    label={
                      <span className="row" style={{ gap: 8 }}>
                        <span aria-hidden="true">{subjectEmoji(s.subjectId, s.area)}</span>
                        <Link to={`/practice/${s.subjectId}`}>{subjectName(s.subjectId)}</Link>
                        {s.trend === 'up' && <span className="badge good">↑</span>}
                        {s.trend === 'down' && <span className="badge warn">↓</span>}
                      </span>
                    }
                    value={s.accuracy}
                    right={<LevelBadge level={s.level} accuracy={s.accuracy} />}
                  />
                  <p className="small muted" style={{ margin: '4px 0 0' }}>
                    {s.items} questions · confidence {s.confidence}
                    {s.hardAccuracy !== null ? ` · hard questions ${s.hardAccuracy}%` : ''}
                    {s.weakTopics.length ? ` · revise: ${s.weakTopics.slice(0, 3).join(', ')}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3>Learning areas</h3>
            <p className="small muted">Quiz evidence blended with your discovery answers. More practice makes these more accurate.</p>
            <div className="stack">
              {[...AREAS]
                .sort((a, b) => profile.areas[b] - profile.areas[a])
                .map((a) => (
                  <Meter
                    key={a}
                    label={
                      <>
                        {AREA_META[a].emoji} {AREA_NAMES[a]}
                      </>
                    }
                    value={profile.areas[a]}
                    tone="tinted"
                    hue={AREA_META[a].hue}
                    right={`${profile.areas[a]}% · ${Math.round(profile.areaEvidence[a] * 100)}% from practice`}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

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

      {recent.length > 0 && (
        <section className="section">
          <h2>Recent rounds</h2>
          <div className="card">
            <ul className="list small">
              {recent.map((a) => (
                <li key={a.id} className="row between">
                  <span>
                    {subjectName(a.subjectId)} <span className="muted">· grades {a.band}</span>
                  </span>
                  <span>
                    <b>
                      {a.correct}/{a.total}
                    </b>{' '}
                    <span className="muted">{new Date(a.date).toLocaleDateString()}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
