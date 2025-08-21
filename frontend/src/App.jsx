import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { signOut } from 'aws-amplify/auth'
import '@aws-amplify/ui-react/styles.css'
import './App.css'

function App({ signOut: amplifySignOut, user }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [findings, setFindings] = useState([])
  const [securityGroups, setSecurityGroups] = useState([])

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)
    setTimeout(() => {
      setFindings([
        { id: 1, severity: 'high', title: 'Public S3 Bucket', description: 'S3 bucket is publicly accessible', status: 'open' },
        { id: 2, severity: 'medium', title: 'Weak IAM Policy', description: 'IAM policy allows excessive permissions', status: 'open' },
        { id: 3, severity: 'low', title: 'Unused Security Group', description: 'Security group has no attached resources', status: 'resolved' }
      ])
      setSecurityGroups([
        { id: 1, name: 'Web Server SG', rules: 5, status: 'secure' },
        { id: 2, name: 'Database SG', rules: 3, status: 'warning' },
        { id: 3, name: 'Load Balancer SG', rules: 2, status: 'secure' }
      ])
      setIsLoading(false)
    }, 2000)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'findings', label: 'Findings', icon: '🔍' },
    { id: 'security', label: 'Security Groups', icon: '🛡️' },
    { id: 'reports', label: 'Reports', icon: '📋' }
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'secure': return '#10b981'
      case 'warning': return '#f59e0b'
      case 'critical': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <motion.header 
        className="header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="logo-section">
            <motion.div 
              className="logo-icon"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              ☁️
            </motion.div>
            <motion.div 
              className="logo-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="main-title">Cloud Auditor</h1>
              <p className="subtitle">Security & Compliance Dashboard</p>
            </motion.div>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <span className="user-email">{user?.attributes?.email || user?.username}</span>
            </div>
            <motion.button 
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              New Scan
            </motion.button>
            <motion.button 
              className="btn btn-outline"
              onClick={handleSignOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <motion.nav 
        className="nav-tabs"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </motion.button>
        ))}
      </motion.nav>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="overview"
            >
              <div className="stats-grid">
                <motion.div 
                  className="stat-card"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3>Total Findings</h3>
                  <p className="stat-number">{findings.length}</p>
                  <p className="stat-label">Security issues detected</p>
                </motion.div>
                
                <motion.div 
                  className="stat-card"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3>Security Groups</h3>
                  <p className="stat-number">{securityGroups.length}</p>
                  <p className="stat-label">Groups monitored</p>
                </motion.div>
                
                <motion.div 
                  className="stat-card"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3>High Severity</h3>
                  <p className="stat-number">{findings.filter(f => f.severity === 'high').length}</p>
                  <p className="stat-label">Critical issues</p>
                </motion.div>
                
                <motion.div 
                  className="stat-card"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3>Resolved</h3>
                  <p className="stat-number">{findings.filter(f => f.status === 'resolved').length}</p>
                  <p className="stat-label">Issues fixed</p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'findings' && (
            <motion.div
              key="findings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="findings"
            >
              <div className="section-header">
                <h2>Security Findings</h2>
                <motion.button 
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Export Report
                </motion.button>
              </div>
              
              <div className="findings-list">
                {isLoading ? (
                  <motion.div 
                    className="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="spinner"></div>
                    <p>Loading findings...</p>
                  </motion.div>
                ) : (
                  findings.map((finding, index) => (
                    <motion.div
                      key={finding.id}
                      className="finding-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
                    >
                      <div className="finding-header">
                        <div 
                          className="severity-indicator"
                          style={{ backgroundColor: getSeverityColor(finding.severity) }}
                        ></div>
                        <h3>{finding.title}</h3>
                        <span className={`status-badge ${finding.status}`}>
                          {finding.status}
                        </span>
                      </div>
                      <p className="finding-description">{finding.description}</p>
                      <div className="finding-actions">
                        <motion.button 
                          className="btn btn-small"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                        </motion.button>
                        <motion.button 
                          className="btn btn-small btn-outline"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Mark Resolved
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="security"
            >
              <div className="section-header">
                <h2>Security Groups</h2>
                <motion.button 
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Scan Groups
                </motion.button>
              </div>
              
              <div className="security-groups-grid">
                {securityGroups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    className="security-group-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
                  >
                    <div className="group-header">
                      <h3>{group.name}</h3>
                      <div 
                        className="status-dot"
                        style={{ backgroundColor: getStatusColor(group.status) }}
                      ></div>
                    </div>
                    <div className="group-stats">
                      <span className="stat">{group.rules} rules</span>
                      <span className={`status ${group.status}`}>{group.status}</span>
                    </div>
                    <motion.button 
                      className="btn btn-small"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Rules
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="reports"
            >
              <div className="section-header">
                <h2>Reports</h2>
                <motion.button 
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Generate Report
                </motion.button>
              </div>
              
              <div className="reports-grid">
                <motion.div 
                  className="report-card"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                >
                  <h3>Weekly Security Report</h3>
                  <p>Comprehensive security analysis for the past week</p>
                  <div className="report-meta">
                    <span>Last generated: 2 days ago</span>
                  </div>
                  <motion.button 
                    className="btn btn-small"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download PDF
                  </motion.button>
                </motion.div>
                
                <motion.div 
                  className="report-card"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                >
                  <h3>Compliance Report</h3>
                  <p>PCI DSS and SOC 2 compliance status</p>
                  <div className="report-meta">
                    <span>Last generated: 1 week ago</span>
                  </div>
                  <motion.button 
                    className="btn btn-small"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download PDF
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

// Wrap the App component with withAuthenticator HOC
export default withAuthenticator(App, {
  signUpAttributes: ['email'],
  socialProviders: [],
  variation: 'modal'
})
