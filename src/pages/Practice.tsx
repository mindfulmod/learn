import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Check, Dumbbell, Lightbulb, PartyPopper, RefreshCw, Sparkles, Target, ThumbsUp, X, Zap } from 'lucide-react'
import { bandForGrade, BOARD_GRADES } from '../data/boards'
import { getCareer } from '../data/careers'
import { subjectsWithItems } from '../data/quizzes'
import { getSubject, subjectName } from '../data/subjects'
import { buildProfile, subjectStrength } from '../engine/profile'
import { buildQuiz, QUIZ_LENGTH, summariseAttempt } from '../engine/quiz'
import { attemptXp, levelFor, totalXp, XP } from '../engine/xp'
import { useStore } from '../store/store'
import type { GradeBand, QuizAttempt, QuizItem } from '../types'
import { LevelBadge, SubjectTile } from '../components/ui'
import { PageHeader } from '../components/PageHeader'
import { Ring } from '../components/Ring'
import { Celebrate } from '../components/Celebrate'
import { AREA_META, subjectIcon, tint } from '../design'
import '../styles/practice.css'

const BANDS: GradeBand[] = ['1-5', '6-8', '9-10', '11-12']
const LETTER_HUES = [258, 320, 36, 160]
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const URDU = /[؀-ۿ]/

export function Practice() {
  const { subjectId } = useParams()
  const { state } = useStore()
  const p = state.profile!
  const ownBand = bandForGrade(p.boardId, p.grade)
  const [band, setBand] = useState<GradeBand>(ownBand)
  const profile = useMemo(() => buildProfile(state), [state])

  if (subjectId) return <Quiz key={subjectId} subjectId={subjectId} band={band} />

  const subjects = subjectsWithItems(band)
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined
  const must = new Set(goal?.subjects.must ?? [])
  const sorted = [...subjects].sort((a, b) => Number(must.has(b)) - Number(must.has(a)) || subjectName(a).localeCompare(subjectName(b)))

  return (
    <>
      <PageHeader kicker="Practice" title="Pick a subject" lead={`${QUIZ_LENGTH} questions a round. Harder when you're winning, kinder when you're not.`} />
      <div className="tabs pills" role="tablist" aria-label="Grade band">
        {BANDS.map((b) => (
          <button key={b} role="tab" aria-selected={band === b} className={`btn sm ${band === b ? 'active' : ''}`} onClick={() => setBand(b)}>
            Grades {b}
            {b === ownBand ? ' (yours)' : ''}
          </button>
        ))}
      </div>
      <div className="grid cols-3 course-grid">
        {sorted.map((id) => {
          const s = profile.subjects[id]
          const subj = getSubject(id)
          const hue = subj ? AREA_META[subj.area].hue : 258
          const Icon = subjectIcon(id, subj?.area)
          return (
            <Link key={id} to={`/practice/${id}`} state={{ band }} className="card lift course-tile" style={tint(hue)}>
              <Ring value={s?.accuracy ?? 0} size={56} stroke={6} tone="tint">
                <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
              </Ring>
              <div className="course-body">
                <h3>{subjectName(id)}</h3>
                <span className="course-status">{s ? `${s.attempts} round${s.attempts === 1 ? '' : 's'} · ${s.accuracy}%` : 'Not started'}</span>
                {must.has(id) && (
                  <span className="course-meta">
                    <span className="chip must">
                      <Target size={12} aria-hidden="true" />
                      Goal subject
                    </span>
                  </span>
                )}
              </div>
              <span className="course-xp" aria-label="Up to 80 XP">
                +80 XP
              </span>
            </Link>
          )
        })}
      </div>
      {!subjects.length && <p className="muted">No practice sets for grades {band} yet.</p>}
      <p className="small muted practice-note">
        Grades on this track: {BOARD_GRADES[p.boardId][0]}-{BOARD_GRADES[p.boardId].at(-1)}. You can practise any band, but only your own band counts toward goal readiness.
      </p>
    </>
  )
}

