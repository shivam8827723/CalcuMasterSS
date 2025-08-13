
"use client"
import { useState, useEffect, useCallback } from 'react';
import { calculatorCategories, type CalculatorInfo } from '@/lib/calculator-config';

const STORAGE_KEY = 'calcuMasterFavorites';

// Re-construct the icon components from their names
const allCalculators = calculatorCategories.flatMap(category => category.calculators);

const getCalculatorByPath = (path: string): CalculatorInfo | undefined => {
  return allCalculators.find(calc => calc.path === path);
};

const listeners: Array<(state: CalculatorInfo[]) => void> = [];

let memoryState: CalculatorInfo[] = [];

function dispatch(newState: CalculatorInfo[]) {
  memoryState = newState;
  listeners.forEach((listener) => {
    listener(memoryState);
  });
  try {
    const favoritePaths = newState.map(fav => fav.path);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritePaths));
  } catch (error) {
    console.error("Could not save favorites to localStorage", error);
  }
}

let isInitialized = false;

function initializeState() {
  if (isInitialized) return;
  try {
    const storedFavorites = localStorage.getItem(STORAGE_KEY);
    if (storedFavorites) {
      const favoritePaths: string[] = JSON.parse(storedFavorites);
      const favoriteCalculators = favoritePaths
        .map(path => getCalculatorByPath(path))
        .filter((calc): calc is CalculatorInfo => !!calc);
      memoryState = favoriteCalculators;
    }
  } catch (error) {
    console.error("Could not load favorites from localStorage", error);
  }
  isInitialized = true;
}


export function useFavorites() {
  const [favorites, setFavorites] = useState<CalculatorInfo[]>(memoryState);
  
  useEffect(() => {
    initializeState();
    setFavorites(memoryState);

    listeners.push(setFavorites);
    return () => {
      const index = listeners.indexOf(setFavorites);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);


  const addFavorite = useCallback((calculator: CalculatorInfo) => {
    const newFavorites = [...memoryState, calculator];
    dispatch(newFavorites);
  }, []);

  const removeFavorite = useCallback((calculatorPath: string) => {
    const newFavorites = memoryState.filter(fav => fav.path !== calculatorPath);
    dispatch(newFavorites);
  }, []);

  const isFavorite = useCallback((calculatorPath: string) => {
    return memoryState.some(fav => fav.path === calculatorPath);
  }, [memoryState]);

  return { favorites, addFavorite, removeFavorite, isFavorite, isInitialized: true };
}
