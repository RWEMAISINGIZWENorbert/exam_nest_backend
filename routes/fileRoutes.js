const express = require('express');
const fileController = require('../controllers/fileController');
const router = express.Router();

// Upload file route
router.post('/upload', fileController.uploadFile);

// Get all files route
router.get('/', fileController.getAllFiles);

// Get file by ID route
router.get('/:id', fileController.getFileById);

module.exports = router; 