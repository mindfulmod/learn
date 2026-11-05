import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Compass, Dumbbell, Eye, Flag, Flame, Lightbulb, Medal, Puzzle, Target, Zap, type LucideIcon } from 'lucide-react'
import { AREA_NAMES } from '../data/discovery'
import { subjectName } from '../data/subjects'
import { AREAS } from '../engine/discovery'
import { buildFeedback } from '../engine/feedback'
import { modeFor } from '../engine/mode'
import { buildProfile, streak, type MasteryLevel } from '../engine/profile'
import { badges, LEVELS, levelFor, totalXp, weeklyMissions } from '../engine/xp'
import { useStore } from '../store/store'
import { Empty, FeedbackCard, IconTile, LevelBadge, Meter } from '../components/ui'
import { PageHeader } from '../components/PageHeader'
import { Ring } from '../components/Ring'
import { AREA_META, subjectIcon, tint } from '../design'
import '../styles/practice.css'

const BADGE_META: Record<string, { icon: LucideIcon; hue: number }> = {
  'first-round': { icon: Target, hue: 258 },
  'first-preview': { icon: Eye, hue: 205 },
  goal: { icon: Flag, hue: 340 },
  finder: { icon: Compass, hue: 180 },
  discovery: { icon: Lightbulb, hue: 45 },
  'streak-7': { icon: Flame, hue: 20 },
  strong: { icon: Medal, hue: 160 },
  'ten-rounds': { icon: Dumbbell, hue: 300 },
}

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const JUNIOR_LEVEL: Record<MasteryLevel, string> = { strong: 'Strong', developing: 'Developing', 'needs-work': 'Keep going', 'not-practised': 'Keep going' }

export function Progress() {
  const { state } = useStore()
  return modeFor(state.profile) === 'junior' ? <JuniorProgress /> : <SeniorProgress />
}

