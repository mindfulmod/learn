import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode, type TouchEvent } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Banknote,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  GraduationCap,
  Hourglass,
  Lightbulb,
  MapPin,
  Sparkles,
  Target,
  TrendingUp,
  X,
  type LucideIcon,
} from 'lucide-react'
import { AREA_META, CLUSTER_META, TRAIT_META, subjectIcon, tint } from '../design'
import { CLUSTER_NAMES, getCareer } from '../data/careers'
import { careerLife, formatPkr, type Demand } from '../data/careerLife'
import { TRAIT_NAMES } from '../data/discovery'
import { getSubject, subjectName } from '../data/subjects'
import { getStream } from '../data/streams'
import { buildJourney, type Milestone } from '../engine/journey'
import { careerFit, hasSignal } from '../engine/careers'
import { buildProfile, type MasteryLevel } from '../engine/profile'
import { useStore } from '../store/store'
import type { Profile, Trait } from '../types'
import '../styles/preview.css'

const STEPS = [
  { kicker: 'Step 1 · Meet the career', icon: Sparkles },
  { kicker: 'Step 2 · Your journey', icon: MapPin },
  { kicker: 'Step 3 · What it takes', icon: Target },
  { kicker: 'Step 4 · Life in the job', icon: Building2 },
  { kicker: 'Step 5 · Your first step', icon: Flag },
] as const

const KIND_HUE: Record<Milestone['kind'], number | null> = {
  now: null,
  school: 36,
  exam: 36,
  university: 215,
  training: 258,
  work: 160,
  future: 320,
}

const KIND_LABEL: Record<Milestone['kind'], string> = {
  now: 'You are here',
  school: 'School',
  exam: 'Exams',
  university: 'University',
  training: 'Training',
  work: 'Work',
  future: 'Future',
}

const DEMAND_CLASS: Record<Demand, string> = {
  'very high': 'good',
  high: 'good',
  growing: 'info',
  steady: 'primary',
  competitive: 'warn',
}

const LEVEL_TEXT: Record<MasteryLevel, { cls: string; text: string }> = {
  strong: { cls: 'good', text: 'Strong' },
  developing: { cls: 'warn', text: 'Developing' },
  'needs-work': { cls: 'bad', text: 'Needs work' },
  'not-practised': { cls: '', text: 'Not practised' },
}

/** Used when the student has not set up a profile yet, so the journey still renders. */
const FALLBACK_PROFILE: Profile = { name: '', grade: 8, boardId: 'national', createdAt: '' }

function Section({ icon: Icon, title, children, hue }: { icon: LucideIcon; title: string; children: ReactNode; hue?: number }) {
  return (
    <section className="fp-section" style={hue !== undefined ? tint(hue) : undefined}>
      <h3 className="fp-section-title">
        <span className="fp-section-icon" aria-hidden="true">
          <Icon size={16} strokeWidth={2.4} />
        </span>
        {title}
      </h3>
      {children}
    </section>
  )
}

