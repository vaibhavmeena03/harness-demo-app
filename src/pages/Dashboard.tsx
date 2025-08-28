import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeatureFlag } from '../utils/featureFlags'

type Props = {
  user: string
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: Props) {
  const navigate = useNavigate()
  const isAdminUI = getFeatureFlag('adminUI')

  const handleLogout = () => {
    sessionStorage.removeItem('auth-user')
    onLogout()
    navigate('/login')
  }

  return (
    <div className="dashboard-container">
      <header>
        <h2>Dashboard</h2>
        <div>
          <span className="user-chip">{user}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main>
        <p>This is a basic dashboard. Feature-flag driven UI: {isAdminUI ? 'Admin view' : 'Standard view'}</p>
        {isAdminUI && (
          <section className="admin-section">
            <h3>Admin Controls</h3>
            <p>Example admin-only controls and metrics would appear here.</p>
          </section>
        )}
      </main>
    </div>
  )
}
