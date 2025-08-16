import { useState } from 'react';
import type { Haiku } from '../types/haiku';
import { formatSyllableInfo, getSyllableDisplay } from '../utils/syllableCounter';

interface HaikuDisplayProps {
  haiku: Haiku | null;
  isLoading?: boolean;
  error?: string | null;
  onRegenerate?: () => void;
  onSave?: (haiku: Haiku) => void;
  onExportImage?: (haiku: Haiku) => void;
}

export default function HaikuDisplay({
  haiku,
  isLoading = false,
  error = null,
  onRegenerate,
  onSave,
  onExportImage
}: HaikuDisplayProps) {
  const [showSyllables, setShowSyllables] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!haiku || !onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(haiku);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!haiku || !onExportImage) return;
    onExportImage(haiku);
  };

  const copyToClipboard = async () => {
    if (!haiku) return;
    
    const text = haiku.lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="zen-card p-8 text-center animate-fade-in">
        <div className="floating mb-6">
          <div className="w-12 h-12 mx-auto bg-zen-vermillion/20 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-zen-vermillion border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="text-zen-shadow dark:text-zen-mist">
          Création de votre haïku en cours...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="zen-card p-8 text-center border-red-200 dark:border-red-800 animate-fade-in">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">
          Erreur de génération
        </h3>
        <p className="text-red-600 dark:text-red-300 mb-4 text-sm">
          {error}
        </p>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="zen-button-primary"
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  if (!haiku) {
    return (
      <div className="zen-card p-8 text-center">
        <div className="text-zen-shadow dark:text-zen-mist mb-4">
          <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <p className="text-zen-shadow dark:text-zen-mist">
          Votre haïku apparaîtra ici une fois généré
        </p>
      </div>
    );
  }

  const syllableInfo = haiku.syllables;
  const isValidStructure = syllableInfo[0] === 5 && syllableInfo[1] === 7 && syllableInfo[2] === 5;

  return (
    <div className="zen-card p-8 animate-fade-in">
      {/* Haiku display */}
      <div className="text-center mb-6">
        <div className="haiku-text text-zen-black dark:text-zen-white mb-4 breathing">
          {haiku.lines.map((line, index) => (
            <div key={index} className="mb-2 last:mb-0">
              {line}
            </div>
          ))}
        </div>

        {/* Syllable information */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <button
            onClick={() => setShowSyllables(!showSyllables)}
            className="text-zen-shadow dark:text-zen-mist hover:text-zen-black dark:hover:text-zen-white transition-colors focus:outline-none"
          >
            Structure: {formatSyllableInfo(syllableInfo)}
            {isValidStructure ? ' ✓' : ' ⚠️'}
          </button>
        </div>

        {showSyllables && (
          <div className="mt-3 text-xs text-zen-shadow dark:text-zen-mist animate-fade-in">
            {haiku.lines.map((line, index) => {
              const expected = index === 1 ? 7 : 5;
              const actual = syllableInfo[index];
              const display = getSyllableDisplay(expected, actual);
              
              return (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="truncate mr-2">{line}</span>
                  <span className={`font-mono ${display.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {display.count} {display.indicator}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Theme and keywords */}
      <div className="mb-6 p-4 bg-zen-mist/50 dark:bg-zen-shadow/50 rounded-lg">
        <div className="text-sm text-zen-shadow dark:text-zen-mist">
          <p><span className="font-medium">Thème:</span> {haiku.theme}</p>
          {haiku.keywords.length > 0 && (
            <p><span className="font-medium">Mots-clés:</span> {haiku.keywords.join(', ')}</p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="zen-button-secondary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Régénérer
          </button>
        )}

        <button
          onClick={copyToClipboard}
          className="zen-button-secondary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copier
        </button>

        {onSave && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="zen-button-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        )}

        {onExportImage && (
          <button
            onClick={handleExport}
            className="zen-button-primary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Exporter
          </button>
        )}
      </div>
    </div>
  );
}