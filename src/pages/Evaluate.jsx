import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, FileText, Send, AlertCircle, Key } from 'lucide-react';
import { evaluationService } from '../services/api';
import { useSubmissionHistory } from '../hooks/useLocalStorage';
import EvaluationPanel from '../components/EvaluationPanel/EvaluationPanel';
import './Evaluate.css';

function Evaluate({ apiKey, onApiKeyChange }) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [taskType, setTaskType] = useState('task2');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');

  const { addSubmission } = useSubmissionHistory();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validTypes = ['text/plain', 'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(droppedFile.type)) {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Invalid file type. Please upload .txt, .docx, or .pdf');
      }
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!text.trim() && !file) {
      setError('Please enter text or upload a file');
      return;
    }

    setIsEvaluating(true);
    setError('');

    try {
      let result;
      if (file) {
        result = await evaluationService.evaluateFile(file, taskType);
      } else {
        result = await evaluationService.evaluateEssay({
          essay: text,
          taskType,
          taskSubType: null,
          topic: ''
        });
      }

      setEvaluation(result.evaluation);

      // Save to history
      addSubmission({
        taskType,
        essay: file ? result.extractedText : text,
        wordCount: result.wordCount,
        evaluation: result.evaluation
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Evaluation failed';
      if (errorMessage.includes('API') || errorMessage.includes('key')) {
        setShowApiKeyInput(true);
      }
      setError(errorMessage);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      onApiKeyChange(tempApiKey.trim());
      setShowApiKeyInput(false);
      setError('');
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  if (evaluation) {
    return (
      <div className="evaluate-page">
        <EvaluationPanel 
          evaluation={evaluation} 
          essay={text}
          wordCount={wordCount}
          taskType={taskType}
          onBack={() => {
            setEvaluation(null);
            setText('');
            setFile(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="evaluate-page">
      <div className="evaluate-container">
        <h1>{t('evaluate.uploadTitle')}</h1>
        <p className="subtitle">{t('evaluate.uploadDesc')}</p>

        {/* API Key Warning/Input */}
        {showApiKeyInput && (
          <div className="api-key-section">
            <div className="api-key-header">
              <Key size={20} />
              <span>OpenAI API Key Required</span>
            </div>
            <div className="api-key-input-group">
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <button onClick={handleSaveApiKey}>Save</button>
            </div>
            <p className="api-key-hint">
              Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Platform</a>
            </p>
          </div>
        )}

        {/* Task Type Selector */}
        <div className="task-selector">
          <label>{t('evaluate.selectTaskType')}</label>
          <div className="task-buttons">
            <button 
              className={taskType === 'task1' ? 'active' : ''}
              onClick={() => setTaskType('task1')}
            >
              Task 1 (150+ words)
            </button>
            <button 
              className={taskType === 'task2' ? 'active' : ''}
              onClick={() => setTaskType('task2')}
            >
              Task 2 (250+ words)
            </button>
          </div>
        </div>

        {/* File Upload Area */}
        <div 
          className={`upload-area ${file ? 'has-file' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            id="file-upload"
            accept=".txt,.docx,.pdf"
            onChange={handleFileChange}
            hidden
          />
          <label htmlFor="file-upload" className="upload-label">
            {file ? (
              <>
                <FileText size={40} />
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
              </>
            ) : (
              <>
                <Upload size={40} />
                <span>{t('evaluate.dragDrop')}</span>
                <span className="supported-formats">.txt, .docx, .pdf</span>
              </>
            )}
          </label>
        </div>

        {/* OR Divider */}
        <div className="divider">
          <span>{t('evaluate.orPaste')}</span>
        </div>

        {/* Text Input Area */}
        <div className="text-input-section">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('evaluate.pasteHere')}
            rows={10}
          />
          <div className="word-count">
            {wordCount} words
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button 
          className="submit-btn"
          onClick={handleSubmit}
          disabled={isEvaluating || (!text.trim() && !file)}
        >
          <Send size={20} />
          {isEvaluating ? t('evaluate.evaluating') : t('evaluate.evaluateBtn')}
        </button>
      </div>
    </div>
  );
}

export default Evaluate;
