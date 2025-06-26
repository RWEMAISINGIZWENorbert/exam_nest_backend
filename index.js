import dotenv  from 'dotenv';
dotenv.config();
import express  from'express';
import dbConnect from './config/db_connect.js';
import fileRoutes from './routes/fileRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import  cookieParser from 'cookie-parser';
import subjectRoutes from './routes/subjectRoutes.js';

const app = express();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/subjects', subjectRoutes);

dbConnect().then(() => 
   app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`))
);
