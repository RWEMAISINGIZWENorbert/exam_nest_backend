import express  from 'express';
import { summaryDashboard } from '../controllers/summaryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const summaryRoutes = express.Router();

// summaryRoutes.get('/summary-dashboard', totalPapers);
summaryRoutes.get('/summary-dashboard', authMiddleware,summaryDashboard);

export default summaryRoutes;