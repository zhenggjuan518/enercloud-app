import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OperationStatusPage() {
  const navigate = useNavigate()

  const initialHeatmapData = [
    [
      { id: 'A1', temp: 28, level: 'normal' },
      { id: 'A2', temp: 28, level: 'normal' },
      { id: 'B3', temp: 38, level: 'warm' },
      { id: 'B4', temp: 50, level: 'hot' },
    ],
    [
      { id: 'A3', temp: 28, level: 'normal' },
      { id: 'A4', temp: 28, level: 'normal' },
      { id: 'B5', temp: 38, level: 'warm' },
      { id: 'B6', temp: 38, level: 'warm' },
    ],
    [
      { id: 'C1', temp: 22, level: 'cool' },
      { id: 'A5', temp: 28, level: 'normal' },
      { id: 'B7', temp: 28, level: 'normal' },
      { id: 'C2', temp: 25, level: 'cool' },
    ],
    [
      { id: 'C3', temp: 22, level: 'cool' },
      { id: 'B8', temp: 28, level: 'normal' },
      { id: 'C4', temp: 22, level: 'cool' },
      { id: 'C5', temp: 22, level: 'cool' },
    ],
  ]

  const [power, setPower] = useState(1250.5)
  const [current, setCurrent] = useState(310.2)
  const [voltage, setVoltage] = useState(405.8)
  const [heatmapData, setHeatmapData] = useState(initialHeatmapData)
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }))

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate gauges
      setPower(prev => Number((prev + (Math.random() - 0.5) * 5).toFixed(1)))
      setCurrent(prev => Number((prev + (Math.random() - 0.5) * 2).toFixed(1)))
      setVoltage(prev => Number((prev + (Math.random() - 0.5) * 1).toFixed(1)))
      
      // Update time
      setLastUpdate(new Date().toLocaleTimeString('en-US', { hour12: false }))

      // Fluctuate heatmap
      setHeatmapData(prevData => {
        return prevData.map(row => 
          row.map(module => {
            // 20% chance to fluctuate each module
            if (Math.random() > 0.8) {
              const newTemp = Math.max(15, Math.min(60, module.temp + Math.floor((Math.random() - 0.5) * 4)))
              let newLevel = 'normal'
              if (newTemp < 25) newLevel = 'cool'
              else if (newTemp >= 35 && newTemp < 45) newLevel = 'warm'
              else if (newTemp >= 45) newLevel = 'hot'
              return { ...module, temp: newTemp, level: newLevel }
            }
            return module
          })
        )
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getTempColor = (level: string) => {
    switch (level) {
      case 'cool': return 'bg-secondary'
      case 'normal': return 'bg-primary-container'
      case 'warm': return 'bg-warning'
      case 'hot': return 'bg-error'
      default: return 'bg-primary-container'
    }
  }

  return (
    <div className="space-y-stack-md">
      {/* Header Section */}
      <h2 className="text-headline-lg-mobile text-on-surface text-center">Real-time Operation Status</h2>

      {/* Overall Status Card */}
      <div className="glass-card rounded-xl p-component-padding flex justify-between items-center border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
          <span className="text-headline-md text-primary flex items-center gap-2">
            RUNNING <span className="material-symbols-outlined text-primary">check_circle</span>
          </span>
        </div>
        <div className="text-right">
          <p className="text-body-sm text-on-surface-variant">Status: <span className="text-primary font-semibold">Normal</span></p>
          <p className="text-body-sm text-outline">Last updated: {lastUpdate}</p>
        </div>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-3 gap-3">
        {/* Power Gauge */}
        <div className="glass-card rounded-xl p-3 flex flex-col items-center justify-center relative min-h-[160px]">
          <div className="absolute w-24 h-24 rounded-full border-4 border-surface-container-high border-t-primary border-r-primary transform rotate-45 transition-all duration-1000" />
          <div className="z-10 text-center flex flex-col items-center">
            <span className="text-label-md text-outline mb-1">{Math.round((power / 1500) * 100)}%</span>
            <span className="text-data-display text-on-surface text-[20px] transition-all duration-500">{power.toFixed(1)}</span>
            <span className="text-body-sm text-on-surface-variant text-[11px]">Discharging</span>
          </div>
          <div className="absolute bottom-2 text-label-md text-outline text-[10px]">POWER (kW)</div>
        </div>

        {/* Current Gauge */}
        <div className="glass-card rounded-xl p-3 flex flex-col items-center justify-center relative min-h-[160px]">
          <div className="absolute w-24 h-24 rounded-full border-4 border-surface-container-high border-t-secondary border-r-secondary transform rotate-45 transition-all duration-1000" />
          <div className="z-10 text-center flex flex-col items-center">
            <span className="text-label-md text-outline mb-1">{Math.round((current / 400) * 100)}%</span>
            <span className="text-data-display text-on-surface text-[20px] transition-all duration-500">{current.toFixed(1)}</span>
            <span className="text-body-sm text-on-surface-variant text-[11px]">Stable</span>
          </div>
          <div className="absolute bottom-2 text-label-md text-outline text-[10px]">CURRENT (A)</div>
        </div>

        {/* Voltage Gauge */}
        <div className="glass-card rounded-xl p-3 flex flex-col items-center justify-center relative min-h-[160px]">
          <div className="absolute w-24 h-24 rounded-full border-4 border-surface-container-high border-t-primary-container border-r-primary-container transform rotate-45 transition-all duration-1000" />
          <div className="z-10 text-center flex flex-col items-center">
            <span className="text-label-md text-outline mb-1">{Math.round((voltage / 450) * 100)}%</span>
            <span className="text-data-display text-on-surface text-[20px] transition-all duration-500">{voltage.toFixed(1)}</span>
            <span className="text-body-sm text-on-surface-variant text-[11px]">Stable</span>
          </div>
          <div className="absolute bottom-2 text-label-md text-outline text-[10px]">VOLTAGE (V)</div>
        </div>
      </div>

      {/* Heat Map Section */}
      <div className="glass-card rounded-xl p-component-padding">
        <h3 className="text-headline-md text-on-surface uppercase mb-2 text-[16px]">System Temperature Heat Map</h3>
        <div className="flex gap-4 text-body-sm mb-3">
          <span className="text-secondary text-[12px]">Cool (20°C)</span>
          <span className="text-warning text-[12px]">Warm (35°C)</span>
          <span className="text-error text-[12px]">Hot (50°C)</span>
        </div>
        <div className="border border-outline-variant rounded-lg p-2 bg-surface-container-lowest">
          <div className="text-center text-label-md text-outline mb-2 text-[10px]">Battery module</div>
          {/* Legend Bar */}
          <div className="flex h-1.5 w-full mb-2 rounded overflow-hidden">
            <div className="flex-1 bg-secondary opacity-50" />
            <div className="flex-1 bg-primary-container opacity-50" />
            <div className="flex-1 bg-primary opacity-50" />
            <div className="flex-1 bg-warning opacity-50" />
            <div className="flex-1 bg-error opacity-50" />
          </div>
          {/* Matrix */}
          <div className="grid grid-cols-4 gap-1 text-center text-white">
            {heatmapData.flat().map((module, index) => (
              <div
                key={index}
                className={`${getTempColor(module.level)} p-2 rounded flex flex-col justify-center text-label-md text-[10px]`}
              >
                <span>Module {module.id}:</span>
                <span>{module.temp}°C</span>
              </div>
            ))}
          </div>
        </div>
        <button 
          onClick={() => navigate('/cell-matrix')}
          className="w-full mt-4 py-3 border border-primary text-primary rounded-full hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">grid_view</span>
          View Cell Matrix Details
        </button>
      </div>
    </div>
  )
}
