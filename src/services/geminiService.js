/**
 * Gemini AI Service with Fallback Mechanism
 * Supports automatic retry with fallback models
 */

const MODELS = {
  PRIMARY: 'gemini-3-pro-preview',
  FALLBACK_1: 'gemini-3-flash-preview',
  FALLBACK_2: 'gemini-2.5-flash'
};

const MODEL_ORDER = [
  MODELS.FALLBACK_1, // Default
  MODELS.PRIMARY,
  MODELS.FALLBACK_2
];

class GeminiService {
  constructor() {
    this.currentModelIndex = 0;
    this.apiKey = null;
  }

  /**
   * Set API key for the service
   * @param {string} apiKey - The Gemini API key
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Get current model
   * @returns {string}
   */
  getCurrentModel() {
    return MODEL_ORDER[this.currentModelIndex];
  }

  /**
   * Try next fallback model
   * @returns {boolean} - Returns false if no more fallback models
   */
  tryNextModel() {
    if (this.currentModelIndex < MODEL_ORDER.length - 1) {
      this.currentModelIndex++;
      return true;
    }
    return false;
  }

  /**
   * Reset to default model
   */
  resetToDefaultModel() {
    this.currentModelIndex = 0;
  }

  /**
   * Make API call with retry and fallback mechanism
   * @param {string} prompt - The prompt to send
   * @param {object} options - Additional options
   * @returns {Promise<object>} - The API response
   */
  async callWithRetry(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('API key not set. Please configure your Gemini API key.');
    }

    const maxRetries = MODEL_ORDER.length;
    let lastError = null;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const currentModel = this.getCurrentModel();
        console.log(`Attempting API call with model: ${currentModel} (Attempt ${attempt + 1}/${maxRetries})`);

        const response = await this.makeApiCall(currentModel, prompt, options);
        
        // Success - reset to default model for next call
        this.resetToDefaultModel();
        return {
          success: true,
          data: response,
          model: currentModel
        };

      } catch (error) {
        lastError = error;
        console.error(`Error with model ${this.getCurrentModel()}:`, error.message);

        // Check if it's a retryable error
        if (this.isRetryableError(error)) {
          const hasNextModel = this.tryNextModel();
          if (!hasNextModel) {
            break; // No more models to try
          }
          attempt++;
          continue;
        } else {
          // Non-retryable error, throw immediately
          throw error;
        }
      }
    }

    // All models failed
    this.resetToDefaultModel();
    throw new Error(`All models failed. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * Make actual API call to Gemini
   * @param {string} model - Model name
   * @param {string} prompt - The prompt
   * @param {object} options - Additional options
   * @returns {Promise<object>}
   */
  async makeApiCall(model, prompt, options = {}) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.3,
        maxOutputTokens: options.maxTokens || 2000,
        topP: options.topP || 0.95,
        topK: options.topK || 40
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  }

  /**
   * Check if error is retryable
   * @param {Error} error
   * @returns {boolean}
   */
  isRetryableError(error) {
    const retryablePatterns = [
      '429', // Rate limit
      'RESOURCE_EXHAUSTED',
      'QUOTA_EXCEEDED',
      'OVERLOADED',
      'UNAVAILABLE',
      '503',
      '500'
    ];

    const errorMessage = error.message || '';
    return retryablePatterns.some(pattern => 
      errorMessage.includes(pattern)
    );
  }

  /**
   * Evaluate IELTS essay
   * @param {object} params - Evaluation parameters
   * @returns {Promise<object>}
   */
  async evaluateEssay({ essay, taskType, taskSubType, topic, wordCount, systemPrompt }) {
    const prompt = `
SYSTEM INSTRUCTIONS:
${systemPrompt}

TOPIC: ${topic || 'Not provided'}

ESSAY (${wordCount} words):
${essay}

Please evaluate this IELTS ${taskType === 'task1' ? 'Task 1' : 'Task 2'} response according to the official IELTS band descriptors.
Return the response as a valid JSON object with the following structure:
{
  "overallBand": <number>,
  "taskAchievement": {
    "band": <number>,
    "feedback": "<string>"
  },
  "coherenceCohesion": {
    "band": <number>,
    "feedback": "<string>"
  },
  "lexicalResource": {
    "band": <number>,
    "feedback": "<string>",
    "suggestions": ["<string>"]
  },
  "grammaticalRange": {
    "band": <number>,
    "feedback": "<string>",
    "corrections": ["<string>"]
  }
}
`;

    const result = await this.callWithRetry(prompt, {
      temperature: 0.3,
      maxTokens: 2000
    });

    // Parse JSON response
    try {
      let jsonStr = result.data;
      const jsonMatch = result.data.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      
      const evaluation = JSON.parse(jsonStr);
      return {
        ...result,
        data: evaluation
      };
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return {
        ...result,
        data: {
          overallBand: 6.0,
          rawFeedback: result.data,
          parseError: true,
          taskAchievement: { band: 6.0, feedback: 'See detailed feedback below' },
          coherenceCohesion: { band: 6.0, feedback: 'See detailed feedback below' },
          lexicalResource: { band: 6.0, feedback: 'See detailed feedback below', suggestions: [] },
          grammaticalRange: { band: 6.0, feedback: 'See detailed feedback below', corrections: [] }
        }
      };
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Export model constants
export { MODELS, MODEL_ORDER };
