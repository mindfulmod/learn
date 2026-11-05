import { useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getCareer } from '../data/careers'
import { CareerPane } from '../components/CareerPane'
import { FuturePreview } from '../components/FuturePreview'
import { Screen } from '../components/Screen'
import '../styles/careers.css'

/** Deep link to one career. Same pane as Explore, inside the page frame. */
export function CareerDetail() {
  const { id } = useParams()
  const career = id ? getCareer(id) : undefined
  const [params, setParams] = useSearchParams()
  const [localPreview, setLocalPreview] = useState(false)
  const preview = localPreview || params.get('preview') === '1'
  const closePreview = () => {
    setLocalPreview(false)
    if (params.has('preview')) setParams({}, { replace: true })
  }
  if (!career) return <Navigate to="/careers" replace />

  return (
    <Screen
      header={
        <Link to={`/careers?path=${career.cluster}`} className="cr-back">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Explore
        </Link>
      }
    >
      <CareerPane key={career.id} careerId={career.id} asPage onPreview={() => setLocalPreview(true)} />
      {preview && <FuturePreview careerId={career.id} onClose={closePreview} />}
    </Screen>
  )
}
