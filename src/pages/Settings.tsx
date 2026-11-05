import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Check, ChevronRight } from 'lucide-react'
import { getBoard, gradeLabel } from '../data/boards'
import { careerTitle } from '../data/careers'
import { getStream } from '../data/streams'
import { modeFor } from '../engine/mode'
import { sanitise, useStore } from '../store/store'
import { PageHeader } from '../components/PageHeader'
import { IconTile } from '../components/ui'
import { tint } from '../design'

export function Settings() {
  const { state, importState, reset, setProfile } = useStore()
  const nav = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)
  const p = state.profile!
  const current = modeFor(p)
  const modes: { id: 'junior' | 'senior' | undefined; title: string; body: string }[] = [
    { id: undefined, title: 'Automatic (by grade)', body: `Grade ${p.grade} uses ${p.grade <= 8 ? 'Junior' : 'Senior'}.` },
    { id: 'junior', title: 'Junior', body: 'Simpler, bigger, fewer words (grades 1-8).' },
    { id: 'senior', title: 'Senior', body: 'Full detail (grades 9-12).' },
  ]

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
      setMessage(`Imported ${parsed.profile.name}'s progress.`)
    } catch {
      setMessage('Could not read that file. Use a Rahnuma export.')
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
      <PageHeader themed hue={258} variant={0} kicker="You" title="Settings" lead="Your profile, your look and your data." />

      <section className="card pastel section" aria-labelledby="interface-title">
        <div className="row between" style={{ marginBottom: 12 }}>
          <h3 id="interface-title" style={{ margin: 0 }}>
            Interface
          </h3>
          <span className="badge tinted" style={{ background: 'var(--surface)' }}>
            Now: {current === 'junior' ? 'Junior' : 'Senior'}
          </span>
        </div>
        <div className="choices">
          {modes.map((m) => {
            const on = p.mode === m.id
            return (
              <button key={m.title} className={`choice ${on ? 'selected' : ''}`} aria-pressed={on} onClick={() => setProfile({ ...p, mode: m.id })}>
                <strong className="row" style={{ gap: 8, justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                  {m.title}
                  {on && <Check size={18} aria-hidden="true" />}
                </strong>
                <span className="small muted">{m.body}</span>
              </button>
            )
          })}
        </div>
      </section>

      <Link to="/curriculum" className="card lift section" style={{ display: 'flex', alignItems: 'center', gap: 14, ...tint(215) }}>
        <IconTile hue={215} icon={BookOpen} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <b>Curriculum</b>
          <span className="small" style={{ display: 'block', color: 'var(--text-2)' }}>
            Every subject, grade by grade.
          </span>
        </span>
        <ChevronRight size={20} aria-hidden="true" style={{ color: 'var(--muted)', flexShrink: 0 }} />
      </Link>
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
        <p className="small muted">Saved in this browser only. Export to back up or move.</p>
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
        <p className="small muted">Removes your profile and all progress from this device.</p>
        <button className="btn danger" onClick={doReset}>
          Delete everything
        </button>
      </div>

      <div className="card soft">
        <h3>About Rahnuma</h3>
        <p className="small muted" style={{ margin: 0 }}>
          A learning and career guide for Pakistani students. Confirm admission rules with each institution. Version 0.1.
        </p>
      </div>
    </>
  )
}
