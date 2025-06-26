import express from 'express';
const aiRouter = express.Router();
import {processFileAndGenerateAnswers} from "../controllers/aiController.js";
import authMiddleware from '../middleware/authMiddleware.js';
// Route to process file and generate answers
aiRouter.post('/process/:fileId', authMiddleware, processFileAndGenerateAnswers);

export default aiRouter;