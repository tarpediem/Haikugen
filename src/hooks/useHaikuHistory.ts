import { useState, useEffect } from 'react';
import type { Haiku } from '../types/haiku';

const STORAGE_KEY = 'haiku-history';
const MAX_HISTORY_SIZE = 50;

export function useHaikuHistory() {
  const [history, setHistory] = useState<Haiku[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedHistory = JSON.parse(saved);
        // Convert date strings back to Date objects
        const historyWithDates = parsedHistory.map((haiku: Omit<Haiku, 'createdAt'> & { createdAt: string }) => ({
          ...haiku,
          createdAt: new Date(haiku.createdAt)
        }));
        setHistory(historyWithDates);
      }
    } catch (error) {
      console.warn('Failed to load haiku history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save haiku history:', error);
    }
  }, [history]);

  const addToHistory = (haiku: Omit<Haiku, 'id' | 'createdAt'>) => {
    const newHaiku: Haiku = {
      ...haiku,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    setHistory(prev => {
      const updated = [newHaiku, ...prev];
      // Keep only the most recent entries
      return updated.slice(0, MAX_HISTORY_SIZE);
    });

    return newHaiku;
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(haiku => haiku.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getRecentKeywords = (limit = 10): string[] => {
    const allKeywords = history
      .flatMap(haiku => haiku.keywords)
      .filter((keyword, index, arr) => arr.indexOf(keyword) === index); // unique
    
    return allKeywords.slice(0, limit);
  };

  const getRecentThemes = (limit = 10): string[] => {
    const allThemes = history
      .map(haiku => haiku.theme)
      .filter((theme, index, arr) => arr.indexOf(theme) === index); // unique
    
    return allThemes.slice(0, limit);
  };

  const findByTheme = (theme: string): Haiku[] => {
    return history.filter(haiku => 
      haiku.theme.toLowerCase().includes(theme.toLowerCase())
    );
  };

  const findByKeyword = (keyword: string): Haiku[] => {
    return history.filter(haiku =>
      haiku.keywords.some(k => 
        k.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getRecentKeywords,
    getRecentThemes,
    findByTheme,
    findByKeyword
  };
}