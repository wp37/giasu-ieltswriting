import { useState, useEffect } from 'react';
import { apiKeyService } from '../../services/apiKeyService';
import { MODEL_ORDER } from '../../services/geminiService';
import './ApiKeyModal.css';

const ApiKeyModal = ({ isOpen, onClose, onSave, initialApiKey = '' }) => {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [selectedModel, setSelectedModel] = useState(apiKeyService.getSelectedModel());
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKey(initialApiKey || apiKeyService.getApiKey() || '');
      setSelectedModel(apiKeyService.getSelectedModel());
      setError('');
    }
  }, [isOpen, initialApiKey]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Vui lòng nhập API key');
      return;
    }

    if (!apiKey.trim().startsWith('AIza')) {
      setError('API key không hợp lệ. API key Gemini thường bắt đầu bằng "AIza"');
      return;
    }

    apiKeyService.saveApiKey(apiKey.trim());
    apiKeyService.saveSelectedModel(selectedModel);
    setError('');
    onSave && onSave(apiKey.trim(), selectedModel);
    onClose();
  };

  const modelInfo = {
    'gemini-3-flash-preview': {
      name: 'Gemini 3 Flash Preview',
      description: 'Mô hình mặc định - Nhanh và hiệu quả',
      badge: 'Mặc định',
      badgeClass: 'badge-default'
    },
    'gemini-3-pro-preview': {
      name: 'Gemini 3 Pro Preview',
      description: 'Phản hồi chi tiết và chính xác hơn',
      badge: 'Pro',
      badgeClass: 'badge-pro'
    },
    'gemini-2.5-flash': {
      name: 'Gemini 2.5 Flash',
      description: 'Phiên bản ổn định',
      badge: 'Ổn định',
      badgeClass: 'badge-stable'
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thiết lập API Key & Model</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* API Key Section */}
          <div className="form-section">
            <label className="form-label">
              Gemini API Key <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type={showKey ? 'text' : 'password'}
                className="api-key-input"
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError('');
                }}
              />
              <button
                className="toggle-visibility"
                onClick={() => setShowKey(!showKey)}
                type="button"
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="help-text">
              Chưa có API key? 
              <a 
                href="https://aistudio.google.com/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="help-link"
              >
                Lấy key tại đây
              </a>
            </div>
          </div>

          {/* Model Selection Section */}
          <div className="form-section">
            <label className="form-label">Chọn Model AI</label>
            <div className="model-cards">
              {MODEL_ORDER.map((modelId) => {
                const info = modelInfo[modelId];
                return (
                  <div
                    key={modelId}
                    className={`model-card ${selectedModel === modelId ? 'selected' : ''}`}
                    onClick={() => setSelectedModel(modelId)}
                  >
                    <div className="model-card-header">
                      <h3>{info.name}</h3>
                      <span className={`model-badge ${info.badgeClass}`}>
                        {info.badge}
                      </span>
                    </div>
                    <p className="model-description">{info.description}</p>
                    {selectedModel === modelId && (
                      <div className="selected-indicator">✓</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Section */}
          <div className="info-section">
            <div className="info-box">
              <strong>ℹ️ Lưu ý:</strong>
              <ul>
                <li>API key được lưu trữ an toàn trong trình duyệt của bạn</li>
                <li>Hệ thống tự động chuyển đổi model khi gặp lỗi</li>
                <li>Bạn có thể thay đổi API key bất cứ lúc nào từ nút Settings</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-save" onClick={handleSave}>
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
