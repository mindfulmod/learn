import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BOARD_GRADES, getBoard, getStage, gradeLabel, stageForGrade } from '../data/boards'
import { CAREERS, CLUSTER_NAMES } from '../data/careers'
import { isCompulsory, subjectsForGrade } from '../data/curriculum'
import { subjectsWithItems } from '../data/quizzes'
import { getStream, streamsFor } from '../data/streams'
import { unitsForGrade } from '../data/subjects'
import { bandForGrade } from '../data/boards'
import { buildProfile } from '../engine/profile'
import { useStore } from '../store/store'
import { LevelBadge } from '../components/ui'

export function Curriculum() {
  const { state } = useStore()
  const p = state.profile!
  const [grade, setGrade] = useState(p.grade)
  const [streamId, setStreamId] = useState<string | undefined>(p.streamId)
  const board = getBoard(p.boardId)
  const stage = stageForGrade(p.boardId, grade)
  const stageInfo = getStage(stage)
  const needsStream = stage === 'secondary' || stage === 'higher-secondary'
  const streams = needsStream ? streamsFor(p.boardId, stage) : []
  const effectiveStream = needsStream ? (streamId && getStream(streamId)?.stageId === stage ? streamId : undefined) : undefined
  const subjects = useMemo(() => subjectsForGrade(p.boardId, grade, effectiveStream), [p.boardId, grade, effectiveStream])
  const profile = useMemo(() => buildProfile(state), [state])
  const band = bandForGrade(p.boardId, grade)
  const practisable = subjectsWithItems(band)
  const goals = state.goals.map((g) => CAREERS.find((c) => c.id === g)).filter(Boolean)
  const goalMust = new Set(goals.flatMap((c) => c!.subjects.must))
  const goalHelpful = new Set(goals.flatMap((c) => c!.subjects.helpful))
  const streamObj = getStream(effectiveStream)

  return (
    <>
      <h1>Curriculum</h1>
      <p className="muted">{board.name}. Pick a grade to see its subjects and what each one covers.</p>

      <div className="tabs" role="tablist" aria-label="Grade">
        {BOARD_GRADES[p.boardId].map((g) => (
          <button key={g} role="tab" aria-selected={g === grade} className={`btn sm ${g === grade ? 'active' : ''}`} onClick={() => setGrade(g)}>
            {g}
          </button>
        ))}
      </div>

      <div className="card soft section">
        <h2 style={{ marginBottom: 4 }}>
          {gradeLabel(p.boardId, grade)} <span className="badge primary">{board.stageLabels[stage]}</span>
        </h2>
        <p className="small muted" style={{ margin: 0 }}>
          {stageInfo.summary}
        </p>
      </div>

      {needsStream && (
        <div className="section">
          <h3>Group / stream</h3>
          <div className="choices cols-2">
            {streams.map((s) => (
              <button key={s.id} className={`choice ${effectiveStream === s.id ? 'selected' : ''}`} onClick={() => setStreamId(s.id)}>
                <strong>{s.name}</strong>
                <span className="small muted">{s.description}</span>
                <span className="chips" style={{ marginTop: 6 }}>
                  {s.leadsTo.map((c) => (
                    <span key={c} className="chip">
                      {CLUSTER_NAMES[c]}
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>
          {streamObj?.electives && (
            <p className="small muted" style={{ marginTop: 10 }}>
              Compulsory subjects plus {streamObj.electives.pick} elective{streamObj.electives.pick > 1 ? 's' : ''} from the list below.
            </p>
          )}
        </div>
      )}

      <div className="section">
        <div className="section-head">
          <h2>Subjects</h2>
          <span className="small muted">{subjects.length} subjects</span>
        </div>
        {goals.length > 0 && (
          <p className="small muted">
            Highlighted: <span className="chip must">must-have</span> and <span className="chip">helpful</span> for your goal{goals.length > 1 ? 's' : ''} ({goals.map((g) => g!.title).join(', ')}).
          </p>
        )}
        <div className="stack">
          {subjects.map((s) => {
            const units = unitsForGrade(s, grade)
            const strength = profile.subjects[s.id]
            const compulsory = needsStream ? isCompulsory(effectiveStream, s.id) : true
            return (
              <details key={s.id}>
                <summary>
                  <span className="row between" style={{ display: 'inline-flex', width: 'calc(100% - 20px)' }}>
                    <span>
                      {s.name}
                      {s.urduName && <span className="muted urdu" style={{ marginLeft: 8, display: 'inline-block' }}>{s.urduName}</span>}{' '}
                      {goalMust.has(s.id) && <span className="chip must">must-have</span>}
                      {!goalMust.has(s.id) && goalHelpful.has(s.id) && <span className="chip">helpful</span>}
                      {needsStream && !compulsory && <span className="badge">elective</span>}
                    </span>
                    {strength ? <LevelBadge level={strength.level} accuracy={strength.accuracy} /> : null}
                  </span>
                </summary>
                <p className="small muted" style={{ marginTop: 8 }}>
                  {s.description}
                </p>
                {units.map((u) => (
                  <div key={u.name}>
                    <h4 className="small" style={{ marginBottom: 4 }}>
                      {u.name}
                    </h4>
                    <ul className="small">
                      {u.topics.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {practisable.includes(s.id) && (
                  <Link to={`/practice/${s.id}`} className="btn sm primary">
                    Practise {s.name}
                  </Link>
                )}
              </details>
            )
          })}
        </div>
      </div>
    </>
  )
}
