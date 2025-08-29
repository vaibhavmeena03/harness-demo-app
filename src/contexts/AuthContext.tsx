/**
 * Authentication Context for managing user authentication state
 * Provides authentication methods and user state to the entire application
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  username: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const storedUser = localStorage.getItem('harness_user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('harness_user')
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Hardcoded credentials check
      if (username === 'admin' && password === 'admin') {
        const userData: User = {
          username: 'admin',
          role: 'Administrator'
        }
        
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem('harness_user', JSON.stringify(userData))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = (): void => {
    try {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('harness_user')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
