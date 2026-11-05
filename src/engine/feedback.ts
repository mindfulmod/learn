import { bandForGrade } from '../data/boards'
import { getCareer } from '../data/careers'
import { AREA_NAMES, TRAIT_NAMES } from '../data/discovery'
import { subjectsWithItems } from '../data/quizzes'
import { subjectName } from '../data/subjects'
import type { StudentState } from '../types'
import { rankCareers } from './careers'
import { topTraits } from './discovery'
import { goalPlan } from './plan'
import { streak, type StrengthProfile } from './profile'

export type FeedbackKind = 'strength' | 'gap' | 'habit' | 'next' | 'goal' | 'discover'

export interface FeedbackItem {
  kind: FeedbackKind
  title: string
  body: string
  action?: { label: string; to: string }
}

/**
 * Rule-based coaching. Ordered so the most useful message comes first:
 * celebrate, then direct attention to one gap, then habit, then next steps.
 */
export function buildFeedback(state: StudentState, profile: StrengthProfile): FeedbackItem[] {
  const out: FeedbackItem[] = []
  const p = state.profile
  if (!p) return out
  const name = p.name.split(' ')[0]
  const band = bandForGrade(p.boardId, p.grade)
  const subjects = Object.values(profile.subjects)

  // 1. Strengths
  const strong = subjects.filter((s) => s.level === 'strong' && s.confidence !== 'low').sort((a, b) => b.accuracy - a.accuracy)
  if (strong.length) {
    const s = strong[0]
    out.push({
      kind: 'strength',
      title: `${subjectName(s.subjectId)} is a real strength`,
      body: `${name}, ${s.accuracy}% across ${s.items} questions${s.hardAccuracy !== null && s.hardAccuracy >= 70 ? ', hard ones too' : ''}. ${s.trend === 'up' ? 'Still improving.' : 'Practise weekly to keep it.'}`,
    })
  }
  const improving = subjects.filter((s) => s.trend === 'up' && s.attempts >= 2)
  if (improving.length && (!strong.length || improving[0].subjectId !== strong[0].subjectId)) {
    const s = improving[0]
    out.push({
      kind: 'strength',
      title: `Climbing in ${subjectName(s.subjectId)}`,
      body: `Recent scores (${s.recentAccuracy}%) beat your overall ${s.accuracy}%. Effort is showing.`,
    })
  }

  // 2. Gaps, prioritising goal subjects
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined
  const plan = goal ? goalPlan(goal, p, profile) : null
  const goalGap = plan?.gaps[0]
  const goalName = goal ? goal.title.split(' (')[0] : ''
  if (goalGap) {
    const s = profile.subjects[goalGap.subjectId]
    const topics = s?.weakTopics.slice(0, 2)
    out.push({
      kind: 'gap',
      title: `${goalGap.name} needs work for ${goalName}`,
      body: `You are at ${goalGap.accuracy}%. ${topics?.length ? `Start with ${topics.join(' and ')}.` : 'A few more rounds will show what to revise.'}`,
      action: { label: `Practise ${goalGap.name}`, to: `/practice/${goalGap.subjectId}` },
    })
  } else {
    const weak = subjects.filter((s) => s.level === 'needs-work').sort((a, b) => a.accuracy - b.accuracy)
    if (weak.length) {
      const s = weak[0]
      out.push({
        kind: 'gap',
        title: `Let us fix ${subjectName(s.subjectId)} together`,
        body: `${s.accuracy}% so far. ${s.weakTopics.length ? `Revise ${s.weakTopics.slice(0, 2).join(' and ')}, then retry.` : 'Read each explanation; they are written to teach.'}`,
        action: { label: 'Practise again', to: `/practice/${s.subjectId}` },
      })
    }
  }
  const stuckTopics = subjects.flatMap((s) => s.weakTopics.map((t) => ({ s, t }))).slice(0, 1)
  if (stuckTopics.length && !goalGap) {
    const { s, t } = stuckTopics[0]
    out.push({
      kind: 'gap',
      title: `Topic to revise: ${t}`,
      body: `"${t}" in ${subjectName(s.subjectId)} keeps tripping you up. Ask a teacher, then practise.`,
    })
  }

  // 3. Habits
  const st = streak(state.activeDays)
  if (st.current >= 3) {
    out.push({ kind: 'habit', title: `${st.current}-day streak`, body: 'A little every day beats cramming. Keep it going.' })
  } else if (state.attempts.length && st.current === 0) {
    out.push({ kind: 'habit', title: 'Pick the streak back up', body: 'Ten minutes today restarts your streak. Small and steady wins.', action: { label: 'Practise now', to: '/practice' } })
  }

  // 4. Goal and discovery nudges
  if (goal && !state.previewed.includes(goal.id)) {
    out.push({
      kind: 'goal',
      title: `See your future as a ${goalName.toLowerCase()}`,
      body: 'Year by year: study, exams, first job and life ten years in.',
      action: { label: 'Peer into your future', to: `/careers/${goal.id}?preview=1` },
    })
  }
  if (!state.goals.length && !state.finder) {
    out.push({
      kind: 'discover',
      title: 'Not sure yet? Play the finder',
      body: 'Eight quick "would you rather" questions, three futures. About three minutes.',
      action: { label: 'Open the Career Finder', to: '/finder' },
    })
  } else if (!state.discovery) {
    out.push({
      kind: 'discover',
      title: 'Discover what suits you',
      body: 'Answer 24 quick statements to see careers and subjects that suit you.',
      action: { label: 'Start discovery', to: '/discover' },
    })
  } else if (!state.goals.length) {
    const ranked = rankCareers(state, profile).slice(0, 2)
    const traits = topTraits(state.discovery.traits, 2).map((t) => TRAIT_NAMES[t]).join(' and ')
    out.push({
      kind: 'goal',
      title: 'Set a goal to get a roadmap',
      body: `You are a ${traits}. ${ranked.map((r) => r.career.title).join(' and ')} fit well. Pick one for a roadmap.`,
      action: { label: 'Explore careers', to: '/careers' },
    })
  }

  if (plan && goal) {
    if (plan.streamMatches === false) {
      out.push({
        kind: 'goal',
        title: `Your group does not lead to ${goalName}`,
        body: `${goalName} usually needs ${plan.recommendedStreamName}. Ask a teacher about switching, or see related careers.`,
        action: { label: 'See related careers', to: `/careers/${goal.id}` },
      })
    }
    const unpractised = plan.subjects.filter((s) => s.importance === 'must' && s.level === 'not-practised' && subjectsWithItems(band).includes(s.subjectId))
    if (unpractised.length) {
      out.push({
        kind: 'next',
        title: `Try a ${unpractised[0].name} practice`,
        body: `A must-have for ${goalName}, not practised yet. One round shows where you stand.`,
        action: { label: `Practise ${unpractised[0].name}`, to: `/practice/${unpractised[0].subjectId}` },
      })
    }
    if (plan.currentFocus.length) {
      out.push({
        kind: 'next',
        title: `This year's focus for ${goalName}`,
        body: plan.currentFocus.slice(0, 2).join(' · '),
      })
    }
  }

  // 5. Area-level insight from blended profile
  if (profile.totalItems >= 16 || state.discovery) {
    const sorted = (Object.entries(profile.areas) as [keyof typeof AREA_NAMES, number][]).sort((a, b) => b[1] - a[1])
    const [bestArea, bestVal] = sorted[0]
    if (bestVal >= 65) {
      out.push({
        kind: 'strength',
        title: `${AREA_NAMES[bestArea]} suits you`,
        body: profile.areaEvidence[bestArea] > 0.3
          ? 'Your practice and interests agree. Look at careers that use it.'
          : 'Your interests point here. Practise related subjects to confirm it.',
      })
    }
  }

  if (!state.attempts.length) {
    out.push({
      kind: 'next',
      title: 'Take your first practice quiz',
      body: 'Eight questions from your grade. Results start your strength profile.',
      action: { label: 'Choose a subject', to: '/practice' },
    })
  }

  return out.slice(0, 7)
}
