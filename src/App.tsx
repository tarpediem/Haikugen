import { useState } from 'react';
import Header from './components/Header';
import HaikuForm from './components/HaikuForm';
import HaikuDisplay from './components/HaikuDisplay';
import { useHaikuHistory } from './hooks/useHaikuHistory';
import { openRouterService } from './services/openrouter';
import type { Haiku, HaikuFormData } from './types/haiku';

function App() {
  const [currentHaiku, setCurrentHaiku] = useState<Haiku | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const { history, addToHistory } = useHaikuHistory();

  const handleGenerateHaiku = async (formData: HaikuFormData) => {
    setIsGenerating(true);
    setError(null);

    try {
      const request = {
        theme: formData.theme === 'custom' ? formData.customTheme : formData.theme,
        keywords: formData.keywords,
        customTheme: formData.theme === 'custom' ? formData.customTheme : undefined
      };

      const response = await openRouterService.generateHaiku(request);

      if (response.success) {
        const newHaiku = addToHistory(response.haiku);
        setCurrentHaiku(newHaiku);
      } else {
        setError(response.error || 'Erreur lors de la génération du haïku');
      }
    } catch (err) {
      setError('Erreur de connexion. Vérifiez votre connexion internet et votre clé API.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateHaiku = () => {
    if (!currentHaiku) return;
    
    const formData: HaikuFormData = {
      keywords: currentHaiku.keywords,
      theme: currentHaiku.theme,
      customTheme: currentHaiku.theme === 'custom' ? currentHaiku.theme : ''
    };
    
    handleGenerateHaiku(formData);
  };

  const handleSaveHaiku = async (haiku: Haiku) => {
    // Already saved in history, could implement additional save features here
    // like exporting to file, sharing, etc.
    console.log('Haiku saved:', haiku);
  };

  const handleExportImage = (haiku: Haiku) => {
    // Create a simple text export for now
    // In a real implementation, this would generate a beautiful image
    const text = `${haiku.lines.join('\n')}\n\n— ${haiku.theme}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haiku-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zen-white dark:bg-zen-charcoal transition-colors duration-300">
      <Header 
        onShowHistory={() => setShowHistory(!showHistory)}
        historyCount={history.length}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-zen-black dark:text-zen-white mb-4">
            俳句
          </h1>
          <p className="text-lg text-zen-shadow dark:text-zen-mist max-w-2xl mx-auto">
            Créez des haïkus traditionnels japonais avec l'aide de l'intelligence artificielle. 
            Laissez vos mots-clés et votre thème guider l'inspiration poétique.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Column */}
          <div className="space-y-6">
            <HaikuForm
              onSubmit={handleGenerateHaiku}
              isLoading={isGenerating}
            />

            {/* API Key Notice */}
            {!import.meta.env.VITE_OPENROUTER_API_KEY && (
              <div className="zen-card p-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                      Configuration requise
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Pour utiliser le générateur de haïkus, configurez votre clé API OpenRouter 
                      dans le fichier <code>.env</code> avec la variable <code>VITE_OPENROUTER_API_KEY</code>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Display Column */}
          <div>
            <HaikuDisplay
              haiku={currentHaiku}
              isLoading={isGenerating}
              error={error}
              onRegenerate={handleRegenerateHaiku}
              onSave={handleSaveHaiku}
              onExportImage={handleExportImage}
            />
          </div>
        </div>

        {/* History Section */}
        {showHistory && history.length > 0 && (
          <div className="mt-12 animate-fade-in">
            <div className="zen-card p-6">
              <h3 className="text-xl font-serif font-medium text-zen-black dark:text-zen-white mb-4">
                Historique des haïkus
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {history.slice(0, 6).map((haiku) => (
                  <button
                    key={haiku.id}
                    onClick={() => setCurrentHaiku(haiku)}
                    className="text-left p-4 rounded-lg border border-zen-mist dark:border-zen-shadow hover:border-zen-vermillion/50 transition-colors focus:outline-none focus:ring-2 focus:ring-zen-vermillion/50"
                  >
                    <div className="haiku-text text-sm mb-2">
                      {haiku.lines.map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                    <div className="text-xs text-zen-shadow dark:text-zen-mist">
                      {haiku.theme} • {haiku.createdAt.toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-zen-shadow dark:text-zen-mist">
          <div className="zen-divider mb-8"></div>
          <p>
            Créé avec ❤️ pour la beauté de la poésie japonaise traditionnelle
          </p>
          <p className="mt-2">
            Propulsé par <span className="text-zen-vermillion">OpenRouter AI</span>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
