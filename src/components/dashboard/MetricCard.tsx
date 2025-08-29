/**
 * MetricCard component for displaying key performance indicators
 * Features beautiful gradients, icons, and change indicators
 */
import React from 'react'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  icon: LucideIcon
  color: 'primary' | 'secondary' | 'success' | 'warning'
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}) => {
  const getColorClasses = (colorType: string): string => {
    try {
      switch (colorType) {
        case 'primary':
          return 'metric-card'
        case 'secondary':
          return 'metric-card-secondary'
        case 'success':
          return 'metric-card-success'
        case 'warning':
          return 'metric-card-warning'
        default:
          return 'metric-card'
      }
    } catch (error) {
      console.error('Color class error:', error)
      return 'metric-card'
    }
  }

  const formatChange = (changeValue: number): string => {
    try {
      const sign = changeValue >= 0 ? '+' : ''
      return `${sign}${changeValue}%`
    } catch (error) {
      console.error('Change formatting error:', error)
      return '0%'
    }
  }

  const isPositiveChange = (changeValue: number): boolean => {
    try {
      return changeValue >= 0
    } catch (error) {
      console.error('Change validation error:', error)
      return false
    }
  }

  return (
    <div className={`${getColorClasses(color)} p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white text-sm font-medium opacity-90 mb-1">
            {title}
          </p>
          <p className="text-white text-3xl font-bold mb-2">
            {value}
          </p>
          <div className="flex items-center space-x-1">
            {isPositiveChange(change) ? (
              <TrendingUp className="h-4 w-4 text-green-200" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-200" />
            )}
            <span className={`text-sm font-medium ${
              isPositiveChange(change) ? 'text-green-200' : 'text-red-200'
            }`}>
              {formatChange(change)}
            </span>
            <span className="text-white text-sm opacity-75 ml-1">
              from last month
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetricCard
