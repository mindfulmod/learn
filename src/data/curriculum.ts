import type { BoardId, Subject } from '../types'
import { stageForGrade } from './boards'
import { getStream, streamSubjects } from './streams'
import { SUBJECTS } from './subjects'

/**
 * Subjects a student studies in a given grade. From grade 9 the stream
 * decides; before that every board has a common foundation set.
 */
export function subjectsForGrade(boardId: BoardId, grade: number, streamId?: string): Subject[] {
  const stage = stageForGrade(boardId, grade)
  const inGrade = (s: Subject) => grade >= s.grades[0] && grade <= s.grades[1] && s.boards.includes(boardId)

  if (stage === 'primary' || stage === 'middle') {
    return SUBJECTS.filter((s) => inGrade(s) && s.grades[0] <= 8)
  }

  const stream = getStream(streamId)
  if (!stream) {
    // No stream chosen yet: show the common core for that stage.
    const core = boardId === 'cambridge' && stage === 'higher-secondary'
      ? ['maths', 'physics', 'chemistry', 'biology', 'computer-science', 'economics', 'business-studies']
      : ['english', 'urdu', 'islamiyat', 'pak-studies', 'maths']
    return SUBJECTS.filter((s) => core.includes(s.id) && inGrade(s))
  }

  const ids = streamSubjects(stream)
  return ids
    .map((id) => SUBJECTS.find((s) => s.id === id))
    .filter((s): s is Subject => !!s)
    .filter((s) => {
      // Islamiyat ends in grade 11 and Pak Studies is the grade 12 paper on
      // national boards; keep both visible but respect the grade ranges.
      return grade >= s.grades[0] && grade <= s.grades[1]
    })
}

export function isCompulsory(streamId: string | undefined, subjectId: string): boolean {
  const stream = getStream(streamId)
  return !!stream && stream.compulsory.includes(subjectId)
}
