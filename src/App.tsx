import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { getFeatureFlag } from './utils/featureFlags'

export default function App() {
  const [user, setUser] = useState<string | null>(null)

  const login = (username: string) => setUser(username)
  const logout = () => setUser(null)

  const isAdminUI = getFeatureFlag('adminUI')

  return (
    <div className={isAdminUI ? 'admin-theme' : 'user-theme'}>
      <Routes>
        <Route path="/login" element={<Login onLogin={login} featureAdmin={isAdminUI} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={logout} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  )
}
