import express from 'express';
const aiRouter = express.Router();
import {processFileAndGenerateAnswers} from "../controllers/aiController.js";
// Route to process file and generate answers
aiRouter.post('/process/:fileId', processFileAndGenerateAnswers);

export default aiRouter;