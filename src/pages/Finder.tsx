import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, Flag, Lightbulb, RefreshCw, Sparkles } from 'lucide-react'
import { FINDER_QUESTIONS, type FinderOption } from '../data/finder'
import { CLUSTER_NAMES } from '../data/careers'
import { careerLife, formatPkr } from '../data/careerLife'
import { scoreFinder } from '../engine/finder'
import { modeFor } from '../engine/mode'
import { buildProfile } from '../engine/profile'
import { pathFor } from '../data/paths'
import { useStore } from '../store/store'
import { CLUSTER_META, tint } from '../design'
import { FuturePreview } from '../components/FuturePreview'
import { Orb } from '../components/Orb'
import { PageHeader } from '../components/PageHeader'
import type { Career, CareerCluster } from '../types'
import '../styles/finder.css'

const LETTERS = ['A', 'B', 'C', 'D']
/** Hue of each option's letter badge, so every screen looks lively. */
const LETTER_HUES = [258, 320, 36, 160]
const ADVANCE_MS = 350

function truncate(text: string, max = 70): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1)
}

/** Up to two options the student picked that point strongly at this cluster. */
function reasonsFor(cluster: CareerCluster, answers: Record<string, string>): FinderOption[] {
  const out: FinderOption[] = []
  for (const q of FINDER_QUESTIONS) {
    const chosen = q.options.find((o) => o.id === answers[q.id])
    if (chosen && (chosen.clusters[cluster] ?? 0) >= 0.8) out.push(chosen)
    if (out.length === 2) break
  }
  return out
}

function CareerFact({ id }: { id: string }) {
  const life = careerLife(id)
  if (!life) return null
  return (
    <span className="finder-fact">
      {life.yearsOfStudy} yrs study · Rs {formatPkr(life.pay.entry[0])}+ /month to start · {life.demand} demand
    </span>
  )
}

