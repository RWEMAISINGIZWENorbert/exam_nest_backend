import express  from 'express';
import { totalPapers } from '../controllers/summaryController.js';
const summaryRoutes = express.Router();

summaryRoutes.get('/summary-dashboard', totalPapers);

export default summaryRoutes;