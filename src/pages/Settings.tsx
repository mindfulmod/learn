import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getBoard, gradeLabel } from '../data/boards'
import { careerTitle } from '../data/careers'
import { getStream } from '../data/streams'
import { sanitise, useStore } from '../store/store'

export function Settings() {
  const { state, importState, reset } = useStore()
  const nav = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)
  const p = state.profile!

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rahnuma-${p.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImport = async (file: File) => {
    try {
      const parsed = sanitise(JSON.parse(await file.text()))
      if (!parsed.profile) throw new Error('No profile in file')
      importState(parsed)
      setMessage(`Imported ${parsed.profile.name}'s progress (${parsed.attempts.length} rounds).`)
    } catch {
      setMessage('That file could not be read. Make sure it was exported from Rahnuma.')
    }
  }

  const doReset = () => {
    if (window.confirm('Delete all progress on this device? Export first if you want to keep it.')) {
      reset()
      nav('/onboarding', { replace: true })
    }
  }

  return (
    <>
      <h1>Settings</h1>
      <div className="card section">
        <h3>Profile</h3>
        <ul className="list small">
          <li>
            <b>Name:</b> {p.name}
          </li>
          <li>
            <b>Grade:</b> {gradeLabel(p.boardId, p.grade)}
          </li>
          <li>
            <b>Board:</b> {getBoard(p.boardId).name}
          </li>
          <li>
            <b>Group:</b> {getStream(p.streamId)?.name ?? 'Not chosen'}
          </li>
          <li>
            <b>Goals:</b> {state.goals.length ? state.goals.map(careerTitle).join(', ') : 'None'}
          </li>
        </ul>
        <Link to="/onboarding" className="btn">
          Edit profile
        </Link>
      </div>

      <div className="card section">
        <h3>Your data</h3>
        <p className="small muted">
          Everything lives in this browser only. Export a file to move to another device or to keep a backup, then import it there.
        </p>
        <div className="row">
          <button className="btn" onClick={exportJson}>
            Export progress
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            Import progress
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImport(f)
              e.target.value = ''
            }}
          />
        </div>
        {message && <p className="small" style={{ marginTop: 10 }}>{message}</p>}
      </div>

      <div className="card section">
        <h3>Start over</h3>
        <p className="small muted">Removes the profile, discovery answers and all practice history from this device.</p>
        <button className="btn danger" onClick={doReset}>
          Delete everything
        </button>
      </div>

      <div className="card soft">
        <h3>About Rahnuma</h3>
        <p className="small muted" style={{ margin: 0 }}>
          A learning guide for students in Pakistan covering the national boards, Cambridge and AKU-EB. Curriculum outlines and career paths are summaries for guidance; always confirm admission requirements with the institution. Version 0.1.
        </p>
      </div>
    </>
  )
}
