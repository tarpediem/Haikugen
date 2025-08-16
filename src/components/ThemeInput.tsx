import { useState, useEffect } from 'react';

interface ThemeInputProps {
  theme: string;
  customTheme: string;
  onThemeChange: (theme: string) => void;
  onCustomThemeChange: (customTheme: string) => void;
  disabled?: boolean;
}

const SUGGESTED_THEMES = [
  { id: 'nature', name: 'Nature', description: 'Paysages, saisons, éléments naturels' },
  { id: 'emotions', name: 'Émotions', description: 'Sentiments profonds, mélancolie, joie' },
  { id: 'urban', name: 'Urbain', description: 'Ville, architecture, vie citadine' },
  { id: 'seasons', name: 'Saisons', description: 'Printemps, été, automne, hiver' },
  { id: 'philosophy', name: 'Philosophique', description: 'Réflexions sur la vie, temps qui passe' },
  { id: 'technology', name: 'Technologie', description: 'Monde numérique, innovation' },
  { id: 'cuisine', name: 'Cuisine', description: 'Saveurs, arômes, plats traditionnels' },
  { id: 'travel', name: 'Voyage', description: 'Découvertes, cultures, horizons lointains' },
  { id: 'art', name: 'Art', description: 'Créativité, beauté, expression artistique' },
  { id: 'memory', name: 'Souvenirs', description: 'Nostalgie, enfance, moments précieux' }
];

export default function ThemeInput({
  theme,
  customTheme,
  onThemeChange,
  onCustomThemeChange,
  disabled = false
}: ThemeInputProps) {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [recentThemes, setRecentThemes] = useState<string[]>([]);

  // Load recent themes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('haiku-recent-themes');
    if (saved) {
      try {
        setRecentThemes(JSON.parse(saved));
      } catch (error) {
        console.warn('Failed to load recent themes:', error);
      }
    }
  }, []);

  // Save theme to recent themes when it changes
  useEffect(() => {
    if (customTheme && customTheme.trim()) {
      const newRecent = [customTheme, ...recentThemes.filter(t => t !== customTheme)].slice(0, 5);
      setRecentThemes(newRecent);
      localStorage.setItem('haiku-recent-themes', JSON.stringify(newRecent));
    }
  }, [customTheme, recentThemes]);

  const handleThemeSelect = (selectedTheme: string) => {
    onThemeChange(selectedTheme);
    setIsCustomMode(false);
    onCustomThemeChange('');
  };

  const handleCustomThemeChange = (value: string) => {
    onCustomThemeChange(value);
    onThemeChange('custom');
    setIsCustomMode(true);
  };

  const toggleCustomMode = () => {
    setIsCustomMode(!isCustomMode);
    if (!isCustomMode) {
      onThemeChange('custom');
    } else {
      onThemeChange('');
      onCustomThemeChange('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-zen-black dark:text-zen-white">
          Thème
        </label>
        <button
          type="button"
          onClick={toggleCustomMode}
          disabled={disabled}
          className="text-sm text-zen-vermillion hover:text-zen-vermillion/80 transition-colors focus:outline-none focus:ring-2 focus:ring-zen-vermillion/50 rounded px-2 py-1"
        >
          {isCustomMode ? '📋 Thèmes suggérés' : '✏️ Thème personnalisé'}
        </button>
      </div>

      {isCustomMode ? (
        <div className="space-y-3">
          <textarea
            value={customTheme}
            onChange={(e) => handleCustomThemeChange(e.target.value)}
            placeholder="Décrivez votre thème personnalisé... (ex: 'Apocalypse zombie dans une ville abandonnée', 'Nostalgie d'enfance dans un jardin secret')"
            disabled={disabled}
            rows={3}
            className="zen-input resize-none"
          />
          
          {recentThemes.length > 0 && (
            <div>
              <p className="text-xs text-zen-shadow dark:text-zen-mist mb-2">Thèmes récents:</p>
              <div className="flex flex-wrap gap-2">
                {recentThemes.map((recentTheme, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleCustomThemeChange(recentTheme)}
                    disabled={disabled}
                    className="px-3 py-1 text-xs bg-zen-mist dark:bg-zen-shadow text-zen-black dark:text-zen-white rounded-full hover:bg-zen-silver dark:hover:bg-zen-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-zen-vermillion/50"
                  >
                    {recentTheme.length > 30 ? `${recentTheme.slice(0, 30)}...` : recentTheme}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUGGESTED_THEMES.map((suggestedTheme) => (
            <button
              key={suggestedTheme.id}
              type="button"
              onClick={() => handleThemeSelect(suggestedTheme.name)}
              disabled={disabled}
              className={`
                p-4 text-left rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zen-vermillion/50
                ${theme === suggestedTheme.name
                  ? 'border-zen-vermillion bg-zen-vermillion/5 dark:bg-zen-vermillion/10'
                  : 'border-zen-mist dark:border-zen-shadow hover:border-zen-vermillion/50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
              `}
            >
              <div className="font-medium text-zen-black dark:text-zen-white mb-1">
                {suggestedTheme.name}
              </div>
              <div className="text-xs text-zen-shadow dark:text-zen-mist">
                {suggestedTheme.description}
              </div>
            </button>
          ))}
        </div>
      )}

      {!isCustomMode && !theme && (
        <p className="text-xs text-zen-shadow dark:text-zen-mist">
          💡 Choisissez un thème pour orienter l'inspiration de votre haïku
        </p>
      )}
    </div>
  );
}