import { useState, useEffect } from 'react'

export default function SiteOverviewPage() {
  const [dailyDischarge, setDailyDischarge] = useState(420.5)

  useEffect(() => {
    const interval = setInterval(() => {
      // Increase daily discharge slightly every 3 seconds to simulate usage
      setDailyDischarge(prev => Number((prev + (Math.random() * 0.5)).toFixed(1)))
    }, 3000)

    return () => clearInterval(interval)
  }, [])
  return (
    <div className="space-y-stack-md">
      {/* Map Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden relative h-[260px]">
        <img
          alt="Map showing location"
          className="w-full h-full object-cover opacity-60 grayscale brightness-110"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOk4r7MBU7xwxxVIBZczTW0s1E42vFY7y3jWHtPTUx2OH-gojPe8HqFbtmsKkcKIQgDyLYtzW9IzmNYgEy2xt_lE3VuVSengl-tMtYOXCll0DqmqBh3CSPlADfplu-3CMzxYQhNRrtXTv-fDnm1rdKSD-Lo1ja2NlupxebBDMXqV5VAulCNGtehP7UnqXp1Z5bWMALGVt2ihHaplzjXTtKRw93ftEe-7ak0cP0vcioX-PCayry-e8cPfbVxNspSZWs_jeDEqnL0jI"
        />
        {/* Map Overlay UI */}
        <div className="absolute inset-0 p-4">
          <button className="absolute top-4 right-4 bg-surface-container-lowest p-2 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] text-primary">
            <span className="material-symbols-outlined text-sm icon-fill">explore</span>
          </button>
          {/* Map Pin */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-surface-container-lowest text-on-surface text-label-md px-4 py-2 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] mb-2 relative">
              Site Alpha - Station 1
              <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-surface-container-lowest rotate-45" />
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute w-16 h-16 bg-primary-container/20 rounded-full animate-ping" />
              <div className="absolute w-24 h-24 bg-primary-container/10 rounded-full" />
              <span className="material-symbols-outlined text-primary-container text-4xl relative z-10 icon-fill">location_on</span>
              <div className="absolute w-3 h-3 bg-white rounded-full z-20 top-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Capacity */}
        <div className="bg-surface-container-lowest rounded-xl p-3 border-2 border-primary-container/30 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center text-center">
          <div className="bg-primary-container/20 p-2 rounded-lg mb-2 text-primary">
            <span className="material-symbols-outlined icon-fill">battery_full</span>
          </div>
          <h3 className="text-label-md text-on-surface-variant mb-1">Total Capacity</h3>
          <div className="text-data-display text-on-surface">5.2 <span className="text-sm font-normal">MWh</span></div>
          <div className="text-[10px] text-on-surface-variant mt-1">85% Charged</div>
        </div>

        {/* Daily Discharge */}
        <div className="bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/30 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center text-center">
          <div className="bg-secondary-container/10 p-2 rounded-lg mb-2 text-secondary-container">
            <span className="material-symbols-outlined">download</span>
          </div>
          <h3 className="text-label-md text-on-surface-variant mb-1">Daily Discharge</h3>
          <div className="text-data-display text-on-surface transition-all duration-300">{dailyDischarge} <span className="text-sm font-normal">kWh</span></div>
          <div className="text-[10px] text-on-surface-variant mt-1">Peak: 2:00 PM</div>
        </div>

        {/* System Health */}
        <div className="bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/30 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-container" />
          <div className="bg-primary-container/20 p-2 rounded-lg mb-2 text-primary">
            <span className="material-symbols-outlined">check</span>
          </div>
          <h3 className="text-label-md text-on-surface-variant mb-1">System Health</h3>
          <div className="text-data-display text-on-surface">Optimal</div>
          <div className="text-[10px] text-on-surface-variant mt-1">No Critical Alerts</div>
        </div>
      </div>

      {/* Energy Flow Chart Card */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant/20">
        <h2 className="text-body-lg font-semibold text-on-surface mb-4">Energy Flow Today</h2>
        <div className="relative h-32 w-full mt-4">
          {/* Chart Background lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="border-t border-dashed border-outline-variant/30 w-full flex items-center">
              <span className="text-[10px] text-outline bg-surface-container-lowest pr-2 -mt-2">Power</span>
            </div>
            <div className="border-t border-dashed border-outline-variant/30 w-full flex items-center">
              <span className="text-[10px] text-outline bg-surface-container-lowest pr-2 -mt-2">Charge</span>
            </div>
          </div>
          {/* Mock Chart Line (SVG) */}
          <svg className="absolute inset-0 w-full h-full pt-4 pb-2 z-10" preserveAspectRatio="none" viewBox="0 0 100 40">
            <path d="M0,35 Q10,36 20,34 T40,36 T45,35 Q48,10 50,5 T55,15 T60,10 T65,25 T70,25 T75,32 T85,30 T100,28 L100,40 L0,40 Z" fill="rgba(0, 191, 165, 0.1)" />
            <path d="M0,35 Q10,36 20,34 T40,36 T45,35" fill="none" stroke="#e0a088" strokeWidth="0.5" />
            <path d="M45,35 Q48,10 50,5 T55,15 T60,10 T65,25 T70,25 T75,32 T85,30 T100,28" fill="none" stroke="#00bfa5" strokeWidth="0.5" />
          </svg>
        </div>
      </div>
    </div>
  )
}
