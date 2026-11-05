import { Link } from 'react-router-dom'
import { Empty } from '../components/ui'

/**
 * Rahnuma Town: the home and explore screen for grades 1 to 5.
 * Placeholder until the Town build lands; see docs/DESIGN.md, iteration 5.
 */
export function TownPage() {
  return (
    <div className="finder pf">
      <Empty title="Rahnuma Town" body="Your town is being built." action={{ to: '/practice', label: 'Practise instead' }} />
      <Link to="/finder" className="btn primary">
        Play the finder
      </Link>
    </div>
  )
}
