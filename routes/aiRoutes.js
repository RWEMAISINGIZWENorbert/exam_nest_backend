const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Route to process file and generate answers
router.post('/process/:fileId', aiController.processFileAndGenerateAnswers);

module.exports = router; 