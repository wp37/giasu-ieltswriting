import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, TrendingUp, FileText, Trash2, Eye, AlertCircle } from 'lucide-react';
import { useSubmissionHistory } from '../hooks/useLocalStorage';
import EvaluationPanel from '../components/EvaluationPanel/EvaluationPanel';
import './History.css';

function History() {
  const { t } = useTranslation();
  const { history, removeSubmission, clearHistory } = useSubmissionHistory();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const getBandColor = (band) => {
    if (band >= 7) return 'high';
    if (band >= 5.5) return 'medium';
    return 'low';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    removeSubmission(id);
  };

  const handleClearAll = () => {
    clearHistory();
    setShowConfirmClear(false);
  };

  if (selectedSubmission) {
    return (
      <div className="history-page">
        <EvaluationPanel
          evaluation={selectedSubmission.evaluation}
          essay={selectedSubmission.essay}
          wordCount={selectedSubmission.wordCount}
          taskType={selectedSubmission.taskType}
          onBack={() => setSelectedSubmission(null)}
        />
      </div>
    );
  }

  return (
    <div className="history-page">
      <header className="history-header">
        <h1>{t('history.title')}</h1>
        {history.length > 0 && (
          <button 
            className="clear-all-btn"
            onClick={() => setShowConfirmClear(true)}
          >
            <Trash2 size={18} />
            {t('history.clearAll')}
          </button>
        )}
      </header>

      {/* Confirm Clear Dialog */}
      {showConfirmClear && (
        <div className="confirm-dialog">
          <div className="dialog-content">
            <AlertCircle size={40} />
            <h3>Clear All History?</h3>
            <p>This action cannot be undone. All submission history will be permanently deleted.</p>
            <div className="dialog-actions">
              <button className="btn-cancel" onClick={() => setShowConfirmClear(false)}>
                {t('common.cancel')}
              </button>
              <button className="btn-danger" onClick={handleClearAll}>
                {t('history.clearAll')}
              </button>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 ? (
        <div className="history-list">
          {history.map((submission) => (
            <div 
              key={submission.id} 
              className="history-item"
              onClick={() => setSelectedSubmission(submission)}
            >
              <div className="item-main">
                <div className="item-type">
                  <FileText size={20} />
                  <div className="type-info">
                    <span className="task-type">
                      {submission.taskType === 'task1' ? 'Task 1' : 'Task 2'}
                    </span>
                    {submission.taskSubType && (
                      <span className="task-subtype">{submission.taskSubType}</span>
                    )}
                  </div>
                </div>

                <div className="item-preview">
                  <p>{submission.essay?.substring(0, 150)}...</p>
                </div>
              </div>

              <div className="item-meta">
                <div className="meta-item score">
                  <TrendingUp size={16} />
                  <span className={`band-score ${getBandColor(submission.evaluation?.overallBand)}`}>
                    Band {submission.evaluation?.overallBand || '-'}
                  </span>
                </div>

                <div className="meta-item words">
                  <span>{submission.wordCount} words</span>
                </div>

                <div className="meta-item date">
                  <Calendar size={16} />
                  <span>{formatDate(submission.timestamp)}</span>
                </div>
              </div>

              <div className="item-actions">
                <button 
                  className="action-btn view"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSubmission(submission);
                  }}
                >
                  <Eye size={16} />
                  {t('history.view')}
                </button>
                <button 
                  className="action-btn delete"
                  onClick={(e) => handleDelete(submission.id, e)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FileText size={60} />
          <h2>{t('history.noHistory')}</h2>
          <p>Your submitted essays will appear here.</p>
        </div>
      )}

      {/* Statistics Summary */}
      {history.length > 0 && (
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-value">{history.length}</span>
            <span className="stat-label">Total Submissions</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {(history.reduce((acc, h) => acc + (h.evaluation?.overallBand || 0), 0) / history.length).toFixed(1)}
            </span>
            <span className="stat-label">Average Band</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {Math.max(...history.map(h => h.evaluation?.overallBand || 0))}
            </span>
            <span className="stat-label">Highest Band</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
