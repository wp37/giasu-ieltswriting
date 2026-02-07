import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import topics from '../../data/topics.json';
import './TopicSelector.css';

function TopicSelector({ testType, taskType, taskSubType, onSubTypeChange, selectedTopic, onTopicSelect }) {
  const { t } = useTranslation();

  // Get sub-type options based on test type and task type
  const getSubTypeOptions = () => {
    if (taskType === 'task2') {
      return [
        { value: 'opinion', label: t('practice.opinion') },
        { value: 'discussion', label: t('practice.discussion') },
        { value: 'problemSolution', label: t('practice.problemSolution') },
        { value: 'advantagesDisadvantages', label: t('practice.advantagesDisadvantages') },
        { value: 'twoPart', label: t('practice.twoPart') },
      ];
    }

    if (testType === 'gt' && taskType === 'task1') {
      return [
        { value: 'complaint', label: t('practice.complaint') },
        { value: 'request', label: t('practice.request') },
        { value: 'application', label: t('practice.application') },
        { value: 'apology', label: t('practice.apology') },
        { value: 'invitation', label: t('practice.invitation') },
        { value: 'personal', label: t('practice.personal') },
      ];
    }

    // Academic Task 1
    return [
      { value: 'lineGraph', label: t('practice.lineGraph') },
      { value: 'barChart', label: t('practice.barChart') },
      { value: 'pieChart', label: t('practice.pieChart') },
      { value: 'table', label: t('practice.table') },
      { value: 'map', label: t('practice.map') },
      { value: 'process', label: t('practice.process') },
    ];
  };

  // Get topics based on current selection
  const getTopics = () => {
    if (taskType === 'task2') {
      return topics.task2[taskSubType] || [];
    }
    if (testType === 'gt' && taskType === 'task1') {
      return topics.task1GT[taskSubType] || [];
    }
    return topics.task1Academic[taskSubType] || [];
  };

  const subTypeOptions = getSubTypeOptions();
  const availableTopics = getTopics();

  return (
    <div className="topic-selector">
      <div className="selector-row">
        <div className="selector-group">
          <label>{t('practice.selectTopic')}</label>
          <div className="select-wrapper">
            <select 
              value={taskSubType} 
              onChange={(e) => {
                onSubTypeChange(e.target.value);
                onTopicSelect(null);
              }}
            >
              {subTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="select-icon" />
          </div>
        </div>

        {availableTopics.length > 0 && (
          <div className="selector-group topic-group">
            <label>{t('practice.topic')}</label>
            <div className="select-wrapper">
              <select 
                value={selectedTopic?.id || ''} 
                onChange={(e) => {
                  const topic = availableTopics.find(t => t.id === e.target.value);
                  onTopicSelect(topic);
                }}
              >
                <option value="">-- Select a topic --</option>
                {availableTopics.map(topic => (
                  <option key={topic.id} value={topic.id}>
                    {topic.title}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="select-icon" />
            </div>
          </div>
        )}
      </div>

      {/* Display selected topic */}
      {selectedTopic && (
        <div className="topic-display">
          <h3>{selectedTopic.title}</h3>
          <p className="topic-description">
            {selectedTopic.description || selectedTopic.question}
          </p>
          {selectedTopic.bulletPoints && (
            <div className="bullet-points">
              <p>You should:</p>
              <ul>
                {selectedTopic.bulletPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          {selectedTopic.tone && (
            <div className="tone-indicator">
              <span className="tone-label">Tone:</span>
              <span className={`tone-badge ${selectedTopic.tone}`}>{selectedTopic.tone}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TopicSelector;
