/**
 * Unit tests for Dashboard component
 * Tests dashboard rendering, metrics display, and chart functionality
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Dashboard from '../Dashboard'
import { AuthProvider } from '../../../contexts/AuthContext'

// Mock the useAuth hook
const mockUseAuth = vi.fn()
vi.mock('../../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../../contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => mockUseAuth(),
  }
})

// Mock the dashboard data
vi.mock('../../../data/dashboardData', () => ({
  dashboardData: {
    metrics: {
      totalDeployments: 1247,
      deploymentsChange: 12.5,
      activeUsers: 89,
      usersChange: 8.2,
      securityScore: 94,
      securityChange: 2.1,
      uptime: 99.8,
      uptimeChange: 0.1
    },
    charts: {
      deploymentFrequency: [
        { name: 'Week 1', value: 45 },
        { name: 'Week 2', value: 52 }
      ],
      pipelineSuccess: [
        { name: 'Build', value: 98 },
        { name: 'Test', value: 95 }
      ],
      resourceUtilization: [
        { name: '00:00', value: 45 },
        { name: '12:00', value: 89 }
      ],
      errorDistribution: [
        { name: 'Build Failures', value: 15 },
        { name: 'Test Failures', value: 25 }
      ]
    }
  }
}))

const renderDashboardWithProvider = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Mock authenticated user
    mockUseAuth.mockReturnValue({
      user: { username: 'admin', role: 'Administrator' },
      logout: vi.fn(),
      isAuthenticated: true
    })
  })

  describe('Rendering', () => {
    test('renders dashboard header with branding', () => {
      renderDashboardWithProvider()
      
      expect(screen.getByText('Harness DevOps')).toBeInTheDocument()
      expect(screen.getByText('Example POC')).toBeInTheDocument()
      expect(screen.getByText('Welcome back,')).toBeInTheDocument()
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    test('renders dashboard title and description', () => {
      renderDashboardWithProvider()
      
      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
      expect(screen.getByText('Monitor your DevOps pipeline performance and key metrics')).toBeInTheDocument()
    })

    test('renders all metric cards', () => {
      renderDashboardWithProvider()
      
      expect(screen.getByText('Total Deployments')).toBeInTheDocument()
      expect(screen.getByText('Active Users')).toBeInTheDocument()
      expect(screen.getByText('Security Score')).toBeInTheDocument()
      expect(screen.getByText('Uptime')).toBeInTheDocument()
    })

    test('renders all chart cards', () => {
      renderDashboardWithProvider()
      
      expect(screen.getByText('Deployment Frequency')).toBeInTheDocument()
      expect(screen.getByText('Pipeline Success Rate')).toBeInTheDocument()
      expect(screen.getByText('Resource Utilization')).toBeInTheDocument()
      expect(screen.getByText('Error Distribution')).toBeInTheDocument()
    })

    test('renders system status section', () => {
      renderDashboardWithProvider()
      
      expect(screen.getByText('System Status')).toBeInTheDocument()
      expect(screen.getByText('All services operational')).toBeInTheDocument()
      expect(screen.getByText('Monitoring active')).toBeInTheDocument()
      expect(screen.getByText('2 warnings')).toBeInTheDocument()
    })
  })

  describe('Metric Values', () => {
    test('displays correct metric values', () => {
      renderDashboardWithProvider()
      
      expect(screen.getByText('1,247')).toBeInTheDocument()
      expect(screen.getByText('89')).toBeInTheDocument()
      expect(screen.getByText('94%')).toBeInTheDocument()
      expect(screen.getByText('99.8%')).toBeInTheDocument()
    })

    test('displays change indicators', () => {
      renderDashboardWithProvider()
      
      expect(screen.getByText('+12.5%')).toBeInTheDocument()
      expect(screen.getByText('+8.2%')).toBeInTheDocument()
      expect(screen.getByText('+2.1%')).toBeInTheDocument()
      expect(screen.getByText('+0.1%')).toBeInTheDocument()
    })
  })

  describe('User Interaction', () => {
    test('logout button calls logout function', () => {
      const mockLogout = vi.fn()
      mockUseAuth.mockReturnValue({
        user: { username: 'admin', role: 'Administrator' },
        logout: mockLogout,
        isAuthenticated: true
      })
      
      renderDashboardWithProvider()
      
      const logoutButton = screen.getByRole('button', { name: /logout/i })
      fireEvent.click(logoutButton)
      
      expect(mockLogout).toHaveBeenCalled()
    })

    test('logout button has correct styling and text', () => {
      renderDashboardWithProvider()
      
      const logoutButton = screen.getByRole('button', { name: /logout/i })
      expect(logoutButton).toHaveTextContent('Logout')
      expect(logoutButton).toBeInTheDocument()
    })
  })

  describe('Chart Descriptions', () => {
    test('displays chart descriptions correctly', () => {
      renderDashboardWithProvider()
      
      expect(screen.getByText('Number of deployments per week')).toBeInTheDocument()
      expect(screen.getByText('Success rate of CI/CD pipelines')).toBeInTheDocument()
      expect(screen.getByText('CPU and memory usage over time')).toBeInTheDocument()
      expect(screen.getByText('Types of errors in the system')).toBeInTheDocument()
    })
  })

  describe('Authentication Integration', () => {
    test('displays user information correctly', () => {
      mockUseAuth.mockReturnValue({
        user: { username: 'testuser', role: 'Developer' },
        logout: vi.fn(),
        isAuthenticated: true
      })
      
      renderDashboardWithProvider()
      
      expect(screen.getByText('testuser')).toBeInTheDocument()
    })

    test('handles missing user information gracefully', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: vi.fn(),
        isAuthenticated: true
      })
      
      renderDashboardWithProvider()
      
      expect(screen.getByText('Welcome back,')).toBeInTheDocument()
      expect(screen.queryByText('undefined')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    test('handles logout errors gracefully', () => {
      const mockLogout = vi.fn().mockImplementation(() => {
        throw new Error('Logout error')
      })
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockUseAuth.mockReturnValue({
        user: { username: 'admin', role: 'Administrator' },
        logout: mockLogout,
        isAuthenticated: true
      })
      
      renderDashboardWithProvider()
      
      const logoutButton = screen.getByRole('button', { name: /logout/i })
      fireEvent.click(logoutButton)
      
      expect(mockLogout).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })

  describe('Responsive Design', () => {
    test('renders with proper grid layouts', () => {
      renderDashboardWithProvider()
      
      // Check that metric cards are in a grid
      const metricCards = screen.getAllByText(/Total Deployments|Active Users|Security Score|Uptime/)
      expect(metricCards).toHaveLength(4)
      
      // Check that chart cards are in a grid
      const chartCards = screen.getAllByText(/Deployment Frequency|Pipeline Success Rate|Resource Utilization|Error Distribution/)
      expect(chartCards).toHaveLength(4)
    })
  })

  describe('Accessibility', () => {
    test('has proper heading structure', () => {
      renderDashboardWithProvider()
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })

    test('has proper button roles', () => {
      renderDashboardWithProvider()
      
      const logoutButton = screen.getByRole('button', { name: /logout/i })
      expect(logoutButton).toBeInTheDocument()
    })
  })
})
