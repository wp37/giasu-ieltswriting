/**
 * API Key Management Service
 * Handles storing and retrieving Gemini API keys from localStorage
 */

const API_KEY_STORAGE_KEY = 'gemini_api_key';
const MODEL_STORAGE_KEY = 'selected_model';

export const apiKeyService = {
  /**
   * Save API key to localStorage
   * @param {string} apiKey - The Gemini API key
   */
  saveApiKey(apiKey) {
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
      return true;
    } catch (error) {
      console.error('Failed to save API key:', error);
      return false;
    }
  },

  /**
   * Get API key from localStorage
   * @returns {string|null} The stored API key or null
   */
  getApiKey() {
    try {
      return localStorage.getItem(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to get API key:', error);
      return null;
    }
  },

  /**
   * Remove API key from localStorage
   */
  removeApiKey() {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to remove API key:', error);
      return false;
    }
  },

  /**
   * Check if API key exists
   * @returns {boolean}
   */
  hasApiKey() {
    return !!this.getApiKey();
  },

  /**
   * Save selected model to localStorage
   * @param {string} model - The selected model name
   */
  saveSelectedModel(model) {
    try {
      localStorage.setItem(MODEL_STORAGE_KEY, model);
      return true;
    } catch (error) {
      console.error('Failed to save selected model:', error);
      return false;
    }
  },

  /**
   * Get selected model from localStorage
   * @returns {string} The selected model or default
   */
  getSelectedModel() {
    try {
      return localStorage.getItem(MODEL_STORAGE_KEY) || 'gemini-3-flash-preview';
    } catch (error) {
      console.error('Failed to get selected model:', error);
      return 'gemini-3-flash-preview';
    }
  }
};
