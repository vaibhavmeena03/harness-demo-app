/**
 * Unit tests for ChartCard component
 * Tests chart rendering, different chart types, and error handling
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import ChartCard from '../ChartCard'

// Mock Recharts components
vi.mock('recharts', () => ({
  LineChart: ({ children, data }: any) => <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>{children}</div>,
  BarChart: ({ children, data }: any) => <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>{children}</div>,
  AreaChart: ({ children, data }: any) => <div data-testid="area-chart" data-chart-data={JSON.stringify(data)}>{children}</div>,
  PieChart: ({ children, data }: any) => <div data-testid="pie-chart" data-chart-data={JSON.stringify(data)}>{children}</div>,
  Line: () => <div data-testid="line-series">Line</div>,
  Bar: () => <div data-testid="bar-series">Bar</div>,
  Area: () => <div data-testid="area-series">Area</div>,
  Pie: ({ children }: any) => <div data-testid="pie-series">{children}</div>,
  Cell: ({ children }: any) => <div data-testid="cell">{children}</div>,
  XAxis: () => <div data-testid="x-axis">XAxis</div>,
  YAxis: () => <div data-testid="y-axis">YAxis</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid">CartesianGrid</div>,
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
  Legend: () => <div data-testid="legend">Legend</div>,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>
}))

describe('ChartCard Component', () => {
  const mockChartData = [
    { name: 'Test 1', value: 10 },
    { name: 'Test 2', value: 20 },
    { name: 'Test 3', value: 30 }
  ]

  const defaultProps = {
    title: 'Test Chart',
    description: 'Test chart description',
    chartData: mockChartData,
    chartType: 'line' as const
  }

  describe('Rendering', () => {
    test('renders chart card with title and description', () => {
      render(<ChartCard {...defaultProps} />)
      
      expect(screen.getByText('Test Chart')).toBeInTheDocument()
      expect(screen.getByText('Test chart description')).toBeInTheDocument()
    })

    test('renders with different chart types', () => {
      const { rerender } = render(<ChartCard {...defaultProps} chartType="line" />)
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
      
      rerender(<ChartCard {...defaultProps} chartType="bar" />)
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      
      rerender(<ChartCard {...defaultProps} chartType="area" />)
      expect(screen.getByTestId('area-chart')).toBeInTheDocument()
      
      rerender(<ChartCard {...defaultProps} chartType="pie" />)
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
    })
  })

  describe('Chart Type Rendering', () => {
    test('renders line chart correctly', () => {
      render(<ChartCard {...defaultProps} chartType="line" />)
      
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
      expect(screen.getByTestId('line-series')).toBeInTheDocument()
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })

    test('renders bar chart correctly', () => {
      render(<ChartCard {...defaultProps} chartType="bar" />)
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      expect(screen.getByTestId('bar-series')).toBeInTheDocument()
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })

    test('renders area chart correctly', () => {
      render(<ChartCard {...defaultProps} chartType="area" />)
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument()
      expect(screen.getByTestId('area-series')).toBeInTheDocument()
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })

    test('renders pie chart correctly', () => {
      render(<ChartCard {...defaultProps} chartType="pie" />)
      
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
      expect(screen.getByTestId('pie-series')).toBeInTheDocument()
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })
  })

  describe('Chart Data', () => {
    test('passes chart data to chart components', () => {
      render(<ChartCard {...defaultProps} chartType="line" />)
      
      const lineChart = screen.getByTestId('line-chart')
      expect(lineChart).toHaveAttribute('data-chart-data', JSON.stringify(mockChartData))
    })

    test('handles empty chart data', () => {
      render(<ChartCard {...defaultProps} chartData={[]} />)
      
      expect(screen.getByText('Test Chart')).toBeInTheDocument()
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })

    test('handles large chart data sets', () => {
      const largeDataSet = Array.from({ length: 100 }, (_, i) => ({ name: `Item ${i}`, value: i }))
      
      render(<ChartCard {...defaultProps} chartData={largeDataSet} />)
      
      const lineChart = screen.getByTestId('line-chart')
      expect(lineChart).toHaveAttribute('data-chart-data', JSON.stringify(largeDataSet))
    })
  })

  describe('Chart Components', () => {
    test('includes all necessary chart components for line chart', () => {
      render(<ChartCard {...defaultProps} chartType="line" />)
      
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
      expect(screen.getByTestId('x-axis')).toBeInTheDocument()
      expect(screen.getByTestId('y-axis')).toBeInTheDocument()
      expect(screen.getByTestId('tooltip')).toBeInTheDocument()
      expect(screen.getByTestId('legend')).toBeInTheDocument()
    })

    test('includes all necessary chart components for bar chart', () => {
      render(<ChartCard {...defaultProps} chartType="bar" />)
      
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
      expect(screen.getByTestId('x-axis')).toBeInTheDocument()
      expect(screen.getByTestId('y-axis')).toBeInTheDocument()
      expect(screen.getByTestId('tooltip')).toBeInTheDocument()
      expect(screen.getByTestId('legend')).toBeInTheDocument()
    })

    test('includes all necessary chart components for area chart', () => {
      render(<ChartCard {...defaultProps} chartType="area" />)
      
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
      expect(screen.getByTestId('x-axis')).toBeInTheDocument()
      expect(screen.getByTestId('y-axis')).toBeInTheDocument()
      expect(screen.getByTestId('tooltip')).toBeInTheDocument()
      expect(screen.getByTestId('legend')).toBeInTheDocument()
    })

    test('includes all necessary chart components for pie chart', () => {
      render(<ChartCard {...defaultProps} chartType="pie" />)
      
      expect(screen.getByTestId('tooltip')).toBeInTheDocument()
      expect(screen.getByTestId('legend')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    test('handles unsupported chart type gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<ChartCard {...defaultProps} chartType={'unsupported' as any} />)
      
      expect(screen.getByText('Unsupported chart type')).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })

    test('handles chart rendering errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock a component that throws an error
      vi.mocked(require('recharts').LineChart).mockImplementation(() => {
        throw new Error('Chart rendering error')
      })
      
      render(<ChartCard {...defaultProps} chartType="line" />)
      
      expect(screen.getByText('Error rendering chart')).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })
  })

  describe('Styling and Layout', () => {
    test('applies card styling classes', () => {
      render(<ChartCard {...defaultProps} />)
      
      const card = screen.getByText('Test Chart').closest('div')
      expect(card).toHaveClass('card', 'chart-container')
    })

    test('has proper spacing and layout', () => {
      render(<ChartCard {...defaultProps} />)
      
      const title = screen.getByText('Test Chart')
      const description = screen.getByText('Test chart description')
      
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900', 'mb-1')
      expect(description).toHaveClass('text-sm', 'text-gray-600')
    })
  })

  describe('Responsive Design', () => {
    test('wraps chart in responsive container', () => {
      render(<ChartCard {...defaultProps} />)
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })

    test('chart container has proper width', () => {
      render(<ChartCard {...defaultProps} />)
      
      const chartContainer = screen.getByTestId('responsive-container').parentElement
      expect(chartContainer).toHaveClass('w-full')
    })
  })

  describe('Accessibility', () => {
    test('has proper heading structure', () => {
      render(<ChartCard {...defaultProps} />)
      
      const title = screen.getByText('Test Chart')
      expect(title.tagName).toBe('H3')
    })

    test('provides descriptive text for charts', () => {
      render(<ChartCard {...defaultProps} />)
      
      expect(screen.getByText('Test chart description')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    test('renders efficiently with large datasets', () => {
      const largeDataSet = Array.from({ length: 1000 }, (_, i) => ({ name: `Item ${i}`, value: i }))
      
      const startTime = performance.now()
      render(<ChartCard {...defaultProps} chartData={largeDataSet} />)
      const endTime = performance.now()
      
      // Should render within reasonable time (adjust threshold as needed)
      expect(endTime - startTime).toBeLessThan(1000)
    })
  })
})
