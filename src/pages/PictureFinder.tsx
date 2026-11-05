import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Eye, Play, RefreshCw, Volume2 } from 'lucide-react'
import { PATH_WORD, PICTURE_PREFIX, PICTURE_ROUNDS, isPictureAnswers } from '../data/pictureFinder'
import { pathFor } from '../data/paths'
import { scorePictureFinder } from '../engine/finder'
import { speak } from '../engine/mode'
import { buildProfile } from '../engine/profile'
import { useStore } from '../store/store'
import { CLUSTER_META, tint } from '../design'
import { FuturePreview } from '../components/FuturePreview'
import { IconTile } from '../components/ui'
import { Orb } from '../components/Orb'
import { Scene } from '../components/Scene'
import '../styles/finder.css'

const ADVANCE_MS = 400
const TOTAL = PICTURE_ROUNDS.length

function SpeakButton({ text, label = 'Read aloud', iconOnly }: { text: string; label?: string; iconOnly?: boolean }) {
  return (
    <button className={`btn pf-speak${iconOnly ? ' icon-only' : ''}`} onClick={() => speak(text)} aria-label={label}>
      <Volume2 size={22} aria-hidden="true" />
      {!iconOnly && label}
    </button>
  )
}

/**
 * Picture finder for grades 1 to 5: eight "would you rather" rounds of two
 * illustrated scenes, then three one-word paths. No reading required.
 */
export function PictureFinder({ onSwitch }: { onSwitch?: () => void }) {
  const { state, setFinder } = useStore()

  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [picked, setPicked] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const done = isPictureAnswers(state.finder)
  const profile = useMemo(() => buildProfile(state), [state])
  const result = useMemo(() => (done && state.finder ? scorePictureFinder(state.finder, state, profile) : null), [done, state, profile])

  const round = PICTURE_ROUNDS[index]
  const playing = !done && started

  const choose = useCallback(
    (sceneId: string) => {
      if (picked) return
      const next = { ...answers, [round.id]: PICTURE_PREFIX + sceneId }
      setAnswers(next)
      setPicked(sceneId)
      timer.current = window.setTimeout(() => {
        setPicked(null)
        if (index + 1 >= TOTAL) {
          setFinder(next)
          window.scrollTo(0, 0)
        } else {
          setIndex(index + 1)
        }
      }, ADVANCE_MS)
    },
    [answers, index, picked, round, setFinder],
  )

  useEffect(() => {
    if (!playing) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === '1' || e.key === '2') {
        e.preventDefault()
        choose(round.scenes[Number(e.key) - 1].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [playing, round, choose])

  const back = () => {
    window.clearTimeout(timer.current)
    setPicked(null)
    if (index === 0) setStarted(false)
    else setIndex(index - 1)
  }

  const playAgain = () => {
    window.clearTimeout(timer.current)
    setFinder(null)
    setAnswers({})
    setIndex(0)
    setPicked(null)
    setPreview(null)
    setStarted(true)
    window.scrollTo(0, 0)
  }

  const switchLink = onSwitch && (
    <button className="pf-switch small" onClick={onSwitch}>
      Switch to the word version
    </button>
  )

  // ---- Intro -----------------------------------------------------------
  if (!done && !started) {
    return (
      <div className="finder finder-welcome pf">
        <Orb hue={320} size={160} variant={1} />
        <h1>Which would you rather do?</h1>
        <div className="pf-actions">
          <button className="btn primary pf-start" onClick={() => setStarted(true)}>
            <Play size={22} aria-hidden="true" />
            Start
          </button>
          <SpeakButton text="Which would you rather do? Tap the picture you like more." />
        </div>
        {switchLink}
      </div>
    )
  }

  // ---- Rounds ----------------------------------------------------------
  if (!done) {
    const [a, b] = round.scenes
    return (
      <div className="finder pf">
        <div className="progress-steps pf-dots" role="progressbar" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={index}>
          {PICTURE_ROUNDS.map((r, i) => (
            <span key={r.id} className={i < index || (i === index && picked) ? 'done' : i === index ? 'current' : ''} />
          ))}
        </div>
        <div key={round.id} className="finder-question">
          <div className="pf-prompt">
            <h2 className="finder-prompt">{round.prompt}</h2>
            <SpeakButton text={`${round.prompt}. ${a.say}, or ${b.say}`} label="Read aloud" iconOnly />
          </div>
          <div className="pf-choices" role="radiogroup" aria-label={round.prompt}>
            {round.scenes.map((s) => {
              const selected = picked === s.id
              return (
                <button
                  key={s.id}
                  role="radio"
                  aria-checked={selected}
                  aria-label={s.say}
                  className={`scene-choice${selected ? ' selected popped' : ''}`}
                  style={tint(s.hue)}
                  onClick={() => choose(s.id)}
                  disabled={!!picked && !selected}
                >
                  <Scene spec={s} />
                  <span className="scene-label">{s.label}</span>
                </button>
              )
            })}
          </div>
          <button className="finder-back pf-back" onClick={back}>
            <ArrowLeft size={18} aria-hidden="true" />
            Back
          </button>
        </div>
      </div>
    )
  }

  // ---- Results ---------------------------------------------------------
  if (!result) return null
  const words = result.topClusters.map((c) => PATH_WORD[c])
  return (
    <div className="finder pf">
      <div className="pf-prompt pf-result-head">
        <h1>You could be a…</h1>
        <SpeakButton text={`You could be ${words.map((w) => (/^[aeiou]/i.test(w) ? `an ${w}` : `a ${w}`)).join(', or ')}. Tap Peek to see more.`} iconOnly />
      </div>

      <div className="grid cols-3 section pf-results">
        {result.topClusters.map((c, rank) => {
          const path = pathFor(c)
          const meta = CLUSTER_META[c]
          const lead = path.lead[0]
          return (
            <article key={c} className="card pastel pf-path" style={{ ...tint(path.hue), animationDelay: `${rank * 80}ms` }}>
              <IconTile hue={path.hue} icon={meta.icon} large />
              <h2>{PATH_WORD[c]}</h2>
              <span className="small muted">{path.title}</span>
              <div className="pf-path-actions">
                <button className="btn primary" onClick={() => setPreview(lead)} aria-label={`Peek at being a ${PATH_WORD[c]}`}>
                  <Eye size={20} aria-hidden="true" />
                  Peek
                </button>
                <Link to="/practice" className="btn">
                  <Play size={20} aria-hidden="true" />
                  Try it
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      <div className="section pf-foot">
        <button className="btn pf-again" onClick={playAgain}>
          <RefreshCw size={20} aria-hidden="true" />
          Play again
        </button>
        {switchLink}
      </div>

      {preview && <FuturePreview careerId={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}
