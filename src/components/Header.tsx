
interface HeaderProps {
  onShowHistory?: () => void;
  historyCount?: number;
}

export default function Header({ onShowHistory, historyCount = 0 }: HeaderProps) {

  return (
    <header className="sticky top-0 z-50 bg-zen-white/90 backdrop-blur-sm border-b border-zen-mist">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zen-vermillion rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-serif">俳</span>
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold text-gray-900">
                Haikugen
              </h1>
              <p className="text-xs text-gray-600">
                Générateur de haïkus IA
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* History button */}
            {onShowHistory && (
              <button
                onClick={onShowHistory}
                className="relative p-2 text-zen-shadow hover:text-zen-black transition-colors rounded-lg hover:bg-zen-mist/50 focus:outline-none focus:ring-2 focus:ring-zen-vermillion/50"
                title="Historique des haïkus"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {historyCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-zen-vermillion text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {historyCount > 99 ? '99+' : historyCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}