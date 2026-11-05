import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, BookOpen, Check, Compass, Dumbbell, Eye, Flag, Flame, Lightbulb, PartyPopper, RefreshCw, Sparkles, Target, ThumbsUp, Volume2, X, Zap, type LucideIcon } from 'lucide-react'
import { bandForGrade } from '../data/boards'
import { getCareer } from '../data/careers'
import { lessonFor } from '../data/lessons'
import { subjectsWithItems } from '../data/quizzes'
import { getSubject, subjectName } from '../data/subjects'
import { modeFor, playsTown, speak } from '../engine/mode'
import { buildProfile, milestoneReached, streak, subjectStrength, todayKey, type MasteryLevel } from '../engine/profile'
import { buildQuiz, roundLength, summariseAttempt } from '../engine/quiz'
import { attemptXp, levelFor, nextStep, totalXp, XP, type NextStep } from '../engine/xp'
import { useStore } from '../store/store'
import type { GradeBand, Prefs, QuizAttempt, QuizItem } from '../types'
import { IconTile, LevelBadge } from '../components/ui'
import { Screen } from '../components/Screen'
import { ContextRail } from '../components/ContextRail'
import { PageHeader } from '../components/PageHeader'
import { Ring } from '../components/Ring'
import { Celebrate } from '../components/Celebrate'
import { AREA_META, subjectIcon, tint } from '../design'
import '../styles/practice.css'

const BANDS: GradeBand[] = ['1-5', '6-8', '9-10', '11-12']
const LETTER_HUES = [258, 320, 36, 160]
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const URDU = /[؀-ۿ]/

const KIND_META: Record<Exclude<NextStep['kind'], 'practice'>, { hue: number; icon: LucideIcon }> = {
  finder: { hue: 320, icon: Compass },
  preview: { hue: 215, icon: Eye },
  discovery: { hue: 45, icon: Lightbulb },
  goal: { hue: 258, icon: Flag },
}

function stepLook(step: NextStep): { hue: number; icon: LucideIcon } {
  if (step.kind !== 'practice') return KIND_META[step.kind]
  const s = step.subjectId ? getSubject(step.subjectId) : undefined
  return { hue: s ? AREA_META[s.area].hue : 160, icon: subjectIcon(step.subjectId ?? '', s?.area) }
}

const JUNIOR_STATUS: Record<MasteryLevel, string> = {
  'not-practised': 'Not started',
  'needs-work': 'Started',
  developing: 'Started',
  strong: 'Going well',
}

/** Confetti only, for junior mode (the shared Celebrate toast shows XP). */
function Confetti() {
  return (
    <div className="celebrate" aria-hidden="true">
      <div className="confetti">
        {Array.from({ length: 28 }, (_, i) => (
          <i key={i} style={{ ['--i' as string]: i, ['--h' as string]: (i * 47) % 360 }} />
        ))}
      </div>
    </div>
  )
}

type Minutes = Prefs['dailyMinutes']
type Level = Prefs['difficulty']
const MINUTES: Minutes[] = [5, 10, 15]
/** Short picture-tile names for grades 1 to 5 (five words or fewer). */
const PICK_NAME: Record<string, string> = { maths: 'Maths', 'general-science': 'Science', 'social-studies': 'Social Studies', english: 'English' }
const LEVEL_OPTIONS: { id: Level; label: string }[] = [
  { id: 'easy', label: 'Easy' },
  { id: 'normal', label: 'Normal' },
  { id: 'hard', label: 'Hard' },
]

