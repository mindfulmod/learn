import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { CLUSTER_META, tint } from '../design'
import { TOWN_PLACES } from '../data/town'
import { Say } from '../components/Say'
import { Visit } from '../components/Visit'
import { speak } from '../engine/mode'
import { useStore } from '../store/store'
import type { CareerCluster } from '../types'
import '../styles/town.css'

/**
 * Sticker book: progress for grades 1 to 5. Nine slots, one per Town
 * place; earned ones in colour and tappable to visit again.
 */
export function StickerBook() {
  const { state } = useStore()
  const [selected, setSelected] = useState<CareerCluster | null>(null)
  const count = TOWN_PLACES.filter((p) => state.stickers.includes(p.cluster)).length
  const close = useCallback(() => setSelected(null), [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="stickers">
      <Say as="h1" className="stickers-title">
        My stickers
      </Say>
      <Say as="p" className="stickers-count" text={`You have ${count} of 9 stickers.`}>
        {count} of 9
      </Say>
      <ul className="stickers-grid">
        {TOWN_PLACES.map((p) => {
          const Icon = CLUSTER_META[p.cluster].icon
          const has = state.stickers.includes(p.cluster)
          return (
            <li key={p.cluster} style={tint(p.hue)}>
              {has ? (
                <button type="button" className="sticker-slot earned" onClick={() => setSelected(p.cluster)} aria-label={`${p.word} sticker. Visit the ${p.name}.`}>
                  <span className="sticker-disc" aria-hidden="true">
                    <Icon size={40} strokeWidth={2.2} />
                  </span>
                  <span className="sticker-word">{p.word}</span>
                </button>
              ) : (
                <button type="button" className="sticker-slot" onClick={() => speak(`${p.word}. Try the ${p.name} to get it.`)} aria-label={`${p.word}, not yet. Try the ${p.name} to get it.`}>
                  <span className="sticker-disc" aria-hidden="true" />
                  <span className="sticker-word">{p.word}</span>
                </button>
              )}
            </li>
          )
        })}
      </ul>
      <Link to="/finder" className="stickers-again">
        <RefreshCw size={18} aria-hidden="true" />
        Play the finder again
      </Link>
      {selected && <Visit key={selected} cluster={selected} onClose={close} finishLabel="Back to my stickers" />}
    </div>
  )
}
