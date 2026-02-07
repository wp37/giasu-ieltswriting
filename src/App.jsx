import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home as HomeIcon, PenTool, Upload, BookOpen, History as HistoryIcon, Globe } from 'lucide-react';
import LevelSelector from './components/LevelSelector/LevelSelector';
import SettingsButton from './components/SettingsButton/SettingsButton';
import ApiKeyModal from './components/ApiKeyModal/ApiKeyModal';
import { apiKeyService } from './services/apiKeyService';
import { geminiService } from './services/geminiService';
import './i18n';
import './App.css';

// Pages
import Home from './pages/Home';
import Practice from './pages/Practice';
import Evaluate from './pages/Evaluate';
import VocabLibrary from './pages/VocabLibrary';
import History from './pages/History';
import Admin from './pages/Admin';

// Navbar Component
function Navbar({ onLanguageToggle, currentLanguage, currentLevel, onLevelChange, onOpenApiKeyModal, onNavigateToAdmin }) {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: HomeIcon, label: t('nav.home') },
    { path: '/practice', icon: PenTool, label: t('nav.practice') },
    { path: '/evaluate', icon: Upload, label: t('nav.evaluate') },
    { path: '/vocabulary', icon: BookOpen, label: t('nav.vocabulary') },
    { path: '/history', icon: HistoryIcon, label: t('nav.history') },
  ];

  return (
    <nav className="navbar glass">
      <div className="navbar-brand">
        <h1 className="brand-title">
          <span className="text-gradient">IELTS</span> Writing Tool
        </h1>
      </div>
      <div className="navbar-links">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-link ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
      <div className="navbar-actions">
        <div className="level-selector-wrapper">
          <LevelSelector
            currentLevel={currentLevel}
            onLevelChange={onLevelChange}
            showBandScore={true}
          />
        </div>
        <button className="lang-toggle glass-button" onClick={onLanguageToggle}>
          <Globe size={18} />
          <span>{currentLanguage.toUpperCase()}</span>
        </button>
        <SettingsButton
          onOpenApiKeyModal={onOpenApiKeyModal}
          onNavigateToAdmin={onNavigateToAdmin}
        />
      </div>
    </nav>
  );
}

// Main App Component
function AppContent() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [apiKey, setApiKey] = useState(() => apiKeyService.getApiKey() || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(() => {
    const savedLevel = localStorage.getItem('user_level');
    return savedLevel && ['A2', 'B1', 'B2', 'C1', 'C2', 'NATIVE'].includes(savedLevel) ? savedLevel : 'B1';
  });

  // Check if API key exists on mount
  useEffect(() => {
    const hasKey = apiKeyService.hasApiKey();
    if (!hasKey) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => setShowApiKeyModal(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Set API key in Gemini service
      geminiService.setApiKey(apiKeyService.getApiKey());
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleApiKeySave = (key, model) => {
    setApiKey(key);
    geminiService.setApiKey(key);
    setShowApiKeyModal(false);
  };

  const handleLevelChange = (level) => {
    setCurrentLevel(level);
    localStorage.setItem('user_level', level);
  };

  const handleOpenApiKeyModal = () => {
    setShowApiKeyModal(true);
  };

  const handleNavigateToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="app">
      <Navbar
        onLanguageToggle={toggleLanguage}
        currentLanguage={i18n.language}
        currentLevel={currentLevel}
        onLevelChange={handleLevelChange}
        onOpenApiKeyModal={handleOpenApiKeyModal}
        onNavigateToAdmin={handleNavigateToAdmin}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/evaluate" element={<Evaluate apiKey={apiKey} onApiKeyChange={handleApiKeySave} />} />
          <Route path="/vocabulary" element={<VocabLibrary />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleApiKeySave}
        initialApiKey={apiKey}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

