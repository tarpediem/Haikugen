export interface Haiku {
  id: string;
  lines: [string, string, string]; // 5-7-5 syllable structure
  theme: string;
  keywords: string[];
  createdAt: Date;
  syllables: [number, number, number];
}

export interface HaikuGenerationRequest {
  theme: string;
  keywords: string[];
  customTheme?: string;
}

export interface HaikuGenerationResponse {
  haiku: Omit<Haiku, 'id' | 'createdAt'>;
  success: boolean;
  error?: string;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  isCustom: boolean;
  usageCount: number;
  lastUsed: Date;
}

export interface UserPreferences {
  darkMode: boolean;
  favoriteThemes: string[];
  recentKeywords: string[];
  language: 'en' | 'fr' | 'jp';
}

export interface HaikuFormData {
  keywords: string[];
  theme: string;
  customTheme: string;
}