import { FlaskConical, Sprout } from 'lucide-react'
import type { CareerCluster } from '../types'
import { PATH_WORD, PICTURE_ROUNDS, type SceneSpec } from './pictureFinder'
import { pathFor } from './paths'

/**
 * Rahnuma Town (grades 1 to 5): nine places, one per path. Positions are
 * percentages of the map. `x`/`y` place it on the wide 1000 by 620 map;
 * `phone` places it on the tall map used in narrow columns, so the 80px
 * targets never overlap. The centre of both maps is kept clear for the
 * signpost. See docs/DESIGN.md, iteration 5.
 */
export type BuildingShape = 'house' | 'dome' | 'hangar' | 'tower'

export interface TownPlace {
  cluster: CareerCluster
  /** Place name, for read-aloud and labels of the building. */
  name: string
  /** One-word path name (PATH_WORD). */
  word: string
  hue: number
  x: number
  y: number
  phone: { x: number; y: number }
  shape: BuildingShape
  /** A person doing the work. */
  scene: SceneSpec
  /** One spoken sentence. */
  say: string
  /** Kicker above the Try it round, five words or fewer. */
  kicker: string
  /** Subject id with grade 1 to 5 items (see subjectsWithItems('1-5')). */
  trySubject: 'maths' | 'english' | 'general-science'
}

function scene(id: string): SceneSpec {
  for (const r of PICTURE_ROUNDS) {
    const s = r.scenes.find((x) => x.id === id)
    if (s) return s
  }
  throw new Error(`Unknown scene ${id}`)
}

const GARDEN_SCENE: SceneSpec = {
  id: 'town-garden',
  label: 'Grow plants',
  say: 'A scientist growing plants in a garden lab',
  icon: Sprout,
  prop: FlaskConical,
  hue: 140,
  motif: 'field',
  clusters: { 'science-research': 1 },
  traits: { investigative: 1 },
}

type Raw = Omit<TownPlace, 'word' | 'hue'>

const RAW: Raw[] = [
  { cluster: 'medicine-health', name: 'Hospital', x: 12, y: 20, phone: { x: 16, y: 10 }, shape: 'house', scene: scene('p2a'), say: 'A doctor helps sick people get better.', kicker: 'Help the doctor', trySubject: 'general-science' },
  { cluster: 'engineering-tech', name: 'Workshop', x: 37, y: 16, phone: { x: 50, y: 8 }, shape: 'house', scene: scene('p1a'), say: 'A builder makes bridges and machines that work.', kicker: 'Help the builder', trySubject: 'maths' },
  { cluster: 'computing-data', name: 'Game Studio', x: 63, y: 19, phone: { x: 84, y: 10 }, shape: 'tower', scene: scene('p3a'), say: 'An inventor makes games and clever machines.', kicker: 'Help the game maker', trySubject: 'maths' },
  { cluster: 'business-finance', name: 'Market', x: 88, y: 16, phone: { x: 84, y: 35 }, shape: 'hangar', scene: scene('p4b'), say: 'A leader runs a shop and counts the money.', kicker: 'Help the shopkeeper', trySubject: 'maths' },
  { cluster: 'defence-aviation', name: 'Airfield', x: 89, y: 52, phone: { x: 84, y: 63 }, shape: 'hangar', scene: scene('p2b'), say: 'A pilot flies planes and keeps people safe.', kicker: 'Help the pilot', trySubject: 'maths' },
  { cluster: 'science-research', name: 'Garden Lab', x: 76, y: 82, phone: { x: 72, y: 86 }, shape: 'dome', scene: GARDEN_SCENE, say: 'A scientist finds out how plants grow.', kicker: 'Help the scientist', trySubject: 'general-science' },
  { cluster: 'education-social', name: 'School', x: 50, y: 84, phone: { x: 28, y: 86 }, shape: 'house', scene: scene('p4a'), say: 'A teacher helps children learn new things.', kicker: 'Help the teacher', trySubject: 'english' },
  { cluster: 'arts-design-media', name: 'Theatre', x: 24, y: 82, phone: { x: 16, y: 63 }, shape: 'dome', scene: scene('p7b'), say: 'A creator tells stories on stage and in films.', kicker: 'Help the actor', trySubject: 'english' },
  { cluster: 'law-governance', name: 'Court', x: 11, y: 52, phone: { x: 16, y: 35 }, shape: 'tower', scene: scene('p8b'), say: 'A judge listens and decides what is fair.', kicker: 'Help the judge', trySubject: 'english' },
]

/** In road order: the road loops through the places in this order. */
export const TOWN_PLACES: TownPlace[] = RAW.map((p) => ({ ...p, word: PATH_WORD[p.cluster], hue: pathFor(p.cluster).hue }))

export function placeFor(cluster: CareerCluster): TownPlace {
  return TOWN_PLACES.find((p) => p.cluster === cluster)!
}
