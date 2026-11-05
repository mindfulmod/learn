/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { todayKey } from '../engine/profile'
import type { DiscoveryResult, Profile, QuizAttempt, StudentState } from '../types'

const KEY = 'rahnuma.v1'

export const EMPTY: StudentState = { version: 1, profile: null, goals: [], discovery: null, finder: null, previewed: [], attempts: [], activeDays: [] }

type Action =
  | { type: 'set-profile'; profile: Profile }
  | { type: 'set-goals'; goals: string[] }
  | { type: 'set-discovery'; discovery: DiscoveryResult }
  | { type: 'set-finder'; answers: Record<string, string> | null }
  | { type: 'mark-previewed'; careerId: string }
  | { type: 'add-attempt'; attempt: QuizAttempt }
  | { type: 'import'; state: StudentState }
  | { type: 'reset' }

function reducer(state: StudentState, action: Action): StudentState {
  switch (action.type) {
    case 'set-profile':
      return { ...state, profile: action.profile }
    case 'set-goals':
      return { ...state, goals: action.goals.slice(0, 3) }
    case 'set-discovery':
      return { ...state, discovery: action.discovery, activeDays: addDay(state.activeDays) }
    case 'set-finder':
      return { ...state, finder: action.answers, activeDays: action.answers ? addDay(state.activeDays) : state.activeDays }
    case 'mark-previewed':
      return state.previewed.includes(action.careerId) ? state : { ...state, previewed: [...state.previewed, action.careerId] }
    case 'add-attempt':
      return { ...state, attempts: [...state.attempts, action.attempt], activeDays: addDay(state.activeDays) }
    case 'import':
      return sanitise(action.state)
    case 'reset':
      return EMPTY
  }
}

function addDay(days: string[]): string[] {
  const t = todayKey()
  return days.includes(t) ? days : [...days, t]
}

export function sanitise(raw: unknown): StudentState {
  if (!raw || typeof raw !== 'object') return EMPTY
  const r = raw as Partial<StudentState>
  return {
    version: 1,
    profile: r.profile && typeof r.profile.name === 'string' && typeof r.profile.grade === 'number' ? r.profile : null,
    goals: Array.isArray(r.goals) ? r.goals.filter((g) => typeof g === 'string') : [],
    discovery: r.discovery && r.discovery.traits ? r.discovery : null,
    finder: r.finder && typeof r.finder === 'object' ? r.finder : null,
    previewed: Array.isArray(r.previewed) ? r.previewed.filter((p) => typeof p === 'string') : [],
    attempts: Array.isArray(r.attempts) ? r.attempts.filter((a) => a && typeof a.subjectId === 'string') : [],
    activeDays: Array.isArray(r.activeDays) ? r.activeDays.filter((d) => typeof d === 'string') : [],
  }
}

function load(): StudentState {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? sanitise(JSON.parse(raw)) : EMPTY
  } catch {
    return EMPTY
  }
}

interface Store {
  state: StudentState
  setProfile: (profile: Profile) => void
  setGoals: (goals: string[]) => void
  setDiscovery: (d: DiscoveryResult) => void
  setFinder: (answers: Record<string, string> | null) => void
  markPreviewed: (careerId: string) => void
  addAttempt: (a: QuizAttempt) => void
  importState: (s: StudentState) => void
  reset: () => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // Storage may be unavailable (private mode); the app still works for the session.
    }
  }, [state])

  const value = useMemo<Store>(
    () => ({
      state,
      setProfile: (profile) => dispatch({ type: 'set-profile', profile }),
      setGoals: (goals) => dispatch({ type: 'set-goals', goals }),
      setDiscovery: (discovery) => dispatch({ type: 'set-discovery', discovery }),
      setFinder: (answers) => dispatch({ type: 'set-finder', answers }),
      markPreviewed: (careerId) => dispatch({ type: 'mark-previewed', careerId }),
      addAttempt: (attempt) => dispatch({ type: 'add-attempt', attempt }),
      importState: (s) => dispatch({ type: 'import', state: s }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [state],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}
