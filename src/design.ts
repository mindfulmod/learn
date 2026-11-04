import type { Area, CareerCluster, Trait } from './types'

/**
 * Visual identity for each learning area. `hue` feeds the CSS custom
 * property system so a tile, badge or bar can be tinted consistently in
 * light and dark themes.
 */
export const AREA_META: Record<Area, { hue: number; emoji: string; label: string }> = {
  maths: { hue: 258, emoji: '➗', label: 'Mathematics' },
  science: { hue: 160, emoji: '🧪', label: 'Science' },
  language: { hue: 12, emoji: '📖', label: 'Languages' },
  social: { hue: 36, emoji: '🌍', label: 'Social studies' },
  computing: { hue: 205, emoji: '💻', label: 'Computing' },
  arts: { hue: 320, emoji: '🎨', label: 'Arts' },
  business: { hue: 180, emoji: '📈', label: 'Business' },
  religious: { hue: 120, emoji: '🕌', label: 'Islamiyat' },
}

export const SUBJECT_EMOJI: Record<string, string> = {
  english: '📖',
  urdu: '✒️',
  maths: '➗',
  'general-maths': '🔢',
  'general-science': '🔬',
  islamiyat: '🕌',
  'social-studies': '🗺️',
  'pak-studies': '🇵🇰',
  'computer-studies': '🖱️',
  'art-craft': '🖍️',
  physics: '⚡',
  chemistry: '🧪',
  biology: '🧬',
  'computer-science': '💻',
  statistics: '📊',
  economics: '💹',
  accounting: '🧾',
  'business-maths': '🧮',
  commerce: '🏪',
  banking: '🏦',
  civics: '🏛️',
  education: '🍎',
  psychology: '🧠',
  sociology: '👥',
  geography: '🌍',
  history: '📜',
  'fine-arts': '🎨',
  'home-economics': '🏡',
  'islamiat-elective': '📿',
  'global-perspectives': '🌐',
  'add-maths': '∑',
  'business-studies': '💼',
  literature: '🎭',
  'environmental-management': '🌱',
  law: '⚖️',
  'further-maths': '∞',
  'general-paper': '📝',
}

export const CLUSTER_META: Record<CareerCluster, { hue: number; emoji: string }> = {
  'medicine-health': { hue: 350, emoji: '🩺' },
  'engineering-tech': { hue: 28, emoji: '⚙️' },
  'computing-data': { hue: 215, emoji: '🤖' },
  'business-finance': { hue: 165, emoji: '💼' },
  'law-governance': { hue: 250, emoji: '⚖️' },
  'arts-design-media': { hue: 320, emoji: '🎬' },
  'education-social': { hue: 45, emoji: '🌱' },
  'defence-aviation': { hue: 200, emoji: '✈️' },
  'science-research': { hue: 140, emoji: '🔭' },
}

export const TRAIT_META: Record<Trait, { hue: number; emoji: string }> = {
  realistic: { hue: 28, emoji: '🛠️' },
  investigative: { hue: 215, emoji: '🔍' },
  artistic: { hue: 320, emoji: '🎨' },
  social: { hue: 45, emoji: '🤝' },
  enterprising: { hue: 350, emoji: '🚀' },
  conventional: { hue: 165, emoji: '🗂️' },
}

/** Inline style that sets the tint hue for a `.tinted` element. */
export function tint(hue: number): React.CSSProperties {
  return { ['--h' as string]: hue }
}

export function subjectEmoji(id: string, area?: Area): string {
  return SUBJECT_EMOJI[id] ?? (area ? AREA_META[area].emoji : '📘')
}
