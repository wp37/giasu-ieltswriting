const openaiService = require('../services/openaiService');
const fileParser = require('../services/fileParser');
const vocabAnalyzer = require('../services/vocabAnalyzer');

const evaluationController = {
  // Evaluate essay text directly
  async evaluateEssay(req, res) {
    try {
      const { essay, taskType, taskSubType, topic } = req.body;

      if (!essay || !taskType) {
        return res.status(400).json({ 
          error: 'Missing required fields: essay and taskType' 
        });
      }

      const wordCount = essay.trim().split(/\s+/).filter(w => w.length > 0).length;
      
      // Check minimum word count
      const minWords = taskType === 'task1' ? 150 : 250;
      const wordCountWarning = wordCount < minWords 
        ? `Warning: Your essay has ${wordCount} words. Minimum recommended is ${minWords} words.`
        : null;

      const evaluation = await openaiService.evaluateEssay({
        essay,
        taskType,
        taskSubType,
        topic,
        wordCount
      });

      res.json({
        success: true,
        wordCount,
        wordCountWarning,
        evaluation
      });
    } catch (error) {
      console.error('Evaluation error:', error);
      res.status(500).json({ 
        error: 'Failed to evaluate essay', 
        details: error.message 
      });
    }
  },

  // Evaluate uploaded file
  async evaluateUploadedFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { taskType, taskSubType, topic } = req.body;

      // Parse file content
      const essay = await fileParser.parseFile(req.file);

      if (!essay || essay.trim().length === 0) {
        return res.status(400).json({ error: 'Could not extract text from file' });
      }

      const wordCount = essay.trim().split(/\s+/).filter(w => w.length > 0).length;
      const minWords = taskType === 'task1' ? 150 : 250;
      const wordCountWarning = wordCount < minWords 
        ? `Warning: Your essay has ${wordCount} words. Minimum recommended is ${minWords} words.`
        : null;

      const evaluation = await openaiService.evaluateEssay({
        essay,
        taskType: taskType || 'task2',
        taskSubType,
        topic,
        wordCount
      });

      res.json({
        success: true,
        extractedText: essay,
        wordCount,
        wordCountWarning,
        evaluation
      });
    } catch (error) {
      console.error('File evaluation error:', error);
      res.status(500).json({ 
        error: 'Failed to process file', 
        details: error.message 
      });
    }
  },

  // Analyze vocabulary level in text
  async analyzeVocabulary(req, res) {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'No text provided' });
      }

      const analysis = vocabAnalyzer.analyzeText(text);

      res.json({
        success: true,
        analysis
      });
    } catch (error) {
      console.error('Vocabulary analysis error:', error);
      res.status(500).json({ 
        error: 'Failed to analyze vocabulary', 
        details: error.message 
      });
    }
  }
};

module.exports = evaluationController;
