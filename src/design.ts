import {
  Activity,
  Banknote,
  BarChart3,
  BookA,
  BookMarked,
  BookOpen,
  Bot,
  Brain,
  Briefcase,
  Building2,
  Calculator,
  Clapperboard,
  Cog,
  Compass,
  Divide,
  Dna,
  Feather,
  FileText,
  Flag,
  Flame,
  FlaskConical,
  FolderKanban,
  Gavel,
  Globe,
  Hand,
  Home,
  Infinity as InfinityIcon,
  Landmark,
  Laptop,
  Leaf,
  Lightbulb,
  Map as MapIcon,
  Medal,
  Microscope,
  Monitor,
  Palette,
  PenTool,
  PiggyBank,
  Plane,
  Puzzle,
  Receipt,
  Rocket,
  Scale,
  Scroll,
  Search,
  Sigma,
  Sparkles,
  Sprout,
  Stethoscope,
  Store,
  Target,
  Telescope,
  Theater,
  TrendingUp,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { Area, CareerCluster, Trait } from './types'

/**
 * Visual identity for each learning area. `hue` feeds the CSS tint system so
 * tiles, badges and bars are coloured consistently in light and dark themes.
 */
export const AREA_META: Record<Area, { hue: number; icon: LucideIcon; label: string }> = {
  maths: { hue: 258, icon: Divide, label: 'Mathematics' },
  science: { hue: 160, icon: FlaskConical, label: 'Science' },
  language: { hue: 12, icon: BookOpen, label: 'Languages' },
  social: { hue: 36, icon: Globe, label: 'Social studies' },
  computing: { hue: 205, icon: Laptop, label: 'Computing' },
  arts: { hue: 320, icon: Palette, label: 'Arts' },
  business: { hue: 180, icon: TrendingUp, label: 'Business' },
  religious: { hue: 120, icon: Landmark, label: 'Islamiyat' },
}

export const SUBJECT_ICON: Record<string, LucideIcon> = {
  english: BookOpen,
  urdu: Feather,
  maths: Divide,
  'general-maths': Calculator,
  'general-science': Microscope,
  islamiyat: Landmark,
  'social-studies': MapIcon,
  'pak-studies': Flag,
  'computer-studies': Monitor,
  'art-craft': PenTool,
  physics: Zap,
  chemistry: FlaskConical,
  biology: Dna,
  'computer-science': Laptop,
  statistics: BarChart3,
  economics: TrendingUp,
  accounting: Receipt,
  'business-maths': Calculator,
  commerce: Store,
  banking: PiggyBank,
  civics: Landmark,
  education: BookMarked,
  psychology: Brain,
  sociology: Users,
  geography: Globe,
  history: Scroll,
  'fine-arts': Palette,
  'home-economics': Home,
  'islamiat-elective': BookA,
  'global-perspectives': Globe,
  'add-maths': Sigma,
  'business-studies': Briefcase,
  literature: Theater,
  'environmental-management': Leaf,
  law: Gavel,
  'further-maths': InfinityIcon,
  'general-paper': FileText,
}

export const CLUSTER_META: Record<CareerCluster, { hue: number; icon: LucideIcon }> = {
  'medicine-health': { hue: 350, icon: Stethoscope },
  'engineering-tech': { hue: 28, icon: Cog },
  'computing-data': { hue: 215, icon: Bot },
  'business-finance': { hue: 165, icon: Briefcase },
  'law-governance': { hue: 250, icon: Scale },
  'arts-design-media': { hue: 320, icon: Clapperboard },
  'education-social': { hue: 45, icon: Sprout },
  'defence-aviation': { hue: 200, icon: Plane },
  'science-research': { hue: 140, icon: Telescope },
}

export const TRAIT_META: Record<Trait, { hue: number; icon: LucideIcon }> = {
  realistic: { hue: 28, icon: Wrench },
  investigative: { hue: 215, icon: Search },
  artistic: { hue: 320, icon: Palette },
  social: { hue: 45, icon: Hand },
  enterprising: { hue: 350, icon: Rocket },
  conventional: { hue: 165, icon: FolderKanban },
}

/** Icons for the coach's feedback kinds. */
export const FEEDBACK_ICON = {
  strength: Sparkles,
  gap: Target,
  habit: Flame,
  next: Compass,
  goal: Flag,
  discover: Lightbulb,
} as const

export const STAT_ICON = { streak: Flame, questions: Puzzle, strong: Medal, accuracy: Target, rounds: Activity, pay: Banknote, workplace: Building2 }

/** Inline style that sets the tint hue for an element and its children. */
export function tint(hue: number): React.CSSProperties {
  return { ['--h' as string]: hue }
}

export function subjectIcon(id: string, area?: Area): LucideIcon {
  return SUBJECT_ICON[id] ?? (area ? AREA_META[area].icon : BookOpen)
}
