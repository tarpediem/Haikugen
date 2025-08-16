import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';

interface WordInputProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  maxKeywords?: number;
  placeholder?: string;
  disabled?: boolean;
}

export default function WordInput({ 
  keywords, 
  onKeywordsChange, 
  maxKeywords = 5,
  placeholder = "Ajoutez des mots-clés (max 5)...",
  disabled = false
}: WordInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword();
    } else if (e.key === 'Backspace' && inputValue === '' && keywords.length > 0) {
      // Remove last keyword if input is empty and backspace is pressed
      removeKeyword(keywords.length - 1);
    }
  };

  const addKeyword = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && 
        keywords.length < maxKeywords && 
        !keywords.includes(trimmedValue)) {
      onKeywordsChange([...keywords, trimmedValue]);
      setInputValue('');
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    onKeywordsChange(newKeywords);
    inputRef.current?.focus();
  };

  const handleInputChange = (value: string) => {
    // Auto-add on comma
    if (value.includes(',')) {
      const newKeyword = value.replace(',', '').trim();
      if (newKeyword && keywords.length < maxKeywords && !keywords.includes(newKeyword)) {
        onKeywordsChange([...keywords, newKeyword]);
      }
      setInputValue('');
    } else {
      setInputValue(value);
    }
  };

  const canAddMore = keywords.length < maxKeywords;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zen-black dark:text-zen-white">
        Mots-clés
        <span className="text-zen-shadow dark:text-zen-mist text-xs ml-2">
          ({keywords.length}/{maxKeywords})
        </span>
      </label>
      
      <div className="zen-card p-4 min-h-[120px]">
        {/* Keywords display */}
        <div className="flex flex-wrap gap-2 mb-3">
          {keywords.map((keyword, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-zen-vermillion/10 dark:bg-zen-vermillion/20 text-zen-vermillion rounded-full text-sm animate-fade-in"
            >
              <span>{keyword}</span>
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                disabled={disabled}
                className="ml-1 text-zen-vermillion hover:text-zen-vermillion/70 focus:outline-none transition-colors"
                aria-label={`Supprimer ${keyword}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Input field */}
        {canAddMore && (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onBlur={addKeyword}
              placeholder={placeholder}
              disabled={disabled}
              className="zen-input border-none bg-transparent focus:ring-0 focus:border-none p-0 placeholder-zen-shadow/50 dark:placeholder-zen-mist/50"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-zen-shadow dark:text-zen-mist">
              Entrée ou virgule pour ajouter
            </div>
          </div>
        )}

        {!canAddMore && (
          <p className="text-sm text-zen-shadow dark:text-zen-mist italic">
            Limite de {maxKeywords} mots-clés atteinte
          </p>
        )}
      </div>

      {keywords.length === 0 && (
        <p className="text-xs text-zen-shadow dark:text-zen-mist">
          💡 Ajoutez des mots-clés pour inspirer votre haïku. Tapez un mot et appuyez sur Entrée.
        </p>
      )}
    </div>
  );
}