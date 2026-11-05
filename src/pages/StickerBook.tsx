import { Empty } from '../components/ui'

/**
 * Sticker book: progress for grades 1 to 5. Placeholder until the Town build
 * lands; see docs/DESIGN.md, iteration 5.
 */
export function StickerBook() {
  return <Empty title="Stickers" body="Visit a place in the Town and try it to earn a sticker." action={{ to: '/', label: 'Go to the Town' }} />
}
