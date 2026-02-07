const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .txt, .pdf, .docx allowed.'));
    }
  }
});

// Evaluation routes
router.post('/evaluate', evaluationController.evaluateEssay);
router.post('/evaluate/upload', upload.single('file'), evaluationController.evaluateUploadedFile);

// Vocabulary analysis
router.post('/analyze-vocab', evaluationController.analyzeVocabulary);

module.exports = router;
