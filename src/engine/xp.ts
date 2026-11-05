import { roundLength } from './quiz'
import { getCareer } from '../data/careers'
import { subjectsWithItems } from '../data/quizzes'
import { getSubject, subjectName } from '../data/subjects'
import { bandForGrade } from '../data/boards'
import { PICTURE_PREFIX } from '../data/pictureFinder'
import { AREA_META } from '../design'
import type { QuizAttempt, StudentState } from '../types'
import { scoreFinder, scorePictureFinder } from './finder'
import { buildProfile, streak, subjectStrength } from './profile'

/** Experience points earned for each kind of action. */
export const XP = {
  correct: 5,
  attempted: 2,
  roundBonus: 40, // 80%+ accuracy
  discovery: 60,
  finder: 40,
  preview: 15,
  goal: 25,
  streakDay: 10,
} as const

export interface Level {
  index: number
  name: string
  min: number
  next: number | null
}

export const LEVELS: { name: string; min: number }[] = [
  { name: 'Explorer', min: 0 },
  { name: 'Pathfinder', min: 150 },
  { name: 'Navigator', min: 400 },
  { name: 'Trailblazer', min: 800 },
  { name: 'Voyager', min: 1400 },
  { name: 'Pioneer', min: 2200 },
  { name: 'Legend', min: 3200 },
]

export function attemptXp(a: QuizAttempt): number {
  const pct = a.total ? a.correct / a.total : 0
  return a.correct * XP.correct + (a.total - a.correct) * XP.attempted + (pct >= 0.8 ? XP.roundBonus : 0)
}

export function totalXp(state: StudentState): number {
  let xp = 0
  for (const a of state.attempts) xp += attemptXp(a)
  if (state.discovery) xp += XP.discovery
  if (state.finder) xp += XP.finder
  xp += state.previewed.length * XP.preview
  if (state.goals.length) xp += XP.goal
  xp += state.activeDays.length * XP.streakDay
  return xp
}

export function levelFor(xp: number): Level & { progress: number; into: number; span: number } {
  let index = 0
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) index = i
  const min = LEVELS[index].min
  const next = LEVELS[index + 1]?.min ?? null
  const span = next ? next - min : 1
  const into = xp - min
  return { index, name: LEVELS[index].name, min, next, progress: next ? Math.min(100, Math.round((into / span) * 100)) : 100, into, span }
}

// ---------------------------------------------------------------- Missions

export interface Mission {
  id: string
  title: string
  detail: string
  xp: number
  done: boolean
  progress: number // 0-1
  to: string
}

function startOfWeek(d = new Date()): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)) // Monday
  return x
}

/**
 * Three missions for the current week, chosen from what the student has and
 * has not done, so there is always something reachable.
 */
