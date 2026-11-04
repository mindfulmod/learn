import type { Board, BoardId, GradeBand, Stage, StageId } from '../types'

export const BOARDS: Board[] = [
  {
    id: 'national',
    name: 'National boards (Federal and provincial)',
    shortName: 'National',
    description:
      'The Single National Curriculum for grades 1-8, then Matriculation (SSC, grades 9-10) and Intermediate (HSSC, grades 11-12) under FBISE, BISE Lahore, Karachi, Peshawar, Quetta and other boards.',
    stageLabels: {
      primary: 'Primary (SNC)',
      middle: 'Middle (SNC)',
      secondary: 'Matric (SSC)',
      'higher-secondary': 'Intermediate (HSSC)',
    },
  },
  {
    id: 'cambridge',
    name: 'Cambridge International (O Level / A Level)',
    shortName: 'Cambridge',
    description:
      'Cambridge Primary and Lower Secondary, then O Level (usually grades 9-11) and AS/A Level (grades 12-13). Equivalence with Matric and FSc is issued by IBCC.',
    stageLabels: {
      primary: 'Cambridge Primary',
      middle: 'Lower Secondary',
      secondary: 'O Level',
      'higher-secondary': 'AS & A Level',
    },
  },
  {
    id: 'akueb',
    name: 'Aga Khan University Examination Board',
    shortName: 'AKU-EB',
    description:
      'A national board with concept-based SSC (grades 9-10) and HSSC (grades 11-12) examinations, aligned to the national scheme of studies and recognised across Pakistan.',
    stageLabels: {
      primary: 'Primary',
      middle: 'Middle',
      secondary: 'SSC (AKU-EB)',
      'higher-secondary': 'HSSC (AKU-EB)',
    },
  },
]

export const STAGES: Stage[] = [
  {
    id: 'primary',
    name: 'Primary',
    grades: [1, 2, 3, 4, 5],
    band: '1-5',
    summary:
      'Building blocks: reading and writing in English and Urdu, number sense, curiosity about the world, and good habits.',
  },
  {
    id: 'middle',
    name: 'Middle',
    grades: [6, 7, 8],
    band: '6-8',
    summary:
      'Subjects get deeper. This is when students usually notice what they enjoy most, and when study habits start to matter.',
  },
  {
    id: 'secondary',
    name: 'Secondary',
    grades: [9, 10],
    band: '9-10',
    summary:
      'The first big choice: Science, Computer, Commerce or Arts group. Board exams begin and the results shape college options.',
  },
  {
    id: 'higher-secondary',
    name: 'Higher Secondary',
    grades: [11, 12],
    band: '11-12',
    summary:
      'Pre-Medical, Pre-Engineering, ICS, I.Com or FA (or A Levels). Entrance tests like MDCAT and ECAT are decided here.',
  },
]

/** Grades each board uses. Cambridge runs to grade 13 (A2). */
export const BOARD_GRADES: Record<BoardId, number[]> = {
  national: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  cambridge: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  akueb: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
}

export function stageForGrade(boardId: BoardId, grade: number): StageId {
  if (grade <= 5) return 'primary'
  if (grade <= 8) return 'middle'
  if (boardId === 'cambridge') return grade <= 11 ? 'secondary' : 'higher-secondary'
  return grade <= 10 ? 'secondary' : 'higher-secondary'
}

export function bandForStage(stage: StageId): GradeBand {
  return STAGES.find((s) => s.id === stage)!.band
}

export function bandForGrade(boardId: BoardId, grade: number): GradeBand {
  return bandForStage(stageForGrade(boardId, grade))
}

export function getBoard(id: BoardId): Board {
  return BOARDS.find((b) => b.id === id)!
}

export function getStage(id: StageId): Stage {
  return STAGES.find((s) => s.id === id)!
}

export function gradeLabel(boardId: BoardId, grade: number): string {
  if (boardId === 'cambridge') {
    if (grade === 12) return 'AS Level (Grade 12)'
    if (grade === 13) return 'A2 Level (Grade 13)'
    if (grade >= 9) return `O Level (Grade ${grade})`
  }
  if (grade === 9) return 'Grade 9 (Matric part 1)'
  if (grade === 10) return 'Grade 10 (Matric part 2)'
  if (grade === 11) return 'Grade 11 (1st year)'
  if (grade === 12) return 'Grade 12 (2nd year)'
  return `Grade ${grade}`
}
