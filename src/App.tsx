import { useState } from 'react';
import Header from './components/Header';
import HaikuForm from './components/HaikuForm';
import HaikuDisplay from './components/HaikuDisplay';
import ZenBackground from './components/ZenBackground';
import Settings from './components/Settings';
import { useHaikuHistory } from './hooks/useHaikuHistory';
import { openRouterService } from './services/openrouter';
import type { Haiku, HaikuFormData } from './types/haiku';

function App() {
  const [currentHaiku, setCurrentHaiku] = useState<Haiku | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const { history, addToHistory } = useHaikuHistory();

  // Demo haiku fallback when API is unavailable
  const generateDemoHaiku = (formData: HaikuFormData): Haiku => {
    const demoHaikus = {
      'Nature': [
        ['Cerisier en fleur', 'Les pétales tombent en danse', 'Printemps éternel'],
        ['Vent dans les bambous', 'Murmure des temps anciens', 'Paix retrouvée'],
        ['Lac sous la brume', 'Reflet des monts endormis', 'Silence d\'aurore'],
        ['Souffle du vent doux', 'Caresse les fleurs des champs', 'Nature en éveil'],
        ['Feuille qui s\'envole', 'Danse avec le vent d\'automne', 'Liberté pure']
      ],
      'Émotions': [
        ['Larme de joie', 'Sur la joue de l\'enfant heureux', 'Bonheur simple'],
        ['Cœur qui s\'envole', 'Vers les étoiles du soir', 'Amour infini'],
        ['Mélancolie', 'Dans le café qui refroidit', 'Solitude douce']
      ],
      'Urbain': [
        ['Néons dans la nuit', 'Reflets sur l\'asphalte mouillé', 'Ville qui respire'],
        ['Métro du matin', 'Visages anonymes pressés', 'Humanité vive'],
        ['Gratte-ciel debout', 'Touchent les nuages gris', 'Rêves verticaux']
      ],
      'Saisons': [
        ['Feuilles d\'automne', 'Dansent sur le vent frisquet', 'Temps qui s\'enfuit'],
        ['Neige silencieuse', 'Couvre le monde endormi', 'Hiver cristallin'],
        ['Bourgeon timide', 'Perce la terre réchauffée', 'Vie qui renaît']
      ]
    };

    const themeKey = formData.theme as keyof typeof demoHaikus;
    const haikuOptions = demoHaikus[themeKey] || demoHaikus['Nature'];
    const selectedHaiku = haikuOptions[Math.floor(Math.random() * haikuOptions.length)];
    
    return {
      lines: selectedHaiku,
      theme: formData.theme === 'custom' ? formData.customTheme || 'Personnalisé' : formData.theme,
      keywords: formData.keywords,
      syllables: [5, 7, 5], // Demo haikus are pre-validated
      id: Date.now().toString(),
      createdAt: new Date()
    };
  };

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
        // If API fails, offer demo mode
        const errorMsg = response.error || 'Erreur lors de la génération du haïku';
        setError(`${errorMsg}\n\n💡 Voulez-vous essayer le mode démo ?`);
      }
    } catch (err) {
      // If connection fails, offer demo mode
      const errorMessage = (err as Error).message;
      let userMessage = 'Erreur de connexion avec l\'API OpenRouter.';
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS')) {
        userMessage = 'Impossible de contacter l\'API OpenRouter. Cela peut être dû à des restrictions CORS.';
      }
      
      setError(`${userMessage}\n\n💡 Voulez-vous essayer le mode démo avec des haïkus pré-générés ?`);
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDemoGenerate = (formData: HaikuFormData) => {
    setIsGenerating(true);
    setError(null);
    
    // Simulate API delay for better UX
    setTimeout(() => {
      const demoHaiku = generateDemoHaiku(formData);
      const newHaiku = addToHistory(demoHaiku);
      setCurrentHaiku(newHaiku);
      setIsGenerating(false);
    }, 1000);
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
    <div className="min-h-screen relative overflow-hidden bg-zen-white text-zen-black">
      {/* Zen Background Animations */}
      <ZenBackground />
      
      <Header 
        onShowHistory={() => setShowHistory(!showHistory)}
        historyCount={history.length}
        onShowSettings={() => setShowSettings(true)}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-zen-black mb-4">
            俳句
          </h1>
          <p className="text-lg text-zen-shadow max-w-2xl mx-auto">
            Créez des haïkus traditionnels japonais avec l'aide de l'intelligence artificielle. 
            Laissez vos mots-clés et votre thème guider l'inspiration poétique.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Column */}
          <div className="space-y-6">
            <HaikuForm
              onSubmit={handleGenerateHaiku}
              onDemoSubmit={handleDemoGenerate}
              isLoading={isGenerating}
              showDemoOption={!!error}
            />

            {/* API Key Notice */}
            {!import.meta.env.VITE_OPENROUTER_API_KEY && (
              <div className="zen-card p-4 border-amber-200 bg-amber-50">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">
                      Configuration requise
                    </h4>
                    <p className="text-sm text-amber-700">
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
              onDemoMode={() => {
                // Use last form data for demo mode
                if (currentHaiku) {
                  const formData = {
                    keywords: currentHaiku.keywords,
                    theme: currentHaiku.theme,
                    customTheme: ''
                  };
                  handleDemoGenerate(formData);
                } else {
                  // Default demo data
                  handleDemoGenerate({
                    keywords: ['nature'],
                    theme: 'Nature',
                    customTheme: ''
                  });
                }
              }}
            />
          </div>
        </div>

        {/* History Section */}
        {showHistory && history.length > 0 && (
          <div className="mt-12 animate-fade-in">
            <div className="zen-card p-6">
              <h3 className="text-xl font-serif font-medium text-zen-black mb-4">
                Historique des haïkus
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {history.slice(0, 6).map((haiku) => (
                  <button
                    key={haiku.id}
                    onClick={() => setCurrentHaiku(haiku)}
                    className="text-left p-4 rounded-lg border border-zen-mist hover:border-zen-vermillion/50 transition-colors focus:outline-none focus:ring-2 focus:ring-zen-vermillion/50"
                  >
                    <div className="haiku-text text-sm mb-2">
                      {haiku.lines.map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                    <div className="text-xs text-zen-shadow">
                      {haiku.theme} • {haiku.createdAt.toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-zen-shadow">
          <div className="zen-divider mb-8"></div>
          <p>
            Créé avec ❤️ pour la beauté de la poésie japonaise traditionnelle
          </p>
          <p className="mt-2">
            Propulsé par <span className="text-zen-vermillion">OpenRouter AI</span>
          </p>
        </footer>
      </main>

      {/* Settings Modal */}
      <Settings 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

export default App;
