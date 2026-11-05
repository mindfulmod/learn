import type { Profile } from '../types'

export type Mode = 'junior' | 'senior'

/**
 * Age bands, after NN/g: children a single grade apart reject each other's
 * content, so behaviour is tuned per band. early and primary play the Town;
 * middle gets quests; senior plans. Density (junior/senior) is separate.
 */
export type AgeBand = 'early' | 'primary' | 'middle' | 'senior'

export function ageBandFor(profile: Profile | null): AgeBand {
  if (!profile) return 'senior'
  if (profile.mode === 'senior') return 'senior'
  const g = profile.grade
  if (g <= 2) return 'early'
  if (g <= 5) return 'primary'
  if (g <= 8) return 'middle'
  return 'senior'
}

/** True for grades 1 to 5: the Town replaces Today and Explore. */
export function playsTown(profile: Profile | null): boolean {
  const b = ageBandFor(profile)
  return b === 'early' || b === 'primary'
}

/**
 * Junior (grades 1-8): one idea per screen, short words, no percentages,
 * read-aloud, interests instead of quizzes. Senior (9-12): full detail.
 */
export function modeFor(profile: Profile | null): Mode {
  if (!profile) return 'senior'
  if (profile.mode) return profile.mode
  return profile.grade <= 8 ? 'junior' : 'senior'
}

/** Speak a short text aloud when the browser supports it. */
export function speak(text: string): boolean {
  try {
    if (!('speechSynthesis' in window)) return false
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-GB'
    u.rate = 0.95
    window.speechSynthesis.speak(u)
    return true
  } catch {
    return false
  }
}
