import { useState, useEffect } from 'react';
import { openRouterService } from '../services/openrouter';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModelInfo {
  id: string;
  name?: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt?: string;
    completion?: string;
  };
}

interface AppSettings {
  apiKey: string;
  selectedModel: string;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    selectedModel: 'anthropic/claude-3-haiku'
  });
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('haikugen-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        // Update the service with saved settings
        if (parsed.apiKey) {
          openRouterService.updateConfig(parsed.apiKey, parsed.selectedModel);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (settings.apiKey || settings.selectedModel !== 'anthropic/claude-3-haiku') {
      localStorage.setItem('haikugen-settings', JSON.stringify(settings));
      if (settings.apiKey) {
        openRouterService.updateConfig(settings.apiKey, settings.selectedModel);
      }
    }
  }, [settings.apiKey, settings.selectedModel]);

  const fetchAvailableModels = async () => {
    if (!settings.apiKey) {
      setConnectionStatus({
        success: false,
        message: 'Veuillez d\'abord saisir votre clé API'
      });
      return;
    }

    setIsLoadingModels(true);
    setConnectionStatus({});

    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter for models suitable for creative text generation
      const creativeModels = data.data?.filter((model: ModelInfo) => 
        model.id.includes('claude') || 
        model.id.includes('gpt') || 
        model.id.includes('gemini') ||
        model.id.includes('llama') ||
        model.id.includes('mistral')
      ) || [];

      setAvailableModels(creativeModels);
      setConnectionStatus({
        success: true,
        message: `${creativeModels.length} modèles chargés avec succès`
      });
    } catch (error) {
      console.error('Error fetching models:', error);
      setConnectionStatus({
        success: false,
        message: `Erreur: ${(error as Error).message}`
      });
      // Fallback to recommended models
      setAvailableModels([
        { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
        { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
        { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
        { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
        { id: 'openai/gpt-4o', name: 'GPT-4o' },
        { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
      ]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const testConnection = async () => {
    if (!settings.apiKey) {
      setConnectionStatus({
        success: false,
        message: 'Veuillez saisir votre clé API'
      });
      return;
    }

    setTestingConnection(true);
    setConnectionStatus({});

    try {
      const result = await openRouterService.testConnection();
      setConnectionStatus({
        success: result.success,
        message: result.success 
          ? 'Connexion réussie !' 
          : `Erreur: ${result.error}`
      });
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: `Erreur de test: ${(error as Error).message}`
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, apiKey: e.target.value }));
    setConnectionStatus({}); // Clear status when API key changes
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({ ...prev, selectedModel: e.target.value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="zen-card max-w-2xl w-full mx-4 p-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-semibold text-zen-black">
            Paramètres
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zen-shadow hover:text-zen-black transition-colors rounded-lg hover:bg-zen-mist/50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* API Key Section */}
        <div className="space-y-3 mb-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-zen-black mb-1">
              Clé API OpenRouter
            </label>
            <input
              type="password"
              id="apiKey"
              value={settings.apiKey}
              onChange={handleApiKeyChange}
              placeholder="sk-or-v1-..."
              className="w-full px-3 py-2 border border-zen-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-zen-vermillion/50 focus:border-zen-vermillion text-sm"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-zen-shadow">
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zen-vermillion hover:underline"
                >
                  Obtenir une clé API →
                </a>
              </p>
              
              {/* Action buttons inline */}
              <div className="flex items-center gap-2">
                <button
                  onClick={testConnection}
                  disabled={testingConnection || !settings.apiKey}
                  className="px-2 py-1 bg-zen-vermillion text-white rounded text-xs hover:bg-zen-vermillion/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {testingConnection ? 'Test...' : '🔍 Tester'}
                </button>
                
                <button
                  onClick={fetchAvailableModels}
                  disabled={isLoadingModels || !settings.apiKey}
                  className="px-2 py-1 bg-zen-sage text-white rounded text-xs hover:bg-zen-sage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoadingModels ? 'Chargement...' : '📡 Modèles'}
                </button>
              </div>
            </div>
          </div>

          {/* Connection Status - Compact */}
          {connectionStatus.message && (
            <div className={`p-2 rounded text-xs ${
              connectionStatus.success 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {connectionStatus.message}
            </div>
          )}
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-zen-black mb-1">
              Modèle d'IA
            </label>
            <select
              id="model"
              value={settings.selectedModel}
              onChange={handleModelChange}
              className="w-full px-3 py-2 border border-zen-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-zen-vermillion/50 focus:border-zen-vermillion text-sm"
            >
              {availableModels.length > 0 ? (
                availableModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name || model.id}
                    {model.context_length && ` (${model.context_length.toLocaleString()} tokens)`}
                  </option>
                ))
              ) : (
                <>
                  <option value="anthropic/claude-3-haiku">Claude 3 Haiku (Rapide)</option>
                  <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet (Équilibré)</option>
                  <option value="anthropic/claude-3-opus">Claude 3 Opus (Créatif)</option>
                  <option value="openai/gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="openai/gpt-4o">GPT-4o</option>
                  <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </>
              )}
            </select>
            <p className="text-xs text-zen-shadow mt-1">
              {availableModels.length > 0 
                ? `${availableModels.length} modèles disponibles`
                : 'Modèles par défaut - cliquez sur "Charger les modèles" pour voir tous les modèles disponibles'
              }
            </p>
          </div>

          {/* Selected Model Info */}
          {availableModels.length > 0 && (
            <div className="p-3 bg-zen-mist/50 rounded-lg">
              {(() => {
                const selectedModelInfo = availableModels.find(m => m.id === settings.selectedModel);
                if (selectedModelInfo) {
                  return (
                    <div className="text-sm">
                      <p className="font-medium text-zen-black mb-1">
                        {selectedModelInfo.name || selectedModelInfo.id}
                      </p>
                      {selectedModelInfo.description && (
                        <p className="text-zen-shadow mb-2">{selectedModelInfo.description}</p>
                      )}
                      {selectedModelInfo.context_length && (
                        <p className="text-zen-shadow">
                          Contexte: {selectedModelInfo.context_length.toLocaleString()} tokens
                        </p>
                      )}
                      {selectedModelInfo.pricing && (
                        <p className="text-zen-shadow">
                          Prix: {selectedModelInfo.pricing.prompt || 'N/A'} prompt / {selectedModelInfo.pricing.completion || 'N/A'} completion
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-zen-mist">
          <div className="flex justify-between items-center">
            <p className="text-xs text-zen-shadow">
              Les paramètres sont sauvegardés automatiquement dans votre navigateur
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zen-black text-white rounded-lg hover:bg-zen-black/90 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}