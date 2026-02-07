import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const evaluationService = {
  // Evaluate essay text
  async evaluateEssay({ essay, taskType, taskSubType, topic }) {
    const response = await api.post('/evaluate', {
      essay,
      taskType,
      taskSubType,
      topic
    });
    return response.data;
  },

  // Evaluate uploaded file
  async evaluateFile(file, taskType, taskSubType, topic) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskType', taskType);
    if (taskSubType) formData.append('taskSubType', taskSubType);
    if (topic) formData.append('topic', topic);

    const response = await api.post('/evaluate/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Analyze vocabulary in text
  async analyzeVocabulary(text) {
    const response = await api.post('/analyze-vocab', { text });
    return response.data;
  }
};

export default api;
