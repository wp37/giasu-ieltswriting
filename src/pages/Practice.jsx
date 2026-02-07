import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, FileText, Lightbulb, Send, Save, Trash2, Play, Pause, RotateCcw } from 'lucide-react';
import useTimer from '../hooks/useTimer';
import useWordCount from '../hooks/useWordCount';
import { useSubmissionHistory } from '../hooks/useLocalStorage';
import { evaluationService } from '../services/api';
import TopicSelector from '../components/TopicSelector/TopicSelector';
import VocabHelper from '../components/VocabHelper/VocabHelper';
import EvaluationPanel from '../components/EvaluationPanel/EvaluationPanel';
import './Practice.css';

function Practice() {
  const { t } = useTranslation();
  const [testType, setTestType] = useState('academic'); // academic, gt
  const [taskType, setTaskType] = useState('task1'); // task1, task2
  const [taskSubType, setTaskSubType] = useState('line'); // line, bar, pie, etc.
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showVocabHelper, setShowVocabHelper] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState('');

  const { addSubmission } = useSubmissionHistory();
  const { text, setText, wordCount, getWordCountStatus } = useWordCount();
  
  const timerMinutes = taskType === 'task1' ? 20 : 40;
  const minWords = taskType === 'task1' ? 150 : 250;
  const { isRunning, isFinished, start, pause, reset, formatTime } = useTimer(timerMinutes);

  const wordStatus = getWordCountStatus(minWords);

  const handleTaskTypeChange = (newTaskType) => {
    setTaskType(newTaskType);
    reset(newTaskType === 'task1' ? 20 : 40);
    setSelectedTopic(null);
    setEvaluation(null);
  };

  const handleSubmit = useCallback(async () => {
    if (wordCount < minWords * 0.5) {
      setError(`Please write at least ${Math.floor(minWords * 0.5)} words before submitting.`);
      return;
    }

    setIsEvaluating(true);
    setError('');
    pause();

    try {
      const result = await evaluationService.evaluateEssay({
        essay: text,
        taskType,
        taskSubType,
        topic: selectedTopic?.description || selectedTopic?.question || ''
      });

      setEvaluation(result.evaluation);
      
      // Save to history
      addSubmission({
        testType,
        taskType,
        taskSubType,
        topic: selectedTopic,
        essay: text,
        wordCount,
        evaluation: result.evaluation
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to evaluate. Please check your API key and try again.');
    } finally {
      setIsEvaluating(false);
    }
  }, [text, wordCount, taskType, taskSubType, selectedTopic, testType, minWords, pause, addSubmission]);

  const handleClear = () => {
    setText('');
    setEvaluation(null);
    setError('');
    reset(timerMinutes);
  };

  const handleSaveDraft = () => {
    const draft = {
      testType,
      taskType,
      taskSubType,
      topic: selectedTopic,
      essay: text,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('ielts_draft', JSON.stringify(draft));
    alert('Draft saved!');
  };

  if (evaluation) {
    return (
      <div className="practice-page">
        <EvaluationPanel 
          evaluation={evaluation} 
          essay={text}
          wordCount={wordCount}
          taskType={taskType}
          onBack={() => setEvaluation(null)}
        />
      </div>
    );
  }

  return (
    <div className="practice-page">
      {/* Header Controls */}
      <div className="practice-header">
        <div className="test-type-selector">
          <button 
            className={`type-btn ${testType === 'academic' ? 'active' : ''}`}
            onClick={() => setTestType('academic')}
          >
            {t('practice.academic')}
          </button>
          <button 
            className={`type-btn ${testType === 'gt' ? 'active' : ''}`}
            onClick={() => setTestType('gt')}
          >
            {t('practice.generalTraining')}
          </button>
        </div>

        <div className="task-type-selector">
          <button 
            className={`type-btn ${taskType === 'task1' ? 'active' : ''}`}
            onClick={() => handleTaskTypeChange('task1')}
          >
            {t('practice.task1')}
          </button>
          <button 
            className={`type-btn ${taskType === 'task2' ? 'active' : ''}`}
            onClick={() => handleTaskTypeChange('task2')}
          >
            {t('practice.task2')}
          </button>
        </div>

        <div className="timer-section">
          <Clock size={20} />
          <span className={`timer-display ${isFinished ? 'time-up' : ''}`}>
            {formatTime()}
          </span>
          <div className="timer-controls">
            {!isRunning ? (
              <button className="timer-btn" onClick={start} title="Start">
                <Play size={16} />
              </button>
            ) : (
              <button className="timer-btn" onClick={pause} title="Pause">
                <Pause size={16} />
              </button>
            )}
            <button className="timer-btn" onClick={() => reset(timerMinutes)} title="Reset">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Topic Selector */}
      <TopicSelector
        testType={testType}
        taskType={taskType}
        taskSubType={taskSubType}
        onSubTypeChange={setTaskSubType}
        selectedTopic={selectedTopic}
        onTopicSelect={setSelectedTopic}
      />

      {/* Main Writing Area */}
      <div className="writing-area">
        <div className="editor-section">
          <div className="editor-header">
            <div className="editor-title">
              <FileText size={18} />
              <span>{t('practice.yourEssay')}</span>
            </div>
            <div className={`word-count ${wordStatus.status}`}>
              {wordCount} {t('practice.words')} 
              <span className="min-words">({t('practice.minWords')}: {minWords})</span>
            </div>
          </div>
          
          <textarea
            className="essay-editor"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Start writing your ${taskType === 'task1' ? 'report' : 'essay'} here...`}
          />

          {error && <div className="error-message">{error}</div>}

          <div className="editor-actions">
            <button 
              className="action-btn primary"
              onClick={handleSubmit}
              disabled={isEvaluating || wordCount < 50}
            >
              <Send size={18} />
              {isEvaluating ? t('evaluate.evaluating') : t('practice.submit')}
            </button>
            <button className="action-btn secondary" onClick={handleSaveDraft}>
              <Save size={18} />
              {t('practice.saveDraft')}
            </button>
            <button className="action-btn danger" onClick={handleClear}>
              <Trash2 size={18} />
              {t('practice.clear')}
            </button>
            <button 
              className="action-btn toggle"
              onClick={() => setShowVocabHelper(!showVocabHelper)}
            >
              <Lightbulb size={18} />
              {showVocabHelper ? t('practice.hideTips') : t('practice.showTips')}
            </button>
          </div>
        </div>

        {/* Vocabulary Helper Sidebar */}
        {showVocabHelper && (
          <VocabHelper 
            taskType={taskType} 
            taskSubType={taskSubType}
            testType={testType}
          />
        )}
      </div>
    </div>
  );
}

export default Practice;
