import { useState, useEffect, useMemo } from 'react'

interface CellData {
  id: number
  voltage: string
  isWarning: boolean
  soc?: string
  soh?: string
  temp?: string
}

export default function CellMatrixPage() {
  const [selectedCell, setSelectedCell] = useState<CellData | null>(null)
  const [activeTab, setActiveTab] = useState<'voltage' | 'temperature' | 'soc'>('voltage')

  // Generate initial cell data
  const initialCells: CellData[] = Array.from({ length: 80 }, (_, i) => {
    const id = i + 1
    const isWarning = id === 36 || id === 57 || id === 22
    return {
      id,
      voltage: isWarning ? '3.65V' : '3.78V',
      isWarning,
      soc: isWarning ? '78%' : '95%',
      soh: isWarning ? '89%' : '98%',
      temp: isWarning ? '42°C' : '28°C',
    }
  })

  const [cells, setCells] = useState<CellData[]>(initialCells)

  useEffect(() => {
    const interval = setInterval(() => {
      setCells(prevCells => prevCells.map(cell => {
        // Only fluctuate some cells to make it look realistic
        if (Math.random() > 0.3) return cell

        const currentVoltage = parseFloat(cell.voltage)
        const currentTemp = parseInt(cell.temp || '28')
        
        // Fluctuate voltage by +/- 0.01V
        let newVoltage = currentVoltage + (Math.random() > 0.5 ? 0.01 : -0.01)
        // Fluctuate temp by +/- 1C
        let newTemp = currentTemp + (Math.random() > 0.5 ? 1 : -1)

        // Randomly fix or create warnings (rare)
        let isWarning = cell.isWarning
        if (isWarning && Math.random() > 0.95) {
          isWarning = false
          newVoltage = 3.78
          newTemp = 28
        } else if (!isWarning && Math.random() > 0.99) {
          isWarning = true
          newVoltage = 3.65
          newTemp = 42
        }

        return {
          ...cell,
          voltage: newVoltage.toFixed(2) + 'V',
          temp: newTemp + '°C',
          isWarning
        }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const avgVoltage = useMemo(() => {
    const sum = cells.reduce((acc, cell) => acc + parseFloat(cell.voltage), 0)
    return (sum / cells.length).toFixed(2) + 'V'
  }, [cells])

  return (
    <div className="flex flex-col gap-stack-lg relative">
      {/* Summary Header */}
      <section className="glass-panel rounded-xl p-component-padding shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex justify-between items-center z-10 relative">
        <div className="flex flex-col gap-1">
          <span className="text-body-sm text-on-surface-variant text-[12px]">System Health</span>
          <span className="text-data-display text-primary text-[20px]">Good</span>
        </div>
        <div className="h-8 w-px bg-outline-variant/30" />
        <div className="flex flex-col gap-1">
          <span className="text-body-sm text-on-surface-variant text-[12px]">Total Cells</span>
          <span className="text-data-display text-[20px]">256</span>
        </div>
        <div className="h-8 w-px bg-outline-variant/30" />
        <div className="flex flex-col gap-1 text-right">
          <span className="text-body-sm text-on-surface-variant text-[12px]">Avg. Voltage</span>
          <span className="text-data-display text-[20px] transition-all duration-300">{avgVoltage}</span>
        </div>
      </section>

      {/* Matrix Controls */}
      <div className="flex bg-surface-container-low rounded-lg p-1 w-full max-w-sm mx-auto shadow-sm">
        {(['voltage', 'temperature', 'soc'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 px-3 rounded-md text-label-md transition-all text-center capitalize
              ${activeTab === tab
                ? 'bg-white shadow-sm text-primary'
                : 'text-on-surface-variant hover:bg-surface-variant/30'
              }`}
          >
            {tab === 'soc' ? 'SOC' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Cell Matrix Area */}
      <section className="relative">
        {/* Tech pattern background */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#006b5c 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="custom-scrollbar overflow-x-auto overflow-y-auto max-h-[420px] bg-surface rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-3 border border-surface-variant relative z-10">
          <div className="grid grid-cols-8 gap-1 min-w-[300px]">
            {cells.map((cell) => (
              <div
                key={cell.id}
                onClick={() => setSelectedCell(selectedCell?.id === cell.id ? null : cell)}
                className={`aspect-square rounded-sm flex flex-col items-center justify-center border shadow-sm transition-transform hover:scale-105 cursor-pointer relative
                  ${cell.isWarning
                    ? 'bg-error-container border-error/30 ring-2 ring-error ring-offset-1 ring-offset-surface'
                    : 'bg-primary-container border-primary/20'
                  }`}
              >
                {cell.isWarning && (
                  <span className="material-symbols-outlined text-on-error-container absolute -top-1 opacity-40 text-[14px] icon-fill">warning</span>
                )}
                <span className={`text-[9px] font-semibold leading-none ${cell.isWarning ? 'text-on-error-container' : 'text-on-primary-container'}`}>
                  #{cell.id}
                </span>
                <span className={`text-[8px] leading-none mt-0.5 ${cell.isWarning ? 'text-on-error-container/80' : 'text-on-primary-container/80'}`}>
                  {cell.voltage}
                </span>

                {/* Details Popover */}
                {selectedCell?.id === cell.id && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-surface-container-lowest rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-outline-variant/30 p-3 flex flex-col gap-2 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center border-b border-outline-variant/20 pb-1">
                      <span className="text-headline-md text-[13px] leading-tight text-on-surface">Cell #{cell.id} Details</span>
                      <button
                        onClick={() => setSelectedCell(null)}
                        className="text-on-surface-variant hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] text-on-surface-variant">
                        <span>SOC:</span> <span className="font-medium text-on-surface">{cell.soc}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-on-surface-variant">
                        <span>SOH:</span> <span className="font-medium text-on-surface">{cell.soh}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-on-surface-variant">
                        <span>Temp:</span> <span className={`font-medium ${cell.isWarning ? 'text-error' : 'text-on-surface'}`}>{cell.temp}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-on-surface-variant">
                        <span>Voltage:</span> <span className="font-medium text-on-surface">{cell.voltage}</span>
                      </div>
                    </div>
                    <button className="mt-1 w-full py-1.5 bg-surface-variant text-on-surface rounded-md hover:bg-surface-container-high transition-colors text-[11px] font-semibold">
                      Isolate Cell
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend overlay */}
        <div className="absolute bottom-2 right-2 bg-surface-container-lowest/90 backdrop-blur-sm rounded-lg p-2 shadow-sm border border-outline-variant/20 flex gap-3 text-[10px] text-on-surface-variant z-20 font-semibold">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-primary-container border border-primary/20" /> Normal
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-error-container border border-error/30" /> Attention
          </div>
        </div>
      </section>
    </div>
  )
}
