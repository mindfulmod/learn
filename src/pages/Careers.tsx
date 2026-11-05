import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Compass, Eye, Lightbulb, Star } from 'lucide-react'
import { CAREERS, CLUSTER_NAMES } from '../data/careers'
import { careerLife, formatPkr } from '../data/careerLife'
import { CLUSTER_META, tint } from '../design'
import { hasSignal, rankCareers } from '../engine/careers'
import { buildProfile } from '../engine/profile'
import { useStore } from '../store/store'
import { FuturePreview } from '../components/FuturePreview'
import { IconTile } from '../components/ui'
import { PageHeader } from '../components/PageHeader'
import type { CareerCluster } from '../types'

export function Careers() {
  const { state } = useStore()
  const nav = useNavigate()
  const [cluster, setCluster] = useState<CareerCluster | 'all'>('all')
  const [query, setQuery] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const profile = useMemo(() => buildProfile(state), [state])
  const signal = hasSignal(state)
  const ranked = useMemo(() => (signal ? rankCareers(state, profile) : CAREERS.map((career) => ({ career, score: null as number | null }))), [signal, state, profile])

  const visible = ranked.filter((r) => (cluster === 'all' || r.career.cluster === cluster) && (!query || r.career.title.toLowerCase().includes(query.toLowerCase()) || r.career.summary.toLowerCase().includes(query.toLowerCase())))

  return (
    <>
      <PageHeader
        kicker="Explore"
        title="Careers"
        lead={
          signal
            ? 'Ranked by how well each career fits what we know about you. Preview any of them to see your path, year by year.'
            : 'Browse careers and preview what each one would look like for you, year by year.'
        }
        action={
          <Link to="/finder" className="btn sm">
            <Compass size={16} aria-hidden="true" />
            {state.finder ? 'My matches' : 'Not sure? Try the finder'}
          </Link>
        }
      />

      {!signal && state.finder && (
        <Link to="/discover" className="btn" style={{ marginBottom: 20 }}>
          <Lightbulb size={18} aria-hidden="true" /> Sharpen these results with the discovery quiz
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
              <span className="badge tinted" style={{ marginBottom: 8 }}>
                {CLUSTER_NAMES[career.cluster]}
              </span>
              <h3 style={{ overflowWrap: 'anywhere' }}>{career.title}</h3>
              <p className="small" style={{ margin: '0 0 12px', color: 'var(--text-2)' }}>
                {career.summary}
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