export function weeklyMissions(state: StudentState): Mission[] {
  const week = startOfWeek().toISOString()
  const thisWeek = state.attempts.filter((a) => a.date >= week)
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined
  const band = state.profile ? bandForGrade(state.profile.boardId, state.profile.grade) : '6-8'
  const practisable = subjectsWithItems(band)
  const goalSubjects = goal ? goal.subjects.must.filter((s) => practisable.includes(s)) : []
  const out: Mission[] = []

  if (goal && goalSubjects.length) {
    const n = thisWeek.filter((a) => goalSubjects.includes(a.subjectId)).length
    out.push({ id: 'goal-subject', title: `Practise a ${goal.title.split(' (')[0]} subject`, detail: `${goalSubjects.slice(0, 2).map(pretty).join(' or ')}, one round`, xp: 30, done: n >= 1, progress: Math.min(1, n), to: `/practice/${goalSubjects[0]}` })
  } else if (!state.goals.length) {
    out.push({ id: 'set-goal', title: 'Pick a goal to aim at', detail: 'Preview a career and set it as your goal', xp: 30, done: state.goals.length > 0, progress: state.goals.length ? 1 : 0, to: state.finder ? '/finder' : '/careers' })
  }

  const rounds = thisWeek.length
  out.push({ id: 'two-rounds', title: 'Two practice rounds this week', detail: `${Math.min(rounds, 2)} of 2 done`, xp: 25, done: rounds >= 2, progress: Math.min(1, rounds / 2), to: '/practice' })

  const unseen = practisable.filter((s) => !state.attempts.some((a) => a.subjectId === s))
  const newThisWeek = thisWeek.some((a) => !state.attempts.some((b) => b.subjectId === a.subjectId && b.date < a.date))
  if (unseen.length) {
    out.push({ id: 'new-subject', title: 'Try a subject you have not practised', detail: `${pretty(unseen[0])} is waiting`, xp: 20, done: newThisWeek, progress: newThisWeek ? 1 : 0, to: `/practice/${unseen[0]}` })
  }

  if (out.length < 3) {
    const previewsThisWeek = state.previewed.length
    out.push({ id: 'preview', title: 'Peer into a future', detail: 'Preview any career from start to finish', xp: 15, done: previewsThisWeek > 0, progress: previewsThisWeek > 0 ? 1 : 0, to: '/careers' })
  }
  if (out.length < 3 && !state.discovery) {
    out.push({ id: 'discovery', title: 'Take the discovery quiz', detail: '24 quick statements, 5 minutes', xp: 60, done: false, progress: 0, to: '/discover' })
  }
  if (out.length < 3) {
    const best = Math.max(0, ...state.attempts.map((a) => (a.total ? a.correct / a.total : 0)))
    const beat = thisWeek.some((a) => a.total && a.correct / a.total >= Math.min(0.9, best))
    out.push({ id: 'beat', title: 'Beat your best score', detail: best ? `Your best round is ${Math.round(best * 100)}%` : 'Any round counts', xp: 25, done: beat, progress: beat ? 1 : 0, to: '/practice' })
  }
  return out.slice(0, 3)
}

function pretty(id: string): string {
  return subjectName(id)
}

// ---------------------------------------------------------------- Badges

export interface Badge {
  id: string
  name: string
  detail: string
  earned: boolean
}

export function badges(state: StudentState): Badge[] {
  const st = streak(state.activeDays)
  const strong = [...new Set(state.attempts.map((a) => a.subjectId))].some((s) => subjectStrength(s, state.attempts).level === 'strong')
  return [
    { id: 'first-round', name: 'First round', detail: 'Finished a practice round', earned: state.attempts.length > 0 },
    { id: 'first-preview', name: 'Time traveller', detail: 'Peered into a future', earned: state.previewed.length > 0 },
    { id: 'goal', name: 'Aiming high', detail: 'Set a career goal', earned: state.goals.length > 0 },
    { id: 'finder', name: 'Compass', detail: 'Completed the Career Finder', earned: !!state.finder },
    { id: 'discovery', name: 'Self-aware', detail: 'Completed the discovery quiz', earned: !!state.discovery },
    { id: 'streak-7', name: 'On fire', detail: 'Seven-day streak', earned: st.best >= 7 },
    { id: 'strong', name: 'Specialist', detail: 'A subject rated strong', earned: strong },
    { id: 'ten-rounds', name: 'Grinder', detail: 'Ten practice rounds', earned: state.attempts.length >= 10 },
  ]
}

// ---------------------------------------------------------------- Next step

export interface NextStep {
  title: string
  detail: string
  cta: string
  to: string
  xp: number
  minutes: number
  kind: 'practice' | 'finder' | 'preview' | 'discovery' | 'goal'
  subjectId?: string
}

