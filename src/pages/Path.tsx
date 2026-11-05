import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Compass, Eye, GraduationCap, Layers, MapPin } from 'lucide-react'
import { getBoard, getStage, stageForGrade } from '../data/boards'
import { getCareer } from '../data/careers'
import { subjectsForGrade } from '../data/curriculum'
import { getStream } from '../data/streams'
import { buildJourney } from '../engine/journey'
import { goalPlan } from '../engine/plan'
import { buildProfile } from '../engine/profile'
import { useStore } from '../store/store'
import { PageHeader } from '../components/PageHeader'
import { PathStrip } from '../components/PathStrip'
import { FuturePreview } from '../components/FuturePreview'
import { Empty } from '../components/ui'
import '../styles/home.css'

function short(title: string): string {
  return title.split(' (')[0]
}

export function Path() {
  const { state } = useStore()
  const p = state.profile!
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined
  const profile = useMemo(() => buildProfile(state), [state])
  const journey = useMemo(() => (goal ? buildJourney(goal, p) : []), [goal, p])
  const plan = useMemo(() => (goal ? goalPlan(goal, p, profile) : null), [goal, p, profile])
  const [preview, setPreview] = useState(false)

  if (!goal || !plan) {
    return (
      <>
        <PageHeader kicker="My Path" title="Your path" lead="Pick a goal and we map every step to it." />
        <Empty icon={Compass} title="No goal yet" body="Play the Career Finder for three matches, or browse careers and set one as your goal." action={{ to: '/finder', label: 'Find a direction' }} />
        <p className="small muted" style={{ textAlign: 'center', marginTop: 12 }}>
          Or <Link to="/careers">browse all careers</Link>
        </p>
      </>
    )
  }

  const board = getBoard(p.boardId)
  const stage = getStage(stageForGrade(p.boardId, p.grade))
  const subjects = subjectsForGrade(p.boardId, p.grade, p.streamId)
  const must = new Set(goal.subjects.must)
  const pathway = goal.pathways[p.boardId]
  const name = short(goal.title)

  return (
    <div className="path-page">
      <PageHeader
        kicker="My Path"
        title={`From grade ${p.grade} to ${name}`}
        lead={`${journey.length} steps, about ${journey[journey.length - 1]?.yearsFromNow ?? 0} years. You are at the first.`}
        action={
          <Link to="/careers" className="btn sm">
            Change goal
          </Link>
        }
      />

      <div className="grid cols-2 section">
        <section className="card" aria-label="Your journey">
          <h3>
            <MapPin size={18} aria-hidden="true" /> Every step
          </h3>
          <PathStrip milestones={journey} />
        </section>

        <div className="stack">
          <section className="card">
            <h3>
              <BookOpen size={18} aria-hidden="true" /> This year
            </h3>
            <p className="small" style={{ color: 'var(--text-2)' }}>
              <b>{board.stageLabels[stage.id]}</b> · {stage.summary}
            </p>
            {subjects.length > 0 && (
              <div className="chips" style={{ marginBottom: 12 }}>
                {subjects.map((s) => (
                  <span key={s.id} className={`chip ${must.has(s.id) ? 'must' : ''}`} title={must.has(s.id) ? `Must-have for ${name}` : undefined}>
                    {s.name}
                  </span>
                ))}
              </div>
            )}
            <Link to="/curriculum" className="small">
              Open curriculum <ArrowRight size={14} className="inline-icon" aria-hidden="true" />
            </Link>
          </section>

          <section className="card">
            <h3>
              <Layers size={18} aria-hidden="true" /> Groups to choose
            </h3>
            <ul className="path-groups">
              <li>
                <span className="small">{board.stageLabels.secondary}</span>
                <b>{getStream(pathway.secondary)?.name ?? pathway.secondary}</b>
              </li>
              <li>
                <span className="small">{board.stageLabels['higher-secondary']}</span>
                <b>{getStream(pathway.higherSecondary)?.name ?? pathway.higherSecondary}</b>
              </li>
            </ul>
            {plan.streamMatches === true && <span className="badge good">On track</span>}
            {plan.streamMatches === false && <span className="badge warn">Different from your group</span>}
            {pathway.note && (
              <p className="small muted" style={{ margin: '8px 0 0' }}>
                {pathway.note}
              </p>
            )}
          </section>

          <section className="card">
            <h3>
              <GraduationCap size={18} aria-hidden="true" /> Tests and degrees
            </h3>
            {plan.entranceTests.length > 0 && (
              <p className="small" style={{ marginBottom: 6 }}>
                <b>Tests:</b> {plan.entranceTests.join(', ')}
              </p>
            )}
            <p className="small" style={{ marginBottom: 6 }}>
              <b>Degrees:</b> {plan.degrees.join(', ')}
            </p>
            <p className="small muted" style={{ margin: 0 }}>
              {plan.institutions.join(' · ')}
            </p>
          </section>

          <section className="card accent">
            <h3>
              <Eye size={18} aria-hidden="true" /> Peer into your future
            </h3>
            <p className="small" style={{ color: 'var(--text-2)' }}>
              See life as a {name.toLowerCase()}, year by year.
            </p>
            <button className="btn primary" onClick={() => setPreview(true)}>
              <Eye size={18} aria-hidden="true" /> Start preview
            </button>
          </section>
        </div>
      </div>

      {preview && <FuturePreview careerId={goal.id} onClose={() => setPreview(false)} />}
    </div>
  )
}
