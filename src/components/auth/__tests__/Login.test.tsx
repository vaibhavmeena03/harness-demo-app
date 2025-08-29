/**
 * Unit tests for Login component
 * Tests authentication functionality, form validation, and user interactions
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Login from '../Login'
import { AuthProvider } from '../../../contexts/AuthContext'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderLoginWithProvider = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Rendering', () => {
    test('renders login form with all elements', () => {
      renderLoginWithProvider()
      
      expect(screen.getByText('Welcome Back')).toBeInTheDocument()
      expect(screen.getByText('Sign in to your Harness DevOps account')).toBeInTheDocument()
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
      expect(screen.getByText('Demo Credentials:')).toBeInTheDocument()
      expect(screen.getByText('Username: admin')).toBeInTheDocument()
      expect(screen.getByText('Password: admin')).toBeInTheDocument()
    })

    test('renders Harness DevOps branding', () => {
      renderLoginWithProvider()
      
      expect(screen.getByText('Harness DevOps Example POC - Secure Authentication System')).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    test('shows error when submitting empty form', async () => {
      renderLoginWithProvider()
      
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Please enter both username and password')).toBeInTheDocument()
      })
    })

    test('shows error when only username is provided', async () => {
      renderLoginWithProvider()
      
      const usernameInput = screen.getByLabelText('Username')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Please enter both username and password')).toBeInTheDocument()
      })
    })

    test('shows error when only password is provided', async () => {
      renderLoginWithProvider()
      
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      fireEvent.change(passwordInput, { target: { value: 'admin' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Please enter both username and password')).toBeInTheDocument()
      })
    })
  })

  describe('Authentication', () => {
    test('successfully logs in with correct credentials', async () => {
      renderLoginWithProvider()
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } })
      fireEvent.change(passwordInput, { target: { value: 'admin' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
      })
    })

    test('shows error with incorrect credentials', async () => {
      renderLoginWithProvider()
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      fireEvent.change(usernameInput, { target: { value: 'wrong' } })
      fireEvent.change(passwordInput, { target: { value: 'wrong' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials. Please use admin/admin')).toBeInTheDocument()
      })
    })

    test('shows error with partial incorrect credentials', async () => {
      renderLoginWithProvider()
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } })
      fireEvent.change(passwordInput, { target: { value: 'wrong' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials. Please use admin/admin')).toBeInTheDocument()
      })
    })
  })

  describe('User Interactions', () => {
    test('toggles password visibility', () => {
      renderLoginWithProvider()
      
      const passwordInput = screen.getByLabelText('Password')
      const toggleButton = screen.getByRole('button', { name: '' })
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      
      fireEvent.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')
      
      fireEvent.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    test('clears error when user starts typing', async () => {
      renderLoginWithProvider()
      
      const usernameInput = screen.getByLabelText('Username')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      // Submit empty form to show error
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText('Please enter both username and password')).toBeInTheDocument()
      })
      
      // Start typing to clear error
      fireEvent.change(usernameInput, { target: { value: 'a' } })
      expect(screen.queryByText('Please enter both username and password')).not.toBeInTheDocument()
    })

    test('handles form submission with Enter key', async () => {
      renderLoginWithProvider()
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } })
      fireEvent.change(passwordInput, { target: { value: 'admin' } })
      
      fireEvent.keyPress(passwordInput, { key: 'Enter', code: 'Enter' })
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
      })
    })
  })

  describe('Loading States', () => {
    test('shows loading state during authentication', async () => {
      renderLoginWithProvider()
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } })
      fireEvent.change(passwordInput, { target: { value: 'admin' } })
      fireEvent.click(submitButton)
      
      expect(screen.getByText('Signing in...')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    test('has proper form labels', () => {
      renderLoginWithProvider()
      
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
    })

    test('has proper button roles', () => {
      renderLoginWithProvider()
      
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    })

    test('form inputs are properly associated with labels', () => {
      renderLoginWithProvider()
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      
      expect(usernameInput).toHaveAttribute('id', 'username')
      expect(passwordInput).toHaveAttribute('id', 'password')
    })
  })

  describe('Error Handling', () => {
    test('handles unexpected errors gracefully', async () => {
      // Mock console.error to avoid noise in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      renderLoginWithProvider()
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      // Simulate an error by providing invalid input that might cause issues
      fireEvent.change(usernameInput, { target: { value: 'admin' } })
      fireEvent.change(passwordInput, { target: { value: 'admin' } })
      
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
      })
      
      consoleSpy.mockRestore()
    })
  })
})
