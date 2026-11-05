import { itemsFor } from '../data/quizzes'
import type { GradeBand, QuizAttempt, QuizItem } from '../types'
import { subjectStrength } from './profile'

export const QUIZ_LENGTH = 8

function shuffle<T>(xs: T[], seed: number): T[] {
  // Deterministic shuffle so a seed gives a repeatable quiz.
  const arr = [...xs]
  let s = seed || 1
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export type Difficulty = 'easy' | 'normal' | 'hard'

export interface QuizOptions {
  /** Number of questions; capped by the size of the item pool. */
  length?: number
  /** Manual choice before the round; biases the mix, adaptivity still runs. */
  difficulty?: Difficulty
}

/** Daily time to round length: 5 minutes is 4 questions, 10 is 8, 15 is 12. */
export function roundLength(minutes: number): number {
  if (minutes <= 5) return 4
  if (minutes >= 15) return 12
  return QUIZ_LENGTH
}

type Mix = Record<1 | 2 | 3, number>

/** Difficulty mixes per eight questions, by manual choice and recent accuracy. */
const MIXES: Record<Difficulty, { high: Mix; mid: Mix; low: Mix }> = {
  easy: { high: { 1: 4, 2: 4, 3: 0 }, mid: { 1: 5, 2: 3, 3: 0 }, low: { 1: 6, 2: 2, 3: 0 } },
  normal: { high: { 1: 1, 2: 3, 3: 4 }, mid: { 1: 2, 2: 4, 3: 2 }, low: { 1: 4, 2: 3, 3: 1 } },
  hard: { high: { 1: 0, 2: 3, 3: 5 }, mid: { 1: 0, 2: 4, 3: 4 }, low: { 1: 1, 2: 4, 3: 3 } },
}

/** Where the shortfall is filled from first, nearest the chosen level. */
const FILL_ORDER: Record<Difficulty, (1 | 2 | 3)[]> = { easy: [1, 2, 3], normal: [2, 1, 3], hard: [3, 2, 1] }

function scaleMix(mix: Mix, length: number): Mix {
  const raw = ([1, 2, 3] as const).map((d) => (mix[d] * length) / 8)
  const out = raw.map(Math.floor)
  let left = length - out.reduce((s, x) => s + x, 0)
  // Hand the remainder to the largest fractional parts.
  const order = [0, 1, 2].sort((a, b) => raw[b] - out[b] - (raw[a] - out[a]) || mix[(b + 1) as 1 | 2 | 3] - mix[(a + 1) as 1 | 2 | 3])
  for (const i of order) {
    if (left <= 0) break
    if (mix[(i + 1) as 1 | 2 | 3] === 0) continue
    out[i] += 1
    left -= 1
  }
  return { 1: out[0], 2: out[1], 3: out[2] }
}

/**
 * Adaptive selection: past accuracy decides how many hard items appear, and
 * topics the student struggled with are prioritised, followed by topics not
 * yet seen. The manual difficulty shifts the mix; the round opens on its
 * easiest question so the start matches the choice.
 */
export function buildQuiz(subjectId: string, band: GradeBand, attempts: QuizAttempt[], seed = Date.now(), opts: QuizOptions = {}): QuizItem[] {
  const pool = itemsFor(subjectId, band)
  if (!pool.length) return []
  const length = Math.max(1, Math.round(opts.length ?? QUIZ_LENGTH))
  const choice: Difficulty = opts.difficulty ?? 'normal'

  const strength = subjectStrength(subjectId, attempts)
  const acc = strength.items ? strength.recentAccuracy : 55

  // Target difficulty mix.
  const set = MIXES[choice]
  const mix = scaleMix(acc >= 80 ? set.high : acc >= 55 ? set.mid : set.low, length)

  const seenTopics = new Set<string>()
  for (const a of attempts.filter((x) => x.subjectId === subjectId)) {
    for (const t of Object.keys(a.topics)) seenTopics.add(t)
  }
  const weak = new Set(strength.weakTopics)

  const priority = (item: QuizItem) => (weak.has(item.topic) ? 0 : seenTopics.has(item.topic) ? 2 : 1)

  const chosen: QuizItem[] = []
  const used = new Set<string>()
  for (const d of [1, 2, 3] as const) {
    const candidates = shuffle(pool.filter((i) => i.difficulty === d), seed + d).sort((a, b) => priority(a) - priority(b))
    for (const c of candidates.slice(0, mix[d])) {
      chosen.push(c)
      used.add(c.id)
    }
  }
  // Fill any shortfall from the remaining pool, nearest the chosen level first.
  const target = Math.min(length, pool.length)
  if (chosen.length < target) {
    const rank = FILL_ORDER[choice]
    const rest = shuffle(pool, seed + 7).sort((a, b) => rank.indexOf(a.difficulty) - rank.indexOf(b.difficulty))
    for (const c of rest) {
      if (chosen.length >= target) break
      if (!used.has(c.id)) {
        chosen.push(c)
        used.add(c.id)
      }
    }
  }
  const round = shuffle(chosen, seed + 11).slice(0, target)
  // Open on the easiest question in the round.
  const first = round.reduce((best, it, i) => (it.difficulty < round[best].difficulty ? i : best), 0)
  if (first > 0) round.unshift(...round.splice(first, 1))
  return round
}

export function summariseAttempt(
  subjectId: string,
  band: GradeBand,
  items: QuizItem[],
  answers: Record<string, number>,
  durationSec: number,
): QuizAttempt {
  const topics: QuizAttempt['topics'] = {}
  const difficulty: QuizAttempt['difficulty'] = { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 } }
  let correct = 0
  for (const item of items) {
    const ok = answers[item.id] === item.answer
    if (ok) correct += 1
    topics[item.topic] ??= { correct: 0, total: 0 }
    topics[item.topic].total += 1
    difficulty[item.difficulty].total += 1
    if (ok) {
      topics[item.topic].correct += 1
      difficulty[item.difficulty].correct += 1
    }
  }
  return {
    id: `${subjectId}-${Date.now()}`,
    subjectId,
    band,
    date: new Date().toISOString(),
    total: items.length,
    correct,
    topics,
    difficulty,
    durationSec,
  }
}
