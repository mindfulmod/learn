import { getSubject } from '../data/subjects'
import type { Area, QuizAttempt, StudentState } from '../types'
import { AREAS } from './discovery'

export type MasteryLevel = 'strong' | 'developing' | 'needs-work' | 'not-practised'

export interface SubjectStrength {
  subjectId: string
  area: Area
  attempts: number
  items: number
  accuracy: number // 0-100
  recentAccuracy: number // last 3 attempts, 0-100
  trend: 'up' | 'down' | 'flat'
  level: MasteryLevel
  confidence: 'low' | 'medium' | 'high'
  weakTopics: string[]
  strongTopics: string[]
  hardAccuracy: number | null // accuracy on difficulty-3 items
}

export interface StrengthProfile {
  subjects: Record<string, SubjectStrength>
  /** 0-100 per area, blending quiz evidence with discovery self-report. */
  areas: Record<Area, number>
  /** How much of each area score comes from quiz evidence (0-1). */
  areaEvidence: Record<Area, number>
  totalItems: number
}

export function levelFor(accuracy: number, items: number): MasteryLevel {
  if (items === 0) return 'not-practised'
  if (accuracy >= 75) return 'strong'
  if (accuracy >= 50) return 'developing'
  return 'needs-work'
}

export function subjectStrength(subjectId: string, attempts: QuizAttempt[]): SubjectStrength {
  const mine = attempts.filter((a) => a.subjectId === subjectId).sort((a, b) => a.date.localeCompare(b.date))
  const items = mine.reduce((s, a) => s + a.total, 0)
  const correct = mine.reduce((s, a) => s + a.correct, 0)
  const accuracy = items ? Math.round((correct / items) * 100) : 0

  const recent = mine.slice(-3)
  const recentItems = recent.reduce((s, a) => s + a.total, 0)
  const recentCorrect = recent.reduce((s, a) => s + a.correct, 0)
  const recentAccuracy = recentItems ? Math.round((recentCorrect / recentItems) * 100) : 0

  let trend: SubjectStrength['trend'] = 'flat'
  if (mine.length >= 2) {
    const first = mine.slice(0, Math.ceil(mine.length / 2))
    const last = mine.slice(Math.ceil(mine.length / 2))
    const acc = (xs: QuizAttempt[]) => {
      const t = xs.reduce((s, a) => s + a.total, 0)
      return t ? xs.reduce((s, a) => s + a.correct, 0) / t : 0
    }
    const diff = acc(last) - acc(first)
    trend = diff > 0.08 ? 'up' : diff < -0.08 ? 'down' : 'flat'
  }

  const topicTally: Record<string, { correct: number; total: number }> = {}
  const hard = { correct: 0, total: 0 }
  for (const a of mine) {
    for (const [t, v] of Object.entries(a.topics)) {
      topicTally[t] ??= { correct: 0, total: 0 }
      topicTally[t].correct += v.correct
      topicTally[t].total += v.total
    }
    hard.correct += a.difficulty[3]?.correct ?? 0
    hard.total += a.difficulty[3]?.total ?? 0
  }
  const topics = Object.entries(topicTally).filter(([, v]) => v.total >= 2)
  const weakTopics = topics.filter(([, v]) => v.correct / v.total < 0.5).map(([t]) => t)
  const strongTopics = topics.filter(([, v]) => v.correct / v.total >= 0.8).map(([t]) => t)

  return {
    subjectId,
    area: getSubject(subjectId)?.area ?? 'science',
    attempts: mine.length,
    items,
    accuracy,
    recentAccuracy,
    trend,
    level: levelFor(items ? Math.round(((accuracy + recentAccuracy) / 2)) : 0, items),
    confidence: items >= 24 ? 'high' : items >= 8 ? 'medium' : 'low',
    weakTopics,
    strongTopics,
    hardAccuracy: hard.total >= 3 ? Math.round((hard.correct / hard.total) * 100) : null,
  }
}

export function buildProfile(state: StudentState): StrengthProfile {
  const subjectIds = [...new Set(state.attempts.map((a) => a.subjectId))]
  const subjects: Record<string, SubjectStrength> = {}
  for (const id of subjectIds) subjects[id] = subjectStrength(id, state.attempts)

  const areas = {} as Record<Area, number>
  const areaEvidence = {} as Record<Area, number>
  for (const area of AREAS) {
    const inArea = Object.values(subjects).filter((s) => s.area === area)
    const items = inArea.reduce((s, x) => s + x.items, 0)
    const correct = inArea.reduce((s, x) => s + Math.round((x.accuracy / 100) * x.items), 0)
    const quizScore = items ? (correct / items) * 100 : null
    const selfScore = state.discovery?.areas[area] ?? null

    // Evidence weight grows with practice: 16 items gives about 60% weight.
    const w = items ? Math.min(0.85, items / 24) : 0
    areaEvidence[area] = w
    if (quizScore !== null && selfScore !== null) areas[area] = Math.round(w * quizScore + (1 - w) * selfScore)
    else if (quizScore !== null) areas[area] = Math.round(quizScore)
    else if (selfScore !== null) areas[area] = selfScore
    else areas[area] = 50
  }

  return { subjects, areas, areaEvidence, totalItems: state.attempts.reduce((s, a) => s + a.total, 0) }
}

export function streak(activeDays: string[]): { current: number; best: number } {
  const days = [...new Set(activeDays)].sort()
  if (!days.length) return { current: 0, best: 0 }
  const toDate = (d: string) => new Date(d + 'T00:00:00Z').getTime()
  const day = 86400000

  let best = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    if (toDate(days[i]) - toDate(days[i - 1]) === day) run += 1
    else run = 1
    best = Math.max(best, run)
  }

  const today = new Date().toISOString().slice(0, 10)
  const last = days[days.length - 1]
  const gap = (toDate(today) - toDate(last)) / day
  if (gap > 1) return { current: 0, best }
  // Count back from the last active day.
  let current = 1
  for (let i = days.length - 1; i > 0; i--) {
    if (toDate(days[i]) - toDate(days[i - 1]) === day) current += 1
    else break
  }
  return { current, best }
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}
