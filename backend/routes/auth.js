import express from 'express';
import { login, register, profile, getHardinessZone } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, profile);
router.get('/hardiness-zone', getHardinessZone);

export default router;
