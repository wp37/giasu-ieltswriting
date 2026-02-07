const OpenAI = require('openai');
const task1AcademicPrompt = require('../prompts/task1Academic');
const task1GTPrompt = require('../prompts/task1GT');
const task2Prompt = require('../prompts/task2');

// Lazy initialization of OpenAI client
let openai = null;

function getOpenAIClient() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'sk-your-openai-api-key-here') {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in .env file.');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

const openaiService = {
  async evaluateEssay({ essay, taskType, taskSubType, topic, wordCount }) {
    // Select appropriate prompt based on task type
    let systemPrompt;
    
    if (taskType === 'task1') {
      if (taskSubType === 'letter') {
        systemPrompt = task1GTPrompt.getPrompt(taskSubType);
      } else {
        systemPrompt = task1AcademicPrompt.getPrompt(taskSubType);
      }
    } else {
      systemPrompt = task2Prompt.getPrompt(taskSubType);
    }

    const userMessage = `
TOPIC: ${topic || 'Not provided'}

ESSAY (${wordCount} words):
${essay}

Please evaluate this IELTS ${taskType === 'task1' ? 'Task 1' : 'Task 2'} response according to the official IELTS band descriptors.
`;

    try {
      const client = getOpenAIClient();
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const content = response.choices[0].message.content;
      
      // Parse JSON response
      try {
        // Extract JSON from response (handle markdown code blocks)
        let jsonStr = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1].trim();
        }
        
        return JSON.parse(jsonStr);
      } catch (parseError) {
        // If JSON parsing fails, return structured response from text
        return {
          overallBand: 6.0,
          rawFeedback: content,
          parseError: true,
          taskAchievement: { band: 6.0, feedback: 'See detailed feedback below' },
          coherenceCohesion: { band: 6.0, feedback: 'See detailed feedback below' },
          lexicalResource: { band: 6.0, feedback: 'See detailed feedback below', suggestions: [] },
          grammaticalRange: { band: 6.0, feedback: 'See detailed feedback below', corrections: [] }
        };
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
};

module.exports = openaiService;
