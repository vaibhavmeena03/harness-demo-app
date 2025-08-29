/**
 * Unit tests for ProtectedRoute component
 * Tests route protection and authentication redirection
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import ProtectedRoute from '../ProtectedRoute'
import { AuthProvider, useAuth } from '../../../contexts/AuthContext'

// Mock the useAuth hook
const mockUseAuth = vi.fn()
vi.mock('../../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../../contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => mockUseAuth(),
  }
})

// Test component to render inside ProtectedRoute
const TestComponent = () => <div>Protected Content</div>

const renderProtectedRoute = (isAuthenticated: boolean) => {
  mockUseAuth.mockReturnValue({ isAuthenticated })
  
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Authentication State', () => {
    test('renders protected content when user is authenticated', () => {
      renderProtectedRoute(true)
      
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
    })

    test('redirects to login when user is not authenticated', () => {
      renderProtectedRoute(false)
      
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    test('handles authentication errors gracefully', () => {
      // Mock console.error to avoid noise in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock useAuth to throw an error
      mockUseAuth.mockImplementation(() => {
        throw new Error('Authentication error')
      })
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          </AuthProvider>
        </BrowserRouter>
      )
      
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })

    test('handles undefined authentication state', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: undefined })
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          </AuthProvider>
        </BrowserRouter>
      )
      
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })
  })

  describe('Component Behavior', () => {
    test('renders children when authenticated', () => {
      renderProtectedRoute(true)
      
      const protectedContent = screen.getByText('Protected Content')
      expect(protectedContent).toBeInTheDocument()
      expect(protectedContent.parentElement).toBeInTheDocument()
    })

    test('does not render children when not authenticated', () => {
      renderProtectedRoute(false)
      
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })
  })

  describe('Route Protection', () => {
    test('protects multiple routes correctly', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: false })
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<div>Login Page</div>} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div>Dashboard Content</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <div>Settings Content</div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      )
      
      expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument()
      expect(screen.queryByText('Settings Content')).not.toBeInTheDocument()
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  describe('Authentication Context Integration', () => {
    test('uses authentication context correctly', () => {
      const mockAuthContext = { isAuthenticated: true }
      mockUseAuth.mockReturnValue(mockAuthContext)
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          </AuthProvider>
        </BrowserRouter>
      )
      
      expect(mockUseAuth).toHaveBeenCalled()
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })
})
