import { DISCOVERY_QUESTIONS } from '../data/discovery'
import type { Area, DiscoveryResult, Trait } from '../types'

export const TRAITS: Trait[] = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional']
export const AREAS: Area[] = ['maths', 'science', 'language', 'social', 'computing', 'arts', 'business', 'religious']

/**
 * Turn Likert answers (1-5) into 0-100 trait and area scores.
 * Each answer contributes (answer - 1) / 4 of its weight; scores are then
 * normalised by the maximum possible for that trait so every trait is
 * comparable regardless of how many statements feed it.
 */
export function scoreDiscovery(answers: Record<string, number>): DiscoveryResult {
  const traitSum: Record<Trait, number> = { realistic: 0, investigative: 0, artistic: 0, social: 0, enterprising: 0, conventional: 0 }
  const traitMax: Record<Trait, number> = { ...traitSum }
  const areaSum: Record<Area, number> = { maths: 0, science: 0, language: 0, social: 0, computing: 0, arts: 0, business: 0, religious: 0 }
  const areaMax: Record<Area, number> = { ...areaSum }

  for (const qn of DISCOVERY_QUESTIONS) {
    const raw = answers[qn.id]
    const agreement = raw ? (raw - 1) / 4 : 0.5
    for (const [t, w] of Object.entries(qn.traits) as [Trait, number][]) {
      traitSum[t] += agreement * w
      traitMax[t] += w
    }
    for (const [a, w] of Object.entries(qn.areas ?? {}) as [Area, number][]) {
      areaSum[a] += agreement * w
      areaMax[a] += w
    }
  }

  const traits = Object.fromEntries(TRAITS.map((t) => [t, traitMax[t] ? Math.round((traitSum[t] / traitMax[t]) * 100) : 0])) as Record<Trait, number>
  const areas = Object.fromEntries(AREAS.map((a) => [a, areaMax[a] ? Math.round((areaSum[a] / areaMax[a]) * 100) : 50])) as Record<Area, number>

  return { answers, traits, areas, completedAt: new Date().toISOString() }
}

export function topTraits(traits: Record<Trait, number>, n = 3): Trait[] {
  return [...TRAITS].sort((a, b) => traits[b] - traits[a]).slice(0, n)
}
