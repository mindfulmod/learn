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
      body: `${name}, you are scoring ${s.accuracy}% across ${s.items} questions${s.hardAccuracy !== null && s.hardAccuracy >= 70 ? ', including the hard ones' : ''}. ${s.trend === 'up' ? 'And you are still improving.' : 'Keep it sharp with a quick practice each week.'}`,
    })
  }
  const improving = subjects.filter((s) => s.trend === 'up' && s.attempts >= 2)
  if (improving.length && (!strong.length || improving[0].subjectId !== strong[0].subjectId)) {
    const s = improving[0]
    out.push({
      kind: 'strength',
      title: `You are climbing in ${subjectName(s.subjectId)}`,
      body: `Your recent scores (${s.recentAccuracy}%) are better than when you started (${s.accuracy}% overall). Effort is showing.`,
    })
  }

  // 2. Gaps, prioritising goal subjects
  const goal = state.goals[0] ? getCareer(state.goals[0]) : undefined
  const plan = goal ? goalPlan(goal, p, profile) : null
  const goalGap = plan?.gaps[0]
  if (goalGap) {
    const s = profile.subjects[goalGap.subjectId]
    const topics = s?.weakTopics.slice(0, 2)
    out.push({
      kind: 'gap',
      title: `${goalGap.name} needs attention for your ${goal!.title} goal`,
      body: `You are at ${goalGap.accuracy}%. ${topics?.length ? `Start with: ${topics.join(' and ')}.` : 'A few more practice rounds will show exactly which topics to revise.'}`,
      action: { label: `Practise ${goalGap.name}`, to: `/practice/${goalGap.subjectId}` },
    })
  } else {
    const weak = subjects.filter((s) => s.level === 'needs-work').sort((a, b) => a.accuracy - b.accuracy)
    if (weak.length) {
      const s = weak[0]
      out.push({
        kind: 'gap',
        title: `Let us fix ${subjectName(s.subjectId)} together`,
        body: `${s.accuracy}% so far. ${s.weakTopics.length ? `Revise ${s.weakTopics.slice(0, 2).join(' and ')} first, then try again.` : 'Read the explanations after each question; they are written to teach, not just to mark.'}`,
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
      body: `In ${subjectName(s.subjectId)}, "${t}" has tripped you up more than once. Ask a teacher or watch a short video on it, then practise.`,
    })
  }

  // 3. Habits
  const st = streak(state.activeDays)
  if (st.current >= 3) {
    out.push({ kind: 'habit', title: `${st.current}-day streak`, body: 'Practising a little every day beats cramming. Keep the chain going.' })
  } else if (state.attempts.length && st.current === 0) {
    out.push({ kind: 'habit', title: 'Pick the streak back up', body: 'A 10-minute practice today restarts your streak. Small and steady wins.', action: { label: 'Practise now', to: '/practice' } })
  }

  // 4. Goal and discovery nudges
  if (!state.discovery) {
    out.push({
      kind: 'discover',
      title: 'Discover what suits you',
      body: 'Answer 24 quick statements and we will show which careers match your interests and the subjects to focus on.',
      action: { label: 'Start discovery', to: '/discover' },
    })
  } else if (!state.goals.length) {
    const ranked = rankCareers(state, profile).slice(0, 2)
    const traits = topTraits(state.discovery.traits, 2).map((t) => TRAIT_NAMES[t]).join(' and ')
    out.push({
      kind: 'goal',
      title: 'Set a goal to get a roadmap',
      body: `You came out as a ${traits}. ${ranked.map((r) => r.career.title).join(' and ')} look like good fits. Pick one to see the subjects and stream you need.`,
      action: { label: 'Explore careers', to: '/careers' },
    })
  }

  if (plan && goal) {
    if (plan.streamMatches === false) {
      out.push({
        kind: 'goal',
        title: `Your current group does not lead to ${goal.title}`,
        body: `${goal.title} usually needs ${plan.recommendedStreamName}. Talk to a teacher or counsellor about whether a change is possible, or look at related careers that fit your group.`,
        action: { label: 'See related careers', to: `/careers/${goal.id}` },
      })
    }
    const unpractised = plan.subjects.filter((s) => s.importance === 'must' && s.level === 'not-practised' && subjectsWithItems(band).includes(s.subjectId))
    if (unpractised.length) {
      out.push({
        kind: 'next',
        title: `Try a ${unpractised[0].name} practice`,
        body: `It is a must-have subject for ${goal.title}, and you have not practised it here yet. One round tells us where you stand.`,
        action: { label: `Practise ${unpractised[0].name}`, to: `/practice/${unpractised[0].subjectId}` },
      })
    }
    if (plan.currentFocus.length) {
      out.push({
        kind: 'next',
        title: `This year's focus for ${goal.title}`,
        body: plan.currentFocus.join(' · '),
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
          ? 'Both your practice results and your interests point the same way. Careers that use this area are worth a close look.'
          : 'Your interests point here. Practise the related subjects to confirm it with real results.',
      })
    }
  }

  if (!state.attempts.length) {
    out.push({
      kind: 'next',
      title: 'Take your first practice quiz',
      body: 'Eight questions from your own grade. The results start your strength profile and unlock personalised feedback.',
      action: { label: 'Choose a subject', to: '/practice' },
    })
  }

  return out.slice(0, 7)
}
