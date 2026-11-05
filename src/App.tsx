import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CareerDetail } from './pages/CareerDetail'
import { Careers } from './pages/Careers'
import { Curriculum } from './pages/Curriculum'
import { Dashboard } from './pages/Dashboard'
import { Discover } from './pages/Discover'
import { Finder } from './pages/Finder'
import { Onboarding } from './pages/Onboarding'
import { Practice } from './pages/Practice'
import { Progress } from './pages/Progress'
import { Settings } from './pages/Settings'
import { useStore } from './store/store'

function RequireProfile({ children }: { children: React.ReactNode }) {
  const { state } = useStore()
  const loc = useLocation()
  if (!state.profile) return <Navigate to="/onboarding" replace state={{ from: loc.pathname }} />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        element={
          <RequireProfile>
            <Layout />
          </RequireProfile>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="curriculum" element={<Curriculum />} />
        <Route path="careers" element={<Careers />} />
        <Route path="careers/:id" element={<CareerDetail />} />
        <Route path="discover" element={<Discover />} />
        <Route path="finder" element={<Finder />} />
        <Route path="practice" element={<Practice />} />
        <Route path="practice/:subjectId" element={<Practice />} />
        <Route path="progress" element={<Progress />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
