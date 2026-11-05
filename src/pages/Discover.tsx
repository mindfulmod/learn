import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Frown, Heart, Laugh, Meh, Smile } from 'lucide-react'
import { AREA_NAMES, DISCOVERY_QUESTIONS, LIKERT, TRAIT_BLURBS, TRAIT_NAMES } from '../data/discovery'
import { rankCareers } from '../engine/careers'
import { AREAS, scoreDiscovery, topTraits, TRAITS } from '../engine/discovery'
import { buildProfile } from '../engine/profile'
import { useStore } from '../store/store'
import { Meter } from '../components/ui'
import { AREA_META, TRAIT_META } from '../design'

const PAGE = 6
const FACES = [Frown, Meh, Smile, Laugh, Heart]

export function Discover() {
  const { state, setDiscovery } = useStore()
  const [answers, setAnswers] = useState<Record<string, number>>(state.discovery?.answers ?? {})
  const [page, setPage] = useState(0)
  const [showResult, setShowResult] = useState(!!state.discovery)
  const pages = Math.ceil(DISCOVERY_QUESTIONS.length / PAGE)
  const slice = DISCOVERY_QUESTIONS.slice(page * PAGE, page * PAGE + PAGE)
  const answered = Object.keys(answers).length
  const pageDone = slice.every((q) => answers[q.id])

  const profile = useMemo(() => buildProfile(state), [state])
  const ranked = useMemo(() => (state.discovery ? rankCareers(state, profile).slice(0, 5) : []), [state, profile])

  const finish = () => {
    setDiscovery(scoreDiscovery(answers))
    setShowResult(true)
    window.scrollTo(0, 0)
  }

  if (showResult && state.discovery) {
    const d = state.discovery
    const top = topTraits(d.traits, 2)
    const TopIcon0 = TRAIT_META[top[0]].icon
    const TopIcon1 = TRAIT_META[top[1]].icon
    return (
      <>
        <span className="kicker">Discovery</span>
        <h1>Your discovery profile</h1>
        <p className="lead">
          Completed {new Date(d.completedAt).toLocaleDateString()}. This is a starting picture of your interests; practice results refine it over time.
        </p>
        <div className="hero section">
          <span className="eyebrow">Your profile</span>
          <div className="row" style={{ gap: 14, marginBottom: 8 }}>
            <span className="row" style={{ gap: 6 }} aria-hidden="true">
              <TopIcon0 size={40} strokeWidth={1.6} />
              <TopIcon1 size={40} strokeWidth={1.6} />
            </span>
            <h2 style={{ color: '#fff', margin: 0 }}>
              {TRAIT_NAMES[top[0]]} and {TRAIT_NAMES[top[1]]}
            </h2>
          </div>
          <p style={{ margin: 0, maxWidth: '60ch' }}>
            {TRAIT_BLURBS[top[0]]} {TRAIT_BLURBS[top[1]]}
          </p>
        </div>
        <div className="grid cols-2 section">
          <div className="card">
            <h3>Interest traits</h3>
            <div className="stack">
              {[...TRAITS]
                .sort((a, b) => d.traits[b] - d.traits[a])
                .map((t) => {
                  const TraitIcon = TRAIT_META[t].icon
                  return (
                    <Meter
                      key={t}
                      label={
                        <>
                          <TraitIcon size={16} className="inline-icon" aria-hidden="true" />
                          {TRAIT_NAMES[t]}
                        </>
                      }
                      value={d.traits[t]}
                      tone="tinted"
                      hue={TRAIT_META[t].hue}
                    />
                  )
                })}
            </div>
          </div>
          <div className="card">
            <h3>Learning areas</h3>
            <p className="small muted">Blends your answers with any practice results.</p>
            <div className="stack">
              {[...AREAS]
                .sort((a, b) => profile.areas[b] - profile.areas[a])
                .map((a) => {
                  const AreaIcon = AREA_META[a].icon
                  return (
                    <Meter
                      key={a}
                      label={
                        <>
                          <AreaIcon size={16} className="inline-icon" aria-hidden="true" />
                          {AREA_NAMES[a]}
                        </>
                      }
                      value={profile.areas[a]}
                      tone="tinted"
                      hue={AREA_META[a].hue}
                    />
                  )
                })}
            </div>
          </div>
        </div>
        <div className="card section">
          <h3>Careers that fit you best</h3>
          <ul className="list">
            {ranked.map((r) => (
              <li key={r.career.id} className="row between">
                <Link to={`/careers/${r.career.id}`}>{r.career.title}</Link>
                <span className={`badge ${r.score >= 70 ? 'good' : 'warn'}`}>{r.score}% fit</span>
              </li>
            ))}
          </ul>
          <Link to="/careers" className="btn sm primary" style={{ marginTop: 8 }}>
            See all careers ranked
          </Link>
        </div>
        <button
          className="btn"
          onClick={() => {
            setShowResult(false)
            setPage(0)
          }}
        >
          Retake the quiz
        </button>
      </>
    )
  }

  return (
    <>
      <span className="kicker">Discovery</span>
      <h1>What suits you?</h1>
      <p className="lead">
        For each statement, choose how much it sounds like you. There are no right answers. {DISCOVERY_QUESTIONS.length} statements, about 5 minutes.
      </p>
      <div className="progress-steps" aria-label={`Page ${page + 1} of ${pages}`}>
        {Array.from({ length: pages }).map((_, i) => (
          <span key={i} className={i <= page ? 'done' : ''} />
        ))}
      </div>
      <div className="stack">
        {slice.map((q, i) => (
          <fieldset key={q.id} className="card" style={{ border: '1px solid var(--border)', margin: 0 }}>
            <legend className="sr-only">Statement {page * PAGE + i + 1}</legend>
            <p>
              <b>{page * PAGE + i + 1}.</b> {q.text}
            </p>
            <div className="likert" role="radiogroup" aria-label={q.text}>
              {LIKERT.map((l) => {
                const Face = FACES[l.value - 1]
                return (
                <button
                  key={l.value}
                  role="radio"
                  aria-checked={answers[q.id] === l.value}
                  className={`choice ${answers[q.id] === l.value ? 'selected' : ''}`}
                  onClick={() => setAnswers({ ...answers, [q.id]: l.value })}
                >
                  <span className="face" aria-hidden="true">
                    <Face size={22} />
                  </span>
                  {l.label}
                </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="row between" style={{ marginTop: 16 }}>
        <button className="btn" disabled={page === 0} onClick={() => setPage(page - 1)}>
          Back
        </button>
        <span className="small muted">
          {answered} / {DISCOVERY_QUESTIONS.length} answered
        </span>
        {page < pages - 1 ? (
          <button
            className="btn primary"
            disabled={!pageDone}
            onClick={() => {
              setPage(page + 1)
              window.scrollTo(0, 0)
            }}
          >
            Next
          </button>
        ) : (
          <button className="btn primary" disabled={answered < DISCOVERY_QUESTIONS.length} onClick={finish}>
            See my results
          </button>
        )}
      </div>
    </>
  )
}
