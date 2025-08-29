/**
 * Unit tests for MetricCard component
 * Tests metric card rendering, styling, and data display
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import MetricCard from '../MetricCard'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  TrendingUp: vi.fn(() => <div data-testid="trending-up">TrendingUp</div>),
  TrendingDown: vi.fn(() => <div data-testid="trending-down">TrendingDown</div>)
}))

describe('MetricCard Component', () => {
  const defaultProps = {
    title: 'Test Metric',
    value: '100',
    change: 5.5,
    icon: TrendingUp,
    color: 'primary' as const
  }

  describe('Rendering', () => {
    test('renders metric card with all elements', () => {
      render(<MetricCard {...defaultProps} />)
      
      expect(screen.getByText('Test Metric')).toBeInTheDocument()
      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.getByText('+5.5%')).toBeInTheDocument()
      expect(screen.getByText('from last month')).toBeInTheDocument()
    })

    test('renders with different color schemes', () => {
      const { rerender } = render(<MetricCard {...defaultProps} color="primary" />)
      expect(screen.getByText('Test Metric')).toBeInTheDocument()
      
      rerender(<MetricCard {...defaultProps} color="secondary" />)
      expect(screen.getByText('Test Metric')).toBeInTheDocument()
      
      rerender(<MetricCard {...defaultProps} color="success" />)
      expect(screen.getByText('Test Metric')).toBeInTheDocument()
      
      rerender(<MetricCard {...defaultProps} color="warning" />)
      expect(screen.getByText('Test Metric')).toBeInTheDocument()
    })
  })

  describe('Data Display', () => {
    test('displays positive change correctly', () => {
      render(<MetricCard {...defaultProps} change={12.5} />)
      
      expect(screen.getByText('+12.5%')).toBeInTheDocument()
      expect(screen.getByTestId('trending-up')).toBeInTheDocument()
    })

    test('displays negative change correctly', () => {
      render(<MetricCard {...defaultProps} change={-8.3} />)
      
      expect(screen.getByText('-8.3%')).toBeInTheDocument()
      expect(screen.getByTestId('trending-down')).toBeInTheDocument()
    })

    test('displays zero change correctly', () => {
      render(<MetricCard {...defaultProps} change={0} />)
      
      expect(screen.getByText('+0%')).toBeInTheDocument()
      expect(screen.getByTestId('trending-up')).toBeInTheDocument()
    })

    test('handles different value types', () => {
      const { rerender } = render(<MetricCard {...defaultProps} value="1,247" />)
      expect(screen.getByText('1,247')).toBeInTheDocument()
      
      rerender(<MetricCard {...defaultProps} value={99.8} />)
      expect(screen.getByText('99.8')).toBeInTheDocument()
      
      rerender(<MetricCard {...defaultProps} value="94%" />)
      expect(screen.getByText('94%')).toBeInTheDocument()
    })
  })

  describe('Styling and Classes', () => {
    test('applies correct color classes for primary', () => {
      render(<MetricCard {...defaultProps} color="primary" />)
      
      const card = screen.getByText('Test Metric').closest('div')
      expect(card).toHaveClass('metric-card')
    })

    test('applies correct color classes for secondary', () => {
      render(<MetricCard {...defaultProps} color="secondary" />)
      
      const card = screen.getByText('Test Metric').closest('div')
      expect(card).toHaveClass('metric-card-secondary')
    })

    test('applies correct color classes for success', () => {
      render(<MetricCard {...defaultProps} color="success" />)
      
      const card = screen.getByText('Test Metric').closest('div')
      expect(card).toHaveClass('metric-card-success')
    })

    test('applies correct color classes for warning', () => {
      render(<MetricCard {...defaultProps} color="warning" />)
      
      const card = screen.getByText('Test Metric').closest('div')
      expect(card).toHaveClass('metric-card-warning')
    })

    test('applies hover and transition classes', () => {
      render(<MetricCard {...defaultProps} />)
      
      const card = screen.getByText('Test Metric').closest('div')
      expect(card).toHaveClass('hover:shadow-xl', 'hover:scale-105', 'transition-all', 'duration-300')
    })
  })

  describe('Icon Display', () => {
    test('renders icon in the correct position', () => {
      render(<MetricCard {...defaultProps} />)
      
      const iconContainer = screen.getByText('Test Metric').closest('div')?.querySelector('.flex-shrink-0')
      expect(iconContainer).toBeInTheDocument()
    })

    test('icon container has correct styling', () => {
      render(<MetricCard {...defaultProps} />)
      
      const iconContainer = screen.getByText('Test Metric').closest('div')?.querySelector('.w-12.h-12')
      expect(iconContainer).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    test('handles invalid color gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<MetricCard {...defaultProps} color={'invalid' as any} />)
      
      const card = screen.getByText('Test Metric').closest('div')
      expect(card).toHaveClass('metric-card') // Default fallback
      
      consoleSpy.mockRestore()
    })

    test('handles formatting errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<MetricCard {...defaultProps} change={NaN} />)
      
      expect(screen.getByText('0%')).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    test('has proper text contrast for white text on colored backgrounds', () => {
      render(<MetricCard {...defaultProps} />)
      
      const title = screen.getByText('Test Metric')
      const value = screen.getByText('100')
      const change = screen.getByText('+5.5%')
      
      expect(title).toHaveClass('text-white')
      expect(value).toHaveClass('text-white')
      expect(change).toHaveClass('text-green-200')
    })

    test('change indicator has proper semantic meaning', () => {
      render(<MetricCard {...defaultProps} change={12.5} />)
      
      expect(screen.getByText('+12.5%')).toBeInTheDocument()
      expect(screen.getByText('from last month')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    test('maintains proper layout structure', () => {
      render(<MetricCard {...defaultProps} />)
      
      const card = screen.getByText('Test Metric').closest('div')
      expect(card).toHaveClass('flex', 'items-center', 'justify-between')
    })

    test('has proper spacing and padding', () => {
      render(<MetricCard {...defaultProps} />)
      
      const card = screen.getByText('Test Metric').closest('div')
      expect(card).toHaveClass('p-6')
    })
  })
})
