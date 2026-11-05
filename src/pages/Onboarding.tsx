import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, Lock, Rocket, Sparkles, Target } from 'lucide-react'
import { BOARD_GRADES, BOARDS, getBoard, gradeLabel, stageForGrade } from '../data/boards'
import { CAREERS, CLUSTER_NAMES } from '../data/careers'
import { streamsFor } from '../data/streams'
import { useStore } from '../store/store'
import { Orb } from '../components/Orb'
import type { BoardId } from '../types'

/** One-line board notes; the full descriptions are too long for a helper line. */
const BOARD_NOTE: Record<BoardId, string> = {
  national: 'Matric and Inter, under FBISE or a provincial board.',
  cambridge: 'O Level and A Level, with IBCC equivalence.',
  akueb: 'Aga Khan board, with SSC and HSSC exams.',
}

function firstSentence(text: string): string {
  const i = text.indexOf('. ')
  return i === -1 ? text : text.slice(0, i + 1)
}

export function Onboarding() {
  const { state, setProfile, setGoals } = useStore()
  const nav = useNavigate()
  const existing = state.profile
  const [step, setStep] = useState(0)
  const [name, setName] = useState(existing?.name ?? '')
  const [grade, setGrade] = useState<number>(existing?.grade ?? 6)
  const [boardId, setBoardId] = useState<BoardId>(existing?.boardId ?? 'national')
  const [streamId, setStreamId] = useState<string | undefined>(existing?.streamId)
  const [goal, setGoal] = useState<string | undefined>(state.goals[0])
  const [goalMode, setGoalMode] = useState<'has' | 'find' | null>(state.goals[0] ? 'has' : null)

  const stage = stageForGrade(boardId, grade)
  const needsStream = stage === 'secondary' || stage === 'higher-secondary'
  const streams = needsStream ? streamsFor(boardId, stage) : []

  const finish = () => {
    setProfile({
      name: name.trim(),
      grade,
      boardId,
      streamId: needsStream ? streamId : undefined,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    })
    setGoals(goalMode === 'has' && goal ? [goal] : [])
    nav(goalMode === 'has' && goal ? `/careers/${goal}?preview=1` : goalMode === 'find' ? '/finder' : '/', { replace: true })
  }

  const steps = ['About you', 'Your school', 'Your goal']

  return (
    <div className="app" style={{ minHeight: '100dvh' }}>
      <main style={{ maxWidth: 640, width: '100%', margin: '0 auto', padding: 'clamp(28px, 7vh, 64px) 16px 40px' }}>
        <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 28 }}>
          <Orb hue={258} size={120} variant={0} />
          <h1 style={{ margin: '14px 0 4px' }}>Rahnuma</h1>
          <p className="lead" style={{ margin: 0 }}>
            Your guide from here to the career you want.
          </p>
        </header>

        <div className="progress-steps" aria-label={`Step ${step + 1} of ${steps.length}`}>
          {steps.map((s, i) => (
            <span key={s} className={i <= step ? 'done' : ''} />
          ))}
        </div>

        {step === 0 && (
          <div className="card">
            <span className="kicker">Step 1 of 3</span>
            <h2>What should we call you?</h2>
            <label className="field">
              <span>Your first name</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ayesha" autoFocus maxLength={40} />
            </label>
            <label className="field">
              <span>Your board or system</span>
              <select
                value={boardId}
                onChange={(e) => {
                  const b = e.target.value as BoardId
                  setBoardId(b)
                  setStreamId(undefined)
                  if (!BOARD_GRADES[b].includes(grade)) setGrade(BOARD_GRADES[b][BOARD_GRADES[b].length - 1])
                }}
              >
                {BOARDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="small muted">{BOARD_NOTE[boardId]}</p>
            <button className="btn primary block" disabled={!name.trim()} onClick={() => setStep(1)}>
              Next
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="card">
            <span className="kicker">Step 2 of 3</span>
            <h2>Which grade are you in?</h2>
            <div className="choices cols-2" style={{ marginBottom: 16 }}>
              {BOARD_GRADES[boardId].map((g) => (
                <button
                  key={g}
                  className={`choice ${grade === g ? 'selected' : ''}`}
                  onClick={() => {
                    setGrade(g)
                    if (stageForGrade(boardId, g) !== stageForGrade(boardId, grade)) setStreamId(undefined)
                  }}
                >
                  <strong>{gradeLabel(boardId, g)}</strong>
                  <span className="small muted">{getBoard(boardId).stageLabels[stageForGrade(boardId, g)]}</span>
                </button>
              ))}
            </div>

            {needsStream && (
              <>
                <h3>Which group or stream?</h3>
                <p className="small muted">Pick yours, or the one you plan. Change it any time.</p>
                <div className="choices" style={{ marginBottom: 16 }}>
                  {streams.map((s) => (
                    <button key={s.id} className={`choice ${streamId === s.id ? 'selected' : ''}`} onClick={() => setStreamId(s.id)}>
                      <strong>{s.name}</strong>
                      <span className="small muted">{firstSentence(s.description)}</span>
                    </button>
                  ))}
                  <button className={`choice ${streamId === undefined ? 'selected' : ''}`} onClick={() => setStreamId(undefined)}>
                    <strong>Not decided yet</strong>
                    <span className="small muted">We will suggest one from your goal.</span>
                  </button>
                </div>
              </>
            )}

            <div className="row">
              <button className="btn" onClick={() => setStep(0)}>
                Back
              </button>
              <button className="btn primary" style={{ flex: 1 }} onClick={() => setStep(2)}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <span className="kicker">Step 3 of 3</span>
            <h2>Do you have a career in mind?</h2>
            <p className="small muted">Most people your age don't. That is fine.</p>
            <div className="choices" style={{ marginBottom: 16 }}>
              <button className={`choice ${goalMode === 'has' ? 'selected' : ''}`} onClick={() => setGoalMode('has')}>
                <strong>
                  <Target size={16} className="inline-icon" aria-hidden="true" />I have one in mind
                </strong>
                <span className="small muted">See your path to it, year by year.</span>
              </button>
              <button
                className={`choice ${goalMode === 'find' ? 'selected' : ''}`}
                onClick={() => {
                  setGoalMode('find')
                  setGoal(undefined)
                }}
              >
                <strong>
                  <Compass size={16} className="inline-icon" aria-hidden="true" />Help me find one
                </strong>
                <span className="small muted">A 3-minute game shows three futures.</span>
              </button>
            </div>
            {goalMode === 'has' && (
              <label className="field">
                <span>Career goal</span>
                <select value={goal ?? ''} onChange={(e) => setGoal(e.target.value || undefined)} autoFocus>
                  <option value="">Choose a career</option>
                  {Object.entries(CLUSTER_NAMES).map(([cluster, label]) => (
                    <optgroup key={cluster} label={label}>
                      {CAREERS.filter((c) => c.cluster === cluster).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
            )}
            <div className="row">
              <button className="btn" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn primary" style={{ flex: 1 }} onClick={finish} disabled={goalMode === 'has' && !goal}>
                {goalMode === 'has' ? (
                  <>
                    Peer into my future <Rocket size={18} aria-hidden="true" />
                  </>
                ) : goalMode === 'find' ? (
                  <>
                    Start the finder <Compass size={18} aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Skip for now <Sparkles size={18} aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <p className="small muted" style={{ marginTop: 20, textAlign: 'center' }}>
          <Lock size={14} className="inline-icon" aria-hidden="true" />
          Saved on this device only. No account, no uploads.
        </p>
      </main>
    </div>
  )
}
