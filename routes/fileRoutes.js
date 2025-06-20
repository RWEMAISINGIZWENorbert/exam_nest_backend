import express from 'express';
import { getAllFiles, getFileById, uploadFile } from '../controllers/fileController.js';
const fileRouter = express.Router();

// Upload file route
fileRouter.post('/upload', uploadFile);

// Get all files route
fileRouter.get('/', getAllFiles);

// Get file by ID route
fileRouter.get('/:id', getFileById);

export default fileRouter;