import {
  Bird,
  BookOpen,
  Brush,
  Building2,
  Calculator,
  Camera,
  Cpu,
  FlaskConical,
  Gavel,
  Hammer,
  HeartPulse,
  Leaf,
  Megaphone,
  Mic,
  Plane,
  Puzzle,
  Rocket,
  School,
  Shield,
  Sprout,
  Stethoscope,
  Store,
  Telescope,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { CareerCluster, Trait } from '../types'

/**
 * Picture finder for grades 1 to 5. No reading required: each round shows two
 * illustrated scenes and a spoken prompt. Scenes are specified, not drawn,
 * so the Scene component can render them from the Orb system and icons.
 */
export interface SceneSpec {
  id: string
  /** One or two words shown under the picture for early readers. */
  label: string
  /** Spoken description for read-aloud. */
  say: string
  icon: LucideIcon
  /** Secondary icon that sits in the scene. */
  prop?: LucideIcon
  hue: number
  /** Background motif the Scene component composes. */
  motif: 'sky' | 'room' | 'field' | 'stage' | 'lab' | 'street'
  clusters: Partial<Record<CareerCluster, number>>
  traits?: Partial<Record<Trait, number>>
}

export interface PictureRound {
  id: string
  prompt: string
  scenes: [SceneSpec, SceneSpec]
}

export const PICTURE_ROUNDS: PictureRound[] = [
  {
    id: 'p1',
    prompt: 'Which would you rather do?',
    scenes: [
      { id: 'p1a', label: 'Fix a bike', say: 'Fix a bike with tools', icon: Wrench, prop: Hammer, hue: 28, motif: 'street', clusters: { 'engineering-tech': 1 }, traits: { realistic: 1 } },
      { id: 'p1b', label: 'Paint a picture', say: 'Paint a big colourful picture', icon: Brush, hue: 320, motif: 'room', clusters: { 'arts-design-media': 1 }, traits: { artistic: 1 } },
    ],
  },
  {
    id: 'p2',
    prompt: 'Which would you rather be?',
    scenes: [
      { id: 'p2a', label: 'Doctor', say: 'A doctor helping a sick child', icon: Stethoscope, prop: HeartPulse, hue: 350, motif: 'room', clusters: { 'medicine-health': 1 }, traits: { social: 0.6, investigative: 0.4 } },
      { id: 'p2b', label: 'Pilot', say: 'A pilot flying a plane in the sky', icon: Plane, hue: 200, motif: 'sky', clusters: { 'defence-aviation': 1 }, traits: { realistic: 0.7 } },
    ],
  },
  {
    id: 'p3',
    prompt: 'Which looks more fun?',
    scenes: [
      { id: 'p3a', label: 'Make a game', say: 'Make a computer game', icon: Cpu, prop: Puzzle, hue: 215, motif: 'room', clusters: { 'computing-data': 1 }, traits: { investigative: 0.7 } },
      { id: 'p3b', label: 'Look after animals', say: 'Look after animals and plants outside', icon: Bird, prop: Leaf, hue: 140, motif: 'field', clusters: { 'science-research': 0.8, 'medicine-health': 0.4 }, traits: { realistic: 0.4, investigative: 0.5 } },
    ],
  },
  {
    id: 'p4',
    prompt: 'Which would you rather do?',
    scenes: [
      { id: 'p4a', label: 'Teach a class', say: 'Teach a class of children', icon: School, prop: BookOpen, hue: 45, motif: 'room', clusters: { 'education-social': 1 }, traits: { social: 1 } },
      { id: 'p4b', label: 'Run a shop', say: 'Run your own shop and count the money', icon: Store, prop: Calculator, hue: 165, motif: 'street', clusters: { 'business-finance': 1 }, traits: { enterprising: 0.8, conventional: 0.4 } },
    ],
  },
  {
    id: 'p5',
    prompt: 'Which would you rather do?',
    scenes: [
      { id: 'p5a', label: 'Do experiments', say: 'Mix things in a science lab', icon: FlaskConical, prop: Telescope, hue: 140, motif: 'lab', clusters: { 'science-research': 1 }, traits: { investigative: 1 } },
      { id: 'p5b', label: 'Speak on stage', say: 'Speak to a crowd on a stage', icon: Mic, prop: Megaphone, hue: 250, motif: 'stage', clusters: { 'law-governance': 0.8, 'arts-design-media': 0.5 }, traits: { enterprising: 1 } },
    ],
  },
  {
    id: 'p6',
    prompt: 'Which would you rather build?',
    scenes: [
      { id: 'p6a', label: 'A bridge', say: 'Build a big bridge', icon: Building2, prop: Hammer, hue: 28, motif: 'field', clusters: { 'engineering-tech': 1 }, traits: { realistic: 0.8 } },
      { id: 'p6b', label: 'A robot', say: 'Build a robot that thinks', icon: Rocket, prop: Cpu, hue: 215, motif: 'lab', clusters: { 'computing-data': 1, 'engineering-tech': 0.4 }, traits: { investigative: 0.8 } },
    ],
  },
  {
    id: 'p7',
    prompt: 'Who would you rather be?',
    scenes: [
      { id: 'p7a', label: 'Protector', say: 'Someone who keeps people safe', icon: Shield, hue: 200, motif: 'street', clusters: { 'defence-aviation': 1, 'law-governance': 0.5 }, traits: { realistic: 0.6, conventional: 0.5 } },
      { id: 'p7b', label: 'Storyteller', say: 'Someone who makes films and stories', icon: Camera, prop: Megaphone, hue: 320, motif: 'stage', clusters: { 'arts-design-media': 1 }, traits: { artistic: 1 } },
    ],
  },
  {
    id: 'p8',
    prompt: 'Which would you rather do?',
    scenes: [
      { id: 'p8a', label: 'Help people', say: 'Help people who need it', icon: Users, prop: HeartPulse, hue: 350, motif: 'room', clusters: { 'medicine-health': 0.8, 'education-social': 0.8 }, traits: { social: 1 } },
      { id: 'p8b', label: 'Make things fair', say: 'Decide what is fair, like a judge', icon: Gavel, prop: Sprout, hue: 250, motif: 'room', clusters: { 'law-governance': 1 }, traits: { enterprising: 0.6, conventional: 0.5 } },
    ],
  },
]

/** One-word names for paths, for the youngest students. */
export const PATH_WORD: Record<CareerCluster, string> = {
  'medicine-health': 'Healer',
  'engineering-tech': 'Builder',
  'computing-data': 'Inventor',
  'business-finance': 'Leader',
  'law-governance': 'Defender',
  'arts-design-media': 'Creator',
  'education-social': 'Helper',
  'defence-aviation': 'Protector',
  'science-research': 'Explorer',
}

export const PICTURE_PREFIX = 'picture:'

export function isPictureAnswers(answers: Record<string, string> | null): boolean {
  return !!answers && Object.values(answers).some((v) => v.startsWith(PICTURE_PREFIX))
}
