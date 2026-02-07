import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Wrapper function to update state
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Error in setValue for key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Hook specifically for submission history
export function useSubmissionHistory() {
  const [history, setHistory, clearHistory] = useLocalStorage('ielts_history', []);

  const addSubmission = useCallback((submission) => {
    const newSubmission = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...submission
    };
    setHistory(prev => [newSubmission, ...prev].slice(0, 50)); // Keep last 50
    return newSubmission;
  }, [setHistory]);

  const removeSubmission = useCallback((id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, [setHistory]);

  const getSubmission = useCallback((id) => {
    return history.find(item => item.id === id);
  }, [history]);

  return {
    history,
    addSubmission,
    removeSubmission,
    getSubmission,
    clearHistory
  };
}

export default useLocalStorage;
