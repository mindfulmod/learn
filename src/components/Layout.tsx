import { NavLink, Outlet, Link } from 'react-router-dom'
import { useStore } from '../store/store'

const NAV = [
  { to: '/', label: 'Home', icon: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z' },
  { to: '/curriculum', label: 'Curriculum', icon: 'M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z' },
  { to: '/careers', label: 'Careers', icon: 'M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18' },
  { to: '/practice', label: 'Practice', icon: 'M9 12l2 2 4-4M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7z' },
  { to: '/progress', label: 'Progress', icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
]

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export function Layout() {
  const { state } = useStore()
  const base = import.meta.env.BASE_URL
  const first = state.profile?.name.split(' ')[0] ?? ''
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          <img src={`${base}favicon.svg`} alt="" />
          Rahnuma
        </Link>
        <nav className="topnav" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <span className="spacer" />
        <Link to="/settings" className="avatar-chip" aria-label="Settings">
          <span className="avatar" aria-hidden="true">
            {first.slice(0, 1).toUpperCase()}
          </span>
          {first} · Grade {state.profile?.grade}
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
      <nav className="bottomnav" aria-label="Main">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'}>
            <Icon d={n.icon} />
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
