import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Compass, Eye, Lightbulb, Star } from 'lucide-react'
import { CAREERS, CLUSTER_NAMES } from '../data/careers'
import { careerLife, formatPkr } from '../data/careerLife'
import { PATHS, pathsForInterests } from '../data/paths'
import { CLUSTER_META, tint } from '../design'
import { hasSignal, rankCareers } from '../engine/careers'
import { modeFor } from '../engine/mode'
import { buildProfile } from '../engine/profile'
import { useStore } from '../store/store'
import { FuturePreview } from '../components/FuturePreview'
import { IconTile } from '../components/ui'
import { PageHeader } from '../components/PageHeader'
import type { CareerCluster } from '../types'
import '../styles/home.css'

const EXPLORE_HUE = 320

/** The first sentence of a summary, capped at `max` words. */
function firstSentence(text: string, max = 40): string {
  const dot = text.indexOf('. ')
  const s = (dot >= 0 ? text.slice(0, dot + 1) : text).trim()
  const words = s.split(/\s+/)
  if (words.length <= max) return s
  return words.slice(0, max).join(' ').replace(/[.,;:!?]+$/, '') + '…'
}

function short(title: string): string {
  return title.split(' (')[0]
}

export function Careers() {
  const { state } = useStore()
  return modeFor(state.profile) === 'junior' ? <JuniorExplore /> : <SeniorExplore />
}

// ------------------------------------------------------------------ Junior

function JuniorExplore() {
  const { state } = useStore()
  const [params] = useSearchParams()
  const [preview, setPreview] = useState<string | null>(null)
  const path = PATHS.find((p) => p.cluster === params.get('path'))
  const forYou = useMemo(() => pathsForInterests(state.interests).map((p) => p.cluster), [state.interests])
  const ordered = useMemo(() => [...PATHS].sort((a, b) => (forYou.includes(a.cluster) ? forYou.indexOf(a.cluster) : 99) - (forYou.includes(b.cluster) ? forYou.indexOf(b.cluster) : 99)), [forYou])

  if (!path) {
    return (
      <>
        <PageHeader themed hue={EXPLORE_HUE} kicker="Explore" title="Which path looks fun?" />
        <div className="grid cols-3 path-grid">
          {ordered.map((p) => (
            <Link key={p.cluster} to={`?path=${p.cluster}`} className="card pastel lift" style={tint(p.hue)}>
              <div className="path-top">
                <IconTile hue={p.hue} icon={CLUSTER_META[p.cluster].icon} />
                {forYou.includes(p.cluster) && <span className="badge tinted">For you</span>}
              </div>
              <h3>{p.title}</h3>
              <p>{p.promise}</p>
            </Link>
          ))}
        </div>
      </>
    )
  }

  const meta = CLUSTER_META[path.cluster]
  const careers = CAREERS.filter((c) => c.cluster === path.cluster).sort((a, b) => {
    const ia = path.lead.indexOf(a.id)
    const ib = path.lead.indexOf(b.id)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
  })

  return (
    <>
      <Link to="/careers" className="path-back">
        <ArrowLeft size={18} aria-hidden="true" /> All paths
      </Link>
      <div style={tint(path.hue)}>
        <PageHeader themed hue={path.hue} kicker="Explore" title={path.title} lead={path.promise} />
      </div>
      <section className="card" style={tint(path.hue)}>
        <ul className="steps career-rows">
          {careers.map((c) => (
            <li key={c.id}>
              <IconTile hue={path.hue} icon={meta.icon} />
              <span className="step-body">
                <b>{short(c.title)}</b>
                <span>{firstSentence(c.summary, 14)}</span>
              </span>
              <button type="button" className="btn sm primary" onClick={() => setPreview(c.id)}>
                <Eye size={16} aria-hidden="true" /> Preview
              </button>
            </li>
          ))}
        </ul>
      </section>
      {preview && <FuturePreview careerId={preview} onClose={() => setPreview(null)} />}
    </>
  )
}

// ------------------------------------------------------------------ Senior

