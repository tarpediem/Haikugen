import type { HaikuGenerationRequest, HaikuGenerationResponse } from '../types/haiku';
import { validateHaikuStructure } from '../utils/syllableCounter';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Recommended models for creative generation
const RECOMMENDED_MODELS = [
  'anthropic/claude-3-haiku',
  'openai/gpt-4-turbo',
  'anthropic/claude-3-sonnet',
  'openai/gpt-3.5-turbo'
];

/**
 * OpenRouter service for generating haikus using AI
 */
export class OpenRouterService {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_OPENROUTER_API_KEY || '';
    this.model = model || RECOMMENDED_MODELS[0];
  }

  /**
   * Update API configuration
   */
  updateConfig(apiKey: string, model?: string): void {
    this.apiKey = apiKey;
    if (model) {
      this.model = model;
    }
  }

  /**
   * Generate system prompt for haiku creation
   */
  private createSystemPrompt(): string {
    return `Tu es un maître poète japonais expert en création de haïkus authentiques.

RÈGLES ABSOLUES - AUCUNE EXCEPTION:
1. STRUCTURE OBLIGATOIRE: exactement 5-7-5 syllabes
   - Ligne 1: EXACTEMENT 5 syllabes
   - Ligne 2: EXACTEMENT 7 syllabes  
   - Ligne 3: EXACTEMENT 5 syllabes

2. COMPTAGE DES SYLLABES EN FRANÇAIS:
   - Compter chaque voyelle ou groupe de voyelles = 1 syllabe
   - "eau" = 1 syllabe, "oi" = 1 syllabe, "ion" = 1 syllabe
   - "e" muet en fin de mot ne compte PAS
   - Exemple: "so-leil" = 2 syllabes, "fleur" = 1 syllabe

3. STRUCTURE TRADITIONNELLE:
   - Ligne 1: Image ou situation (présent)
   - Ligne 2: Action ou développement (présent)
   - Ligne 3: Révélation ou contraste (souvent passé/futur)

4. STYLE HAÏKU:
   - Pas de métaphores complexes
   - Images simples et directes
   - Éviter "le", "la", "les" quand possible
   - Pas de rimes
   - Capturer un instant précis

EXEMPLES PARFAITS:
Cerf dans le bois (5)
Branche qui craque sous mes pas (7)
Il a disparu (5)

VÉRIFICATION OBLIGATOIRE:
Compte tes syllabes AVANT de répondre. Si ce n'est pas 5-7-5, recommence.

Réponds UNIQUEMENT avec les 3 lignes du haïku, rien d'autre.`;
  }

  /**
   * Create user prompt with theme and keywords
   */
  private createUserPrompt(request: HaikuGenerationRequest): string {
    const theme = request.customTheme || request.theme;
    const keywordsText = request.keywords.join(', ');
    
    return `Thème: "${theme}"
Mots-clés à intégrer naturellement: ${keywordsText}

INSTRUCTIONS CRUCIALES:
1. Compte chaque syllabe: so-leil = 2, fleur = 1, beau = 1
2. Structure: 5 syllabes / 7 syllabes / 5 syllabes
3. Évite les articles inutiles
4. Capture un moment précis lié au thème
5. Intègre les mots-clés de façon poétique

VÉRIFIE: Compte tes syllabes ligne par ligne AVANT de répondre.
Format de réponse: 3 lignes seulement, pas de commentaire.`;
  }

  /**
   * Parse AI response to extract haiku lines
   */
  private parseHaikuResponse(response: string): [string, string, string] | null {
    const lines = response.trim().split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length >= 3) {
      return [
        lines[0].trim(),
        lines[1].trim(),
        lines[2].trim()
      ];
    }
    
    return null;
  }

  /**
   * Generate haiku with retry mechanism
   */
  async generateHaiku(request: HaikuGenerationRequest, retries = 2): Promise<HaikuGenerationResponse> {
    if (!this.apiKey) {
      return {
        haiku: { lines: ['', '', ''], theme: request.theme, keywords: request.keywords, syllables: [0, 0, 0] },
        success: false,
        error: 'Clé API OpenRouter non configurée'
      };
    }

    try {
      const systemPrompt = this.createSystemPrompt();
      const userPrompt = this.createUserPrompt(request);

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Haikugen - AI Haiku Generator'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: 150,
          top_p: 0.9,
          frequency_penalty: 0.5,
          presence_penalty: 0.3
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Provide more specific error messages
        let errorMessage = 'Erreur inconnue';
        
        if (response.status === 401) {
          errorMessage = 'Clé API invalide. Vérifiez votre configuration OpenRouter.';
        } else if (response.status === 403) {
          errorMessage = 'Accès refusé. Vérifiez les permissions de votre clé API.';
        } else if (response.status === 429) {
          errorMessage = 'Limite de requêtes atteinte. Veuillez patienter avant de réessayer.';
        } else if (response.status >= 500) {
          errorMessage = 'Erreur serveur OpenRouter. Veuillez réessayer plus tard.';
        } else if (errorData.error?.message) {
          errorMessage = `Erreur API: ${errorData.error.message}`;
        }
        
        throw new Error(`${errorMessage} (Code: ${response.status})`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Réponse vide de l\'API');
      }

      const haikuLines = this.parseHaikuResponse(content);
      
      if (!haikuLines) {
        throw new Error('Format de haïku invalide');
      }

      // Validate syllable structure
      const validation = validateHaikuStructure(haikuLines);
      
      // If structure is invalid and we have retries left, try again
      if (!validation.isValid && retries > 0) {
        console.warn(`Structure de haïku invalide (${validation.syllables.join('-')}), nouvelle tentative...`, validation.errors);
        
        // Add more specific instructions for retry
        const retryRequest = {
          ...request,
          customTheme: `${request.customTheme || request.theme} - ATTENTION: Le haïku précédent avait ${validation.syllables.join('-')} syllabes au lieu de 5-7-5. Compte TRÈS attentivement chaque syllabe.`
        };
        
        return this.generateHaiku(retryRequest, retries - 1);
      }

      return {
        haiku: {
          lines: haikuLines,
          theme: request.customTheme || request.theme,
          keywords: request.keywords,
          syllables: validation.syllables
        },
        success: true
      };

    } catch (error) {
      console.error('Erreur génération haïku:', error);
      
      const errorMessage = (error as Error).message;
      let userFriendlyMessage = errorMessage;
      
      // Provide more specific error messages for common issues
      if (errorMessage.includes('CORS')) {
        userFriendlyMessage = 'Erreur CORS: L\'API OpenRouter ne peut pas être contactée depuis le navigateur. Utilisez un proxy ou configurez CORS.';
      } else if (errorMessage.includes('fetch')) {
        userFriendlyMessage = 'Erreur de connexion: Impossible de contacter l\'API OpenRouter. Vérifiez votre connexion internet.';
      } else if (errorMessage.includes('Failed to fetch')) {
        userFriendlyMessage = 'Erreur réseau: L\'API OpenRouter n\'est pas accessible. Vérifiez votre connexion ou réessayez plus tard.';
      } else if (errorMessage.includes('timeout')) {
        userFriendlyMessage = 'Délai d\'attente dépassé: L\'API OpenRouter met trop de temps à répondre.';
      }
      
      // If we have retries left and it's a network error, try again
      if (retries > 0 && (errorMessage.includes('fetch') || errorMessage.includes('timeout') || errorMessage.includes('CORS'))) {
        console.warn(`Tentative de nouvelle requête (${retries} essais restants)`);
        return this.generateHaiku(request, retries - 1);
      }

      return {
        haiku: { lines: ['', '', ''], theme: request.theme, keywords: request.keywords, syllables: [0, 0, 0] },
        success: false,
        error: userFriendlyMessage
      };
    }
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const testRequest: HaikuGenerationRequest = {
        theme: 'test',
        keywords: ['test']
      };
      
      const result = await this.generateHaiku(testRequest, 0);
      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get available models
   */
  getAvailableModels(): string[] {
    return [...RECOMMENDED_MODELS];
  }

  /**
   * Switch model
   */
  setModel(model: string): void {
    this.model = model;
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();