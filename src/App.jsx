import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home as HomeIcon, PenTool, Upload, BookOpen, History as HistoryIcon, Globe, UserPlus, Sparkles } from 'lucide-react';
import LevelSelector from './components/LevelSelector/LevelSelector';
import SettingsButton from './components/SettingsButton/SettingsButton';
import ApiKeyModal from './components/ApiKeyModal/ApiKeyModal';
import RegistrationModal from './components/RegistrationModal/RegistrationModal';
import { apiKeyService } from './services/apiKeyService';
import { geminiService } from './services/geminiService';
import { isUserActivated, isAdmin } from './services/authService';
import './i18n';
import './App.css';

// Pages
import Home from './pages/Home';
import Practice from './pages/Practice';
import Evaluate from './pages/Evaluate';
import VocabLibrary from './pages/VocabLibrary';
import History from './pages/History';
import Admin from './pages/Admin';
import AIWriter from './pages/AIWriter';

// Navbar Component
function Navbar({ onLanguageToggle, currentLanguage, currentLevel, onLevelChange, onOpenApiKeyModal, onNavigateToAdmin, onOpenRegistration, isActivated }) {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: HomeIcon, label: t('nav.home') },
    { path: '/practice', icon: PenTool, label: t('nav.practice') },
    { path: '/evaluate', icon: Upload, label: t('nav.evaluate') },
    { path: '/ai-writer', icon: Sparkles, label: 'AI Viết' },
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
        {!isActivated && (
          <button className="register-btn btn-primary" onClick={onOpenRegistration}>
            <UserPlus size={16} />
            <span>Đăng ký</span>
          </button>
        )}
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
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
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

  // Check activation status
  useEffect(() => {
    const checkActivation = () => {
      setIsActivated(isUserActivated() || isAdmin());
    };
    checkActivation();
    // Re-check on focus (in case admin activated in another tab)
    window.addEventListener('focus', checkActivation);
    return () => window.removeEventListener('focus', checkActivation);
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
        onOpenRegistration={() => setShowRegistrationModal(true)}
        isActivated={isActivated}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/evaluate" element={<Evaluate apiKey={apiKey} onApiKeyChange={handleApiKeySave} />} />
          <Route path="/vocabulary" element={<VocabLibrary />} />
          <Route path="/history" element={<History />} />
          <Route path="/ai-writer" element={<AIWriter />} />
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

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
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

