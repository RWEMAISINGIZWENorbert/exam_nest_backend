import dotenv  from 'dotenv';
dotenv.config();
import express  from'express';
import dbConnect from './config/db_connect.js';
import fileRoutes from './routes/fileRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/ai', aiRoutes);

dbConnect().then(() => 
   app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`))
);
