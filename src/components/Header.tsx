
interface HeaderProps {
  onShowHistory?: () => void;
  historyCount?: number;
  onShowSettings?: () => void;
}

export default function Header({ onShowHistory, historyCount = 0, onShowSettings }: HeaderProps) {

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

            {/* Settings button */}
            {onShowSettings && (
              <button
                onClick={onShowSettings}
                className="p-2 text-zen-shadow hover:text-zen-black transition-colors rounded-lg hover:bg-zen-mist/50 focus:outline-none focus:ring-2 focus:ring-zen-vermillion/50"
                title="Paramètres"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}