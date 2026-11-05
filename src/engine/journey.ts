import { getBoard, BOARD_GRADES } from '../data/boards'
import { careerLife, formatPkr } from '../data/careerLife'
import { getStream } from '../data/streams'
import type { Career, Profile } from '../types'

export interface Milestone {
  /** Approximate age at this point. */
  age: number
  /** Years from now. 0 means now. */
  yearsFromNow: number
  title: string
  detail: string
  kind: 'now' | 'school' | 'exam' | 'university' | 'training' | 'work' | 'future'
}

/** Students in Pakistan are usually about grade + 5 years old. */
export function ageForGrade(grade: number): number {
  return grade + 5
}

/**
 * Build a personal timeline from the student's current grade to an
 * established career, with ages, so the future feels concrete.
 */
export function buildJourney(career: Career, profile: Profile): Milestone[] {
  const board = getBoard(profile.boardId)
  const pathway = career.pathways[profile.boardId]
  const life = careerLife(career.id)
  const grades = BOARD_GRADES[profile.boardId]
  const lastGrade = grades[grades.length - 1]
  const g = profile.grade
  const age = ageForGrade(g)
  const out: Milestone[] = []

  out.push({ age, yearsFromNow: 0, kind: 'now', title: `Grade ${g}, today`, detail: 'This is where the journey starts. Every step below is reachable from here.' })

  const secondaryStart = 9
  const secondaryEnd = profile.boardId === 'cambridge' ? 11 : 10
  const higherEnd = lastGrade
  const secName = getStream(pathway.secondary)?.name ?? pathway.secondary
  const highName = getStream(pathway.higherSecondary)?.name ?? pathway.higherSecondary

  if (g < secondaryStart) {
    out.push({
      age: ageForGrade(secondaryStart),
      yearsFromNow: secondaryStart - g,
      kind: 'school',
      title: `Grade ${secondaryStart}: choose your group`,
      detail: `Pick ${secName}. Until then, build strong ${career.subjects.must.length ? 'foundations in ' + career.subjects.must.slice(0, 2).map(prettySubject).join(' and ') : 'study habits'}.`,
    })
  }
  if (g <= secondaryEnd) {
    out.push({
      age: ageForGrade(secondaryEnd) + 1,
      yearsFromNow: secondaryEnd - g + 1,
      kind: 'exam',
      title: `Finish ${board.stageLabels.secondary}`,
      detail: g >= secondaryStart ? `You are in ${secName === pathway.secondary ? 'this stage' : secName} now. Aim high in the board exams; they decide your college.` : `Board exams in ${secName}. Strong marks here open the best colleges.`,
    })
  }
  if (g <= higherEnd) {
    out.push({
      age: ageForGrade(higherEnd) + 1,
      yearsFromNow: higherEnd - g + 1,
      kind: 'exam',
      title: `Finish ${board.stageLabels['higher-secondary']} and sit ${career.entranceTests[0]?.split(' (')[0] ?? 'the entrance test'}`,
      detail: `${highName}. ${career.entranceTests[0] ? 'Then ' + career.entranceTests[0] + '.' : ''}`,
    })
  }

  const uniStartYears = Math.max(0, higherEnd - g + 1)
  const study = life?.yearsOfStudy ?? 4
  out.push({
    age: ageForGrade(higherEnd) + 1 + study,
    yearsFromNow: uniStartYears + study,
    kind: 'university',
    title: `Graduate: ${career.degrees[0]}`,
    detail: `${study} years at a place like ${career.institutions.slice(0, 2).join(' or ')}.`,
  })

  let afterUni = uniStartYears + study
  if (life?.training) {
    afterUni += life.training.years
    out.push({
      age: ageForGrade(higherEnd) + 1 + study + life.training.years,
      yearsFromNow: afterUni,
      kind: 'training',
      title: life.training.name,
      detail: `${life.training.years} more year${life.training.years === 1 ? '' : 's'} of training on the job.`,
    })
  }

  out.push({
    age: age + afterUni,
    yearsFromNow: afterUni,
    kind: 'work',
    title: `First job as a ${career.title.split(' (')[0]}`,
    detail: life ? `Around Rs ${formatPkr(life.pay.entry[0])} to ${formatPkr(life.pay.entry[1])} a month to start, working in ${life.workplaces[0].toLowerCase()}.` : 'Your career begins.',
  })
  out.push({
    age: age + afterUni + 10,
    yearsFromNow: afterUni + 10,
    kind: 'future',
    title: 'Ten years in: established',
    detail: life ? `Experienced ${career.title.split(' (')[0].toLowerCase()}s earn around Rs ${formatPkr(life.pay.experienced[0])} to ${formatPkr(life.pay.experienced[1])} a month, often leading teams or running their own practice.` : 'Leading, mentoring, shaping the field.',
  })

  return out
}

function prettySubject(id: string): string {
  return id.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}