export function Finder() {
  const { state, setFinder } = useStore()

  // Local game state.
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [picked, setPicked] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const profile = useMemo(() => buildProfile(state), [state])
  const result = useMemo(() => (state.finder ? scoreFinder(state.finder, state, profile) : null), [state, profile])

  const question = FINDER_QUESTIONS[index]
  const total = FINDER_QUESTIONS.length
  const playing = !state.finder && started

  const choose = useCallback(
    (optionId: string) => {
      if (picked) return
      const next = { ...answers, [question.id]: optionId }
      setAnswers(next)
      setPicked(optionId)
      timer.current = window.setTimeout(() => {
        setPicked(null)
        if (index + 1 >= total) {
          setFinder(next)
          window.scrollTo(0, 0)
        } else {
          setIndex(index + 1)
        }
      }, ADVANCE_MS)
    },
    [answers, index, picked, question, setFinder, total],
  )

  const back = () => {
    window.clearTimeout(timer.current)
    setPicked(null)
    if (index === 0) setStarted(false)
    else setIndex(index - 1)
  }

  useEffect(() => {
    if (!playing) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= question.options.length) {
        e.preventDefault()
        choose(question.options[n - 1].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [playing, question, choose])

  const retake = () => {
    window.clearTimeout(timer.current)
    setFinder(null)
    setAnswers({})
    setIndex(0)
    setPicked(null)
    setPreview(null)
    setStarted(true)
    window.scrollTo(0, 0)
  }

  // ---- A. Intro --------------------------------------------------------
  if (!state.finder && !started) {
    return (
      <div className="finder finder-welcome">
        <Orb hue={320} size={200} variant={1} />
        <span className="kicker">Career finder</span>
        <h1>Not sure what you want to be? Good.</h1>
        <p className="lead">Eight quick 'would you rather' questions. Three futures to explore.</p>
        <button className="btn primary finder-play" onClick={() => setStarted(true)}>
          <Sparkles size={18} aria-hidden="true" />
          Let's play
        </button>
        <p className="small muted finder-time">Takes about 3 minutes.</p>
        <Link to="/" className="small finder-skip">
          Skip to Today
        </Link>
      </div>
    )
  }

  // ---- B. Questions ----------------------------------------------------
  if (!state.finder) {
    const current = answers[question.id]
    return (
      <div className="finder">
        <div className="finder-top row between">
          <button className="finder-back" onClick={back}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </button>
          <span className="small muted">
            Question {index + 1} of {total}
          </span>
        </div>
        <div className="progress-steps" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index}>
          {FINDER_QUESTIONS.map((q, i) => (
            <span key={q.id} className={i < index || (i === index && picked) ? 'done' : i === index ? 'current' : ''} />
          ))}
        </div>
        <div key={question.id} className="finder-question">
          <h2 className="finder-prompt">{question.prompt}</h2>
          <div className="finder-options" role="radiogroup" aria-label={question.prompt}>
            {question.options.map((o, i) => {
              const selected = picked ? picked === o.id : current === o.id
              return (
                <button
                  key={o.id}
                  role="radio"
                  aria-checked={selected}
                  className={`finder-option${selected ? ' selected' : ''}${picked === o.id ? ' popped' : ''}`}
                  style={tint(LETTER_HUES[i % LETTER_HUES.length])}
                  onClick={() => choose(o.id)}
                  disabled={!!picked && picked !== o.id}
                >
                  <span className="finder-letter" aria-hidden="true">
                    {LETTERS[i]}
                  </span>
                  <span className="finder-option-text">{o.text}</span>
                  <kbd className="finder-key" aria-hidden="true">
                    {i + 1}
                  </kbd>
                </button>
              )
            })}
          </div>
          <p className="small muted finder-hint">Tip: press 1 to 4 to pick.</p>
        </div>
      </div>
    )
  }

  // ---- C. Results ------------------------------------------------------
  if (!result) return null
  const answered = state.finder
  const junior = modeFor(state.profile) === 'junior'
  const byCluster = (c: CareerCluster) => result.careers.filter((r) => r.career.cluster === c).slice(0, 3)
  const previewBtn = (career: Career) => (
    <button className="btn sm" onClick={() => setPreview(career.id)} aria-label={`Preview life as ${career.title}`}>
      <Eye size={16} aria-hidden="true" />
      Preview
    </button>
  )

  return (
    <div className="finder">
      {state.goals[0] && (
        <div className="finder-note small">
          <Flag size={16} aria-hidden="true" />
          <span>
            You have a goal already. Exploring still helps. <Link to="/">Back to my goal</Link>
          </span>
        </div>
      )}

      <PageHeader themed hue={320} variant={1} kicker="Your results" title="Three futures worth a look" lead="Starting points, not verdicts." />

      <div className="grid cols-3 section finder-results">
        {result.topClusters.map((c, rank) => {
          const meta = CLUSTER_META[c]
          const Icon = meta.icon
          const pct = result.clusters[c]
          const reasons = reasonsFor(c, answered)
          return (
            <article key={c} className="card pastel finder-cluster" style={{ ...tint(meta.hue), animationDelay: `${rank * 80}ms` }}>
              <div className="row finder-cluster-head">
                <span className="tile-icon">
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <span className="finder-rank">Future {rank + 1}</span>
                  <h3>{junior ? pathFor(c).title : CLUSTER_NAMES[c]}</h3>
                </div>
              </div>
              {junior ? (
                <p className="finder-why junior-why">{pathFor(c).promise}</p>
              ) : (
                <>
              <div className="finder-match">
                <div className="row between small">
                  <span className="muted">Match</span>
                  <b>{pct}%</b>
                </div>
                <div className="bar tinted" role="img" aria-label={`${pct}% match`}>
                  <span style={{ width: `${pct}%` }} />
                </div>
              </div>
              <p className="finder-why">
                {reasons.length > 0 ? (
                  <>
                    Because you'd rather "{truncate(lowerFirst(reasons[0].text))}"
                    {reasons[1] && <> and "{truncate(lowerFirst(reasons[1].text))}"</>}.
                  </>
                ) : (
                  <>Your answers leaned this way overall.</>
                )}
              </p>
                </>
              )}
              {!junior && (
              <ul className="finder-careers">
                {byCluster(c).map(({ career, score }) => (
                  <li key={career.id}>
                    <div className="finder-career-main">
                      <div className="row finder-career-title">
                        <Link to={`/careers/${career.id}`}>{career.title}</Link>
                        <span className="badge tinted">{score}%</span>
                      </div>
                      <CareerFact id={career.id} />
                    </div>
                    {previewBtn(career)}
                  </li>
                ))}
              </ul>
              )}
            </article>
          )
        })}
      </div>

      {junior ? (
        <section className="card section">
          <h3>Careers to try</h3>
          <ul className="steps">
            {result.careers.slice(0, 5).map(({ career }, i) => (
              <li key={career.id} style={tint(CLUSTER_META[career.cluster].hue)}>
                <span className="num">{i + 1}</span>
                <span className="step-body">
                  <Link to={`/careers/${career.id}`}>
                    <b>{career.title}</b>
                  </Link>
                </span>
                {previewBtn(career)}
              </li>
            ))}
          </ul>
          <Link to="/careers" className="finder-all">
            See all the paths
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      ) : (
      <section className="card section">
        <div className="section-head">
          <h2>All careers ranked for you</h2>
        </div>
        <ol className="finder-ranked">
          {result.careers.slice(0, 12).map(({ career, score }, i) => {
            const meta = CLUSTER_META[career.cluster]
            const Icon = meta.icon
            return (
              <li key={career.id} style={tint(meta.hue)}>
                <span className="finder-ranked-num">{i + 1}</span>
                <span className="tile-icon finder-ranked-icon">
                  <Icon aria-hidden="true" />
                </span>
                <div className="finder-ranked-body">
                  <Link to={`/careers/${career.id}`}>{career.title}</Link>
                  <span className="small muted">{CLUSTER_NAMES[career.cluster]}</span>
                </div>
                <span className="badge tinted">{score}%</span>
                {previewBtn(career)}
              </li>
            )
          })}
        </ol>
        <Link to="/careers" className="finder-all">
          See everything in Careers
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
      )}

      <div className="section stack">
        {!state.discovery && (
          <Link to="/discover" className="card lift finder-nudge" style={tint(45)}>
            <span className="tile-icon">
              <Lightbulb aria-hidden="true" />
            </span>
            <div>
              <b>Want sharper results?</b>
              <span className="small muted">Take the 5-minute discovery quiz.</span>
            </div>
            <ArrowRight size={18} aria-hidden="true" className="finder-nudge-arrow" />
          </Link>
        )}
        <div>
          <button className="btn" onClick={retake}>
            <RefreshCw size={18} aria-hidden="true" />
            Retake the finder
          </button>
        </div>
      </div>

      {preview && <FuturePreview careerId={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}
