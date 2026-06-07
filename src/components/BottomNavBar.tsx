import { useNavigate } from 'react-router-dom'

interface BottomNavBarProps {
  activeTab: 'overview' | 'status' | 'analysis' | 'reports'
}

const tabs = [
  { id: 'overview' as const, label: 'Overview', icon: 'home', path: '/overview' },
  { id: 'status' as const, label: 'Status', icon: 'battery_charging_full', path: '/status' },
  { id: 'analysis' as const, label: 'Analysis', icon: 'insights', path: '/analysis' },
  { id: 'reports' as const, label: 'Reports', icon: 'settings', path: '/reports' },
]

export default function BottomNavBar({ activeTab }: BottomNavBarProps) {
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-t-xl">
      <div className="flex justify-around items-center px-4 py-2 border-t border-outline-variant/20 max-w-[480px] mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center min-w-[64px] transition-all duration-200 active:scale-90
                ${isActive
                  ? 'text-primary bg-primary/10 rounded-full px-4 py-1.5'
                  : 'text-on-surface-variant hover:bg-surface-container-high rounded-lg p-1.5'
                }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${isActive ? 'icon-fill' : ''}`}
              >
                {tab.icon}
              </span>
              <span className="text-label-md mt-0.5">{tab.label}</span>
            </button>
          )
        })}
      </div>
      {/* iOS Home Indicator Space */}
      <div className="h-5 w-full flex justify-center pb-2 bg-surface">
        <div className="w-1/3 h-1 bg-outline rounded-full opacity-30" />
      </div>
    </nav>
  )
}
