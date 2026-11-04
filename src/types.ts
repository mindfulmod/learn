// Shared domain types for Rahnuma.

export type BoardId = 'national' | 'cambridge' | 'akueb'

export type StageId = 'primary' | 'middle' | 'secondary' | 'higher-secondary'

export type GradeBand = '1-5' | '6-8' | '9-10' | '11-12'

/** Broad learning areas used for aptitude tracking and career matching. */
export type Area =
  | 'maths'
  | 'science'
  | 'language'
  | 'social'
  | 'computing'
  | 'arts'
  | 'business'
  | 'religious'

/** Holland (RIASEC) interest traits, used by the discovery questionnaire. */
export type Trait =
  | 'realistic'
  | 'investigative'
  | 'artistic'
  | 'social'
  | 'enterprising'
  | 'conventional'

export interface Board {
  id: BoardId
  name: string
  shortName: string
  description: string
  /** Label the board uses for each stage, e.g. "Matric" vs "O Level". */
  stageLabels: Record<StageId, string>
}

export interface Stage {
  id: StageId
  name: string
  grades: number[]
  band: GradeBand
  summary: string
}

export interface SyllabusUnit {
  /** Inclusive grade range this unit applies to. */
  grades: [number, number]
  name: string
  topics: string[]
}

export interface Subject {
  id: string
  name: string
  urduName?: string
  area: Area
  description: string
  /** Boards that offer this subject. */
  boards: BoardId[]
  /** Grades in which the subject is normally studied. */
  grades: [number, number]
  units: SyllabusUnit[]
}

export interface Stream {
  id: string
  boardId: BoardId
  stageId: StageId
  name: string
  shortName: string
  description: string
  compulsory: string[]
  /** Elective subject ids; `pick` says how many are normally chosen. */
  electives?: { pick: number; from: string[] }
  /** Career clusters this stream naturally leads toward. */
  leadsTo: CareerCluster[]
}

export type CareerCluster =
  | 'medicine-health'
  | 'engineering-tech'
  | 'computing-data'
  | 'business-finance'
  | 'law-governance'
  | 'arts-design-media'
  | 'education-social'
  | 'defence-aviation'
  | 'science-research'

export interface CareerPathway {
  /** Stream id (or free text) recommended for grades 9-10 on this board. */
  secondary: string
  /** Stream id (or free text) recommended for grades 11-12 on this board. */
  higherSecondary: string
  note?: string
}

export interface RoadmapStep {
  stage: StageId
  focus: string[]
}

export interface Career {
  id: string
  title: string
  cluster: CareerCluster
  summary: string
  dayInLife: string
  /** 0-1 weights describing how strongly each trait fits the career. */
  traits: Partial<Record<Trait, number>>
  /** 0-1 weights describing how important each learning area is. */
  areas: Partial<Record<Area, number>>
  subjects: { must: string[]; helpful: string[] }
  pathways: Record<BoardId, CareerPathway>
  entranceTests: string[]
  degrees: string[]
  institutions: string[]
  roadmap: RoadmapStep[]
  related: string[]
}

export interface DiscoveryQuestion {
  id: string
  text: string
  /** Weight of each trait when the student agrees with the statement. */
  traits: Partial<Record<Trait, number>>
  areas?: Partial<Record<Area, number>>
}

export interface QuizItem {
  id: string
  subjectId: string
  band: GradeBand
  topic: string
  difficulty: 1 | 2 | 3
  question: string
  options: string[]
  answer: number
  explanation: string
}

// ---- Persisted student state ----

export interface Profile {
  name: string
  grade: number
  boardId: BoardId
  streamId?: string
  createdAt: string
}

export interface DiscoveryResult {
  answers: Record<string, number>
  traits: Record<Trait, number>
  areas: Record<Area, number>
  completedAt: string
}

export interface QuizAttempt {
  id: string
  subjectId: string
  band: GradeBand
  date: string
  total: number
  correct: number
  /** Per-topic tallies for finer feedback. */
  topics: Record<string, { correct: number; total: number }>
  /** Per-difficulty tallies. */
  difficulty: Record<1 | 2 | 3, { correct: number; total: number }>
  durationSec: number
}

export interface StudentState {
  version: 1
  profile: Profile | null
  goals: string[]
  discovery: DiscoveryResult | null
  attempts: QuizAttempt[]
  /** ISO dates on which the student practised, for streak tracking. */
  activeDays: string[]
}
