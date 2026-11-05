import type { Profile } from '../types'

export type Mode = 'junior' | 'senior'

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
