import { CAREERS } from '../data/careers'
import { AREA_NAMES, TRAIT_NAMES } from '../data/discovery'
import { subjectName } from '../data/subjects'
import type { Area, Career, StudentState, Trait } from '../types'
import { AREAS, TRAITS } from './discovery'
import type { StrengthProfile } from './profile'

export interface CareerFit {
  career: Career
  score: number // 0-100
  traitScore: number | null
  areaScore: number | null
  subjectScore: number | null
  reasons: string[]
  cautions: string[]
}

function weightedMatch<K extends string>(weights: Partial<Record<K, number>>, scores: Record<K, number>): number {
  let num = 0
  let den = 0
  for (const [k, w] of Object.entries(weights) as [K, number][]) {
    num += w * (scores[k] ?? 50)
    den += w
  }
  return den ? num / den : 50
}

/**
 * Fit combines three signals when available:
 *  - trait match from the discovery questionnaire,
 *  - learning-area match (quiz evidence blended with self-report),
 *  - direct mastery in the career's must-have subjects.
 */
export function careerFit(career: Career, state: StudentState, profile: StrengthProfile): CareerFit {
  const reasons: string[] = []
  const cautions: string[] = []

  let traitScore: number | null = null
  if (state.discovery) {
    traitScore = Math.round(weightedMatch<Trait>(career.traits, state.discovery.traits))
    const top = (Object.entries(career.traits) as [Trait, number][])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
    for (const [t] of top) {
      const v = state.discovery.traits[t]
      if (v >= 65) reasons.push(`You scored high as a ${TRAIT_NAMES[t]}, which this career needs.`)
      else if (v <= 35) cautions.push(`This career leans on being a ${TRAIT_NAMES[t]}, which was not a strong area in your discovery quiz.`)
    }
  }

  const hasAreaSignal = state.discovery || profile.totalItems > 0
  let areaScore: number | null = null
  if (hasAreaSignal) {
    areaScore = Math.round(weightedMatch<Area>(career.areas, profile.areas))
    const topAreas = (Object.entries(career.areas) as [Area, number][]).sort((a, b) => b[1] - a[1]).slice(0, 2)
    for (const [a, w] of topAreas) {
      if (w < 0.7) continue
      const v = profile.areas[a]
      const evidence = profile.areaEvidence[a] > 0.3 ? 'your practice results' : 'your answers'
      if (v >= 70) reasons.push(`${AREA_NAMES[a]} is a strength according to ${evidence}.`)
      else if (v < 45) cautions.push(`${AREA_NAMES[a]} needs work based on ${evidence}, and it matters a lot here.`)
    }
  }

  let subjectScore: number | null = null
  const practised = career.subjects.must.map((id) => profile.subjects[id]).filter(Boolean)
  if (practised.length) {
    subjectScore = Math.round(practised.reduce((s, x) => s + x.accuracy, 0) / practised.length)
    for (const s of practised) {
      if (s.level === 'strong') reasons.push(`You are doing well in ${subjectName(s.subjectId)} practice (${s.accuracy}%).`)
      else if (s.level === 'needs-work') cautions.push(`${subjectName(s.subjectId)} practice is at ${s.accuracy}%; this subject is essential for the career.`)
    }
  }

  const parts: [number | null, number][] = [
    [traitScore, 0.4],
    [areaScore, 0.35],
    [subjectScore, 0.25],
  ]
  let num = 0
  let den = 0
  for (const [v, w] of parts) {
    if (v !== null) {
      num += v * w
      den += w
    }
  }
  const score = den ? Math.round(num / den) : 50

  return { career, score, traitScore, areaScore, subjectScore, reasons, cautions }
}

export function rankCareers(state: StudentState, profile: StrengthProfile): CareerFit[] {
  return CAREERS.map((c) => careerFit(c, state, profile)).sort((a, b) => b.score - a.score)
}

export function hasSignal(state: StudentState): boolean {
  return !!state.discovery || state.attempts.length > 0
}

export { AREAS, TRAITS }
