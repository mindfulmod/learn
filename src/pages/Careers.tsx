import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CAREERS, CLUSTER_NAMES } from '../data/careers'
import { hasSignal, rankCareers } from '../engine/careers'
import { buildProfile } from '../engine/profile'
import { useStore } from '../store/store'
import type { CareerCluster } from '../types'

export function Careers() {
  const { state } = useStore()
  const [cluster, setCluster] = useState<CareerCluster | 'all'>('all')
  const [query, setQuery] = useState('')
  const profile = useMemo(() => buildProfile(state), [state])
  const signal = hasSignal(state)
  const ranked = useMemo(() => (signal ? rankCareers(state, profile) : CAREERS.map((career) => ({ career, score: null as number | null }))), [signal, state, profile])

  const visible = ranked.filter((r) => (cluster === 'all' || r.career.cluster === cluster) && (!query || r.career.title.toLowerCase().includes(query.toLowerCase()) || r.career.summary.toLowerCase().includes(query.toLowerCase())))

  return (
    <>
      <h1>Careers</h1>
      <p className="muted">
        {signal
          ? 'Ranked by how well each career matches your discovery answers and practice results. Open one to see the exact path from your grade.'
          : 'Browse careers and the school path each one needs. Take the discovery quiz to see fit scores.'}
      </p>
      {!signal && (
        <Link to="/discover" className="btn primary" style={{ marginBottom: 16 }}>
          Take the discovery quiz
        </Link>
      )}

      <div className="row section" style={{ alignItems: 'stretch' }}>
        <input className="search" type="text" placeholder="Search careers" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search careers" />
      </div>
      <div className="tabs">
        <button className={`btn sm ${cluster === 'all' ? 'active' : ''}`} onClick={() => setCluster('all')}>
          All
        </button>
        {(Object.keys(CLUSTER_NAMES) as CareerCluster[]).map((c) => (
          <button key={c} className={`btn sm ${cluster === c ? 'active' : ''}`} onClick={() => setCluster(c)}>
            {CLUSTER_NAMES[c]}
          </button>
        ))}
      </div>

      <div className="grid cols-2">
        {visible.map(({ career, score }) => {
          const isGoal = state.goals.includes(career.id)
          return (
            <Link key={career.id} to={`/careers/${career.id}`} className="card" style={{ color: 'inherit', textDecoration: 'none' }}>
              <div className="row between" style={{ marginBottom: 6 }}>
                <span className="badge">{CLUSTER_NAMES[career.cluster]}</span>
                <span className="row" style={{ gap: 6 }}>
                  {isGoal && <span className="badge primary">Your goal</span>}
                  {score !== null && <span className={`badge ${score >= 70 ? 'good' : score >= 50 ? 'warn' : ''}`}>{score}% fit</span>}
                </span>
              </div>
              <h3>{career.title}</h3>
              <p className="small muted" style={{ margin: 0 }}>
                {career.summary}
              </p>
            </Link>
          )
        })}
      </div>
      {!visible.length && <p className="muted">No careers match that search.</p>}
    </>
  )
}
