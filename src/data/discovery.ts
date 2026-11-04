import type { Area, DiscoveryQuestion, Trait } from '../types'

export const TRAIT_NAMES: Record<Trait, string> = {
  realistic: 'Maker (hands-on)',
  investigative: 'Thinker (curious)',
  artistic: 'Creator (imaginative)',
  social: 'Helper (people-focused)',
  enterprising: 'Leader (persuasive)',
  conventional: 'Organiser (detail-focused)',
}

export const TRAIT_BLURBS: Record<Trait, string> = {
  realistic: 'You like building, fixing, sports and working with real things.',
  investigative: 'You like asking why, solving puzzles and understanding how things work.',
  artistic: 'You like drawing, writing, music and making new things.',
  social: 'You like helping, teaching and spending time with people.',
  enterprising: 'You like leading, convincing others and starting projects.',
  conventional: 'You like order, lists, numbers and getting details right.',
}

export const AREA_NAMES: Record<Area, string> = {
  maths: 'Mathematics',
  science: 'Science',
  language: 'Languages',
  social: 'Social studies',
  computing: 'Computing',
  arts: 'Arts',
  business: 'Business',
  religious: 'Islamiyat',
}

export const LIKERT = [
  { value: 1, label: 'Not like me' },
  { value: 2, label: 'A little' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Mostly' },
  { value: 5, label: 'Very like me' },
]

/** 24 statements, 4 per trait, written for students aged roughly 9 to 18. */
export const DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
  // Realistic
  { id: 'r1', text: 'I enjoy fixing or building things with my hands, like toys, bikes or models.', traits: { realistic: 1 } },
  { id: 'r2', text: 'I would rather do a science experiment than read about it.', traits: { realistic: 0.8, investigative: 0.4 }, areas: { science: 0.5 } },
  { id: 'r3', text: 'I like sports, being outdoors and physical challenges.', traits: { realistic: 1 } },
  { id: 'r4', text: 'I am curious about how machines, engines and gadgets work inside.', traits: { realistic: 0.7, investigative: 0.6 }, areas: { science: 0.4, maths: 0.2 } },
  // Investigative
  { id: 'i1', text: 'I like solving maths puzzles and tricky problems.', traits: { investigative: 1 }, areas: { maths: 1 } },
  { id: 'i2', text: 'I ask a lot of "why" and "how" questions about nature and the world.', traits: { investigative: 1 }, areas: { science: 0.8 } },
  { id: 'i3', text: 'I enjoy reading about science, space, animals or the human body.', traits: { investigative: 0.9 }, areas: { science: 1 } },
  { id: 'i4', text: 'I like figuring out patterns and finding what is wrong when something does not work.', traits: { investigative: 0.9, conventional: 0.3 }, areas: { computing: 0.6, maths: 0.4 } },
  // Artistic
  { id: 'a1', text: 'I love drawing, painting, designing or making crafts.', traits: { artistic: 1 }, areas: { arts: 1 } },
  { id: 'a2', text: 'I enjoy writing stories, poems or making up plays.', traits: { artistic: 1 }, areas: { language: 0.8 } },
  { id: 'a3', text: 'I like music, acting, or performing in front of others.', traits: { artistic: 0.9, social: 0.3 }, areas: { arts: 0.6 } },
  { id: 'a4', text: 'I have lots of ideas and like doing things in my own new way.', traits: { artistic: 0.8, enterprising: 0.3 } },
  // Social
  { id: 's1', text: 'I enjoy helping classmates understand their work.', traits: { social: 1 }, areas: { language: 0.3 } },
  { id: 's2', text: 'People come to me when they are upset or need advice.', traits: { social: 1 } },
  { id: 's3', text: 'I would like a job where I take care of people, like a doctor, nurse or teacher.', traits: { social: 0.9, investigative: 0.2 }, areas: { science: 0.3 } },
  { id: 's4', text: 'I like working in a group more than working alone.', traits: { social: 0.8, enterprising: 0.3 } },
  // Enterprising
  { id: 'e1', text: 'I like being the leader of a team or a class project.', traits: { enterprising: 1 } },
  { id: 'e2', text: 'I enjoy debating, giving speeches, or convincing others of my ideas.', traits: { enterprising: 0.9, social: 0.3 }, areas: { language: 0.6, social: 0.4 } },
  { id: 'e3', text: 'I would enjoy running my own business or selling something I made.', traits: { enterprising: 1 }, areas: { business: 1 } },
  { id: 'e4', text: 'I like taking charge and making decisions quickly.', traits: { enterprising: 0.9 } },
  // Conventional
  { id: 'c1', text: 'I like keeping my things, notes and schedule neat and organised.', traits: { conventional: 1 } },
  { id: 'c2', text: 'I enjoy working with numbers, tables and money sums.', traits: { conventional: 0.8, investigative: 0.3 }, areas: { maths: 0.7, business: 0.6 } },
  { id: 'c3', text: 'I like following clear steps and rules to get something exactly right.', traits: { conventional: 1 } },
  { id: 'c4', text: 'I enjoy using computers to organise information, like spreadsheets or lists.', traits: { conventional: 0.8 }, areas: { computing: 0.7 } },
]
