import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Eye } from 'lucide-react'
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
import { Screen } from '../components/Screen'
import { PathRoad } from '../components/PathRoad'
import { FuturePreview } from '../components/FuturePreview'
import { Empty, IconTile } from '../components/ui'
import '../styles/home.css'

function short(title: string): string {
  return title.split(' (')[0]
}

/** Drop "(…)" asides so names stay plain. */
function plain(text: string): string {
  return text.replace(/\s*\([^)]*\)/g, '').trim()
}

function clipWords(text: string, n: number): string {
  const words = text.trim().split(/\s+/)
  if (words.length <= n) return text.trim()
  return words.slice(0, n).join(' ').replace(/[.,;:!?]+$/, '') + '…'
}

/** One line of at most `n` words: the whole detail if short, else its first sentence. */
function oneLine(detail: string, n: number): string {
  const text = plain(detail).replace(/\s+\./g, '.')
  if (text.split(/\s+/).length <= n) return text
  const first = text.split(/(?<=\.)\s+/)[0]
  return clipWords(first, n)
}

export function Path() {
  const { state } = useStore()
  const p = state.profile!
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined
  const profile = useMemo(() => buildProfile(state), [state])
  const journey = useMemo(() => (goal ? buildJourney(goal, p) : []), [goal, p])
  const plan = useMemo(() => (goal ? goalPlan(goal, p, profile) : null), [goal, p, profile])
  const [preview, setPreview] = useState(false)
  const [selected, setSelected] = useState(0)
  const junior = modeFor(p) === 'junior'

  if (!goal || !plan) {
    if (junior) {
      return (
        <Screen header={<PageHeader themed hue={36} variant={0} kicker="My Path" title="Your path" />}>
          <div className="card pastel empty" style={{ textAlign: 'center' }}>
            <IconTile hue={36} icon={Compass} large />
            <h3>Pick a dream first.</h3>
            <Link to="/careers" className="btn primary">
              See the paths
            </Link>
          </div>
        </Screen>
      )
    }
    return (
      <Screen header={<PageHeader themed hue={36} variant={0} kicker="My Path" title="Your path" lead="Pick a goal and we map every step to it." />}>
        <Empty icon={Compass} title="No goal yet" body="Play the Career Finder for three matches, or browse careers and set one as your goal." action={{ to: '/finder', label: 'Find a direction' }} />
        <p className="small muted" style={{ textAlign: 'center', marginTop: 12 }}>
          Or <Link to="/careers">browse all careers</Link>
        </p>
      </Screen>
    )
  }

  const board = getBoard(p.boardId)
  const stage = getStage(stageForGrade(p.boardId, p.grade))
  const subjects = subjectsForGrade(p.boardId, p.grade, p.streamId)
  const must = new Set(goal.subjects.must)
  const pathway = goal.pathways[p.boardId]
  const name = short(goal.title)
  const years = journey[journey.length - 1]?.yearsFromNow ?? 0
  const mustCount = subjects.filter((s) => must.has(s.id)).length
  const sel = journey[Math.min(selected, journey.length - 1)]
  const secName = getStream(pathway.secondary)?.name ?? pathway.secondary
  const highName = getStream(pathway.higherSecondary)?.name ?? pathway.higherSecondary

  const chips = subjects.length > 0 && (
    <div className="chips">
      {subjects.map((s) => (
        <span key={s.id} className={`chip ${must.has(s.id) ? 'must' : ''}`} title={must.has(s.id) ? `Must-have for ${name}` : undefined}>
          {s.name}
        </span>
      ))}
    </div>
  )

  const yearLine = junior
    ? `${subjects.length} subjects this year.`
    : mustCount
      ? `${plain(board.stageLabels[stage.id])}. ${subjects.length} subjects, ${mustCount} key for ${name}.`
      : `${plain(board.stageLabels[stage.id])}. ${subjects.length} subjects this year.`

  const detail = sel && (
    <section className="card road-detail" aria-live="polite">
      <span className="kicker">
        Age {sel.age} · Step {selected + 1} of {journey.length}
      </span>
      <h3>{junior ? clipWords(plain(sel.title), 6) : plain(sel.title)}</h3>
      <p>{oneLine(sel.detail, junior ? 10 : 14)}</p>
    </section>
  )

  return (
    <Screen
      header={
        <PageHeader
          themed
          hue={36}
          variant={0}
          kicker="My Path"
          title={junior ? `Grade ${p.grade} to ${name}` : `From grade ${p.grade} to ${name}`}
          lead={junior ? undefined : `${journey.length} steps, about ${years} years`}
          action={
            <Link to="/careers" className="btn sm">
              Change goal
            </Link>
          }
        />
      }
    >
      <div className="road-page section">
        <section className="road-main" aria-label="Your journey">
          <PathRoad milestones={journey} selected={selected} onSelect={setSelected} junior={junior} />
          <p className="small muted road-hint">{junior ? 'Tap a step to look closer.' : 'Tap a step, or use the arrow keys.'}</p>
        </section>

        <div className="road-side">
          {detail}
          <button className="btn primary road-cta" onClick={() => setPreview(true)}>
            <Eye size={18} aria-hidden="true" /> {junior ? 'See my future' : 'Peer into your future'}
          </button>

          <div className="rail-groups">
            <section className="rail-group" aria-label="This year">
              <span className="kicker">This year</span>
              <p className="rail-group-line">{yearLine}</p>
              {chips}
              <Link to="/curriculum" className="small">
                {junior ? 'Open my subjects' : 'Open curriculum'} <ArrowRight size={14} className="inline-icon" aria-hidden="true" />
              </Link>
            </section>

            <section className="rail-group" aria-label="Groups to choose">
              <span className="kicker">Groups to choose</span>
              <p className="rail-group-line">
                {plain(board.stageLabels.secondary)}: {secName}. {plain(board.stageLabels['higher-secondary'])}: {highName}.
              </p>
              {plan.streamMatches === true && <span className="badge good">On track</span>}
              {plan.streamMatches === false && <span className="badge warn">Different from your group</span>}
            </section>
          </div>
        </div>
      </div>

      {preview && <FuturePreview careerId={goal.id} onClose={() => setPreview(false)} />}
    </Screen>
  )
}