/** One-line segmented control: a quiet row of pills, one selected. */
function Segmented<T extends string | number>({ label, options, value, onChange, hue = 160 }: { label: string; options: { id: T; label: string }[]; value: T; onChange: (v: T) => void; hue?: number }) {
  return (
    <div className="segmented-row">
      <span className="segmented-label" id={`seg-${label.replace(/\s+/g, '-').toLowerCase()}`}>
        {label}
      </span>
      <div className="segmented" role="radiogroup" aria-labelledby={`seg-${label.replace(/\s+/g, '-').toLowerCase()}`} style={tint(hue)}>
        {options.map((o) => (
          <button key={String(o.id)} type="button" role="radio" aria-checked={o.id === value} className={o.id === value ? 'on' : ''} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function DailyTime() {
  const { state, setPrefs } = useStore()
  return <Segmented label="Daily time" options={MINUTES.map((m) => ({ id: m, label: `${m} min` }))} value={state.prefs.dailyMinutes} onChange={(m) => setPrefs({ dailyMinutes: m })} />
}

/** Junior streak milestone: confetti and a toast with no points. */
function MilestoneToast({ label }: { label: string }) {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 2600)
    return () => clearTimeout(t)
  }, [])
  if (!show) return null
  return (
    <div className="celebrate" aria-live="polite">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 28 }, (_, i) => (
          <i key={i} style={{ ['--i' as string]: i, ['--h' as string]: (i * 47) % 360 }} />
        ))}
      </div>
      <div className="xp-toast pop">
        <Flame size={18} aria-hidden="true" />
        <b>{label}</b>
      </div>
    </div>
  )
}

