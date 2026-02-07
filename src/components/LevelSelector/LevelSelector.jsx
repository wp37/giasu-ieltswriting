import { useState } from 'react';
import { VIETNAMESE_LEVELS } from '../../services/educationService';
import './LevelSelector.css';

const LevelSelector = ({ currentLevel, onLevelChange, showBandScore = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  const levels = Object.keys(VIETNAMESE_LEVELS);

  const handleSelect = (level) => {
    onLevelChange(level);
    setIsOpen(false);
  };

  const currentLevelInfo = VIETNAMESE_LEVELS[currentLevel] || VIETNAMESE_LEVELS.B1;

  return (
    <div className="level-selector">
      <button
        className="level-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderColor: currentLevelInfo.color }}
      >
        <div className="level-button-content">
          <div className="level-main">
            <span className="level-code" style={{ color: currentLevelInfo.color }}>
              {currentLevel}
            </span>
            <span className="level-label">{currentLevelInfo.label}</span>
          </div>
          {showBandScore && (
            <div className="level-band">
              IELTS: {currentLevelInfo.band}
            </div>
          )}
        </div>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="level-dropdown">
          <div className="dropdown-header">
            <h3>Chọn trình độ của bạn</h3>
            <button 
              className="dropdown-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="level-options">
            {levels.map((level) => {
              const info = VIETNAMESE_LEVELS[level];
              const isActive = level === currentLevel;

              return (
                <button
                  key={level}
                  className={`level-option ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelect(level)}
                  style={{
                    borderLeftColor: info.color,
                    backgroundColor: isActive ? `${info.color}10` : 'white'
                  }}
                >
                  <div className="option-header">
                    <span 
                      className="option-code"
                      style={{ color: info.color }}
                    >
                      {level}
                    </span>
                    <span className="option-label">{info.label}</span>
                    {isActive && (
                      <span className="active-check" style={{ color: info.color }}>✓</span>
                    )}
                  </div>
                  <div className="option-band">IELTS: {info.band}</div>
                  <div className="option-description">{info.description}</div>
                </button>
              );
            })}
          </div>
          <div className="dropdown-footer">
            <p className="footer-note">
              💡 <strong>Gợi ý:</strong> Chọn trình độ hiện tại của bạn để nhận được lộ trình học phù hợp
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelSelector;
