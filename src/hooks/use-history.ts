
"use client"
import { useState, useEffect, useCallback } from 'react';

export type HistoryItem = {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
};

const STORAGE_KEY = 'calcuMasterHistory';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Could not load history from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error("Could not save history to localStorage", error);
      }
    }
  }, [history, isInitialized]);

  const addHistory = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50)); // Keep last 50 entries
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addHistory, clearHistory, isInitialized };
}