/** The one thing the student should do right now. */
export function nextStep(state: StudentState): NextStep {
  const p = state.profile
  const qs = roundLength(state.prefs?.dailyMinutes ?? 10)
  const mins = state.prefs?.dailyMinutes ?? 10
  const band = p ? bandForGrade(p.boardId, p.grade) : '6-8'
  const practisable = subjectsWithItems(band)
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined

  if (!state.goals.length && !state.finder) {
    return { kind: 'finder', title: 'Find a direction', detail: 'Eight quick questions. Three futures worth a look.', cta: 'Play the finder', to: '/finder', xp: XP.finder, minutes: 3 }
  }
  if (goal && !state.previewed.includes(goal.id)) {
    return { kind: 'preview', title: `See your future as a ${goal.title.split(' (')[0].toLowerCase()}`, detail: 'Your age at every step, from today to ten years in.', cta: 'Peer into your future', to: `/careers/${goal.id}?preview=1`, xp: XP.preview, minutes: 4 }
  }
  if (goal) {
    const must = goal.subjects.must.filter((s) => practisable.includes(s))
    const ranked = must
      .map((s) => ({ s, st: subjectStrength(s, state.attempts) }))
      .sort((a, b) => (a.st.items === 0 ? -1 : b.st.items === 0 ? 1 : a.st.recentAccuracy - b.st.recentAccuracy))
    const pick = ranked[0]
    if (pick) {
      const why = pick.st.items === 0 ? 'You have not tried it here yet.' : pick.st.level === 'needs-work' ? `It is at ${pick.st.accuracy}%. Let us lift it.` : pick.st.level === 'developing' ? `${pick.st.accuracy}% and climbing. Keep going.` : `Keep it sharp for ${goal.title.split(' (')[0]}.`
      return { kind: 'practice', title: `Practise ${pretty(pick.s)}`, detail: `${qs} questions, about ${mins} minutes. ${why}`, cta: 'Start round', to: `/practice/${pick.s}`, xp: 40 + 40, minutes: mins, subjectId: pick.s }
    }
  }
  if (!state.discovery) {
    return { kind: 'discovery', title: 'Discover what suits you', detail: '24 quick statements. Sharper career matches.', cta: 'Start discovery', to: '/discover', xp: XP.discovery, minutes: 5 }
  }
  if (!state.goals.length) {
    return { kind: 'goal', title: 'Pick a goal to aim at', detail: 'Preview one of your top matches and set it.', cta: 'See my matches', to: '/finder', xp: XP.goal, minutes: 2 }
  }
  const weakest = [...new Set(state.attempts.map((a) => a.subjectId))].map((s) => subjectStrength(s, state.attempts)).sort((a, b) => a.recentAccuracy - b.recentAccuracy)[0]
  const s = weakest?.subjectId ?? practisable[0] ?? 'maths'
  return { kind: 'practice', title: `Practise ${pretty(s)}`, detail: `${qs} questions, about ${mins} minutes.`, cta: 'Start round', to: `/practice/${s}`, xp: 80, minutes: mins, subjectId: s }
}

// ---------------------------------------------------------------- Home state

export type HomeStateKind = 'new' | 'pick-goal' | 'preview' | 'first-round' | 'resume' | 'done-today' | 'streak-risk'
export type HomeIcon = 'compass' | 'target' | 'eye' | 'play' | 'check' | 'flame'

export interface HomeCard {
  state: HomeStateKind
  title: string
  line: string
  cta: string
  to: string
  hue: number
  icon: HomeIcon
  meta?: {
    subject?: string
    rounds?: number
    accuracy?: number
    streak?: number
    /** The last round's score, for "6 of 8". */
    correct?: number
    total?: number
    /** Questions in the next round, from prefs. */
    questions?: number
    /** Career id for the finder and preview states. */
    careerId?: string
  }
}

function subjectHue(id: string): number {
  const s = getSubject(id)
  if (!s) return 258
  return AREA_META[s.area].hue
}

function questionsFor(state: StudentState): number {
  const m = state.prefs?.dailyMinutes ?? 10
  return m === 5 ? 4 : m === 15 ? 12 : 8
}

