import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PenTool, Upload, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { useSubmissionHistory } from '../hooks/useLocalStorage';
import './Home.css';

function Home() {
  const { t } = useTranslation();
  const { history } = useSubmissionHistory();

  const recentSubmissions = history.slice(0, 5);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>{t('home.welcome')}</h1>
        <p className="hero-subtitle">{t('home.description')}</p>
      </section>

      <section className="quick-actions">
        <Link to="/practice" className="action-card">
          <div className="action-icon">
            <PenTool size={32} />
          </div>
          <h3>{t('home.practiceBtn')}</h3>
          <p>Task 1 & Task 2</p>
        </Link>

        <Link to="/evaluate" className="action-card">
          <div className="action-icon">
            <Upload size={32} />
          </div>
          <h3>{t('home.uploadBtn')}</h3>
          <p>.txt, .docx, .pdf</p>
        </Link>

        <Link to="/vocabulary" className="action-card">
          <div className="action-icon">
            <BookOpen size={32} />
          </div>
          <h3>{t('home.vocabBtn')}</h3>
          <p>Band 5-9</p>
        </Link>
      </section>

      <section className="recent-section">
        <h2>{t('home.recentSubmissions')}</h2>
        {recentSubmissions.length > 0 ? (
          <div className="recent-list">
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="recent-item">
                <div className="recent-info">
                  <span className="recent-type">{submission.taskType}</span>
                  <span className="recent-subtype">{submission.taskSubType}</span>
                </div>
                <div className="recent-score">
                  <TrendingUp size={16} />
                  <span>Band {submission.evaluation?.overallBand || '-'}</span>
                </div>
                <div className="recent-date">
                  <Clock size={14} />
                  <span>{new Date(submission.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-submissions">{t('home.noSubmissions')}</p>
        )}
      </section>

      <section className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h4>4 Criteria Evaluation</h4>
            <p>Task Response, Coherence, Lexical Resource, Grammar</p>
          </div>
          <div className="feature-item">
            <h4>Band Score 1.0-9.0</h4>
            <p>Detailed breakdown with feedback</p>
          </div>
          <div className="feature-item">
            <h4>Vocabulary Upgrade</h4>
            <p>Band 5-6 to Band 7-9 suggestions</p>
          </div>
          <div className="feature-item">
            <h4>Grammar Correction</h4>
            <p>Error highlighting with explanations</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
