import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { newSubject } from '../controllers/subjectController.js';
const subjectRoutes = express.Router();

subjectRoutes.post('/add', authMiddleware, newSubject);

export default subjectRoutes;