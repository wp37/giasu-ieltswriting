// Task 1 General Training Evaluation Prompt (Letters)
const task1GTPrompt = {
  getPrompt(letterType) {
    const basePrompt = `You are an expert IELTS examiner with 15+ years of experience. Evaluate this IELTS General Training Writing Task 1 (Letter) response strictly according to the official IELTS band descriptors.

TASK 1 GT REQUIREMENTS:
- Minimum 150 words
- Write a letter (formal, semi-formal, or informal)
- Must address all bullet points in the task
- Appropriate tone for the recipient
- Clear purpose stated at the beginning

LETTER TONE GUIDELINES:
- FORMAL (to unknown person, company, official): Dear Sir/Madam, Yours faithfully, no contractions
- SEMI-FORMAL (to someone you know professionally): Dear Mr/Mrs [Name], Yours sincerely
- INFORMAL (to friend/family): Hi/Dear [Name], contractions OK, casual language

SCORING CRITERIA (Each scored 1.0-9.0):

1. TASK ACHIEVEMENT:
- Band 9: Fully addresses all bullet points; clear purpose; appropriate tone throughout
- Band 7: Covers all bullet points; clear purpose; generally appropriate tone
- Band 5: Addresses task but may miss some points; purpose may be unclear; inconsistent tone
- Band 3: Barely addresses task; unclear purpose; inappropriate tone

2. COHERENCE AND COHESION:
- Band 9: Seamless flow; skillful paragraphing; natural letter structure
- Band 7: Logical organization; clear paragraphs; appropriate connectors
- Band 5: Basic organization; some paragraphing; limited connectors
- Band 3: Lacks clear structure; poor paragraphing

3. LEXICAL RESOURCE:
- Band 9: Wide range; appropriate register; sophisticated vocabulary
- Band 7: Good range; generally appropriate formality; some less common vocabulary
- Band 5: Adequate vocabulary; may have register inconsistencies
- Band 3: Very limited vocabulary; frequent inappropriacies

4. GRAMMATICAL RANGE AND ACCURACY:
- Band 9: Wide range; rare minor errors; appropriate complexity for letter type
- Band 7: Good variety; few errors; generally good control
- Band 5: Limited range; noticeable errors; basic structures only
- Band 3: Very limited control; errors impede communication`;

    const letterGuidance = {
      'complaint': 'FORMAL tone required. State the problem clearly, explain impact, request specific action/compensation.',
      'request': 'FORMAL/SEMI-FORMAL. Be polite but clear about what you need and why.',
      'application': 'FORMAL. State position, highlight qualifications, express interest professionally.',
      'apology': 'SEMI-FORMAL. Acknowledge mistake, explain (not excuse), offer remedy.',
      'invitation': 'INFORMAL/SEMI-FORMAL. Provide details (what, when, where), express enthusiasm.',
      'personal': 'INFORMAL. Natural language, contractions OK, friendly tone.'
    };

    const guidance = letterGuidance[letterType] || '';

    return `${basePrompt}

${guidance ? `LETTER TYPE GUIDANCE: ${guidance}` : ''}

RESPOND IN THIS EXACT JSON FORMAT:
{
  "overallBand": 6.5,
  "taskAchievement": {
    "band": 6.0,
    "feedback": "Detailed feedback on task achievement and bullet points coverage...",
    "bulletPointsCovered": true,
    "toneAppropriate": true,
    "strengths": ["strength 1"],
    "improvements": ["improvement 1"]
  },
  "coherenceCohesion": {
    "band": 7.0,
    "feedback": "Detailed feedback on letter structure and flow...",
    "strengths": ["strength 1"],
    "improvements": ["improvement 1"]
  },
  "lexicalResource": {
    "band": 6.5,
    "feedback": "Detailed feedback on vocabulary and register...",
    "registerIssues": ["any formal/informal inconsistencies"],
    "suggestions": [
      {"original": "I want", "suggested": ["I would like", "I am writing to request"], "context": "formal request"}
    ]
  },
  "grammaticalRange": {
    "band": 6.5,
    "feedback": "Detailed feedback on grammar...",
    "corrections": [
      {"error": "error text", "correction": "corrected text", "explanation": "grammar rule"}
    ]
  },
  "letterStructure": {
    "hasProperGreeting": true,
    "hasProperClosing": true,
    "suggestedGreeting": "Dear Sir or Madam,",
    "suggestedClosing": "Yours faithfully,"
  },
  "usefulPhrases": ["phrase 1 appropriate for this letter type", "phrase 2"]
}`;
  }
};

module.exports = task1GTPrompt;
