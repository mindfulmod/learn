import { useMemo } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Compass, Flame, Home, Map as MapIcon, Settings, Sparkles, Target, TrendingUp, Zap } from 'lucide-react'
import { modeFor } from '../engine/mode'
import { levelFor, totalXp } from '../engine/xp'
import { streak } from '../engine/profile'
import { useStore } from '../store/store'
import { Ring } from './Ring'

const NAV = [
  { to: '/', label: 'Today', icon: Home, end: true },
  { to: '/path', label: 'My Path', icon: MapIcon },
  { to: '/careers', label: 'Explore', icon: Compass },
  { to: '/practice', label: 'Practice', icon: Target },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
]

export function Layout() {
  const { state } = useStore()
  const loc = useLocation()
  const base = import.meta.env.BASE_URL
  const first = state.profile?.name.split(' ')[0] ?? ''
  const xp = useMemo(() => totalXp(state), [state])
  const level = levelFor(xp)
  const st = streak(state.activeDays)
  const focus = /^\/practice\/[^/]+/.test(loc.pathname) || (loc.pathname === '/finder' && state.finder === null)
  const mode = modeFor(state.profile)
  const section = loc.pathname === '/' ? 'today' : loc.pathname.startsWith('/path') || loc.pathname.startsWith('/curriculum') ? 'path' : loc.pathname.startsWith('/careers') || loc.pathname.startsWith('/finder') || loc.pathname.startsWith('/discover') ? 'explore' : loc.pathname.startsWith('/practice') ? 'practice' : loc.pathname.startsWith('/progress') ? 'progress' : 'today'

  return (
    <div className={`shell ${focus ? 'focus' : ''} ${mode} section-${section}`}>
      <aside className="sidebar" aria-label="Main navigation">
        <Link to="/" className="brand">
          <img src={`${base}favicon.svg`} alt="" />
          <span>Rahnuma</span>
        </Link>
        <nav className="sidenav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              <n.icon size={20} strokeWidth={2.2} aria-hidden="true" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/progress" className="level-card">
          <Ring value={level.progress} size={52} stroke={6}>
            <Zap size={18} />
          </Ring>
          <span>
            <b>{level.name}</b>
            <span className="small">
              {level.next ? `${level.next - xp} XP to ${levelFor(level.next).name}` : 'Top level'}
            </span>
          </span>
        </Link>
        <NavLink to="/settings" className="sidenav-settings">
          <Settings size={18} aria-hidden="true" /> Settings
        </NavLink>
      </aside>

      <div className="content">
        <header className="statusbar">
          <Link to="/" className="brand compact">
            <img src={`${base}favicon.svg`} alt="Rahnuma" />
          </Link>
          <span className="spacer" />
          <span className={`stat-chip ${st.current > 0 ? 'hot' : ''}`} title="Day streak">
            <Flame size={16} aria-hidden="true" />
            {st.current}
          </span>
          <span className="stat-chip xp" title="Experience points">
            <Sparkles size={16} aria-hidden="true" />
            {xp} XP
          </span>
          <Link to="/settings" className="avatar-chip" aria-label="Settings">
            <span className="avatar" aria-hidden="true">
              {first.slice(0, 1).toUpperCase()}
            </span>
            <span className="avatar-name">{first}</span>
          </Link>
        </header>
        <main>
          <Outlet />
        </main>
      </div>

      <nav className="tabbar" aria-label="Main">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}>
            <n.icon size={22} strokeWidth={2.2} aria-hidden="true" />
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
