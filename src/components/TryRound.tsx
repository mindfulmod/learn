import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, Eye, RefreshCw, Sticker, X } from 'lucide-react'
import { CLUSTER_META } from '../design'
import type { TownPlace } from '../data/town'
import { buildQuiz, summariseAttempt } from '../engine/quiz'
import { speak } from '../engine/mode'
import { useStore } from '../store/store'
import { Say } from './Say'

const ROUND = 3
const NEEDED = 2
const ADVANCE_MS = 600

let audio: AudioContext | null = null

/** A tiny Web Audio chime: no asset, silent if audio is unavailable. */
function chime(notes: number[]) {
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return
    audio ??= new Ctor()
    const ctx = audio
    if (ctx.state === 'suspended') void ctx.resume()
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.11
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.3)
    })
  } catch {
    // No audio: the check mark still shows.
  }
}

/** Confetti burst, the same markup as Celebrate but with no XP toast. */
function StickerBurst() {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = window.setTimeout(() => setShow(false), 2600)
    return () => window.clearTimeout(t)
  }, [])
  if (!show) return null
  return (
    <div className="celebrate" aria-hidden="true">
      <div className="confetti">
        {Array.from({ length: 28 }, (_, i) => (
          <i key={i} style={{ ['--i' as string]: i, ['--h' as string]: (i * 47) % 360 }} />
        ))}
      </div>
    </div>
  )
}

/**
 * Try it: three questions from the grade 1 to 5 bank in the place's
 * subject. Right answers chime and move on; wrong answers show the right
 * one and the one-line reason. Two of three earns the place's sticker.
 */
export function TryRound({ place, onFinish, onPeek, finishLabel = 'Back to the Town' }: { place: TownPlace; onFinish: () => void; onPeek: () => void; finishLabel?: string }) {
  const { state, addAttempt, addSticker } = useStore()
  const [items, setItems] = useState(() => buildQuiz(place.trySubject, '1-5', state.attempts, Date.now()).slice(0, ROUND))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [picked, setPicked] = useState<number | null>(null)
  const [result, setResult] = useState<{ correct: number; sticker: boolean } | null>(null)
  const start = useRef(0)
  const timer = useRef<number | undefined>(undefined)
  const nextRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    start.current = Date.now()
    return () => window.clearTimeout(timer.current)
  }, [])

  const item = items[index]
  const Icon = CLUSTER_META[place.cluster].icon

  const finish = (final: Record<string, number>) => {
    const durationSec = Math.max(1, Math.round((Date.now() - start.current) / 1000))
    const attempt = summariseAttempt(place.trySubject, '1-5', items, final, durationSec)
    addAttempt(attempt)
    const sticker = attempt.correct >= NEEDED
    if (sticker) {
      addSticker(place.cluster)
      chime([523, 659, 784, 1047])
      speak('You got a sticker!')
    } else {
      speak('Good try. Have another go!')
    }
    setResult({ correct: attempt.correct, sticker })
  }

  const advance = (final: Record<string, number>) => {
    setPicked(null)
    if (index + 1 >= items.length) finish(final)
    else setIndex(index + 1)
  }

  const choose = (i: number) => {
    if (picked !== null || !item) return
    const next = { ...answers, [item.id]: i }
    setAnswers(next)
    setPicked(i)
    if (i === item.answer) {
      chime([660, 880])
      timer.current = window.setTimeout(() => advance(next), ADVANCE_MS)
    } else {
      window.setTimeout(() => nextRef.current?.focus(), 0)
    }
  }

  const again = () => {
    window.clearTimeout(timer.current)
    setAnswers({})
    setIndex(0)
    setPicked(null)
    setResult(null)
    setItems(buildQuiz(place.trySubject, '1-5', state.attempts, Date.now()).slice(0, ROUND))
    start.current = Date.now()
  }

  if (!items.length) {
    return (
      <div className="try">
        <Say as="p" className="try-question">
          No questions here yet.
        </Say>
        <button type="button" className="btn town-big" onClick={onPeek}>
          <Eye size={22} aria-hidden="true" />
          Peek instead
        </button>
      </div>
    )
  }

  if (result) {
    return (
      <div className="try try-end">
        {result.sticker && <StickerBurst />}
        <span className={`try-sticker${result.sticker ? ' earned' : ''}`} aria-hidden="true">
          <Icon size={48} strokeWidth={2.2} />
        </span>
        <Say as="h2" className="try-end-title">
          {result.sticker ? 'Sticker!' : 'Good try!'}
        </Say>
        <Say as="p" className="try-end-line" text={`You got ${result.correct} out of ${items.length}.`}>
          {Array.from({ length: items.length }, (_, i) => (
            <span key={i} className={`try-dot${i < result.correct ? ' on' : ''}`} aria-hidden="true">
              {i < result.correct ? <Check size={16} strokeWidth={3} /> : null}
            </span>
          ))}
          <span className="sr-only">{`${result.correct} of ${items.length} right`}</span>
        </Say>
        <div className="town-actions">
          {result.sticker ? (
            <button type="button" className="btn primary town-big" onClick={onFinish} autoFocus>
              <Sticker size={22} aria-hidden="true" />
              {finishLabel}
            </button>
          ) : (
            <>
              <button type="button" className="btn primary town-big" onClick={again} autoFocus>
                <RefreshCw size={22} aria-hidden="true" />
                Try again
              </button>
              <button type="button" className="btn town-big quiet" onClick={onPeek}>
                <Eye size={22} aria-hidden="true" />
                Peek instead
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const wrong = picked !== null && picked !== item.answer

  return (
    <div className="try" key={items[0]?.id}>
      <div className="try-top">
        <Say className="try-kicker">{place.kicker}</Say>
        <span className="try-progress" aria-label={`Question ${index + 1} of ${items.length}`}>
          {items.map((it, i) => (
            <span key={it.id} className={i < index ? 'done' : i === index ? 'now' : ''} />
          ))}
        </span>
      </div>
      <Say as="h2" className="try-question">
        {item.question}
      </Say>
      <div className={`try-options${picked !== null ? ' locked' : ''}`} role="group" aria-label="Answers">
        {item.options.map((o, i) => {
          const look = picked === null ? '' : i === item.answer ? ' right' : i === picked ? ' wrong' : ' faded'
          return (
            <button key={o} type="button" className={`try-option${look}`} onClick={() => choose(i)} disabled={picked !== null && i !== picked && i !== item.answer} aria-pressed={picked === i}>
              <span className="try-option-text">{o}</span>
              {picked !== null && i === item.answer && <Check className="try-mark" size={26} strokeWidth={3} aria-label="Right answer" />}
              {wrong && i === picked && <X className="try-mark" size={26} strokeWidth={3} aria-label="Not this one" />}
            </button>
          )
        })}
      </div>
      {wrong && (
        <div className="try-why">
          <Say as="p">{item.explanation}</Say>
          <button type="button" className="btn primary town-big" ref={nextRef} onClick={() => advance(answers)}>
            Next
            <ArrowRight size={22} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
