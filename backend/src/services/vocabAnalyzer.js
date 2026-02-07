// Vocabulary Analyzer Service
// Analyzes text for Band 5-6 vs Band 7-9 vocabulary usage

const vocabAnalyzer = {
  // Basic words that should be upgraded
  basicVocab: {
    // Cohesive devices
    'and': ['furthermore', 'moreover', 'additionally'],
    'but': ['however', 'nevertheless', 'conversely', 'notwithstanding'],
    'so': ['consequently', 'therefore', 'thus', 'hence'],
    'also': ['furthermore', 'moreover', 'in addition'],
    'because': ['due to', 'owing to', 'as a result of'],
    
    // Trend words
    'went up': ['increased', 'rose', 'climbed', 'surged'],
    'went down': ['decreased', 'declined', 'fell', 'dropped'],
    'a lot': ['significantly', 'considerably', 'substantially'],
    'very': ['extremely', 'highly', 'remarkably'],
    'big': ['significant', 'substantial', 'considerable'],
    'small': ['minor', 'slight', 'marginal', 'negligible'],
    'fast': ['rapid', 'swift', 'dramatic'],
    'slow': ['gradual', 'steady', 'moderate'],
    
    // Common replacements
    'good': ['beneficial', 'advantageous', 'positive'],
    'bad': ['detrimental', 'adverse', 'negative'],
    'important': ['crucial', 'essential', 'paramount', 'vital'],
    'think': ['believe', 'consider', 'argue', 'contend'],
    'people think': ['it is widely believed', 'many argue', 'some contend'],
    'more and more': ['an increasing number of', 'a growing number of'],
    'nowadays': ['in contemporary society', 'in the modern era'],
    'kids': ['children', 'young people', 'the younger generation'],
    'get': ['obtain', 'acquire', 'receive'],
    'give': ['provide', 'offer', 'present'],
    'show': ['demonstrate', 'illustrate', 'indicate', 'reveal'],
    'use': ['utilize', 'employ', 'make use of'],
    'help': ['assist', 'aid', 'facilitate'],
    'need': ['require', 'necessitate'],
    'want': ['desire', 'wish', 'seek'],
    'like': ['such as', 'for instance', 'including'],
    'thing': ['factor', 'aspect', 'element', 'issue'],
    'way': ['method', 'approach', 'means'],
    'problem': ['issue', 'challenge', 'concern', 'difficulty']
  },

  // Advanced vocabulary (Band 7-9)
  advancedVocab: [
    'furthermore', 'moreover', 'consequently', 'nevertheless', 'notwithstanding',
    'thereby', 'hence', 'thus', 'whereby', 'whereas',
    'surged', 'plummeted', 'soared', 'fluctuated', 'oscillated',
    'precipitous', 'marginal', 'negligible', 'substantial', 'significant',
    'paramount', 'crucial', 'detrimental', 'beneficial', 'prevalent',
    'predominantly', 'inherently', 'fundamentally', 'inevitably', 'undoubtedly'
  ],

  analyzeText(text) {
    const words = text.toLowerCase().split(/\s+/);
    const suggestions = [];
    const advancedUsed = [];
    const basicFound = [];

    // Check for basic vocabulary that could be upgraded
    for (const [basic, advanced] of Object.entries(this.basicVocab)) {
      const regex = new RegExp(`\\b${basic}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        basicFound.push(basic);
        suggestions.push({
          original: basic,
          count: matches.length,
          suggested: advanced,
          type: 'upgrade'
        });
      }
    }

    // Check for advanced vocabulary used
    for (const word of this.advancedVocab) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(text)) {
        advancedUsed.push(word);
      }
    }

    // Calculate vocabulary score estimate
    const totalWords = words.length;
    const advancedCount = advancedUsed.length;
    const basicCount = basicFound.length;
    
    let vocabLevel = 'Band 5-6';
    if (advancedCount >= 5 && basicCount <= 3) {
      vocabLevel = 'Band 7-8';
    } else if (advancedCount >= 8 && basicCount <= 2) {
      vocabLevel = 'Band 8-9';
    } else if (advancedCount >= 3) {
      vocabLevel = 'Band 6-7';
    }

    return {
      wordCount: totalWords,
      vocabLevel,
      advancedVocabUsed: advancedUsed,
      advancedCount,
      basicVocabFound: basicFound,
      basicCount,
      suggestions: suggestions.slice(0, 10), // Limit to top 10 suggestions
      summary: {
        strength: advancedUsed.length > 0 
          ? `Good use of advanced vocabulary: ${advancedUsed.slice(0, 5).join(', ')}`
          : 'Consider using more advanced vocabulary',
        improvement: suggestions.length > 0
          ? `Replace basic words like "${suggestions[0].original}" with "${suggestions[0].suggested[0]}"`
          : 'Good vocabulary variety'
      }
    };
  }
};

module.exports = vocabAnalyzer;
