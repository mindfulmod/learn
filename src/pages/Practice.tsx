import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Check, Dumbbell, Lightbulb, PartyPopper, RefreshCw, Target, ThumbsUp } from 'lucide-react'
import { bandForGrade, BOARD_GRADES } from '../data/boards'
import { getCareer } from '../data/careers'
import { subjectsWithItems } from '../data/quizzes'
import { getSubject, subjectName } from '../data/subjects'
import { buildProfile, subjectStrength } from '../engine/profile'
import { buildQuiz, QUIZ_LENGTH, summariseAttempt } from '../engine/quiz'
import { useStore } from '../store/store'
import type { GradeBand, QuizItem } from '../types'
import { LevelBadge, SubjectTile } from '../components/ui'

const BANDS: GradeBand[] = ['1-5', '6-8', '9-10', '11-12']

export function Practice() {
  const { subjectId } = useParams()
  const { state } = useStore()
  const p = state.profile!
  const ownBand = bandForGrade(p.boardId, p.grade)
  const [band, setBand] = useState<GradeBand>(ownBand)
  const profile = useMemo(() => buildProfile(state), [state])

  if (subjectId) return <Quiz subjectId={subjectId} band={band} />

  const subjects = subjectsWithItems(band)
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined
  const must = new Set(goal?.subjects.must ?? [])
  const sorted = [...subjects].sort((a, b) => Number(must.has(b)) - Number(must.has(a)) || subjectName(a).localeCompare(subjectName(b)))

  return (
    <>
      <span className="kicker">Train</span>
      <h1>Practice</h1>
      <p className="lead">
        {QUIZ_LENGTH} questions per round. Difficulty adapts to how you did last time, and weak topics come back until you beat them.
      </p>
      <div className="tabs pills" role="tablist" aria-label="Grade band">
        {BANDS.map((b) => (
          <button key={b} role="tab" aria-selected={band === b} className={`btn sm ${band === b ? 'active' : ''}`} onClick={() => setBand(b)}>
            Grades {b}
            {b === ownBand ? ' (yours)' : ''}
          </button>
        ))}
      </div>
      <div className="grid cols-2">
        {sorted.map((id) => {
          const s = profile.subjects[id]
          const subj = getSubject(id)
          return (
            <Link key={id} to={`/practice/${id}`} state={{ band }} className="card lift subject-card">
              <SubjectTile subjectId={id} large />
              <div>
                <div className="row between" style={{ marginBottom: 4 }}>
                  <h3 style={{ margin: 0 }}>{subjectName(id)}</h3>
                  {must.has(id) && <span className="chip must">
                      <Target size={12} className="inline-icon" aria-hidden="true" />
                      goal subject
                    </span>}
                </div>
                <p className="small" style={{ marginBottom: 10, color: 'var(--text-2)' }}>
                  {subj?.description}
                </p>
                {s ? (
                  <span className="row" style={{ gap: 8 }}>
                    <LevelBadge level={s.level} accuracy={s.accuracy} />
                    <span className="small muted">
                      {s.attempts} round{s.attempts === 1 ? '' : 's'}
                    </span>
                  </span>
                ) : (
                  <span className="badge">Not started</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
      {!subjects.length && <p className="muted">No practice sets for grades {band} yet.</p>}
      <p className="small muted" style={{ marginTop: 16 }}>
        Grades on this track: {BOARD_GRADES[p.boardId][0]}-{BOARD_GRADES[p.boardId].at(-1)}. You can practise any band, but only your own band counts toward goal readiness.
      </p>
    </>
  )
}

function Quiz({ subjectId, band: initialBand }: { subjectId: string; band: GradeBand }) {
  const { state, addAttempt } = useStore()
  const nav = useNavigate()
  const p = state.profile!
  const band = useMemo<GradeBand>(() => {
    // Prefer the band passed from the practice list, else the student's own band.
    const fromNav = (window.history.state?.usr as { band?: GradeBand } | undefined)?.band
    return fromNav ?? initialBand ?? bandForGrade(p.boardId, p.grade)
  }, [initialBand, p.boardId, p.grade])

  const [items] = useState<QuizItem[]>(() => buildQuiz(subjectId, band, state.attempts))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)
  const start = useRef(0)
  const saved = useRef(false)

  useEffect(() => {
    start.current = Date.now()
  }, [])

  const item = items[index]
  const chosen = item ? answers[item.id] : undefined

  useEffect(() => {
    if (done && !saved.current) {
      saved.current = true
      addAttempt(summariseAttempt(subjectId, band, items, answers, Math.round((Date.now() - start.current) / 1000)))
    }
  }, [done, addAttempt, subjectId, band, items, answers])

  if (!items.length) {
    return (
      <>
        <h1>{subjectName(subjectId)}</h1>
        <p className="muted">No practice questions for grades {band} in this subject yet.</p>
        <Link to="/practice" className="btn">
          Back to practice
        </Link>
      </>
    )
  }

  if (done) {
    const correct = items.filter((i) => answers[i.id] === i.answer).length
    const pct = Math.round((correct / items.length) * 100)
    const strength = subjectStrength(subjectId, state.attempts)
    const wrong = items.filter((i) => answers[i.id] !== i.answer)
    const topicsMissed = [...new Set(wrong.map((w) => w.topic))]
    return (
      <>
        <div className="row" style={{ gap: 18, marginBottom: 8 }}>
          <SubjectTile subjectId={subjectId} large />
          <div>
            <span className="big-score pop">
              {correct}/{items.length}
            </span>
          </div>
        </div>
        <p className="lead">
          {pct >= 85 ? (
            <>
              <PartyPopper size={20} className="inline-icon" style={{ verticalAlign: 'middle' }} aria-hidden="true" />
              Excellent. Next round will be harder.
            </>
          ) : pct >= 60 ? (
            <>
              <ThumbsUp size={20} className="inline-icon" style={{ verticalAlign: 'middle' }} aria-hidden="true" />
              Good work. A few topics to revise below.
            </>
          ) : (
            <>
              <Dumbbell size={20} className="inline-icon" style={{ verticalAlign: 'middle' }} aria-hidden="true" />
              Good effort. Read the explanations, then try again tomorrow.
            </>
          )}
        </p>
        <p className="small muted">
          {subjectName(subjectId)} · grades {band}
        </p>
        <div className="card section">
          <div className="row between">
            <span>
              Overall in {subjectName(subjectId)}: <LevelBadge level={strength.level} accuracy={strength.accuracy} />
            </span>
            {strength.trend === 'up' && <span className="badge good">Improving</span>}
          </div>
          {topicsMissed.length > 0 && (
            <>
              <h4 style={{ marginTop: 12 }}>Revise these topics</h4>
              <div className="chips">
                {topicsMissed.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        {wrong.length > 0 && (
          <div className="section">
            <h3>Learn from the misses</h3>
            <div className="stack">
              {wrong.map((w) => (
                <div key={w.id} className="card">
                  <span className="kicker" style={{ display: 'block', marginBottom: 6 }}>
                    {w.topic}
                  </span>
                  <p>
                    <b>{w.question}</b>
                  </p>
                  <p className="small">
                    Your answer: <span style={{ color: 'var(--bad)' }}>{answers[w.id] !== undefined ? w.options[answers[w.id]] : 'skipped'}</span>
                    <br />
                    Correct: <span style={{ color: 'var(--good)' }}>{w.options[w.answer]}</span>
                  </p>
                  <p className="small" style={{ margin: 0 }}>
                    {w.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="row">
          <button className="btn primary" onClick={() => nav(0)}>
            <RefreshCw size={18} aria-hidden="true" /> Another round
          </button>
          <Link to="/practice" className="btn">
            Other subjects
          </Link>
          <Link to="/" className="btn">
            Home
          </Link>
        </div>
      </>
    )
  }

  const pick = (i: number) => {
    if (revealed) return
    setAnswers({ ...answers, [item.id]: i })
  }
  const check = () => setRevealed(true)
  const next = () => {
    setRevealed(false)
    if (index + 1 >= items.length) setDone(true)
    else setIndex(index + 1)
  }

  return (
    <>
      <div className="row between">
        <span className="small muted">
          {subjectName(subjectId)} · grades {band}
        </span>
        <span className="small muted">
          {index + 1} / {items.length}
        </span>
      </div>
      <div className="progress-steps" aria-hidden="true">
        {items.map((it, i) => (
          <span key={it.id} className={i < index || (i === index && revealed) ? 'done' : ''} />
        ))}
      </div>
      <div className="card" style={{ padding: 26 }}>
        <div className="row" style={{ gap: 8, marginBottom: 10 }}>
          <span className="badge primary">{item.topic}</span>
          <span className={`badge ${['good', 'warn', 'bad'][item.difficulty - 1]}`}>{['Easy', 'Medium', 'Hard'][item.difficulty - 1]}</span>
        </div>
        <h2 className={/[؀-ۿ]/.test(item.question) ? 'urdu' : ''} style={{ fontSize: '1.3rem' }}>
          {item.question}
        </h2>
        <div className="choices" style={{ marginTop: 12 }}>
          {item.options.map((opt, i) => {
            let cls = 'choice'
            if (revealed) {
              if (i === item.answer) cls += ' correct'
              else if (i === chosen) cls += ' wrong'
            } else if (i === chosen) cls += ' selected'
            return (
              <button key={i} className={`${cls} ${/[؀-ۿ]/.test(opt) ? 'urdu' : ''}`} onClick={() => pick(i)} disabled={revealed} aria-pressed={i === chosen}>
                {opt}
              </button>
            )
          })}
        </div>
        {revealed && (
          <div className={`explain pop ${chosen === item.answer ? 'ok' : 'no'}`}>
            <b>
              {chosen === item.answer ? <Check size={16} className="inline-icon" aria-hidden="true" /> : <Lightbulb size={16} className="inline-icon" aria-hidden="true" />}
              {chosen === item.answer ? 'Correct!' : 'Not quite.'}
            </b>{' '}
            {item.explanation}
          </div>
        )}
        <div className="row" style={{ marginTop: 16 }}>
          {!revealed ? (
            <button className="btn primary" disabled={chosen === undefined} onClick={check}>
              Check
            </button>
          ) : (
            <button className="btn primary" onClick={next}>
              {index + 1 >= items.length ? 'See results' : 'Next'}
            </button>
          )}
          <Link to="/practice" className="btn">
            Quit
          </Link>
        </div>
      </div>
    </>
  )
}