function Quiz({ subjectId, band: initialBand }: { subjectId: string; band: GradeBand }) {
  const { state, addAttempt } = useStore()
  const nav = useNavigate()
  const loc = useLocation()
  const p = state.profile!
  const navBand = (loc.state as { band?: GradeBand } | null)?.band
  const band = useMemo<GradeBand>(() => {
    // Prefer the band passed from the practice list, else the student's own band.
    return navBand ?? initialBand ?? bandForGrade(p.boardId, p.grade)
  }, [navBand, initialBand, p.boardId, p.grade])

  const [items] = useState<QuizItem[]>(() => buildQuiz(subjectId, band, state.attempts))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [revealed, setRevealed] = useState(false)
  const [result, setResult] = useState<QuizAttempt | null>(null)
  const start = useRef(0)
  const saved = useRef(false)

  useEffect(() => {
    start.current = Date.now()
  }, [])

  useEffect(() => {
    if (result && !saved.current) {
      saved.current = true
      addAttempt(result)
    }
  }, [result, addAttempt])

  const item = items[index]
  const chosen = item ? answers[item.id] : undefined
  const subject = subjectName(subjectId)

  if (!items.length) {
    return (
      <>
        <PageHeader kicker="Practice" title={subject} lead={`No practice questions for grades ${band} in this subject yet.`} />
        <Link to="/practice" className="btn">
          Back to practice
        </Link>
      </>
    )
  }

  if (result) {
    const correct = result.correct
    const total = result.total
    const pct = Math.round((correct / total) * 100)
    const xp = attemptXp(result)
    const strength = subjectStrength(subjectId, state.attempts)
    const wrong = items.filter((i) => answers[i.id] !== i.answer)
    const topicsMissed = [...new Set(wrong.map((w) => w.topic))]
    const allXp = totalXp(state)
    const level = levelFor(allXp)
    return (
      <>
        <Celebrate xp={xp} label={`${correct}/${total} in ${subject}`} />
        <div className="result-head">
          <SubjectTile subjectId={subjectId} large />
          <span className="big-score pop">
            {correct}/{total}
          </span>
        </div>
        <p className="lead result-verdict">
          {pct >= 85 ? (
            <>
              <PartyPopper size={20} aria-hidden="true" />
              Excellent. Next round will be harder.
            </>
          ) : pct >= 60 ? (
            <>
              <ThumbsUp size={20} aria-hidden="true" />
              Good work. A few topics to revise below.
            </>
          ) : (
            <>
              <Dumbbell size={20} aria-hidden="true" />
              Good effort. Read the explanations, then try again tomorrow.
            </>
          )}
        </p>
        <p className="small muted">
          {subject} · grades {band}
        </p>

        <div className="card accent section earned-row">
          <Ring value={level.progress} size={48} stroke={5}>
            <Zap size={16} aria-hidden="true" />
          </Ring>
          <div>
            <b>You earned +{xp} XP</b>
            <span>{level.next ? `${level.next - allXp} XP to ${levelFor(level.next).name}` : `${level.name}: top level reached`}</span>
          </div>
        </div>

        <div className="card section">
          <div className="row between">
            <span>
              Overall in {subject}: <LevelBadge level={strength.level} accuracy={strength.accuracy} />
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
                    Your answer: <span className="miss-answer-bad">{answers[w.id] !== undefined ? w.options[answers[w.id]] : 'skipped'}</span>
                    <br />
                    Correct: <span className="miss-answer-good">{w.options[w.answer]}</span>
                  </p>
                  <p className="small" style={{ margin: 0 }}>
                    {w.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="row result-actions">
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

  // Live XP from the questions checked so far (bonus is added at the end).
  const counted = items.slice(0, revealed ? index + 1 : index)
  const liveXp = counted.reduce((s, it) => s + (answers[it.id] === it.answer ? XP.correct : XP.attempted), 0)

  const pick = (i: number) => {
    if (revealed) return
    setAnswers({ ...answers, [item.id]: i })
  }
  const check = () => setRevealed(true)
  const next = () => {
    setRevealed(false)
    if (index + 1 >= items.length) setResult(summariseAttempt(subjectId, band, items, answers, Math.round((Date.now() - start.current) / 1000)))
    else setIndex(index + 1)
  }

  return (
    <>
      <div className="quiz-top">
        <Link to="/practice" className="btn sm" aria-label="Quit this round">
          <X size={16} aria-hidden="true" /> Quit
        </Link>
        <div className="quiz-title">
          <b>{subject}</b>
          <span>Grades {band}</span>
        </div>
        <span className="stat-chip xp quiz-xp" aria-live="polite" aria-label={`${liveXp} XP this round`}>
          <Sparkles size={16} aria-hidden="true" />
          <b key={liveXp} className={liveXp ? 'bump' : ''}>
            {liveXp}
          </b>
          XP
        </span>
      </div>
      <div className="quiz-count">
        {index + 1} / {items.length}
      </div>
      <div className="progress-steps" aria-hidden="true">
        {items.map((it, i) => (
          <span key={it.id} className={i < index || (i === index && revealed) ? 'done' : ''} />
        ))}
      </div>
      <div className="card quiz-card">
        <div className="row" style={{ gap: 8 }}>
          <span className="badge primary">{item.topic}</span>
          <span className={`badge ${['good', 'warn', 'bad'][item.difficulty - 1]}`}>{['Easy', 'Medium', 'Hard'][item.difficulty - 1]}</span>
        </div>
        <h2 className={URDU.test(item.question) ? 'urdu' : ''}>{item.question}</h2>
        <div className="choices">
          {item.options.map((opt, i) => {
            let cls = 'choice quiz-choice'
            if (revealed) {
              if (i === item.answer) cls += ' correct'
              else if (i === chosen) cls += ' wrong'
            } else if (i === chosen) cls += ' selected'
            return (
              <button key={i} className={cls} onClick={() => pick(i)} disabled={revealed} aria-pressed={i === chosen}>
                <span className="choice-letter" style={tint(LETTER_HUES[i % LETTER_HUES.length])} aria-hidden="true">
                  {revealed && i === item.answer ? <Check size={16} strokeWidth={3} /> : LETTERS[i]}
                </span>
                <span className={`choice-text ${URDU.test(opt) ? 'urdu' : ''}`}>{opt}</span>
              </button>
            )
          })}
        </div>
        {revealed && (
          <div className={`explain pop ${chosen === item.answer ? 'ok' : 'no'}`}>
            <b>
              {chosen === item.answer ? <Check size={16} className="inline-icon" aria-hidden="true" /> : <Lightbulb size={16} className="inline-icon" aria-hidden="true" />}
              {chosen === item.answer ? `Correct! +${XP.correct} XP` : `Not quite. +${XP.attempted} XP for trying.`}
            </b>{' '}
            {item.explanation}
          </div>
        )}
        <div className="quiz-actions">
          {!revealed ? (
            <button className="btn primary" disabled={chosen === undefined} onClick={check}>
              Check
            </button>
          ) : (
            <button className="btn primary" onClick={next}>
              {index + 1 >= items.length ? 'See results' : 'Next'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
