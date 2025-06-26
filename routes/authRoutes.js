import express from 'express';
import { editSchool, login, logout, markAllowed, schoolRegister, userRegister } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const authRoutes = express.Router();

authRoutes.post('/school-register', schoolRegister);
authRoutes.put('/mark-allowed-status', markAllowed);
authRoutes.put('/edit-school', editSchool);
authRoutes.post('/user-register', userRegister);
authRoutes.post('/login', login);
authRoutes.get('/logout', authMiddleware, logout);


export default authRoutes;