function SeniorExplore() {
  const { state } = useStore()
  const nav = useNavigate()
  const [cluster, setCluster] = useState<CareerCluster | 'all'>('all')
  const [query, setQuery] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const profile = useMemo(() => buildProfile(state), [state])
  const signal = hasSignal(state)
  const ranked = useMemo(() => (signal ? rankCareers(state, profile) : CAREERS.map((career) => ({ career, score: null as number | null }))), [signal, state, profile])

  const q = query.toLowerCase()
  const visible = ranked.filter((r) => (cluster === 'all' || r.career.cluster === cluster) && (!q || r.career.title.toLowerCase().includes(q) || r.career.summary.toLowerCase().includes(q)))

  return (
    <>
      <PageHeader
        themed
        hue={EXPLORE_HUE}
        kicker="Explore"
        title="Careers"
        lead={signal ? 'Ranked by fit. Preview any to see your path.' : 'Preview any career to see your path, year by year.'}
        action={
          <Link to="/finder" className="btn sm">
            <Compass size={16} aria-hidden="true" />
            {state.finder ? 'My matches' : 'Not sure? Try the finder'}
          </Link>
        }
      />

      {!signal && state.finder && (
        <Link to="/discover" className="btn" style={{ marginBottom: 20 }}>
          <Lightbulb size={18} aria-hidden="true" /> Sharpen results with the discovery quiz
        </Link>
      )}

      <div className="row section" style={{ alignItems: 'stretch', marginBottom: 14 }}>
        <input className="search" type="text" placeholder="Search careers" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search careers" />
      </div>
      <div className="tabs pills">
        <button className={`btn sm ${cluster === 'all' ? 'active' : ''}`} onClick={() => setCluster('all')}>
          All
        </button>
        {(Object.keys(CLUSTER_NAMES) as CareerCluster[]).map((c) => {
          const ClusterIcon = CLUSTER_META[c].icon
          return (
            <button key={c} className={`btn sm ${cluster === c ? 'active' : ''}`} onClick={() => setCluster(c)}>
              <ClusterIcon size={14} aria-hidden="true" /> {CLUSTER_NAMES[c]}
            </button>
          )
        })}
      </div>

      {/* auto-fill: one column on phones, two on tablets, three on wide screens */}
      <div className="grid cols-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))' }}>
        {visible.map(({ career, score }) => {
          const isGoal = state.goals.includes(career.id)
          const meta = CLUSTER_META[career.cluster]
          const life = careerLife(career.id)
          const seen = state.previewed.includes(career.id)
          return (
            <div
              key={career.id}
              role="link"
              tabIndex={0}
              onClick={() => nav(`/careers/${career.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') nav(`/careers/${career.id}`)
              }}
              className="card lift career-card"
              style={{ cursor: 'pointer', minWidth: 0, ...tint(meta.hue) }}
            >
              <div className="row between" style={{ alignItems: 'flex-start' }}>
                <IconTile hue={meta.hue} icon={meta.icon} />
                <span className="row" style={{ gap: 6 }}>
                  {isGoal && (
                    <span className="badge primary">
                      <Star size={12} fill="currentColor" className="inline-icon" aria-hidden="true" />
                      Your goal
                    </span>
                  )}
                  {!isGoal && seen && <span className="badge">Previewed</span>}
                  {score !== null && <span className={`badge ${score >= 70 ? 'good' : score >= 50 ? 'warn' : ''}`}>{score}% fit</span>}
                </span>
              </div>
              <h3 style={{ overflowWrap: 'anywhere', marginTop: 12 }}>{career.title}</h3>
              <p className="small" style={{ margin: '0 0 12px', color: 'var(--text-2)' }}>
                {firstSentence(career.summary)}
              </p>
              {life && (
                <p className="small muted" style={{ margin: '0 0 12px' }}>
                  {life.yearsOfStudy + (life.training?.years ?? 0)} yrs study · Rs {formatPkr(life.pay.entry[0])}+ /month to start · {life.demand} demand
                </p>
              )}
              <button
                className="btn sm primary"
                onClick={(e) => {
                  e.stopPropagation()
                  setPreview(career.id)
                }}
              >
                <Eye size={16} aria-hidden="true" /> Preview my future
              </button>
            </div>
          )
        })}
      </div>
      {!visible.length && <p className="muted">No careers match that search.</p>}
      {preview && <FuturePreview careerId={preview} onClose={() => setPreview(null)} />}
    </>
  )
}
