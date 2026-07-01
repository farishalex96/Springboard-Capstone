import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getFavorites);
router.post('/:plantId', addFavorite);
router.delete('/:plantId', removeFavorite);

export default router;
