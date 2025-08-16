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
   * Generate system prompt for haiku creation
   */
  private createSystemPrompt(): string {
    return `Tu es un maître poète spécialisé dans la création de haïkus traditionnels japonais.

Règles strictes à respecter:
1. Structure exacte: 5 syllabes (ligne 1), 7 syllabes (ligne 2), 5 syllabes (ligne 3)
2. Incorporer les mots-clés fournis de manière naturelle et poétique
3. Respecter le thème choisi avec subtilité
4. Capturer un moment précis, une émotion ou une observation
5. Utiliser des images concrètes et sensorielles
6. Éviter les rimes forcées
7. Créer une césure ou un tournant surprenant entre les lignes
8. Répondre UNIQUEMENT avec les 3 lignes du haïku, séparées par des retours à la ligne
9. Pas d'explication, pas de commentaire, juste le haïku

Le haïku doit être en français et respecter parfaitement la structure 5-7-5 syllabes.`;
  }

  /**
   * Create user prompt with theme and keywords
   */
  private createUserPrompt(request: HaikuGenerationRequest): string {
    const theme = request.customTheme || request.theme;
    const keywordsText = request.keywords.join(', ');
    
    return `Crée un haïku sur le thème "${theme}" en incorporant ces mots-clés: ${keywordsText}

Rappel de la structure requise:
- Ligne 1: exactement 5 syllabes
- Ligne 2: exactement 7 syllabes  
- Ligne 3: exactement 5 syllabes

Réponds uniquement avec le haïku, rien d'autre.`;
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
          'X-Title': 'Haiku Generator'
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
        throw new Error(`API Error ${response.status}: ${errorData.error?.message || 'Erreur inconnue'}`);
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
        console.warn('Structure de haïku invalide, nouvelle tentative...', validation.errors);
        return this.generateHaiku(request, retries - 1);
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
      
      // If we have retries left and it's a network error, try again
      if (retries > 0 && (error as Error).message.includes('fetch')) {
        return this.generateHaiku(request, retries - 1);
      }

      return {
        haiku: { lines: ['', '', ''], theme: request.theme, keywords: request.keywords, syllables: [0, 0, 0] },
        success: false,
        error: (error as Error).message
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