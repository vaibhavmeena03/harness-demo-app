/**
 * ProtectedRoute component for securing routes that require authentication
 * Redirects unauthenticated users to the login page
 */
import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  try {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }

    return <>{children}</>
  } catch (error) {
    console.error('ProtectedRoute error:', error)
    return <Navigate to="/login" replace />
  }
}

export default ProtectedRoute