/** The goal's weakest must subject that has items; same ranking as nextStep. */
function weakestGoalSubject(state: StudentState): string | undefined {
  const p = state.profile
  const band = p ? bandForGrade(p.boardId, p.grade) : '6-8'
  const practisable = subjectsWithItems(band)
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined
  if (!goal) return practisable[0]
  const ranked = goal.subjects.must
    .filter((s) => practisable.includes(s))
    .map((s) => ({ s, st: subjectStrength(s, state.attempts) }))
    .sort((a, b) => (a.st.items === 0 ? -1 : b.st.items === 0 ? 1 : a.st.recentAccuracy - b.st.recentAccuracy))
  return ranked[0]?.s ?? practisable[0]
}

/**
 * The one card at the top of Today, chosen by state (screensdesign's state
 * router). Copy here is the senior copy; junior screens re-word it from the
 * state and meta. `now` comes from the caller so render stays pure.
 */
export function homeState(state: StudentState, now: { hour: number; today: string }): HomeCard {
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined
  const questions = questionsFor(state)

  if (!state.goals.length && !state.finder) {
    return { state: 'new', title: 'Find a direction', line: 'Eight quick questions. Three futures worth a look.', cta: 'Play the finder', to: '/finder', hue: 320, icon: 'compass' }
  }
  if (!goal) {
    const answers = state.finder ?? {}
    const profile = buildProfile(state)
    const picture = Object.values(answers).some((v) => typeof v === 'string' && v.startsWith(PICTURE_PREFIX))
    const top = (picture ? scorePictureFinder(answers, state, profile) : scoreFinder(answers, state, profile)).careers[0]?.career
    const name = top ? top.title.split(' (')[0] : 'a career'
    return { state: 'pick-goal', title: `Your top match: ${name}`, line: 'Look at it closely, then set it as your goal.', cta: 'See my matches', to: '/finder', hue: 258, icon: 'target', meta: { careerId: top?.id } }
  }
  const goalName = goal.title.split(' (')[0]
  if (!state.previewed.includes(goal.id)) {
    return { state: 'preview', title: `See your future as a ${goalName.toLowerCase()}`, line: 'Your age at every step, from today to ten years in.', cta: 'Peer into your future', to: `/careers/${goal.id}?preview=1`, hue: 215, icon: 'eye', meta: { careerId: goal.id } }
  }
  if (!state.attempts.length) {
    const s = weakestGoalSubject(state) ?? 'maths'
    return {
      state: 'first-round',
      title: pretty(s),
      line: `Round 1 · ${questions} questions, about ${state.prefs?.dailyMinutes ?? 10} minutes`,
      cta: 'Start round',
      to: `/practice/${s}`,
      hue: subjectHue(s),
      icon: 'play',
      meta: { subject: s, rounds: 0, questions },
    }
  }

  const last = [...state.attempts].sort((a, b) => a.date.localeCompare(b.date))[state.attempts.length - 1]
  const s = last.subjectId
  const st = subjectStrength(s, state.attempts)
  const run = streak(state.activeDays).current
  const activeToday = state.activeDays.includes(now.today)
  const roundToday = state.attempts.some((a) => a.date.slice(0, 10) === now.today)

  if (activeToday && roundToday) {
    const extra = nextStep(state)
    return {
      state: 'done-today',
      title: "You're done for today",
      line: run >= 2 ? `${run} days in a row` : 'Your streak starts today',
      cta: extra.title,
      to: extra.to,
      hue: 150,
      icon: 'check',
      meta: { streak: run, subject: extra.subjectId },
    }
  }
  if (now.hour >= 17 && !activeToday && run >= 2) {
    return { state: 'streak-risk', title: 'Keep your streak', line: `5 minutes keeps ${run} days alive`, cta: 'Next round', to: `/practice/${s}`, hue: 28, icon: 'flame', meta: { subject: s, streak: run, rounds: st.attempts } }
  }
  return {
    state: 'resume',
    title: pretty(s),
    line: `Round ${st.attempts + 1} · last round ${last.correct} of ${last.total}`,
    cta: 'Next round',
    to: `/practice/${s}`,
    hue: subjectHue(s),
    icon: 'play',
    meta: { subject: s, rounds: st.attempts, accuracy: st.recentAccuracy, correct: last.correct, total: last.total, questions },
  }
}
