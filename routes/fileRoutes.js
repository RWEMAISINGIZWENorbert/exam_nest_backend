import express from 'express';
import { getAllFiles, getFileById, uploadFile, uploadQuestionsAndAnswers, upload } from '../controllers/fileController.js';
const fileRouter = express.Router();

// Upload questions (and optional answers) route
fileRouter.post('/upload-questions', upload.fields([
    { name: 'questions', maxCount: 1 },
    { name: 'answers', maxCount: 1 }
]), uploadQuestionsAndAnswers);

// Upload file route
fileRouter.post('/upload', upload.single('file'), uploadFile);

// Get all files route
fileRouter.get('/', getAllFiles);

// Get file by ID route
fileRouter.get('/:id', getFileById);

export default fileRouter;