export function Practice() {
  const { subjectId } = useParams()
  const { state } = useStore()
  const p = state.profile!
  const ownBand = bandForGrade(p.boardId, p.grade)
  const [band, setBand] = useState<GradeBand>(ownBand)
  const profile = useMemo(() => buildProfile(state), [state])
  const junior = modeFor(state.profile) === 'junior'
  const town = playsTown(state.profile)

  if (subjectId) return <Quiz key={subjectId} subjectId={subjectId} band={town ? '1-5' : band} />

  if (town) {
    const picks = subjectsWithItems('1-5').sort((a, b) => subjectName(a).localeCompare(subjectName(b)))
    return (
      <Screen header={<PageHeader kicker="Practice" title="Pick one" themed hue={160} variant={1} />}>
        <div className="pick-tiles">
          {picks.map((id) => {
            const subj = getSubject(id)
            const hue = subj ? AREA_META[subj.area].hue : 258
            const Icon = subjectIcon(id, subj?.area)
            return (
              <Link key={id} to={`/practice/${id}`} state={{ band: '1-5' }} className="pick-tile" style={tint(hue)}>
                <span className="pick-icon" aria-hidden="true">
                  <Icon size={44} strokeWidth={2.2} />
                </span>
                <span className="pick-name">{PICK_NAME[id] ?? subjectName(id)}</span>
              </Link>
            )
          })}
        </div>
      </Screen>
    )
  }

  const subjects = subjectsWithItems(band)
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined
  const must = new Set(goal?.subjects.must ?? [])
  const sorted = [...subjects].sort((a, b) => Number(must.has(b)) - Number(must.has(a)) || subjectName(a).localeCompare(subjectName(b)))
  const len = roundLength(state.prefs.dailyMinutes)
  const otherBands = BANDS.filter((b) => b !== ownBand)

  return (
    <Screen
      header={
        <PageHeader
          kicker="Practice"
          title="Pick a subject"
          lead={junior ? undefined : `${len} questions, about ${state.prefs.dailyMinutes} minutes, up to ${len * XP.correct + XP.roundBonus} XP`}
          themed
          hue={160}
          variant={1}
        />
      }
      rail={<ContextRail />}
    >
      {!junior && <DailyTime />}
      {band !== ownBand && (
        <div className="band-now row">
          <span className="small muted">Showing grades {band}</span>
          <button className="btn sm quiet" onClick={() => setBand(ownBand)}>
            Back to my grade
          </button>
        </div>
      )}
      <div className={`grid cols-3 course-grid ${junior ? 'junior-courses' : ''}`}>
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
                <span className="course-status">{junior ? JUNIOR_STATUS[s?.level ?? 'not-practised'] : s ? `${s.attempts} round${s.attempts === 1 ? '' : 's'} · ${s.accuracy}%` : 'Not started'}</span>
                {must.has(id) && (
                  <span className="course-meta">
                    <span className="chip must">
                      <Target size={12} aria-hidden="true" />
                      Goal subject
                    </span>
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
      {!subjects.length && <p className="muted">No practice sets for grades {band} yet.</p>}
      {junior && <DailyTime />}
      <details className="other-grades">
        <summary>Other grades</summary>
        <div className="row other-grades-list">
          {otherBands.map((b) => (
            <button key={b} className={`btn sm ${band === b ? 'active' : ''}`} aria-pressed={band === b} onClick={() => setBand(b)}>
              Grades {b}
            </button>
          ))}
        </div>
      </details>
    </Screen>
  )
}

function Quiz({ subjectId, band: initialBand }: { subjectId: string; band: GradeBand }) {
  const { state, addAttempt, setPrefs } = useStore()
  const nav = useNavigate()
  const loc = useLocation()
  const p = state.profile!
  const junior = modeFor(state.profile) === 'junior'
  const town = playsTown(state.profile)
  const navBand = (loc.state as { band?: GradeBand } | null)?.band
  const band = useMemo<GradeBand>(() => {
    // Prefer the band passed from the practice list, else the student's own band.
    return navBand ?? initialBand ?? bandForGrade(p.boardId, p.grade)
  }, [navBand, initialBand, p.boardId, p.grade])

  const lesson = lessonFor(subjectId, band)
  const [seed] = useState(() => Date.now())
  const [length] = useState(() => roundLength(state.prefs.dailyMinutes))
  const difficulty: Prefs['difficulty'] = town ? 'easy' : state.prefs.difficulty
  const [items, setItems] = useState<QuizItem[]>(() => buildQuiz(subjectId, band, state.attempts, seed, { length, difficulty }))
  const [inLesson, setInLesson] = useState(() => lesson !== undefined)
  const [noVoice, setNoVoice] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [revealed, setRevealed] = useState(false)
  const [result, setResult] = useState<QuizAttempt | null>(null)
  const start = useRef(0)
  const saved = useRef(false)
  const [milestone, setMilestone] = useState<number | null>(null)
  const chooseDifficulty = (d: Prefs['difficulty']) => {
    if (d === difficulty) return
    setPrefs({ difficulty: d })
    setItems(buildQuiz(subjectId, band, state.attempts, seed, { length, difficulty: d }))
    setAnswers({})
  }
  const difficultyControl = town ? null : <Segmented label="Difficulty" options={LEVEL_OPTIONS} value={difficulty} onChange={chooseDifficulty} />

  useEffect(() => {
    start.current = Date.now()
  }, [])

  useEffect(() => {
    if (result && !saved.current) {
      saved.current = true
      addAttempt(result)
    }
  }, [result, addAttempt])

  // Results are part of the app, not the focused quiz: give the shell its
  // chrome back on phones while they show.
  useEffect(() => {
    if (result) document.body.dataset.quizDone = '1'
    else delete document.body.dataset.quizDone
    return () => {
      delete document.body.dataset.quizDone
    }
  }, [result])

  const item = items[index]
  const chosen = item ? answers[item.id] : undefined
  const subject = subjectName(subjectId)

  const readAloud = (text: string) => setNoVoice(!speak(text))
  const step = useMemo(() => nextStep(state), [state])

  if (!items.length) {
    return (
      <Screen header={<PageHeader kicker="Practice" title={subject} lead={`No practice questions for grades ${band} in this subject yet.`} />}>
        <Link to="/practice" className="btn">
          Back to Practice
        </Link>
      </Screen>
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

    const misses = wrong.length > 0 && (
      <div className="section">
        {!junior && <h3>Learn from the misses</h3>}
        <div className="stack">
          {wrong.map((w) => (
            <div key={w.id} className="card">
              <span className="kicker" style={{ display: 'block', marginBottom: 6 }}>
                {w.topic}
              </span>
              <p>
                <b className={URDU.test(w.question) ? 'urdu' : ''}>{w.question}</b>
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
    )

    const look = stepLook(step)
    const sameRound = step.kind === 'practice' && step.subjectId === subjectId
    const verdict =
      pct >= 85 ? (
        <>
          <PartyPopper size={20} aria-hidden="true" />
          {junior ? 'Brilliant. You really know this.' : 'Excellent. Next round will be harder.'}
        </>
      ) : pct >= 60 ? (
        <>
          <ThumbsUp size={20} aria-hidden="true" />
          {junior ? 'Good work. Nearly there.' : 'Good work. A few topics to revise below.'}
        </>
      ) : (
        <>
          <Dumbbell size={20} aria-hidden="true" />
          {junior ? 'Good try. Practice makes it easier.' : 'Good effort. Read the explanations, then try again tomorrow.'}
        </>
      )

    const handoff = (
      <section className="card accent handoff section result-handoff" aria-label="Next up">
        <IconTile hue={look.hue} icon={look.icon} />
        <div className="handoff-body">
          <span className="tile-label">Next up</span>
          <h3>{step.title}</h3>
          {!junior && <p className="small">{step.detail}</p>}
          <div className="row handoff-actions">
            {sameRound ? (
              <button className="btn primary" onClick={() => nav(0)}>
                {step.cta} <ArrowRight size={18} aria-hidden="true" />
              </button>
            ) : (
              <>
                <Link to={step.to} className="btn primary">
                  {step.cta} <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <button className="btn" onClick={() => nav(0)}>
                  <RefreshCw size={18} aria-hidden="true" /> Another round
                </button>
              </>
            )}
            <Link to="/practice" className="btn quiet">
              Back to Practice
            </Link>
          </div>
        </div>
      </section>
    )

    const header = <PageHeader kicker={`Practice · ${subject}`} title={`${correct} of ${total}`} lead={<span className="result-verdict">{verdict}</span>} />

    if (junior) {
      return (
        <Screen header={header}>
          <div className="junior-result">
            {milestone ? <MilestoneToast label={`${milestone} days in a row!`} /> : <Confetti />}
            {topicsMissed.length > 0 && (
              <div className="card pastel section" style={tint(160)}>
                <h4 style={{ marginTop: 0 }}>Topics to look at again</h4>
                <div className="chips">
                  {topicsMissed.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {wrong.length > 0 && (
              <details className="result-details section">
                <summary>Show my answers</summary>
                {misses}
              </details>
            )}
            {handoff}
          </div>
        </Screen>
      )
    }

    return (
      <Screen header={header}>
        <Celebrate xp={xp} label={milestone ? `${milestone}-day streak!` : `${correct}/${total} in ${subject}`} />
        <div className="result-grid section">
          <div className="card accent earned-row">
            <Ring value={level.progress} size={48} stroke={5}>
              <Zap size={16} aria-hidden="true" />
            </Ring>
            <div>
              <b>You earned +{xp} XP</b>
              <span>{level.next ? `${level.next - allXp} XP to ${levelFor(level.next).name}` : `${level.name}: top level reached`}</span>
            </div>
          </div>

          <div className="card">
            <div className="row between">
              <span>
                Overall in {subject}: <LevelBadge level={strength.level} accuracy={strength.accuracy} />
              </span>
              {strength.trend === 'up' && <span className="badge good">Improving</span>}
            </div>
            <p className="small muted" style={{ margin: '6px 0 0' }}>
              Grades {band}
            </p>
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
        </div>

        {misses}
        {handoff}
      </Screen>
    )
  }

  const quitButton = (
    <Link to="/practice" className="btn sm" aria-label="Quit this round">
      <X size={16} aria-hidden="true" /> Quit
    </Link>
  )
  const quizHeader = (title: string, counter?: ReactNode) => (
    <PageHeader
      kicker={`Practice · ${subject}`}
      title={<span aria-live="polite">{title}</span>}
      action={
        <>
          {counter}
          {quitButton}
        </>
      }
    />
  )

  if (inLesson && lesson) {
    const lessonUrdu = URDU.test(lesson.idea)
    const startQuestions = () => {
      start.current = Date.now()
      setNoVoice(false)
      setInLesson(false)
    }
    return (
      <>
        <div className="quiz-top">{quizHeader('Read this first')}</div>
        <div className="card lesson-card pop" style={tint(160)}>
          <span className="kicker lesson-kicker">
            <BookOpen size={14} aria-hidden="true" /> {subject} · grades {band}
          </span>
          <h2 className={lessonUrdu ? 'urdu' : ''}>{lesson.title}</h2>
          <p className={`lesson-idea ${lessonUrdu ? 'urdu' : ''}`}>{lesson.idea}</p>
          <div className="card pastel lesson-example" style={tint(160)}>
            <h4>A worked example</h4>
            <p className={lessonUrdu ? 'urdu' : ''}>{lesson.example}</p>
          </div>
          {difficultyControl}
          <div className="lesson-actions">
            <button className="btn primary" onClick={startQuestions}>
              Try the questions <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button className="btn" onClick={() => readAloud(`${lesson.title}. ${lesson.idea} ${lesson.example}`)}>
              <Volume2 size={18} aria-hidden="true" /> Read it aloud
            </button>
          </div>
          {noVoice && (
            <p className="small muted lesson-note" role="status">
              Read-aloud is not available on this device
            </p>
          )}
          <p className="small muted lesson-note">Take your time. There is no timer.</p>
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
    setNoVoice(false)
    if (index + 1 >= items.length) {
      // Streak before this round (as stored) and after it (today added).
      const before = streak(state.activeDays).current
      const after = streak([...state.activeDays, todayKey()]).current
      setMilestone(after > before ? milestoneReached(before, after) : null)
      setResult(summariseAttempt(subjectId, band, items, answers, Math.round((Date.now() - start.current) / 1000)))
    } else setIndex(index + 1)
  }
  const isRight = chosen === item.answer

  return (
    <>
      <div className="quiz-top">
        {quizHeader(
          `Question ${index + 1} of ${items.length}`,
          junior ? undefined : (
            <span className="stat-chip xp quiz-xp" aria-label={`${liveXp} XP this round`}>
              <Sparkles size={16} aria-hidden="true" />
              <b key={liveXp} className={liveXp ? 'bump' : ''}>
                {liveXp}
              </b>
              XP
            </span>
          ),
        )}
      </div>
      <div className={`progress-steps ${junior ? 'dots' : ''}`} aria-hidden="true">
        {items.map((it, i) => (
          <span key={it.id} className={i < index || (i === index && revealed) ? 'done' : ''} />
        ))}
      </div>
      {!lesson && index === 0 && !revealed && difficultyControl && <div className="quiz-difficulty">{difficultyControl}</div>}
      <div className="card quiz-card">
        <div className="row" style={{ gap: 8 }}>
          <span className="badge primary">{item.topic}</span>
          {!junior && <span className={`badge ${['good', 'warn', 'bad'][item.difficulty - 1]}`}>{['Easy', 'Medium', 'Hard'][item.difficulty - 1]}</span>}
        </div>
        <div className="quiz-question">
          <h2 className={URDU.test(item.question) ? 'urdu' : ''}>{item.question}</h2>
          {junior && (
            <button
              className="btn sm quiz-speak"
              onClick={() => readAloud(`${item.question} ${item.options.map((o, i) => `${LETTERS[i]}: ${o}.`).join(' ')}`)}
              aria-label="Read the question aloud"
              title="Read aloud"
            >
              <Volume2 size={20} aria-hidden="true" />
            </button>
          )}
        </div>
        {junior && noVoice && (
          <p className="small muted lesson-note" role="status">
            Read-aloud is not available on this device
          </p>
        )}
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
          <div className={`explain pop ${isRight ? 'ok' : 'no'}`}>
            <b>
              {isRight ? <Check size={16} className="inline-icon" aria-hidden="true" /> : <Lightbulb size={16} className="inline-icon" aria-hidden="true" />}
              {junior ? (isRight ? 'Correct!' : 'Not quite.') : isRight ? `Correct! +${XP.correct} XP` : `Not quite. +${XP.attempted} XP for trying.`}
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
