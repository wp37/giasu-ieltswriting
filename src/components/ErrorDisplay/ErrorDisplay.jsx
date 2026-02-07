import { useState } from 'react';
import './ErrorDisplay.css';

const ErrorDisplay = ({ error, onRetry, currentModel, failedModels = [] }) => {
  const [showDetails, setShowDetails] = useState(false);

  const isResourceExhausted = error && (
    error.includes('429') || 
    error.includes('RESOURCE_EXHAUSTED') ||
    error.includes('QUOTA_EXCEEDED')
  );

  const isAllModelsFailed = failedModels.length >= 3;

  return (
    <div className="error-display">
      <div className={`error-card ${isResourceExhausted ? 'quota-error' : 'general-error'}`}>
        <div className="error-header">
          <div className="error-icon">
            {isResourceExhausted ? '⚠️' : '❌'}
          </div>
          <div className="error-title">
            {isResourceExhausted ? 'Quota Limit Reached' : 'Processing Error'}
          </div>
        </div>

        <div className="error-body">
          <p className="error-message">
            {isResourceExhausted
              ? 'Your API key has reached its quota limit. The system will automatically try alternative models.'
              : 'An error occurred while processing your request.'}
          </p>

          {/* Current Model Info */}
          {currentModel && (
            <div className="model-info">
              <span className="info-label">Current Model:</span>
              <span className="info-value">{currentModel}</span>
            </div>
          )}

          {/* Failed Models List */}
          {failedModels.length > 0 && (
            <div className="failed-models">
              <span className="info-label">Failed Models:</span>
              <ul className="failed-list">
                {failedModels.map((model, index) => (
                  <li key={index}>{model}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Error Details Toggle */}
          <button
            className="details-toggle"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '▼' : '▶'} Show technical details
          </button>

          {showDetails && (
            <div className="error-details">
              <pre>{error}</pre>
            </div>
          )}

          {/* Action Buttons */}
          <div className="error-actions">
            {isAllModelsFailed ? (
              <div className="all-failed-message">
                <p>All available models have been tried.</p>
                <ul className="suggestions">
                  <li>Check your API key quota at <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                  <li>Wait a few minutes and try again</li>
                  <li>Consider using a different API key</li>
                </ul>
              </div>
            ) : (
              <>
                {onRetry && (
                  <button className="btn-retry" onClick={onRetry}>
                    🔄 Retry with Next Model
                  </button>
                )}
              </>
            )}
          </div>

          {/* Help Text */}
          {isResourceExhausted && (
            <div className="help-section">
              <h4>What to do:</h4>
              <ol>
                <li>The system will automatically retry with alternative models</li>
                <li>If all models fail, check your API quota</li>
                <li>You can get a new API key or wait for quota reset</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
