import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  onLogin: (username: string) => void
  featureAdmin: boolean
}

export default function Login({ onLogin, featureAdmin }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Fake auth: accept any username/password
    sessionStorage.setItem('auth-user', username)
    onLogin(username)
    navigate('/dashboard')
  }

  const exampleHint = featureAdmin
    ? { user: 'admin', pass: 'password123' }
    : { user: 'user@example.com', pass: 'demo' }

  return (
    <div className="login-container">
      <h1>{featureAdmin ? 'Admin Portal' : 'Welcome'}</h1>
      {featureAdmin ? (
        <p className="admin-banner">Admin experience enabled — additional controls will appear after login.</p>
      ) : (
        <p>Sign in to access your dashboard.</p>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <label className="input-row">
          <span>Username</span>
          <input
            placeholder={exampleHint.user}
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            aria-label="username"
          />
          <small className="hint">Try: <strong>{exampleHint.user}</strong></small>
        </label>

        <label className="input-row">
          <span>Password</span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={exampleHint.pass}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            aria-label="password"
          />
          <div className="row-controls">
            <label className="show-password">
              <input type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} /> Show
            </label>
            <small className="hint">Hint: <strong>{exampleHint.pass}</strong></small>
          </div>
        </label>

        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <button type="submit">Sign in</button>
        </div>
      </form>
    </div>
  )
}