function MiniBar({ value, hue }: { value: number; hue: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="bar tinted fp-minibar" style={tint(hue)} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${v}%` }} />
    </div>
  )
}

function inYears(n: number): string {
  if (n <= 0) return 'Today'
  return `In ${n} year${n === 1 ? '' : 's'}`
}

export function FuturePreview({ careerId, onClose }: { careerId: string; onClose: () => void }) {
  const { state, setGoals, markPreviewed } = useStore()
  const navigate = useNavigate()
  const career = getCareer(careerId)
  const life = careerLife(careerId)
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [justSet, setJustSet] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  const last = STEPS.length - 1
  // Mark as previewed once per career.
  const markRef = useRef(markPreviewed)
  useEffect(() => {
    markRef.current = markPreviewed
  }, [markPreviewed])
  useEffect(() => {
    markRef.current(careerId)
  }, [careerId])

  // Body scroll lock, initial focus, keyboard.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    const prevFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
      } else if (e.key === 'ArrowRight') {
        setStep((s) => Math.min(last, s + 1))
      } else if (e.key === 'ArrowLeft') {
        setStep((s) => Math.max(0, s - 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.()
    }
  }, [last])

  // Scroll back to the top on every step change.
  useEffect(() => {
    bodyRef.current?.scrollTo?.({ top: 0 })
    dialogRef.current?.scrollTo?.({ top: 0 })
  }, [step])

  const strength = useMemo(() => buildProfile(state), [state])
  const fit = useMemo(() => (career && hasSignal(state) ? careerFit(career, state, strength) : null), [career, state, strength])
  const profile = state.profile ?? FALLBACK_PROFILE
  const journey = useMemo(() => (career ? buildJourney(career, profile) : []), [career, profile])

  if (!career) {
    return createPortal(
      <div className="fp-backdrop" onClick={onClose}>
        <div className="fp-panel" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} ref={dialogRef} onClick={(e) => e.stopPropagation()}>
          <div className="fp-body">
            <h2 id={titleId}>Career not found</h2>
            <p className="muted">We could not find that career. Try another one.</p>
            <button className="btn primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>,
      document.body,
    )
  }

  const cluster = CLUSTER_META[career.cluster]
  const ClusterIcon = cluster.icon
  const shortTitle = career.title.split(' (')[0]
  const isGoal = state.goals.includes(careerId)
  const topTraits = (Object.entries(career.traits) as [Trait, number][]).sort((a, b) => b[1] - a[1]).slice(0, 3)
  const pathway = career.pathways[profile.boardId]
  const StepIcon = STEPS[step].icon

  const headerTitle = [
    career.title,
    'Your journey',
    'What it takes',
    'Life in the job',
    'Your first step',
  ][step]

  const headerLead = [
    career.summary,
    state.profile
      ? `From grade ${profile.grade} today to an established ${shortTitle.toLowerCase()}. Here is how old you would be at each step.`
      : `Imagining you are in grade ${profile.grade} today. Set up your profile for a timeline that fits you exactly.`,
    'The subjects, strengths and skills this career leans on.',
    'Where you would work, what it pays, and the honest truth.',
    'You do not have to decide your whole life today. Just try one small thing.',
  ][step]

  const setGoal = () => {
    setGoals([careerId, ...state.goals.filter((g) => g !== careerId)])
    setJustSet(true)
  }

  const goToPlan = () => {
    navigate('/')
    onClose()
  }

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      setStep((s) => (dx < 0 ? Math.min(last, s + 1) : Math.max(0, s - 1)))
    }
  }

  const studyYears = life ? life.yearsOfStudy + (life.training?.years ?? 0) : null

  // ---------- Step content ----------
  let content: ReactNode
  if (step === 0) {
    content = (
      <>
        {life && (
          <>
            <div className="fp-facts">
              <div className="fp-fact" style={tint(215)}>
                <span className="fp-fact-icon" aria-hidden="true">
                  <GraduationCap size={18} strokeWidth={2.3} />
                </span>
                <b>{studyYears} years</b>
                <span>
                  of study after grade 12
                  {life.training ? ` (${life.yearsOfStudy} degree + ${life.training.years} training)` : ''}
                </span>
              </div>
              <div className="fp-fact" style={tint(36)}>
                <span className="fp-fact-icon" aria-hidden="true">
                  <Clock size={18} strokeWidth={2.3} />
                </span>
                <b>Typical hours</b>
                <span>{life.hours}</span>
              </div>
              <div className="fp-fact" style={tint(160)}>
                <span className="fp-fact-icon" aria-hidden="true">
                  <TrendingUp size={18} strokeWidth={2.3} />
                </span>
                <b>
                  <span className={`badge ${DEMAND_CLASS[life.demand]}`}>Demand: {life.demand}</span>
                </b>
                <span>{life.demandNote}</span>
              </div>
            </div>
            <figure className="fp-story">
              <figcaption className="kicker">A day in your life</figcaption>
              <blockquote>{life.dayStory}</blockquote>
            </figure>
          </>
        )}
        {!life && (
          <figure className="fp-story">
            <figcaption className="kicker">A day in your life</figcaption>
            <blockquote>{career.dayInLife}</blockquote>
          </figure>
        )}
      </>
    )
  } else if (step === 1) {
    content = (
      <ol className="fp-journey">
        {journey.map((m, i) => {
          const hue = KIND_HUE[m.kind]
          const style: CSSProperties | undefined = hue !== null ? tint(hue) : undefined
          return (
            <li key={i} className={`fp-milestone kind-${m.kind} ${i === 0 ? 'here' : ''}`} style={{ ...style, animationDelay: `${i * 70}ms` }}>
              <div className="fp-age" aria-label={`Age ${m.age}`}>
                <small>age</small>
                <b>{m.age}</b>
              </div>
              <div className="fp-milestone-body">
                <div className="fp-milestone-meta">
                  {i === 0 ? (
                    <span className="badge primary">
                      <MapPin size={12} strokeWidth={2.6} aria-hidden="true" /> You are here
                    </span>
                  ) : (
                    <span className="fp-when">
                      <Hourglass size={12} strokeWidth={2.6} aria-hidden="true" /> {inYears(m.yearsFromNow)}
                    </span>
                  )}
                  {i !== 0 && <span className="badge tinted">{KIND_LABEL[m.kind]}</span>}
                </div>
                <h3>{m.title}</h3>
                <p>{m.detail}</p>
              </div>
            </li>
          )
        })}
      </ol>
    )
  } else if (step === 2) {
    content = (
      <>
        {fit && (
          <div className="fp-fit">
            <div className="score-ring pop" style={{ ['--pct' as string]: fit.score }} aria-label={`Fit ${fit.score} percent`}>
              <span>{fit.score}%</span>
            </div>
            <div>
              <b>Your fit with this career</b>
              <p className="small muted">Based on what you've told us so far.</p>
            </div>
          </div>
        )}

        <Section icon={GraduationCap} title="Must-have subjects" hue={258}>
          <div className="fp-subjects">
            {career.subjects.must.map((id) => {
              const sub = getSubject(id)
              const Icon = subjectIcon(id, sub?.area)
              const hue = sub ? AREA_META[sub.area].hue : 258
              const st = strength.subjects[id]
              const practised = st && st.items > 0
              const lvl = practised ? LEVEL_TEXT[st.level] : null
              return (
                <div key={id} className="fp-subject" style={tint(hue)}>
                  <span className="tile-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={2.2} />
                  </span>
                  <div className="fp-subject-body">
                    <b>{subjectName(id)}</b>
                    {practised && lvl ? (
                      <>
                        <span className={`badge ${lvl.cls}`}>
                          {lvl.text} · {st.accuracy}%
                        </span>
                        <MiniBar value={st.accuracy} hue={hue} />
                      </>
                    ) : (
                      <span className="small muted">Not practised yet</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {career.subjects.helpful.length > 0 && (
            <div className="fp-helpful">
              <span className="small muted">Also helpful:</span>
              <div className="chips">
                {career.subjects.helpful.map((id) => (
                  <span key={id} className="chip">
                    {subjectName(id)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Section>

        <Section icon={Sparkles} title="Strengths this career leans on" hue={320}>
          <div className="fp-traits">
            {topTraits.map(([t, w]) => {
              const meta = TRAIT_META[t]
              const Icon = meta.icon
              const mine = state.discovery?.traits[t]
              return (
                <div key={t} className="fp-trait" style={tint(meta.hue)}>
                  <span className="tile-icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={2.2} />
                  </span>
                  <div className="fp-trait-body">
                    <div className="fp-trait-row">
                      <b>{TRAIT_NAMES[t]}</b>
                      <span className="small muted">Needs {Math.round(w * 100)}%</span>
                    </div>
                    <MiniBar value={w * 100} hue={meta.hue} />
                    {mine !== undefined && (
                      <>
                        <div className="fp-trait-row">
                          <span className="small">You</span>
                          <span className="small muted">{Math.round(mine)}%</span>
                        </div>
                        <div className="bar fp-minibar fp-you" role="progressbar" aria-valuenow={Math.round(mine)} aria-valuemin={0} aria-valuemax={100} aria-label={`Your ${TRAIT_NAMES[t]} score`}>
                          <span style={{ width: `${Math.max(0, Math.min(100, mine))}%` }} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {!state.discovery && <p className="small muted fp-note">Take the discovery quiz to see how your own strengths compare.</p>}
        </Section>

        {life && (
          <Section icon={Check} title="Skills you'll use every day" hue={160}>
            <ul className="fp-checks">
              {life.skills.map((s) => (
                <li key={s}>
                  <span className="fp-check" aria-hidden="true">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </>
    )
  } else if (step === 3) {
    content = (
      <>
        {life && (
          <>
            <Section icon={Building2} title="Where you'd work" hue={215}>
              <div className="chips">
                {life.workplaces.map((w) => (
                  <span key={w} className="chip tinted">
                    {w}
                  </span>
                ))}
              </div>
            </Section>

            <Section icon={Banknote} title="What it pays" hue={160}>
              <div className="fp-pay">
                <div className="fp-pay-tile" style={tint(160)}>
                  <span className="kicker">Starting out</span>
                  <b>
                    Rs {formatPkr(life.pay.entry[0])} – {formatPkr(life.pay.entry[1])}
                  </b>
                  <span className="small muted">/ month</span>
                </div>
                <div className="fp-pay-tile" style={tint(258)}>
                  <span className="kicker">10 years in</span>
                  <b>
                    Rs {formatPkr(life.pay.experienced[0])} – {formatPkr(life.pay.experienced[1])}
                  </b>
                  <span className="small muted">/ month</span>
                </div>
              </div>
              <p className="small muted fp-note">Approximate, varies a lot by city and employer.</p>
            </Section>

            <Section icon={AlertTriangle} title="The honest hard parts" hue={20}>
              <ul className="fp-hard">
                {life.hardParts.map((h) => (
                  <li key={h}>
                    <AlertTriangle size={15} strokeWidth={2.4} aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
              <p className="small muted fp-note">Every career has hard days. Knowing them now helps you choose with open eyes.</p>
            </Section>
          </>
        )}

        {career.entranceTests.length > 0 && (
          <Section icon={Target} title="Tests on the way" hue={36}>
            <div className="chips">
              {career.entranceTests.map((t) => (
                <span key={t} className="chip tinted">
                  {t}
                </span>
              ))}
            </div>
          </Section>
        )}

        {career.institutions.length > 0 && (
          <p className="small muted fp-institutions">
            <MapPin size={14} strokeWidth={2.4} aria-hidden="true" /> <b>Where people study this:</b> {career.institutions.join(', ')}
          </p>
        )}
      </>
    )
  } else {
    const sec = getStream(pathway?.secondary)?.name ?? pathway?.secondary
    const high = getStream(pathway?.higherSecondary)?.name ?? pathway?.higherSecondary
    content = (
      <>
        {life && life.tryIt.length > 0 && (
          <Section icon={Lightbulb} title="Try it this month" hue={45}>
            <ul className="fp-try">
              {life.tryIt.slice(0, 3).map((t, i) => (
                <li key={t} style={{ animationDelay: `${i * 80}ms` }}>
                  <span className="fp-try-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {pathway && (
          <Section icon={MapPin} title="Your path through school" hue={215}>
            <div className="fp-path">
              <div className="fp-path-step">
                <span className="kicker">Grades 9–10</span>
                <b>{sec}</b>
              </div>
              <ChevronRight className="fp-path-arrow" size={20} aria-hidden="true" />
              <div className="fp-path-step">
                <span className="kicker">Grades 11–12</span>
                <b>{high}</b>
              </div>
            </div>
            {pathway.note && <p className="small muted fp-note">{pathway.note}</p>}
          </Section>
        )}

        <div className="fp-cta" style={tint(cluster.hue)}>
          {justSet ? (
            <div className="fp-success pop" role="status">
              <span className="fp-success-icon" aria-hidden="true">
                <Check size={26} strokeWidth={3} />
              </span>
              <div>
                <b>Goal set.</b> Your home page now shows your roadmap.
              </div>
              <button className="btn primary" onClick={goToPlan}>
                Go to my plan <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <>
              <h3>Could this be you?</h3>
              <p className="small muted">You can change your goal any time. Setting one just gives you a roadmap to follow.</p>
              <div className="row">
                {isGoal ? (
                  <span className="badge good fp-goal-badge">
                    <Flag size={14} strokeWidth={2.6} aria-hidden="true" /> This is your goal
                  </span>
                ) : (
                  <button className="btn primary" onClick={setGoal}>
                    <Flag size={18} aria-hidden="true" /> Set as my goal
                  </button>
                )}
                <button className="btn" onClick={onClose}>
                  Explore another career
                </button>
              </div>
            </>
          )}
        </div>
      </>
    )
  }

  return createPortal(
    <div className="fp-backdrop" onClick={onClose}>
      <div
        className="fp-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
        style={tint(cluster.hue)}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <header className="fp-header">
          <div className="fp-glow one" aria-hidden="true" />
          <div className="fp-glow two" aria-hidden="true" />
          <div className="fp-progress" aria-hidden="true">
            {STEPS.map((_, i) => (
              <span key={i} className={i <= step ? 'done' : ''} />
            ))}
          </div>
          <button className="fp-close" onClick={onClose} aria-label="Close preview">
            <X size={20} strokeWidth={2.6} />
          </button>
          <div className="fp-header-main" key={step}>
            <div className="fp-hero-tile" aria-hidden="true">
              {step === 0 ? <ClusterIcon size={40} strokeWidth={2} /> : <StepIcon size={36} strokeWidth={2.1} />}
            </div>
            <div className="fp-header-text">
              <span className="fp-kicker">{step === 0 ? `Step 1 · Meet the ${shortTitle.toLowerCase()}` : STEPS[step].kicker}</span>
              {step === 0 && <span className="fp-cluster-badge">{CLUSTER_NAMES[career.cluster]}</span>}
              <h2 id={titleId}>{headerTitle}</h2>
              <p>{headerLead}</p>
            </div>
          </div>
        </header>

        <div className="fp-body" ref={bodyRef}>
          <div className="fp-step" key={step}>
            {content}
          </div>
        </div>

        <footer className="fp-footer">
          <button className="btn" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} aria-label="Previous step">
            <ChevronLeft size={18} aria-hidden="true" /> <span className="fp-btn-text">Back</span>
          </button>
          <div className="fp-dots" role="tablist" aria-label="Steps">
            {STEPS.map((s, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === step}
                aria-label={s.kicker}
                className={`fp-dot ${i === step ? 'active' : ''} ${i < step ? 'seen' : ''}`}
                onClick={() => setStep(i)}
              />
            ))}
          </div>
          {step < last ? (
            <button className="btn primary" onClick={() => setStep((s) => Math.min(last, s + 1))} aria-label="Next step">
              <span className="fp-btn-text">Next</span> <ChevronRight size={18} aria-hidden="true" />
            </button>
          ) : (
            <button className="btn" onClick={onClose} aria-label="Finish and close">
              <span className="fp-btn-text">Done</span> <Check size={18} aria-hidden="true" />
            </button>
          )}
        </footer>
      </div>
    </div>,
    document.body,
  )
}
