import { useDarkMode } from '../hooks/useDarkMode';

interface HeaderProps {
  onShowHistory?: () => void;
  historyCount?: number;
}

export default function Header({ onShowHistory, historyCount = 0 }: HeaderProps) {
  const { isDark, toggle } = useDarkMode();

  return (
    <header className="sticky top-0 z-50 bg-zen-white/90 dark:bg-zen-charcoal/90 backdrop-blur-sm border-b border-zen-mist dark:border-zen-shadow">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zen-vermillion rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-serif">俳</span>
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold text-zen-black dark:text-zen-white">
                Haikugen
              </h1>
              <p className="text-xs text-zen-shadow dark:text-zen-mist">
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
                className="relative p-2 text-zen-shadow dark:text-zen-mist hover:text-zen-black dark:hover:text-zen-white transition-colors rounded-lg hover:bg-zen-mist/50 dark:hover:bg-zen-shadow/50 focus:outline-none focus:ring-2 focus:ring-zen-vermillion/50"
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

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="p-2 text-zen-shadow dark:text-zen-mist hover:text-zen-black dark:hover:text-zen-white transition-colors rounded-lg hover:bg-zen-mist/50 dark:hover:bg-zen-shadow/50 focus:outline-none focus:ring-2 focus:ring-zen-vermillion/50"
              title={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Info button */}
            <button
              className="p-2 text-zen-shadow dark:text-zen-mist hover:text-zen-black dark:hover:text-zen-white transition-colors rounded-lg hover:bg-zen-mist/50 dark:hover:bg-zen-shadow/50 focus:outline-none focus:ring-2 focus:ring-zen-vermillion/50"
              title="À propos"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}