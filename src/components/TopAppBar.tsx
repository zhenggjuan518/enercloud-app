import { useNavigate } from 'react-router-dom'

interface TopAppBarProps {
  title: string
  showBack?: boolean
  rightAction?: React.ReactNode
}

export default function TopAppBar({ title, showBack = true, rightAction }: TopAppBarProps) {
  const navigate = useNavigate()

  return (
    <header className="w-full top-0 sticky z-40 header-gradient shadow-sm">
      <div className="flex items-center px-container-margin h-14 max-w-[480px] mx-auto">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="text-on-surface-variant hover:bg-surface-variant/50 p-2 rounded-full transition-colors active:opacity-70 -ml-2"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
        )}
        <h1 className="text-headline-md text-primary flex-1 text-center font-bold truncate">
          {title}
        </h1>
        {rightAction ? (
          rightAction
        ) : (
          <div className="w-10" /> /* Spacer to balance the back button */
        )}
      </div>
    </header>
  )
}
