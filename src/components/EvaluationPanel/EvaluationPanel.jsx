import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download, CheckCircle, XCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import './EvaluationPanel.css';

function EvaluationPanel({ evaluation, essay, wordCount, taskType, onBack }) {
  const { t } = useTranslation();

  if (!evaluation) return null;

  const {
    overallBand,
    taskAchievement,
    taskResponse,
    coherenceCohesion,
    lexicalResource,
    grammaticalRange,
    overviewSuggestion,
    thesisSuggestion,
    modelPhrases
  } = evaluation;

  // Use taskAchievement for Task 1, taskResponse for Task 2
  const taskCriteria = taskType === 'task1' ? taskAchievement : taskResponse;
  const taskCriteriaLabel = taskType === 'task1' ? t('evaluation.taskAchievement') : t('evaluation.taskResponse');

  const getBandColor = (band) => {
    if (band >= 7) return 'high';
    if (band >= 5.5) return 'medium';
    return 'low';
  };

  const renderBandBar = (band) => {
    const percentage = (band / 9) * 100;
    return (
      <div className="band-bar">
        <div 
          className={`band-fill ${getBandColor(band)}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="evaluation-panel">
      <div className="evaluation-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>{t('common.back')}</span>
        </button>
        <h2>{t('evaluation.overallBand')}</h2>
        <button className="download-btn">
          <Download size={18} />
          <span>{t('evaluation.downloadPdf')}</span>
        </button>
      </div>

      {/* Overall Score */}
      <div className="overall-score">
        <div className={`score-circle ${getBandColor(overallBand)}`}>
          <span className="score-number">{overallBand}</span>
          <span className="score-label">Band</span>
        </div>
        <div className="score-details">
          <p>Word Count: <strong>{wordCount}</strong></p>
          <p>Task: <strong>{taskType === 'task1' ? 'Task 1' : 'Task 2'}</strong></p>
        </div>
      </div>

      {/* Criteria Breakdown */}
      <div className="criteria-breakdown">
        <h3>Criteria Breakdown</h3>
        
        <div className="criteria-grid">
          {/* Task Achievement/Response */}
          <div className="criteria-item">
            <div className="criteria-header">
              <span className="criteria-name">{taskCriteriaLabel}</span>
              <span className={`criteria-band ${getBandColor(taskCriteria?.band)}`}>
                {taskCriteria?.band || '-'}
              </span>
            </div>
            {renderBandBar(taskCriteria?.band || 0)}
            <p className="criteria-feedback">{taskCriteria?.feedback}</p>
          </div>

          {/* Coherence & Cohesion */}
          <div className="criteria-item">
            <div className="criteria-header">
              <span className="criteria-name">{t('evaluation.coherenceCohesion')}</span>
              <span className={`criteria-band ${getBandColor(coherenceCohesion?.band)}`}>
                {coherenceCohesion?.band || '-'}
              </span>
            </div>
            {renderBandBar(coherenceCohesion?.band || 0)}
            <p className="criteria-feedback">{coherenceCohesion?.feedback}</p>
          </div>

          {/* Lexical Resource */}
          <div className="criteria-item">
            <div className="criteria-header">
              <span className="criteria-name">{t('evaluation.lexicalResource')}</span>
              <span className={`criteria-band ${getBandColor(lexicalResource?.band)}`}>
                {lexicalResource?.band || '-'}
              </span>
            </div>
            {renderBandBar(lexicalResource?.band || 0)}
            <p className="criteria-feedback">{lexicalResource?.feedback}</p>
          </div>

          {/* Grammatical Range */}
          <div className="criteria-item">
            <div className="criteria-header">
              <span className="criteria-name">{t('evaluation.grammaticalRange')}</span>
              <span className={`criteria-band ${getBandColor(grammaticalRange?.band)}`}>
                {grammaticalRange?.band || '-'}
              </span>
            </div>
            {renderBandBar(grammaticalRange?.band || 0)}
            <p className="criteria-feedback">{grammaticalRange?.feedback}</p>
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="feedback-sections">
        {/* Strengths */}
        {(taskCriteria?.strengths || coherenceCohesion?.strengths || lexicalResource?.strengths) && (
          <div className="feedback-section strengths">
            <h3>
              <CheckCircle size={20} />
              {t('evaluation.strengths')}
            </h3>
            <ul>
              {taskCriteria?.strengths?.map((s, i) => <li key={`ta-${i}`}>{s}</li>)}
              {coherenceCohesion?.strengths?.map((s, i) => <li key={`cc-${i}`}>{s}</li>)}
              {lexicalResource?.strengths?.map((s, i) => <li key={`lr-${i}`}>{s}</li>)}
              {grammaticalRange?.strengths?.map((s, i) => <li key={`gr-${i}`}>{s}</li>)}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {(taskCriteria?.improvements || coherenceCohesion?.improvements || lexicalResource?.improvements) && (
          <div className="feedback-section improvements">
            <h3>
              <AlertTriangle size={20} />
              {t('evaluation.improvements')}
            </h3>
            <ul>
              {taskCriteria?.improvements?.map((s, i) => <li key={`ta-${i}`}>{s}</li>)}
              {coherenceCohesion?.improvements?.map((s, i) => <li key={`cc-${i}`}>{s}</li>)}
              {lexicalResource?.improvements?.map((s, i) => <li key={`lr-${i}`}>{s}</li>)}
              {grammaticalRange?.improvements?.map((s, i) => <li key={`gr-${i}`}>{s}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Grammar Corrections */}
      {grammaticalRange?.corrections?.length > 0 && (
        <div className="corrections-section">
          <h3>{t('evaluation.grammarCorrections')}</h3>
          <div className="corrections-list">
            {grammaticalRange.corrections.map((correction, idx) => (
              <div key={idx} className="correction-item">
                <div className="correction-row">
                  <span className="error-text">
                    <XCircle size={16} />
                    {correction.error}
                  </span>
                  <ArrowRight size={16} />
                  <span className="correct-text">
                    <CheckCircle size={16} />
                    {correction.correction}
                  </span>
                </div>
                {correction.explanation && (
                  <p className="correction-explanation">{correction.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vocabulary Suggestions */}
      {lexicalResource?.suggestions?.length > 0 && (
        <div className="suggestions-section">
          <h3>{t('evaluation.vocabSuggestions')}</h3>
          <div className="suggestions-list">
            {lexicalResource.suggestions.map((suggestion, idx) => (
              <div key={idx} className="suggestion-item">
                <span className="original">{suggestion.original}</span>
                <ArrowRight size={16} />
                <div className="suggested-words">
                  {suggestion.suggested.map((word, i) => (
                    <span key={i} className="suggested">{word}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview/Thesis Suggestion */}
      {(overviewSuggestion || thesisSuggestion) && (
        <div className="suggestion-box">
          <h4>Suggested {taskType === 'task1' ? 'Overview' : 'Thesis'}:</h4>
          <p>{overviewSuggestion || thesisSuggestion}</p>
        </div>
      )}

      {/* Model Phrases */}
      {modelPhrases?.length > 0 && (
        <div className="model-phrases">
          <h4>Useful Phrases:</h4>
          <div className="phrases-list">
            {modelPhrases.map((phrase, idx) => (
              <span key={idx} className="model-phrase">{phrase}</span>
            ))}
          </div>
        </div>
      )}

      <div className="evaluation-footer">
        <button className="btn-primary" onClick={onBack}>
          {t('evaluation.tryAnother')}
        </button>
      </div>
    </div>
  );
}

export default EvaluationPanel;
