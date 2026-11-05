import { CAREERS } from '../data/careers'
import { FINDER_QUESTIONS } from '../data/finder'
import type { Career, CareerCluster, StudentState, Trait } from '../types'
import { rankCareers } from './careers'
import type { StrengthProfile } from './profile'

export const CLUSTERS: CareerCluster[] = [
  'medicine-health',
  'engineering-tech',
  'computing-data',
  'business-finance',
  'law-governance',
  'arts-design-media',
  'education-social',
  'defence-aviation',
  'science-research',
]

export interface FinderResult {
  clusters: Record<CareerCluster, number> // 0-100
  topClusters: CareerCluster[]
  careers: { career: Career; score: number }[]
}

/**
 * Score clusters from scenario answers, then blend with the full career fit
 * (discovery traits plus practice evidence) when that exists, so the finder
 * gets smarter the more the student has done.
 */
export function scoreFinder(answers: Record<string, string>, state: StudentState, profile: StrengthProfile): FinderResult {
  const sum = Object.fromEntries(CLUSTERS.map((c) => [c, 0])) as Record<CareerCluster, number>
  const max = Object.fromEntries(CLUSTERS.map((c) => [c, 0])) as Record<CareerCluster, number>
  const traitSum: Partial<Record<Trait, number>> = {}

  for (const q of FINDER_QUESTIONS) {
    const chosen = q.options.find((o) => o.id === answers[q.id])
    // Max possible per cluster across the question's options.
    for (const c of CLUSTERS) max[c] += Math.max(...q.options.map((o) => o.clusters[c] ?? 0))
    if (!chosen) continue
    for (const [c, w] of Object.entries(chosen.clusters) as [CareerCluster, number][]) sum[c] += w
    for (const [t, w] of Object.entries(chosen.traits ?? {}) as [Trait, number][]) traitSum[t] = (traitSum[t] ?? 0) + w
  }

  // Normalise against the strongest cluster rather than the theoretical
  // maximum (which would need the same cluster picked on every question), so
  // the top match reads as a confident lead and the rest fall away from it.
  const raw = Object.fromEntries(CLUSTERS.map((c) => [c, max[c] ? sum[c] / max[c] : 0])) as Record<CareerCluster, number>
  const best = Math.max(...Object.values(raw), 0.0001)
  const clusters = Object.fromEntries(CLUSTERS.map((c) => [c, Math.round((raw[c] / best) * 92)])) as Record<CareerCluster, number>
  const topClusters = [...CLUSTERS].sort((a, b) => clusters[b] - clusters[a]).slice(0, 3)

  const fits = rankCareers(state, profile)
  const hasFit = !!state.discovery || state.attempts.length > 0
  const careers = CAREERS.map((career) => {
    const clusterScore = clusters[career.cluster]
    const fit = fits.find((f) => f.career.id === career.id)?.score ?? 50
    const score = hasFit ? Math.round(clusterScore * 0.6 + fit * 0.4) : clusterScore
    return { career, score }
  }).sort((a, b) => b.score - a.score)

  return { clusters, topClusters, careers }
}
