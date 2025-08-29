/**
 * Dashboard data configuration for Harness DevOps Example POC
 * Contains sample metrics and chart data for demonstration purposes
 */

export const dashboardData = {
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
      { name: 'Week 2', value: 52 },
      { name: 'Week 3', value: 48 },
      { name: 'Week 4', value: 61 },
      { name: 'Week 5', value: 55 },
      { name: 'Week 6', value: 67 },
      { name: 'Week 7', value: 73 },
      { name: 'Week 8', value: 69 }
    ],
    
    pipelineSuccess: [
      { name: 'Build', value: 98 },
      { name: 'Test', value: 95 },
      { name: 'Deploy', value: 92 },
      { name: 'Monitor', value: 97 },
      { name: 'Rollback', value: 88 }
    ],
    
    resourceUtilization: [
      { name: '00:00', value: 45 },
      { name: '04:00', value: 38 },
      { name: '08:00', value: 67 },
      { name: '12:00', value: 89 },
      { name: '16:00', value: 92 },
      { name: '20:00', value: 78 },
      { name: '24:00', value: 52 }
    ],
    
    errorDistribution: [
      { name: 'Build Failures', value: 15 },
      { name: 'Test Failures', value: 25 },
      { name: 'Deployment Errors', value: 20 },
      { name: 'Infrastructure Issues', value: 18 },
      { name: 'Network Problems', value: 12 },
      { name: 'Other', value: 10 }
    ]
  }
}
