import { useState } from 'react';
import WordInput from './WordInput';
import ThemeInput from './ThemeInput';
import type { HaikuFormData } from '../types/haiku';

interface HaikuFormProps {
  onSubmit: (data: HaikuFormData) => void;
  onDemoSubmit?: (data: HaikuFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<HaikuFormData>;
  showDemoOption?: boolean;
}

export default function HaikuForm({
  onSubmit,
  onDemoSubmit,
  isLoading = false,
  initialData = {},
  showDemoOption = false
}: HaikuFormProps) {
  const [formData, setFormData] = useState<HaikuFormData>({
    keywords: initialData.keywords || [],
    theme: initialData.theme || '',
    customTheme: initialData.customTheme || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof HaikuFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof HaikuFormData, string>> = {};

    // Validate keywords
    if (formData.keywords.length === 0) {
      newErrors.keywords = 'Au moins un mot-clé est requis';
    } else if (formData.keywords.length > 5) {
      newErrors.keywords = 'Maximum 5 mots-clés autorisés';
    }

    // Validate theme
    if (!formData.theme && !formData.customTheme) {
      newErrors.theme = 'Un thème est requis';
    } else if (formData.theme === 'custom' && !formData.customTheme.trim()) {
      newErrors.customTheme = 'Le thème personnalisé ne peut pas être vide';
    } else if (formData.customTheme && formData.customTheme.length < 3) {
      newErrors.customTheme = 'Le thème doit contenir au moins 3 caractères';
    } else if (formData.customTheme && formData.customTheme.length > 200) {
      newErrors.customTheme = 'Le thème ne peut pas dépasser 200 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateFormData = (updates: Partial<HaikuFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear related errors when fields are updated
    if (updates.keywords !== undefined) {
      setErrors(prev => ({ ...prev, keywords: undefined }));
    }
    if (updates.theme !== undefined) {
      setErrors(prev => ({ ...prev, theme: undefined }));
    }
    if (updates.customTheme !== undefined) {
      setErrors(prev => ({ ...prev, customTheme: undefined }));
    }
  };

  const isFormValid = formData.keywords.length > 0 && 
                    (formData.theme || formData.customTheme) &&
                    !(formData.theme === 'custom' && !formData.customTheme.trim());

  const handleQuickStart = () => {
    const quickData: HaikuFormData = {
      keywords: ['nature', 'paix'],
      theme: 'Nature',
      customTheme: ''
    };
    setFormData(quickData);
  };

  return (
    <div className="zen-card p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-medium text-zen-black dark:text-zen-white mb-2">
          Créer un haïku
        </h2>
        <p className="text-zen-shadow dark:text-zen-mist text-sm">
          Laissez-vous inspirer par vos mots et votre thème pour créer un haïku unique
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Keywords Section */}
        <div>
          <WordInput
            keywords={formData.keywords}
            onKeywordsChange={(keywords) => updateFormData({ keywords })}
            disabled={isLoading}
          />
          {errors.keywords && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.keywords}
            </p>
          )}
        </div>

        {/* Theme Section */}
        <div>
          <ThemeInput
            theme={formData.theme}
            customTheme={formData.customTheme}
            onThemeChange={(theme) => updateFormData({ theme })}
            onCustomThemeChange={(customTheme) => updateFormData({ customTheme })}
            disabled={isLoading}
          />
          {errors.theme && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.theme}
            </p>
          )}
          {errors.customTheme && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.customTheme}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`
              zen-button-primary flex-1 flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
            `}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Génération...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Créer le haïku
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleQuickStart}
            disabled={isLoading}
            className="zen-button-secondary flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Exemple rapide
          </button>

          {showDemoOption && onDemoSubmit && (
            <button
              type="button"
              onClick={() => onDemoSubmit(formData)}
              disabled={isLoading || !isFormValid}
              className="zen-button-primary flex items-center justify-center gap-2 bg-gradient-to-r from-zen-vermillion to-red-500 hover:from-zen-vermillion/90 hover:to-red-500/90"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-9a3 3 0 110 6M7 10a3 3 0 110 6m3 4a8.001 8.001 0 01-8-8 8.001 8.001 0 0116 0 8.003 8.003 0 01-8 8z" />
              </svg>
              Mode démo
            </button>
          )}
        </div>

        {/* Form Status */}
        {formData.keywords.length === 0 && formData.theme === '' && (
          <div className="p-4 bg-zen-mist/30 dark:bg-zen-shadow/30 rounded-lg">
            <p className="text-sm text-zen-shadow dark:text-zen-mist">
              💡 <strong>Astuce:</strong> Commencez par ajouter quelques mots-clés qui vous inspirent, 
              puis choisissez un thème qui résonne avec votre humeur du moment.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}