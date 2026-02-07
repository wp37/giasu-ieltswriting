import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import cohesiveDevices from '../../data/cohesiveDevices.json';
import trendVocabulary from '../../data/trendVocabulary.json';
import mapVocabulary from '../../data/mapVocabulary.json';
import processVocabulary from '../../data/processVocabulary.json';
import letterPhrases from '../../data/letterPhrases.json';
import './VocabHelper.css';

function VocabHelper({ taskType, taskSubType, testType }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [expandedSections, setExpandedSections] = useState(['connectors']);

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Get relevant vocabulary based on task type
  const relevantVocab = useMemo(() => {
    const vocab = [];

    // Always include cohesive devices
    vocab.push({
      id: 'connectors',
      title: t('vocabulary.cohesiveDevices'),
      items: cohesiveDevices.categories.slice(0, 4).map(cat => ({
        category: cat.name[lang] || cat.name.en,
        basic: cat.basic,
        advanced: cat.advanced.slice(0, 3)
      }))
    });

    // Add task-specific vocabulary
    if (taskType === 'task1') {
      if (testType === 'gt') {
        // Letter writing vocabulary
        const letterType = taskSubType || 'request';
        const letterData = letterPhrases.letterTypes[letterType];
        if (letterData) {
          vocab.push({
            id: 'letter',
            title: letterData.name[lang] || letterData.name.en,
            items: [{
              category: 'Useful Phrases',
              phrases: letterData.usefulPhrases.slice(0, 5)
            }]
          });
        }

        // Opening/Closing phrases
        const tone = letterData?.tone || 'formal';
        vocab.push({
          id: 'openings',
          title: 'Opening & Closing',
          items: [{
            category: 'Greetings',
            phrases: letterPhrases.greetings[tone]?.slice(0, 3).map(g => g.phrase) || []
          }, {
            category: 'Closings',
            phrases: letterPhrases.closings[tone]?.slice(0, 3).map(c => c.phrase) || []
          }]
        });
      } else {
        // Academic Task 1
        if (['lineGraph', 'barChart', 'line', 'bar'].includes(taskSubType)) {
          vocab.push({
            id: 'trends',
            title: t('vocabulary.trendWords'),
            items: trendVocabulary.categories.slice(0, 3).map(cat => ({
              category: cat.name[lang] || cat.name.en,
              basic: cat.verbs.basic.slice(0, 3),
              advanced: cat.verbs.advanced.slice(0, 2)
            }))
          });

          vocab.push({
            id: 'adverbs',
            title: 'Degree Adverbs',
            items: [{
              category: 'Strong Change',
              phrases: trendVocabulary.adverbs.strong.slice(0, 4).map(a => a.word)
            }, {
              category: 'Mild Change',
              phrases: trendVocabulary.adverbs.mild.slice(0, 4).map(a => a.word)
            }]
          });
        }

        if (taskSubType === 'map') {
          vocab.push({
            id: 'map',
            title: t('vocabulary.mapWords'),
            items: Object.entries(mapVocabulary.transformationVerbs).slice(0, 4).map(([key, data]) => ({
              category: data.name[lang] || data.name.en,
              phrases: data.words.slice(0, 3).map(w => w.word)
            }))
          });
        }

        if (taskSubType === 'process') {
          vocab.push({
            id: 'process',
            title: t('vocabulary.processWords'),
            items: [{
              category: 'Beginning',
              phrases: processVocabulary.sequencers.beginning.slice(0, 3).map(s => s.phrase)
            }, {
              category: 'Middle',
              phrases: processVocabulary.sequencers.middle.slice(0, 3).map(s => s.phrase)
            }, {
              category: 'End',
              phrases: processVocabulary.sequencers.end.slice(0, 3).map(s => s.phrase)
            }]
          });
        }
      }
    }

    return vocab;
  }, [taskType, taskSubType, testType, t, lang]);

  return (
    <div className="vocab-helper">
      <div className="vocab-header">
        <Lightbulb size={20} />
        <h3>Vocabulary Helper</h3>
      </div>

      <div className="vocab-sections">
        {relevantVocab.map(section => (
          <div key={section.id} className="vocab-section">
            <button 
              className="section-header"
              onClick={() => toggleSection(section.id)}
            >
              <span>{section.title}</span>
              {expandedSections.includes(section.id) 
                ? <ChevronUp size={18} /> 
                : <ChevronDown size={18} />
              }
            </button>

            {expandedSections.includes(section.id) && (
              <div className="section-content">
                {section.items.map((item, idx) => (
                  <div key={idx} className="vocab-item">
                    <h4>{item.category}</h4>
                    
                    {item.basic && (
                      <div className="vocab-level">
                        <span className="level-badge basic">Band 5-6</span>
                        <div className="words">
                          {item.basic.map((word, i) => (
                            <span key={i} className="word">{word}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.advanced && (
                      <div className="vocab-level">
                        <span className="level-badge advanced">Band 7-9</span>
                        <div className="words">
                          {item.advanced.map((word, i) => (
                            <span key={i} className="word highlighted">
                              {typeof word === 'string' ? word : word.word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.phrases && (
                      <div className="phrases">
                        {item.phrases.map((phrase, i) => (
                          <span key={i} className="phrase">{phrase}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VocabHelper;
