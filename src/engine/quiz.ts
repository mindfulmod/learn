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

/**
 * Adaptive selection: past accuracy decides how many hard items appear, and
 * topics the student struggled with are prioritised, followed by topics not
 * yet seen.
 */
export function buildQuiz(subjectId: string, band: GradeBand, attempts: QuizAttempt[], seed = Date.now()): QuizItem[] {
  const pool = itemsFor(subjectId, band)
  if (!pool.length) return []

  const strength = subjectStrength(subjectId, attempts)
  const acc = strength.items ? strength.recentAccuracy : 55

  // Target difficulty mix.
  const mix: Record<1 | 2 | 3, number> = acc >= 80
    ? { 1: 1, 2: 3, 3: 4 }
    : acc >= 55
      ? { 1: 2, 2: 4, 3: 2 }
      : { 1: 4, 2: 3, 3: 1 }

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
  // Fill any shortfall from the remaining pool.
  if (chosen.length < Math.min(QUIZ_LENGTH, pool.length)) {
    for (const c of shuffle(pool, seed + 7)) {
      if (chosen.length >= Math.min(QUIZ_LENGTH, pool.length)) break
      if (!used.has(c.id)) {
        chosen.push(c)
        used.add(c.id)
      }
    }
  }
  return shuffle(chosen, seed + 11).slice(0, QUIZ_LENGTH)
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
