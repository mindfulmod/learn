import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Eye, Play, Sticker, X } from 'lucide-react'
import { tint } from '../design'
import { placeFor } from '../data/town'
import { pathFor } from '../data/paths'
import { speak } from '../engine/mode'
import { useStore } from '../store/store'
import type { CareerCluster } from '../types'
import { FuturePreview } from './FuturePreview'
import { Say } from './Say'
import { Scene } from './Scene'
import { TryRound } from './TryRound'
import '../styles/finder.css'
import '../styles/town.css'

const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'

/**
 * Visit: what a place is about. A drawer on desktop (the shell stays in
 * view) and a bottom sheet on phones. Scene, word, one spoken line, then
 * Try it and Peek.
 */
export function Visit({ cluster, onClose, finishLabel }: { cluster: CareerCluster; onClose: () => void; finishLabel?: string }) {
  const { state } = useStore()
  const place = placeFor(cluster)
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLButtonElement>(null)
  const [mode, setMode] = useState<'intro' | 'try'>('intro')
  const [peek, setPeek] = useState(false)
  const peekRef = useRef(false)
  const has = state.stickers.includes(cluster)

  useEffect(() => {
    peekRef.current = peek
  }, [peek])

  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Speak once, lock the page, focus the first button, trap Tab, Escape closes.
  useEffect(() => {
    speak(place.say)
    const prevFocus = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (peekRef.current) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
      } else if (e.key === 'Tab' && panelRef.current) {
        const els = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
        if (!els.length) return
        const first = els[0]
        const last = els[els.length - 1]
        const active = document.activeElement
        if (!panelRef.current.contains(active)) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      window.speechSynthesis?.cancel?.()
      prevFocus?.focus?.()
    }
  }, [place.say])

  useEffect(() => {
    panelRef.current?.scrollTo?.({ top: 0 })
  }, [mode])

  return createPortal(
    <div className="visit-backdrop" onClick={onClose}>
      <div className="visit-panel" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={panelRef} style={tint(place.hue)} onClick={(e) => e.stopPropagation()}>
        <div className="visit-body">
          {mode === 'intro' ? (
            <>
              <div className="visit-scene">
                <Scene spec={place.scene} size={460} />
                {has && (
                  <span className="visit-has" aria-label="You have this sticker">
                    <Sticker size={18} aria-hidden="true" />
                  </span>
                )}
              </div>
              <Say as="h2" className="visit-title">
                <span id={titleId}>{place.word}</span>
              </Say>
              <Say as="p" className="visit-line">
                {place.say}
              </Say>
              <div className="town-actions">
                <button type="button" ref={firstRef} className="btn primary town-big" onClick={() => setMode('try')}>
                  <Play size={22} fill="currentColor" aria-hidden="true" />
                  Try it
                </button>
                <button type="button" className="btn town-big quiet" onClick={() => setPeek(true)}>
                  <Eye size={22} aria-hidden="true" />
                  Peek
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="sr-only" id={titleId}>
                {place.word}
              </h2>
              <TryRound place={place} onFinish={onClose} onPeek={() => setPeek(true)} finishLabel={finishLabel} />
            </>
          )}
        </div>
        <button type="button" className="visit-close" onClick={onClose} aria-label="Close">
          <X size={24} strokeWidth={2.6} aria-hidden="true" />
        </button>
      </div>
      {peek && (
        <div onClick={(e) => e.stopPropagation()}>
          <FuturePreview careerId={pathFor(cluster).lead[0]} onClose={() => setPeek(false)} />
        </div>
      )}
    </div>,
    document.body,
  )
}
