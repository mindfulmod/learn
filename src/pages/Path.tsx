import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Compass, Eye, GraduationCap, Hourglass, Layers, MapPin, School } from 'lucide-react'
import { getBoard, getStage, stageForGrade } from '../data/boards'
import { getCareer } from '../data/careers'
import { subjectsForGrade } from '../data/curriculum'
import { getStream } from '../data/streams'
import { buildJourney } from '../engine/journey'
import { modeFor } from '../engine/mode'
import { goalPlan } from '../engine/plan'
import { buildProfile } from '../engine/profile'
import { useStore } from '../store/store'
import { PageHeader } from '../components/PageHeader'
import { PathStrip } from '../components/PathStrip'
import { FuturePreview } from '../components/FuturePreview'
import { Empty, IconTile } from '../components/ui'
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
  const junior = modeFor(p) === 'junior'

  if (!goal || !plan) {
    if (junior) {
      return (
        <>
          <PageHeader themed hue={36} variant={0} kicker="My Path" title="Your path" lead="Every step to your dream, one at a time." />
          <div className="card pastel empty" style={{ textAlign: 'center' }}>
            <IconTile hue={36} icon={Compass} large />
            <h3>Pick a dream first.</h3>
            <Link to="/careers" className="btn primary">
              See the paths
            </Link>
          </div>
        </>
      )
    }
    return (
      <>
        <PageHeader themed hue={36} variant={0} kicker="My Path" title="Your path" lead="Pick a goal and we map every step to it." />
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
  const years = journey[journey.length - 1]?.yearsFromNow ?? 0

  const chips = subjects.length > 0 && (
    <div className="chips" style={{ marginBottom: 12 }}>
      {subjects.map((s) => (
        <span key={s.id} className={`chip ${must.has(s.id) ? 'must' : ''}`} title={must.has(s.id) ? `Must-have for ${name}` : undefined}>
          {s.name}
        </span>
      ))}
    </div>
  )

  const groupsCard = (
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
  )

  const testsList = (
    <ul className="steps">
      {plan.entranceTests.length > 0 && (
        <li>
          <span className="num" aria-hidden="true">
            <Hourglass size={18} />
          </span>
          <span className="step-body">
            <b>Tests</b>
            <span>{plan.entranceTests.join(', ')}</span>
          </span>
        </li>
      )}
      <li>
        <span className="num" aria-hidden="true">
          <GraduationCap size={18} />
        </span>
        <span className="step-body">
          <b>Degrees</b>
          <span>{plan.degrees.join(', ')}</span>
        </span>
      </li>
      <li>
        <span className="num" aria-hidden="true">
          <School size={18} />
        </span>
        <span className="step-body">
          <b>Where to study</b>
          <span>{plan.institutions.join(' · ')}</span>
        </span>
      </li>
    </ul>
  )

  if (junior) {
    return (
      <div className="path-page">
        <PageHeader themed hue={36} variant={0} kicker="My Path" title={`Grade ${p.grade} to ${name}`} lead={`${journey.length} steps. You are on the first one.`} />

        <section className="card pastel section" aria-label="Your journey">
          <PathStrip milestones={journey} />
          <button className="btn primary" onClick={() => setPreview(true)}>
            <Eye size={18} aria-hidden="true" /> See my future
          </button>
        </section>

        <section className="card section">
          <h3>
            <BookOpen size={18} aria-hidden="true" /> This year
          </h3>
          {chips}
          <Link to="/curriculum" className="small">
            Open my subjects <ArrowRight size={14} className="inline-icon" aria-hidden="true" />
          </Link>
        </section>

        <details className="section">
          <summary>More about the path</summary>
          <div className="stack" style={{ marginTop: 12 }}>
            {groupsCard}
            {testsList}
          </div>
        </details>

        {preview && <FuturePreview careerId={goal.id} onClose={() => setPreview(false)} />}
      </div>
    )
  }

  return (
    <div className="path-page">
      <PageHeader
        themed
        hue={36}
        variant={0}
        kicker="My Path"
        title={`From grade ${p.grade} to ${name}`}
        lead={`${journey.length} steps, about ${years} years. You are at the first.`}
        action={
          <Link to="/careers" className="btn sm">
            Change goal
          </Link>
        }
      />

      <div className="grid cols-2 section">
        <section className="card pastel" aria-label="Your journey">
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
            {chips}
            <Link to="/curriculum" className="small">
              Open curriculum <ArrowRight size={14} className="inline-icon" aria-hidden="true" />
            </Link>
          </section>

          {groupsCard}

          <section className="card soft">
            <h3>
              <GraduationCap size={18} aria-hidden="true" /> Tests and degrees
            </h3>
            {testsList}
          </section>

          <section className="card accent">
            <h3>
              <Eye size={18} aria-hidden="true" /> Peer into your future
            </h3>
            <p className="small" style={{ color: 'var(--text-2)' }}>
              Life as a {name.toLowerCase()}, year by year.
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
