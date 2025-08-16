/**
 * Syllable counter utility for validating haiku structure (5-7-5)
 * Supports French syllable counting with basic rules
 */

// French vowel patterns for syllable counting
const VOWELS = 'aeiouyàáâäèéêëìíîïòóôöùúûü';
const VOWEL_GROUPS = [
  'eau', 'eau', 'eaux', // 3-letter first to avoid conflicts
  'ai', 'au', 'eu', 'ou', 'oi', 'ei', 'ay', 'ey', 'oy', 'uy',
  'an', 'en', 'in', 'on', 'un', 'am', 'em', 'im', 'om', 'um',
  'ion', 'tion', 'sion'
];

/**
 * Count syllables in a French word using basic phonetic rules
 */
export function countSyllablesInWord(word: string): number {
  if (!word || word.trim().length === 0) return 0;
  
  let syllableCount = 0;
  const cleanWord = word.toLowerCase().replace(/[^a-züàáâäèéêëìíîïòóôöùúûü]/g, '');
  
  if (cleanWord.length === 0) return 0;
  
  // Handle vowel groups first (longer patterns first)
  let processedWord = cleanWord;
  const sortedGroups = VOWEL_GROUPS.sort((a, b) => b.length - a.length);
  
  for (const group of sortedGroups) {
    const regex = new RegExp(group, 'g');
    const matches = processedWord.match(regex);
    if (matches) {
      syllableCount += matches.length;
      processedWord = processedWord.replace(regex, 'X'.repeat(group.length));
    }
  }
  
  // Count remaining single vowels
  for (let i = 0; i < processedWord.length; i++) {
    if (VOWELS.includes(processedWord[i]) && processedWord[i] !== 'X') {
      syllableCount++;
      // Skip consecutive vowels that aren't already handled
      while (i + 1 < processedWord.length && 
             VOWELS.includes(processedWord[i + 1]) && 
             processedWord[i + 1] !== 'X') {
        i++;
      }
    }
  }
  
  // Handle silent 'e' at the end (French rule)
  if (cleanWord.endsWith('e') && syllableCount > 1) {
    syllableCount--;
  }
  
  // Minimum one syllable per word
  return Math.max(1, syllableCount);
}

/**
 * Count syllables in a line of text
 */
export function countSyllablesInLine(line: string): number {
  if (!line || line.trim().length === 0) return 0;
  
  const words = line.trim().split(/\s+/).filter(word => word.length > 0);
  return words.reduce((total, word) => total + countSyllablesInWord(word), 0);
}

/**
 * Validate if a haiku follows the traditional 5-7-5 syllable structure
 */
export function validateHaikuStructure(lines: [string, string, string]): {
  isValid: boolean;
  syllables: [number, number, number];
  errors: string[];
} {
  const syllables: [number, number, number] = [
    countSyllablesInLine(lines[0]),
    countSyllablesInLine(lines[1]),
    countSyllablesInLine(lines[2])
  ];
  
  const errors: string[] = [];
  
  if (syllables[0] !== 5) {
    errors.push(`Première ligne: ${syllables[0]} syllabes (attendu: 5)`);
  }
  if (syllables[1] !== 7) {
    errors.push(`Deuxième ligne: ${syllables[1]} syllabes (attendu: 7)`);
  }
  if (syllables[2] !== 5) {
    errors.push(`Troisième ligne: ${syllables[2]} syllabes (attendu: 5)`);
  }
  
  return {
    isValid: errors.length === 0,
    syllables,
    errors
  };
}

/**
 * Format syllable validation results for display
 */
export function formatSyllableInfo(syllables: [number, number, number]): string {
  return `${syllables[0]}-${syllables[1]}-${syllables[2]}`;
}

/**
 * Get syllable count with visual indicator
 */
export function getSyllableDisplay(expected: number, actual: number): {
  count: number;
  isCorrect: boolean;
  indicator: string;
} {
  return {
    count: actual,
    isCorrect: actual === expected,
    indicator: actual === expected ? '✓' : '✗'
  };
}