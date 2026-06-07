import { Outlet, useLocation } from 'react-router-dom'
import BottomNavBar from '../components/BottomNavBar'
import TopAppBar from '../components/TopAppBar'

export default function MobileLayout() {
  const location = useLocation()

  // Determine page title based on route
  const getTitle = () => {
    switch (location.pathname) {
      case '/overview': return 'BMS Monitor'
      case '/status': return 'BMS Monitor'
      case '/cell-matrix': return 'BMS Monitor'
      case '/analysis': return 'Advanced Data Analysis'
      case '/reports': return 'BMS Monitor'
      default: return 'BMS Monitor'
    }
  }

  // Determine which tab is active
  const getActiveTab = () => {
    if (location.pathname === '/overview') return 'overview'
    if (location.pathname === '/status' || location.pathname === '/cell-matrix') return 'status'
    if (location.pathname === '/analysis') return 'analysis'
    if (location.pathname === '/reports') return 'reports'
    return 'overview'
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24">
      <TopAppBar title={getTitle()} />
      <main className="max-w-[480px] mx-auto px-container-margin pt-4">
        <Outlet />
      </main>
      <BottomNavBar activeTab={getActiveTab()} />
    </div>
  )
}
