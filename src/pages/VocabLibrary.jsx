import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, BookOpen, TrendingUp, Map, Repeat, Mail } from 'lucide-react';
import cohesiveDevices from '../data/cohesiveDevices.json';
import trendVocabulary from '../data/trendVocabulary.json';
import mapVocabulary from '../data/mapVocabulary.json';
import processVocabulary from '../data/processVocabulary.json';
import letterPhrases from '../data/letterPhrases.json';
import './VocabLibrary.css';

function VocabLibrary() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [activeCategory, setActiveCategory] = useState('cohesive');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const categories = [
    { id: 'cohesive', label: t('vocabulary.cohesiveDevices'), icon: BookOpen },
    { id: 'trends', label: t('vocabulary.trendWords'), icon: TrendingUp },
    { id: 'map', label: t('vocabulary.mapWords'), icon: Map },
    { id: 'process', label: t('vocabulary.processWords'), icon: Repeat },
    { id: 'letter', label: t('vocabulary.letterPhrases'), icon: Mail },
  ];

  // Filter data based on search query
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    if (activeCategory === 'cohesive') {
      return cohesiveDevices.categories.filter(cat => {
        const nameMatch = (cat.name[lang] || cat.name.en).toLowerCase().includes(query);
        const basicMatch = cat.basic.some(w => w.toLowerCase().includes(query));
        const advancedMatch = cat.advanced.some(a => a.word.toLowerCase().includes(query));
        return nameMatch || basicMatch || advancedMatch || !query;
      });
    }
    
    if (activeCategory === 'trends') {
      return trendVocabulary.categories.filter(cat => {
        const nameMatch = (cat.name[lang] || cat.name.en).toLowerCase().includes(query);
        const verbMatch = [...cat.verbs.basic, ...cat.verbs.advanced.map(v => v.word)]
          .some(w => w.toLowerCase().includes(query));
        return nameMatch || verbMatch || !query;
      });
    }

    if (activeCategory === 'map') {
      return Object.entries(mapVocabulary.transformationVerbs).filter(([key, data]) => {
        const nameMatch = (data.name[lang] || data.name.en).toLowerCase().includes(query);
        const wordMatch = data.words.some(w => w.word.toLowerCase().includes(query));
        return nameMatch || wordMatch || !query;
      });
    }

    if (activeCategory === 'process') {
      const sections = [
        { key: 'beginning', data: processVocabulary.sequencers.beginning },
        { key: 'middle', data: processVocabulary.sequencers.middle },
        { key: 'end', data: processVocabulary.sequencers.end },
      ];
      return sections.filter(section => {
        const phraseMatch = section.data.some(p => p.phrase.toLowerCase().includes(query));
        return phraseMatch || !query;
      });
    }

    if (activeCategory === 'letter') {
      return Object.entries(letterPhrases.letterTypes).filter(([key, data]) => {
        const nameMatch = (data.name[lang] || data.name.en).toLowerCase().includes(query);
        const phraseMatch = data.usefulPhrases.some(p => p.toLowerCase().includes(query));
        return nameMatch || phraseMatch || !query;
      });
    }

    return [];
  }, [activeCategory, searchQuery, lang]);

  const renderCohesiveDevices = () => (
    <div className="vocab-grid">
      {filteredData.map((category) => (
        <div key={category.id} className="vocab-card">
          <h3>{category.name[lang] || category.name.en}</h3>
          <p className="description">{category.description[lang] || category.description.en}</p>
          
          <div className="vocab-level-section">
            <div className="level-header basic">
              <span className="badge">{t('vocabulary.band56')}</span>
            </div>
            <div className="word-list">
              {category.basic.map((word, i) => (
                <span key={i} className="word basic">{word}</span>
              ))}
            </div>
          </div>

          <div className="vocab-level-section">
            <div className="level-header advanced">
              <span className="badge">{t('vocabulary.band79')}</span>
            </div>
            <div className="advanced-list">
              {category.advanced.map((item, i) => (
                <div key={i} className="advanced-item">
                  <span className="word advanced">{item.word}</span>
                  <p className="usage">{t('vocabulary.usage')}: {item.usage}</p>
                  <p className="example">{t('vocabulary.example')}: <em>{item.example}</em></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTrendVocabulary = () => (
    <div className="vocab-grid">
      {filteredData.map((category) => (
        <div key={category.id} className="vocab-card">
          <h3>{category.name[lang] || category.name.en}</h3>
          
          <div className="vocab-level-section">
            <div className="level-header basic">
              <span className="badge">Basic Verbs</span>
            </div>
            <div className="word-list">
              {category.verbs.basic.map((word, i) => (
                <span key={i} className="word basic">{word}</span>
              ))}
            </div>
          </div>

          <div className="vocab-level-section">
            <div className="level-header advanced">
              <span className="badge">{t('vocabulary.band79')}</span>
            </div>
            <div className="advanced-list">
              {category.verbs.advanced.map((item, i) => (
                <div key={i} className="advanced-item">
                  <span className="word advanced">{item.word}</span>
                  <p className="meaning">{item.meaning}</p>
                  <p className="example">{t('vocabulary.example')}: <em>{item.example}</em></p>
                </div>
              ))}
            </div>
          </div>

          {category.nouns && (
            <div className="nouns-section">
              <span className="nouns-label">Nouns:</span>
              <span className="nouns-list">{category.nouns.join(', ')}</span>
            </div>
          )}
        </div>
      ))}

      {/* Adverbs Section */}
      <div className="vocab-card adverbs-card">
        <h3>Degree Adverbs</h3>
        <div className="adverbs-grid">
          <div className="adverb-group">
            <h4>Strong Change</h4>
            {trendVocabulary.adverbs.strong.map((adv, i) => (
              <div key={i} className="adverb-item">
                <span className="adverb">{adv.word}</span>
                <span className="meaning">{adv.meaning}</span>
              </div>
            ))}
          </div>
          <div className="adverb-group">
            <h4>Mild Change</h4>
            {trendVocabulary.adverbs.mild.map((adv, i) => (
              <div key={i} className="adverb-item">
                <span className="adverb">{adv.word}</span>
                <span className="meaning">{adv.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMapVocabulary = () => (
    <div className="vocab-grid">
      {filteredData.map(([key, data]) => (
        <div key={key} className="vocab-card">
          <h3>{data.name[lang] || data.name.en}</h3>
          <div className="word-examples">
            {data.words.map((item, i) => (
              <div key={i} className="word-example-item">
                <span className="word advanced">{item.word}</span>
                <p className="example">{item.example}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Prepositions Section */}
      <div className="vocab-card prepositions-card">
        <h3>Location Prepositions</h3>
        {Object.entries(mapVocabulary.locationPrepositions).map(([key, items]) => (
          <div key={key} className="preposition-group">
            <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
            <div className="preposition-list">
              {items.map((item, i) => (
                <div key={i} className="preposition-item">
                  <span className="phrase">{item.phrase}</span>
                  <span className="usage">{item.usage}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProcessVocabulary = () => (
    <div className="vocab-grid">
      {filteredData.map((section) => (
        <div key={section.key} className="vocab-card">
          <h3>{section.key.charAt(0).toUpperCase() + section.key.slice(1)} Phrases</h3>
          <div className="phrase-list">
            {section.data.map((item, i) => (
              <div key={i} className="phrase-item">
                <span className="phrase">{item.phrase}</span>
                <p className="example">{item.example}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Passive Voice Section */}
      <div className="vocab-card passive-card">
        <h3>Passive Voice Structures</h3>
        <p className="description">{processVocabulary.passiveVoice.description.en}</p>
        {processVocabulary.passiveVoice.structures.map((structure, i) => (
          <div key={i} className="structure-item">
            <h4>{structure.name}</h4>
            <code>{structure.formula}</code>
            <p className="example">{structure.example}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLetterPhrases = () => (
    <div className="vocab-grid">
      {filteredData.map(([key, data]) => (
        <div key={key} className="vocab-card letter-card">
          <div className="letter-header">
            <h3>{data.name[lang] || data.name.en}</h3>
            <span className={`tone-badge ${data.tone}`}>{data.tone}</span>
          </div>
          
          <div className="letter-structure">
            <h4>Structure:</h4>
            <ol>
              {data.structure.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="useful-phrases">
            <h4>Useful Phrases:</h4>
            <ul>
              {data.usefulPhrases.map((phrase, i) => (
                <li key={i}>{phrase}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'cohesive': return renderCohesiveDevices();
      case 'trends': return renderTrendVocabulary();
      case 'map': return renderMapVocabulary();
      case 'process': return renderProcessVocabulary();
      case 'letter': return renderLetterPhrases();
      default: return null;
    }
  };

  return (
    <div className="vocab-library-page">
      <header className="vocab-header">
        <h1>{t('vocabulary.title')}</h1>
        
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder={t('vocabulary.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <nav className="category-nav">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`category-btn ${activeCategory === id ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(id);
              setSelectedSubCategory(null);
            }}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="vocab-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default VocabLibrary;
