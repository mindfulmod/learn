import { Compass, Heart, Hammer, Lightbulb, Leaf, Megaphone, Palette, Puzzle, Users, type LucideIcon } from 'lucide-react'
import type { CareerCluster, InterestId } from '../types'

/**
 * Paths are career clusters renamed as aspirations a child can picture
 * ("Care for people") instead of job titles ("Medicine and Health"). Each has
 * a one-line promise and a pastel tile so the nine paths look different.
 */
export interface PathMeta {
  cluster: CareerCluster
  title: string
  promise: string
  /** The careers to lead with for this path (ids from careers.ts). */
  lead: string[]
  hue: number
}

export const PATHS: PathMeta[] = [
  { cluster: 'medicine-health', title: 'Care for people', promise: 'Help people get better and stay well.', lead: ['doctor', 'nurse', 'dentist'], hue: 350 },
  { cluster: 'engineering-tech', title: 'Build a better world', promise: 'Make bridges, machines and energy that work.', lead: ['electrical-engineer', 'civil-engineer', 'architect'], hue: 28 },
  { cluster: 'computing-data', title: 'Create with technology', promise: 'Make apps, games and smart machines.', lead: ['software-engineer', 'data-scientist'], hue: 215 },
  { cluster: 'business-finance', title: 'Run the show', promise: 'Start things, lead teams, handle money.', lead: ['business-manager', 'chartered-accountant', 'economist'], hue: 165 },
  { cluster: 'law-governance', title: 'Make things fair', promise: 'Stand up for people and run the country.', lead: ['lawyer', 'civil-servant'], hue: 250 },
  { cluster: 'arts-design-media', title: 'Tell stories', promise: 'Design, film, write and make people feel.', lead: ['graphic-designer', 'journalist'], hue: 320 },
  { cluster: 'education-social', title: 'Help others grow', promise: 'Teach, listen and change lives one at a time.', lead: ['teacher', 'psychologist'], hue: 45 },
  { cluster: 'defence-aviation', title: 'Protect and fly', promise: 'Lead, serve and take to the skies.', lead: ['pilot', 'armed-forces-officer'], hue: 200 },
  { cluster: 'science-research', title: 'Find out why', promise: 'Discover things nobody knew before.', lead: ['biotechnologist', 'chemist'], hue: 140 },
]

export function pathFor(cluster: CareerCluster): PathMeta {
  return PATHS.find((p) => p.cluster === cluster)!
}

/** Interest pills shown on the home screen. Each nudges paths. */
export const INTERESTS: { id: InterestId; label: string; icon: LucideIcon; paths: Partial<Record<CareerCluster, number>> }[] = [
  { id: 'make', label: 'Make things', icon: Hammer, paths: { 'engineering-tech': 1, 'computing-data': 0.5, 'arts-design-media': 0.3 } },
  { id: 'puzzles', label: 'Solve puzzles', icon: Puzzle, paths: { 'computing-data': 1, 'science-research': 0.8, 'business-finance': 0.4 } },
  { id: 'help', label: 'Help people', icon: Heart, paths: { 'medicine-health': 1, 'education-social': 0.9, 'law-governance': 0.3 } },
  { id: 'nature', label: 'Explore nature', icon: Leaf, paths: { 'science-research': 1, 'medicine-health': 0.4, 'engineering-tech': 0.3 } },
  { id: 'stories', label: 'Tell stories', icon: Megaphone, paths: { 'arts-design-media': 1, 'education-social': 0.4, 'law-governance': 0.3 } },
  { id: 'organise', label: 'Plan and organise', icon: Compass, paths: { 'business-finance': 1, 'law-governance': 0.5, 'defence-aviation': 0.4 } },
  { id: 'lead', label: 'Lead a team', icon: Users, paths: { 'defence-aviation': 0.8, 'business-finance': 0.8, 'law-governance': 0.6 } },
  { id: 'design', label: 'Draw and design', icon: Palette, paths: { 'arts-design-media': 1, 'engineering-tech': 0.4, 'computing-data': 0.3 } },
]

export const IDEA_ICON = Lightbulb

/** Rank paths from chosen interests; falls back to a friendly default trio. */
export function pathsForInterests(interests: InterestId[]): PathMeta[] {
  if (!interests.length) return [pathFor('computing-data'), pathFor('medicine-health'), pathFor('engineering-tech')]
  const score: Partial<Record<CareerCluster, number>> = {}
  for (const id of interests) {
    const it = INTERESTS.find((i) => i.id === id)
    if (!it) continue
    for (const [c, w] of Object.entries(it.paths) as [CareerCluster, number][]) score[c] = (score[c] ?? 0) + w
  }
  return [...PATHS].sort((a, b) => (score[b.cluster] ?? 0) - (score[a.cluster] ?? 0)).slice(0, 3)
}
