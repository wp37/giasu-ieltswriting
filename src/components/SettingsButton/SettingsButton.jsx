import { Settings, ChevronDown, Key, Cpu, Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { apiKeyService } from '../../services/apiKeyService';
import './SettingsButton.css';

const SettingsButton = ({ onOpenApiKeyModal, onNavigateToAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setHasApiKey(apiKeyService.hasApiKey());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApiKeyClick = () => {
    setIsOpen(false);
    onOpenApiKeyModal && onOpenApiKeyModal();
  };

  const handleAdminClick = () => {
    setIsOpen(false);
    onNavigateToAdmin && onNavigateToAdmin();
  };

  return (
    <div className="settings-button-wrapper" ref={dropdownRef}>
      <button
        className={`settings-button ${!hasApiKey ? 'needs-key' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings size={18} className={`settings-icon ${isOpen ? 'rotating' : ''}`} />
        <span className="settings-text">Settings</span>
        {!hasApiKey && (
          <span className="api-key-warning">Lấy API key để sử dụng app</span>
        )}
        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="settings-dropdown">
          <div className="dropdown-header">
            <span>Cài đặt ứng dụng</span>
          </div>
          
          <button className="dropdown-item" onClick={handleApiKeyClick}>
            <div className="dropdown-item-icon">
              <Key size={18} />
            </div>
            <div className="dropdown-item-content">
              <span className="dropdown-item-title">API Key</span>
              <span className="dropdown-item-desc">
                {hasApiKey ? 'Đã cấu hình' : 'Chưa cấu hình'}
              </span>
            </div>
            {!hasApiKey && <span className="status-dot error"></span>}
            {hasApiKey && <span className="status-dot success"></span>}
          </button>

          <button className="dropdown-item" onClick={handleApiKeyClick}>
            <div className="dropdown-item-icon">
              <Cpu size={18} />
            </div>
            <div className="dropdown-item-content">
              <span className="dropdown-item-title">Model AI</span>
              <span className="dropdown-item-desc">
                {apiKeyService.getSelectedModel().split('-').slice(-2).join(' ')}
              </span>
            </div>
          </button>

          <div className="dropdown-divider"></div>

          <button className="dropdown-item" onClick={handleAdminClick}>
            <div className="dropdown-item-icon">
              <Shield size={18} />
            </div>
            <div className="dropdown-item-content">
              <span className="dropdown-item-title">Admin Dashboard</span>
              <span className="dropdown-item-desc">Thống kê & Quản trị</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsButton;
