import { useState } from 'react'

interface Report {
  id: number
  title: string
  date: string
  status: 'available' | 'generating'
}

const reports: Report[] = [
  { id: 1, title: 'Weekly System Performance Report', date: 'Jan 1 - Jan 7, 2024', status: 'available' },
  { id: 2, title: 'Monthly Energy Output Report', date: 'December 2023', status: 'available' },
  { id: 3, title: 'Daily Status Report', date: 'Jan 8, 2024', status: 'available' },
  { id: 4, title: 'Daily Status Report', date: 'Jan 9, 2024', status: 'generating' },
]

export default function ReportCenterPage() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = ['All', 'Daily', 'Weekly', 'Monthly']

  return (
    <div className="flex flex-col gap-stack-lg">
      {/* Page Header & Search */}
      <section className="flex flex-col gap-stack-sm">
        <h2 className="text-headline-lg-mobile text-on-surface">Report Center</h2>
        <div className="relative w-full mt-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline-variant">search</span>
          </div>
          <input
            type="text"
            placeholder="Search reports..."
            className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-full leading-5 bg-surface-container-lowest placeholder-outline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-colors duration-200 shadow-sm"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex overflow-x-auto gap-2 py-2 no-scrollbar mt-2 border border-outline-variant/30 rounded-full bg-surface-container-lowest/50 p-1">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.toLowerCase()
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter.toLowerCase())}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-label-md transition-colors
                  ${isActive
                    ? 'bg-inverse-surface text-inverse-on-surface'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
              >
                {filter}
              </button>
            )
          })}
        </div>
      </section>

      {/* Report List */}
      <section className="flex flex-col gap-stack-md mb-8">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`bg-surface-container-lowest rounded-xl p-component-padding shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-between border-l-4
              ${report.status === 'generating' ? 'border-surface-variant opacity-80' : 'border-primary'}`}
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-body-lg font-semibold text-on-surface text-[14px]">{report.title}</h3>
              <p className="text-body-sm text-outline text-[12px]">({report.date})</p>
              {report.status === 'available' ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-container/20 text-on-primary-container w-max mt-1">
                  Available
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-variant text-on-surface-variant w-max mt-1">
                  <span className="material-symbols-outlined text-[14px] mr-1 animate-spin-slow">sync</span>
                  Generating
                </span>
              )}
            </div>
            <button
              disabled={report.status === 'generating'}
              className={`p-2 rounded-lg flex-shrink-0 transition-opacity
                ${report.status === 'generating'
                  ? 'bg-surface-container-high text-outline-variant cursor-not-allowed'
                  : 'bg-inverse-surface text-inverse-on-surface hover:opacity-90'
                }`}
            >
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        ))}
      </section>
    </div>
  )
}
