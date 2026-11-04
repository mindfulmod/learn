import { getBoard, getStage, STAGES, stageForGrade } from '../data/boards'
import { getStream } from '../data/streams'
import { subjectName } from '../data/subjects'
import type { Career, Profile, StageId } from '../types'
import type { MasteryLevel, StrengthProfile } from './profile'

export interface SubjectStatus {
  subjectId: string
  name: string
  importance: 'must' | 'helpful'
  level: MasteryLevel
  accuracy: number | null
  inCurrentStream: boolean | null
}

export interface GoalPlan {
  career: Career
  stage: StageId
  stageLabel: string
  pathway: { secondary: string; higherSecondary: string; note?: string }
  recommendedStreamId: string | null
  recommendedStreamName: string | null
  streamMatches: boolean | null
  currentFocus: string[]
  nextStage: { id: StageId; label: string; focus: string[] } | null
  subjects: SubjectStatus[]
  gaps: SubjectStatus[]
  entranceTests: string[]
  degrees: string[]
  institutions: string[]
}

function streamLabel(id: string): string {
  return getStream(id)?.name ?? id
}

export function goalPlan(career: Career, profile: Profile, strengths: StrengthProfile): GoalPlan {
  const board = getBoard(profile.boardId)
  const stage = stageForGrade(profile.boardId, profile.grade)
  const pathway = career.pathways[profile.boardId]

  let recommendedStreamId: string | null = null
  if (stage === 'secondary') recommendedStreamId = pathway.secondary
  if (stage === 'higher-secondary') recommendedStreamId = pathway.higherSecondary
  if (stage === 'middle') recommendedStreamId = pathway.secondary

  const streamMatches = stage === 'secondary' || stage === 'higher-secondary'
    ? profile.streamId ? profile.streamId === recommendedStreamId || streamAcceptable(career, profile) : null
    : null

  const currentStream = getStream(profile.streamId)
  const streamSubjectIds = currentStream ? [...currentStream.compulsory, ...(currentStream.electives?.from ?? [])] : null

  const subjects: SubjectStatus[] = [
    ...career.subjects.must.map((id) => ({ id, importance: 'must' as const })),
    ...career.subjects.helpful.map((id) => ({ id, importance: 'helpful' as const })),
  ].map(({ id, importance }) => {
    const s = strengths.subjects[id]
    return {
      subjectId: id,
      name: subjectName(id),
      importance,
      level: s?.level ?? 'not-practised',
      accuracy: s ? s.accuracy : null,
      inCurrentStream: streamSubjectIds ? streamSubjectIds.includes(id) : null,
    }
  })

  const gaps = subjects.filter((s) => s.importance === 'must' && (s.level === 'needs-work' || s.level === 'developing'))

  const stageIndex = STAGES.findIndex((s) => s.id === stage)
  const next = STAGES[stageIndex + 1]
  const currentFocus = career.roadmap.find((r) => r.stage === stage)?.focus ?? []
  const nextFocus = next ? career.roadmap.find((r) => r.stage === next.id)?.focus ?? [] : []

  return {
    career,
    stage,
    stageLabel: board.stageLabels[stage],
    pathway: {
      secondary: streamLabel(pathway.secondary),
      higherSecondary: streamLabel(pathway.higherSecondary),
      note: pathway.note,
    },
    recommendedStreamId,
    recommendedStreamName: recommendedStreamId ? streamLabel(recommendedStreamId) : null,
    streamMatches,
    currentFocus,
    nextStage: next ? { id: next.id, label: board.stageLabels[next.id], focus: nextFocus } : null,
    subjects,
    gaps,
    entranceTests: career.entranceTests,
    degrees: career.degrees,
    institutions: career.institutions,
  }
}

/**
 * A stream is acceptable when it contains every must-have subject for the
 * career, even if it is not the primary recommendation.
 */
export function streamAcceptable(career: Career, profile: Profile): boolean {
  const stream = getStream(profile.streamId)
  if (!stream) return false
  const ids = [...stream.compulsory, ...(stream.electives?.from ?? [])]
  // Foundation subjects like english are always available.
  const foundational = ['english', 'urdu', 'maths', 'art-craft']
  return career.subjects.must.every((id) => ids.includes(id) || foundational.includes(id))
}

export function stageName(stage: StageId): string {
  return getStage(stage).name
}
