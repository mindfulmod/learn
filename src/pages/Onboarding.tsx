import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BOARD_GRADES, BOARDS, getBoard, gradeLabel, stageForGrade } from '../data/boards'
import { CAREERS, CLUSTER_NAMES } from '../data/careers'
import { streamsFor } from '../data/streams'
import { useStore } from '../store/store'
import type { BoardId } from '../types'

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

  const stage = stageForGrade(boardId, grade)
  const needsStream = stage === 'secondary' || stage === 'higher-secondary'
  const streams = needsStream ? streamsFor(boardId, stage) : []
  const base = import.meta.env.BASE_URL

  const finish = () => {
    setProfile({
      name: name.trim(),
      grade,
      boardId,
      streamId: needsStream ? streamId : undefined,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    })
    setGoals(goal ? [goal] : [])
    nav('/', { replace: true })
  }

  const steps = ['About you', 'Your school', 'Your goal']

  return (
    <div className="app">
      <main style={{ maxWidth: 640 }}>
        <div className="row" style={{ marginBottom: 20 }}>
          <img src={`${base}favicon.svg`} alt="" width={36} height={36} />
          <div>
            <h1 style={{ marginBottom: 0 }}>Rahnuma</h1>
            <p className="muted small" style={{ margin: 0 }}>Your guide through school to the career you want.</p>
          </div>
        </div>

        <div className="progress-steps" aria-label={`Step ${step + 1} of ${steps.length}`}>
          {steps.map((s, i) => (
            <span key={s} className={i <= step ? 'done' : ''} />
          ))}
        </div>

        {step === 0 && (
          <div className="card">
            <h2>What should we call you?</h2>
            <label className="field">
              <span>Your first name</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ayesha" autoFocus maxLength={40} />
            </label>
            <label className="field">
              <span>Which board or system do you study under?</span>
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
            <p className="small muted">{getBoard(boardId).description}</p>
            <button className="btn primary block" disabled={!name.trim()} onClick={() => setStep(1)}>
              Next
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="card">
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
                <p className="small muted">Pick the one you are in, or the one you are planning. You can change this later.</p>
                <div className="choices" style={{ marginBottom: 16 }}>
                  {streams.map((s) => (
                    <button key={s.id} className={`choice ${streamId === s.id ? 'selected' : ''}`} onClick={() => setStreamId(s.id)}>
                      <strong>{s.name}</strong>
                      <span className="small muted">{s.description}</span>
                    </button>
                  ))}
                  <button className={`choice ${streamId === undefined ? 'selected' : ''}`} onClick={() => setStreamId(undefined)}>
                    <strong>Not decided yet</strong>
                    <span className="small muted">We will suggest one based on your goal.</span>
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
            <h2>Do you have a career in mind?</h2>
            <p className="small muted">Optional. If you are not sure, skip this and take the discovery quiz; it suggests careers that fit you.</p>
            <label className="field">
              <span>Career goal</span>
              <select value={goal ?? ''} onChange={(e) => setGoal(e.target.value || undefined)}>
                <option value="">Not sure yet</option>
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
            <div className="row">
              <button className="btn" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn primary" style={{ flex: 1 }} onClick={finish}>
                {goal ? 'Show my roadmap' : 'Start exploring'}
              </button>
            </div>
          </div>
        )}

        <p className="small muted" style={{ marginTop: 20, textAlign: 'center' }}>
          Everything is saved on this device only. No account, no uploads.
        </p>
      </main>
    </div>
  )
}