function JuniorProgress() {
  const { state } = useStore()
  const profile = useMemo(() => buildProfile(state), [state])
  const badgeList = useMemo(() => [...badges(state)].sort((a, b) => Number(b.earned) - Number(a.earned)), [state])
  const [week] = useState(() => {
    const ms = Date.now()
    return Array.from({ length: 7 }, (_, i) => {
      const key = new Date(ms - (6 - i) * 86400000).toISOString().slice(0, 10)
      return { key, letter: DAY_LETTERS[new Date(key + 'T00:00:00Z').getUTCDay()] }
    })
  })
  const active = new Set(state.activeDays)
  const st = streak(state.activeDays)
  const subjects = Object.values(profile.subjects).sort((a, b) => b.accuracy - a.accuracy)

  return (
    <>
      <PageHeader themed hue={140} variant={2} kicker="Progress" title="You're growing" lead="Every day you practise counts." />

      <section className="card pastel section" aria-label="Streak">
        <div className="streak-days" aria-label="Last seven days">
          {week.map((d, i) => (
            <span key={d.key} className={`${active.has(d.key) ? 'on' : ''} ${i === 6 ? 'today' : ''}`}>
              {d.letter}
            </span>
          ))}
        </div>
        <h2 style={{ margin: '14px 0 0' }}>
          <Flame size={22} className="inline-icon" aria-hidden="true" /> {st.current} day{st.current === 1 ? '' : 's'} in a row
        </h2>
      </section>

      <section className="card section">
        <h3>Badges</h3>
        <div className="badge-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}>
          {badgeList.map((b) => {
            const meta = BADGE_META[b.id] ?? { icon: Medal, hue: 258 }
            return (
              <div key={b.id} className={`badge-tile ${b.earned ? '' : 'locked'}`} aria-label={`${b.name}${b.earned ? '' : ' (not yet earned)'}`}>
                <IconTile hue={meta.hue} icon={meta.icon} />
                <b>{b.name}</b>
              </div>
            )
          })}
        </div>
      </section>

      {!subjects.length ? (
        <div className="progress-section">
          <Empty icon={Puzzle} title="No practice yet" body="Play one round to see your subjects." action={{ to: '/practice', label: 'Start practising' }} />
        </div>
      ) : (
        <section className="card section">
          <h3>Subjects</h3>
          <div className="stack">
            {subjects.map((s) => {
              const SubjIcon = subjectIcon(s.subjectId, s.area)
              return (
                <Meter
                  key={s.subjectId}
                  label={
                    <span className="row" style={{ gap: 8 }}>
                      <SubjIcon size={16} aria-hidden="true" />
                      <Link to={`/practice/${s.subjectId}`}>{subjectName(s.subjectId)}</Link>
                    </span>
                  }
                  value={s.accuracy}
                  right={JUNIOR_LEVEL[s.level]}
                />
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}

function SeniorProgress() {
  const { state } = useStore()
  const profile = useMemo(() => buildProfile(state), [state])
  const feedback = useMemo(() => buildFeedback(state, profile), [state, profile])
  const xp = useMemo(() => totalXp(state), [state])
  const missions = useMemo(() => weeklyMissions(state), [state])
  const badgeList = useMemo(() => badges(state), [state])
  const level = levelFor(xp)
  const nextName = level.next !== null ? levelFor(level.next).name : null
  const st = streak(state.activeDays)
  const subjects = Object.values(profile.subjects).sort((a, b) => b.accuracy - a.accuracy)
  const recent = [...state.attempts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12)
  const accuracy = profile.totalItems ? Math.round((state.attempts.reduce((s, a) => s + a.correct, 0) / profile.totalItems) * 100) : 0

  return (
    <>
      <PageHeader
        themed
        hue={140}
        variant={2}
        kicker="Progress"
        title={`${level.name}, level ${level.index + 1}`}
        lead={level.next !== null ? `${xp} XP · ${level.next - xp} to ${nextName}` : `${xp} XP · Top level reached`}
      />

      <div className="bento">
        <div className="card pastel tile span-2 level-tile">
          <Ring value={level.progress} size={96} stroke={9}>
            <Zap size={32} aria-hidden="true" />
          </Ring>
          <div className="level-tile-body" style={{ minWidth: 0, maxWidth: '100%' }}>
            <span className="tile-label">Level</span>
            <h3>{level.name}</h3>
            <ol className="level-ladder" aria-label="Levels">
              {LEVELS.map((l, i) => (
                <li key={l.name} className={i === level.index ? 'current' : i < level.index ? 'reached' : ''} aria-current={i === level.index ? 'step' : undefined}>
                  <b>{l.name}</b>
                  <span>{l.min} XP</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="card tile stat-tile" style={tint(24)}>
          <div className="tile-head">
            <span className="tile-label">Streak</span>
            <Flame size={20} aria-hidden="true" />
          </div>
          <span className="big">
            {st.current}
            <small>day{st.current === 1 ? '' : 's'}</small>
          </span>
          <p className="stat-sub">Best: {st.best} day{st.best === 1 ? '' : 's'}</p>
        </div>
        <div className="card tile stat-tile" style={tint(160)}>
          <div className="tile-head">
            <span className="tile-label">Accuracy</span>
            <Target size={20} aria-hidden="true" />
          </div>
          <span className="big">{accuracy}%</span>
          <p className="stat-sub">
            {state.attempts.length} round{state.attempts.length === 1 ? '' : 's'} · {profile.totalItems} questions
          </p>
        </div>
      </div>

      <div className="grid cols-2 progress-section">
        <div className="card">
          <div className="card-head">
            <h3>This week</h3>
            <span className="small muted">
              {missions.filter((m) => m.done).length} of {missions.length} done
            </span>
          </div>
          <ul className="missions roomy">
            {missions.map((m) => (
              <li key={m.id} className={m.done ? 'done' : ''}>
                <Link to={m.to}>
                  <span className={`mission-check ${m.done ? 'done' : ''}`} aria-hidden="true">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="mission-text">
                    <b>{m.title}</b>
                    <span>{m.detail}</span>
                  </span>
                </Link>
                <span className="badge primary">+{m.xp} XP</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="card-head">
            <h3>Badges</h3>
            <span className="small muted">
              {badgeList.filter((b) => b.earned).length} of {badgeList.length} earned
            </span>
          </div>
          <div className="badge-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}>
            {badgeList.map((b) => {
              const meta = BADGE_META[b.id] ?? { icon: Medal, hue: 258 }
              return (
                <div key={b.id} className={`badge-tile ${b.earned ? '' : 'locked'}`} aria-label={`${b.name}: ${b.detail}${b.earned ? '' : ' (not yet earned)'}`}>
                  <IconTile hue={meta.hue} icon={meta.icon} />
                  <b>{b.name}</b>
                  <span>{b.detail}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {!subjects.length ? (
        <div className="progress-section">
          <Empty icon={Puzzle} title="No practice yet" body="Each round is eight questions." action={{ to: '/practice', label: 'Start practising' }} />
        </div>
      ) : (
        <div className="grid cols-2 progress-section">
          <div className="card">
            <h3>Subjects</h3>
            <div className="stack">
              {subjects.map((s) => {
                const SubjIcon = subjectIcon(s.subjectId, s.area)
                return (
                  <div key={s.subjectId}>
                    <Meter
                      label={
                        <span className="row" style={{ gap: 8 }}>
                          <SubjIcon size={16} aria-hidden="true" />
                          <Link to={`/practice/${s.subjectId}`}>{subjectName(s.subjectId)}</Link>
                          {s.trend === 'up' && <span className="badge good">↑</span>}
                          {s.trend === 'down' && <span className="badge warn">↓</span>}
                        </span>
                      }
                      value={s.accuracy}
                      right={<LevelBadge level={s.level} accuracy={s.accuracy} />}
                    />
                    <p className="small muted" style={{ margin: '4px 0 0' }}>
                      {s.items} questions
                      {s.weakTopics.length ? ` · revise: ${s.weakTopics.slice(0, 2).join(', ')}` : ''}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="card">
            <h3>Learning areas</h3>
            <p className="small muted">Grows as you practise.</p>
            <div className="stack">
              {[...AREAS]
                .sort((a, b) => profile.areas[b] - profile.areas[a])
                .map((a) => {
                  const AreaIcon = AREA_META[a].icon
                  return (
                    <Meter
                      key={a}
                      label={
                        <>
                          <AreaIcon size={16} className="inline-icon" aria-hidden="true" />
                          {AREA_NAMES[a]}
                        </>
                      }
                      value={profile.areas[a]}
                      tone="tinted"
                      hue={AREA_META[a].hue}
                      right={`${profile.areas[a]}%`}
                    />
                  )
                })}
            </div>
          </div>
        </div>
      )}

      <section className="section">
        <div className="section-head">
          <h2>Your coach says</h2>
        </div>
        <div className="stack">
          {feedback.slice(0, 4).map((f, i) => (
            <FeedbackCard key={i} item={f} />
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="section">
          <h2>Recent rounds</h2>
          <div className="card soft">
            <ul className="list small recent-list">
              {recent.map((a) => (
                <li key={a.id} className="row between">
                  <span>
                    {subjectName(a.subjectId)} <span className="muted">· grades {a.band}</span>
                  </span>
                  <span>
                    <b>
                      {a.correct}/{a.total}
                    </b>{' '}
                    <span className="muted">{new Date(a.date).toLocaleDateString()}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
