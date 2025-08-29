/**
 * Dashboard component displaying Harness DevOps metrics and charts
 * Features a beautiful layout with metric cards and interactive charts
 */
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { LogOut, BarChart3, Activity, Users, Zap, Shield, Clock, TrendingUp } from 'lucide-react'
import MetricCard from './MetricCard'
import ChartCard from './ChartCard'
import { dashboardData } from '../../data/dashboardData'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()

  const handleLogout = (): void => {
    try {
      logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="dashboard-header text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-white" />
                <h1 className="text-2xl font-bold">Harness DevOps</h1>
              </div>
              <span className="text-blue-100 text-sm">Example POC</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-100">Welcome back,</p>
                <p className="font-semibold">{user?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h2>
          <p className="text-gray-600">
            Monitor your DevOps pipeline performance and key metrics
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Deployments"
            value={dashboardData.metrics.totalDeployments}
            change={dashboardData.metrics.deploymentsChange}
            icon={Zap}
            color="primary"
          />
          <MetricCard
            title="Active Users"
            value={dashboardData.metrics.activeUsers}
            change={dashboardData.metrics.usersChange}
            icon={Users}
            color="secondary"
          />
          <MetricCard
            title="Security Score"
            value={`${dashboardData.metrics.securityScore}%`}
            change={dashboardData.metrics.securityChange}
            icon={Shield}
            color="success"
          />
          <MetricCard
            title="Uptime"
            value={`${dashboardData.metrics.uptime}%`}
            change={dashboardData.metrics.uptimeChange}
            icon={Clock}
            color="warning"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard
            title="Deployment Frequency"
            description="Number of deployments per week"
            chartData={dashboardData.charts.deploymentFrequency}
            chartType="line"
          />
          <ChartCard
            title="Pipeline Success Rate"
            description="Success rate of CI/CD pipelines"
            chartData={dashboardData.charts.pipelineSuccess}
            chartType="bar"
          />
          <ChartCard
            title="Resource Utilization"
            description="CPU and memory usage over time"
            chartData={dashboardData.charts.resourceUtilization}
            chartType="area"
          />
          <ChartCard
            title="Error Distribution"
            description="Types of errors in the system"
            chartData={dashboardData.charts.errorDistribution}
            chartType="pie"
          />
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">All services operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Monitoring active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">2 warnings</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
