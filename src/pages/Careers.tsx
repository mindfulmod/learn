import { useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Compass, Eye, Lightbulb, Star } from 'lucide-react'
import { CAREERS, getCareer } from '../data/careers'
import { careerLife, formatPkr } from '../data/careerLife'
import { PATHS, pathFor, pathsForInterests, type PathMeta } from '../data/paths'
import { PATH_WORD } from '../data/pictureFinder'
import { CLUSTER_META, tint } from '../design'
import { hasSignal, rankCareers } from '../engine/careers'
import { modeFor } from '../engine/mode'
import { buildProfile } from '../engine/profile'
import { useStore } from '../store/store'
import { CareerPane } from '../components/CareerPane'
import { FuturePreview } from '../components/FuturePreview'
import { PayCoins } from '../components/PayBand'
import { PageHeader } from '../components/PageHeader'
import { Screen } from '../components/Screen'
import { IconTile } from '../components/ui'
import type { Career, CareerCluster } from '../types'
import '../styles/careers.css'

const EXPLORE_HUE = 320

/** First sentence of a summary, capped at `max` words. */
function firstSentence(text: string, max = 14): string {
  const s = text.split(/(?<=[.!?])\s+/)[0].trim()
  const words = s.split(/\s+/)
  if (words.length <= max) return s
  return words.slice(0, max).join(' ').replace(/[.,;:!?]+$/, '') + '…'
}

/** Title without the bracketed suffix. */
function shortTitle(title: string): string {
  return title.split(' (')[0]
}

function isCluster(v: string | null): v is CareerCluster {
  return !!v && PATHS.some((p) => p.cluster === v)
}

/**
 * Explore as master-detail: the nine paths on the left, the chosen path's
 * careers (or one career) on the right. Selection lives in the URL so the
 * back button works, and nothing jumps to a new page.
 */
export function Careers() {
  const { state } = useStore()
  const junior = modeFor(state.profile) === 'junior'
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const paneRef = useRef<HTMLElement>(null)

  const profile = useMemo(() => buildProfile(state), [state])
  const signal = hasSignal(state)
  const scores = useMemo(() => {
    const m = new Map<string, number>()
    if (signal) for (const r of rankCareers(state, profile)) m.set(r.career.id, r.score)
    return m
  }, [signal, state, profile])

  const career = getCareer(params.get('career') ?? '')
  const pathParam = params.get('path')
  const forYou = useMemo(() => pathsForInterests(state.interests), [state.interests])
  const cluster: CareerCluster = career?.cluster ?? (isCluster(pathParam) ? pathParam : (forYou[0]?.cluster ?? 'computing-data'))
  const path = pathFor(cluster)
  const q = junior ? '' : query.trim().toLowerCase()

  const revealPane = () => {
    const el = paneRef.current
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }
  const selectPath = (c: CareerCluster) => {
    setQuery('')
    setParams({ path: c })
    revealPane()
  }
  const selectCareer = (id: string) => {
    const c = getCareer(id)
    if (!c) return
    setParams({ path: c.cluster, career: id })
    revealPane()
  }
  const backToPath = () => setParams({ path: cluster })

  const byFit = (a: Career, b: Career) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0)
  const pathCareers = useMemo(() => {
    const lead = (id: string) => {
      const i = path.lead.indexOf(id)
      return i < 0 ? 99 : i
    }
    return CAREERS.filter((c) => c.cluster === cluster).sort((a, b) => lead(a.id) - lead(b.id))
  }, [cluster, path])
  const searchHits = q ? CAREERS.filter((c) => c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)).sort(byFit) : []

  const row = (c: Career) => {
    const meta = CLUSTER_META[c.cluster]
    const life = careerLife(c.id)
    const score = scores.get(c.id)
    const isGoal = state.goals.includes(c.id)
    return (
      <li key={c.id} className="cr-row" style={tint(meta.hue)}>
        <button type="button" className="cr-row-main" onClick={() => selectCareer(c.id)}>
          <IconTile hue={meta.hue} icon={meta.icon} />
          <span className="cr-row-body">
            <b>
              {shortTitle(c.title)}
              {isGoal && (
                <span className="badge primary cr-row-badge">
                  <Star size={12} fill="currentColor" className="inline-icon" aria-hidden="true" /> Your goal
                </span>
              )}
            </b>
            <span className="cr-row-line">{firstSentence(c.summary, 14)}</span>
            {life && (
              <span className="cr-row-meta">
                {junior ? <PayCoins life={life} /> : <span className="cr-row-pay">Rs {formatPkr(life.pay.entry[0])}+ /month to start</span>}
                {!junior && score !== undefined && <span className={`badge ${score >= 70 ? 'good' : score >= 50 ? 'warn' : ''}`}>{score}% fit</span>}
              </span>
            )}
          </span>
        </button>
        <button type="button" className="btn sm primary cr-row-preview" onClick={() => setPreview(c.id)}>
          <Eye size={16} aria-hidden="true" /> Preview
        </button>
      </li>
    )
  }

  const pathItem = (p: PathMeta) => (
    <button
      key={p.cluster}
      type="button"
      className={`master-item ${p.cluster === cluster ? 'active' : ''}`}
      style={tint(p.hue)}
      aria-current={p.cluster === cluster ? 'true' : undefined}
      onClick={() => selectPath(p.cluster)}
    >
      <IconTile hue={p.hue} icon={CLUSTER_META[p.cluster].icon} />
      <span className="cr-item-title">{p.title}</span>
      {junior && <span className="badge tinted">{PATH_WORD[p.cluster]}</span>}
    </button>
  )

  let detail
  if (career) {
    detail = (
      <>
        <button type="button" className="cr-back" onClick={backToPath}>
          <ArrowLeft size={16} aria-hidden="true" /> All {path.title}
        </button>
        <CareerPane key={career.id} careerId={career.id} onPreview={() => setPreview(career.id)} onRelated={selectCareer} />
      </>
    )
  } else if (q) {
    detail = (
      <section className="card">
        <h2 className="cr-list-title">Search results</h2>
        {searchHits.length ? <ul className="cr-rows">{searchHits.map(row)}</ul> : <p className="muted">No careers match that search.</p>}
      </section>
    )
  } else {
    detail = (
      <section className="card pastel cr-path" style={tint(path.hue)}>
        <h2 className="cr-list-title">{path.title}</h2>
        <p className="cr-promise">{path.promise}</p>
        <ul className="cr-rows">{pathCareers.map(row)}</ul>
      </section>
    )
  }

  return (
    <Screen
      wide
      header={
        <PageHeader
          themed
          hue={EXPLORE_HUE}
          kicker="Explore"
          title={junior ? 'Which path looks fun?' : 'Careers'}
          lead={junior ? undefined : 'Pick a path, then a career. Preview any to see your future.'}
          action={
            junior ? undefined : (
              <Link to="/finder" className="btn sm">
                <Compass size={16} aria-hidden="true" />
                {state.finder ? 'My matches' : 'Not sure? Try the finder'}
              </Link>
            )
          }
        />
      }
    >
      <div className="master-detail">
        <nav className="master card cr-master" aria-label="Paths">
          {!junior && (
            <input className="search cr-search" type="search" placeholder="Search careers" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search careers" />
          )}
          <div className="master-list cr-master-list">{PATHS.map(pathItem)}</div>
          <div className="tabs pills cr-pills">
            {PATHS.map((p) => {
              const PathIcon = CLUSTER_META[p.cluster].icon
              return (
                <button
                  key={p.cluster}
                  type="button"
                  className={`btn sm ${p.cluster === cluster ? 'active' : ''}`}
                  style={tint(p.hue)}
                  aria-pressed={p.cluster === cluster}
                  onClick={() => selectPath(p.cluster)}
                >
                  <PathIcon size={14} aria-hidden="true" /> {junior ? PATH_WORD[p.cluster] : p.title}
                </button>
              )
            })}
          </div>
          {!junior && !signal && state.finder && (
            <Link to="/discover" className="cr-sharpen small">
              <Lightbulb size={16} aria-hidden="true" /> Sharpen results with the discovery quiz
            </Link>
          )}
        </nav>
        <section className="detail-pane" ref={paneRef}>
          {detail}
        </section>
      </div>
      {preview && <FuturePreview careerId={preview} onClose={() => setPreview(null)} />}
    </Screen>
  )
}
