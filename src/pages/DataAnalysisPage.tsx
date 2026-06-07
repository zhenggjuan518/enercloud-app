import { useState } from 'react'

export default function DataAnalysisPage() {
  const [activeRange, setActiveRange] = useState<'day' | 'week' | 'month'>('week')

  return (
    <div className="flex flex-col gap-stack-lg">
      {/* Time Range Selector */}
      <div className="flex w-full rounded-lg border border-secondary overflow-hidden h-10 shadow-sm bg-surface-container-lowest">
        {(['day', 'week', 'month'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setActiveRange(range)}
            className={`flex-1 text-label-md transition-colors capitalize
              ${activeRange === range
                ? 'segment-active'
                : 'segment-inactive hover:bg-secondary/5'
              }
              ${range === 'week' ? 'border-x border-secondary' : ''}`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Line Chart Card */}
      <div className="glass-card rounded-xl p-component-padding flex flex-col gap-stack-md">
        <h2 className="text-headline-md text-on-surface text-[16px]">Charge/Discharge Cycles Over Time (MWh)</h2>
        <div className="relative w-full h-[220px] mt-2">
          {/* Y-Axis Labels */}
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-label-md text-on-surface-variant pr-2 w-8 z-10 bg-surface-container-lowest/80 backdrop-blur-sm text-[10px]">
            <span>200</span>
            <span>150</span>
            <span>100</span>
            <span>50</span>
            <span>0</span>
          </div>

          {/* Chart Grid & Lines */}
          <div className="absolute left-8 right-0 top-2 bottom-8">
            {/* Grid Lines */}
            <div className="absolute top-0 w-full h-[1px] bg-outline-variant/30" />
            <div className="absolute top-1/4 w-full h-[1px] bg-outline-variant/30" />
            <div className="absolute top-2/4 w-full h-[1px] bg-outline-variant/30" />
            <div className="absolute top-3/4 w-full h-[1px] bg-outline-variant/30" />
            <div className="absolute bottom-0 w-full h-[1px] bg-outline-variant/30" />

            {/* Chart Lines & Areas */}
            <div className="absolute inset-0 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Charge Line (Blue) */}
                <path d="M0,90 Q5,40 10,45 T20,60 T30,30 T40,65 T45,15 T50,60 T60,35 T70,55 T80,10 T90,60 T100,20" fill="none" stroke="#0070eb" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <path d="M0,90 Q5,40 10,45 T20,60 T30,30 T40,65 T45,15 T50,60 T60,35 T70,55 T80,10 T90,60 T100,20 L100,100 L0,100 Z" fill="url(#blue-grad)" />
                {/* Discharge Line (Green) */}
                <path d="M0,100 Q5,60 10,65 T20,80 T30,50 T40,80 T45,40 T50,80 T60,60 T70,80 T80,30 T90,80 T100,40" fill="none" stroke="#00bfa5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <path d="M0,100 Q5,60 10,65 T20,80 T30,50 T40,80 T45,40 T50,80 T60,60 T70,80 T80,30 T90,80 T100,40 L100,100 L0,100 Z" fill="url(#green-grad)" />
                <defs>
                  <linearGradient id="blue-grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0070eb" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0070eb" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="green-grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00bfa5" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00bfa5" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="absolute left-8 right-0 bottom-0 flex justify-between text-label-md text-on-surface-variant pt-2 text-[10px]">
            <span>Oct 1</span>
            <span>Oct 3</span>
            <span>Oct 5</span>
            <span>Oct 7</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-[2px] bg-secondary-container" />
            <span className="text-body-sm text-on-surface-variant text-[12px]">Charge Cycles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-[2px] bg-primary-container" />
            <span className="text-body-sm text-on-surface-variant text-[12px]">Discharge Cycles</span>
          </div>
        </div>
      </div>

      {/* Pie Chart Card */}
      <div className="glass-card rounded-xl p-component-padding flex flex-col gap-stack-md mb-8">
        <h2 className="text-headline-md text-on-surface text-[16px]">Energy Distribution Pie Chart</h2>
        <div className="flex flex-col items-center mt-4">
          <div
            className="relative w-48 h-48 rounded-full overflow-hidden shadow-sm"
            style={{
              background: `conic-gradient(
                #0070eb 0% 45%,
                #00bfa5 45% 80%,
                #70b5ff 80% 100%
              )`,
            }}
          >
            {/* Labels inside chart */}
            <span className="absolute top-1/2 right-6 -translate-y-1/2 text-white text-label-md text-[12px] font-bold drop-shadow-sm">45%</span>
            <span className="absolute bottom-6 left-12 text-white text-label-md text-[12px] font-bold drop-shadow-sm">35%</span>
            <span className="absolute top-10 left-10 text-white text-label-md text-[12px] font-bold drop-shadow-sm">20%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-secondary-container" />
            <span className="text-body-sm text-on-surface text-[12px]">Stored Energy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-primary-container" />
            <span className="text-body-sm text-on-surface text-[12px]">Discharged Energy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#70b5ff' }} />
            <span className="text-body-sm text-on-surface text-[12px]">System Losses</span>
          </div>
        </div>
      </div>
    </div>
  )
}
