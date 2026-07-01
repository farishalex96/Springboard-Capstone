import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getMyPlants, addMyPlant, updateMyPlant, deleteMyPlant } from '../controllers/myPlantController.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getMyPlants);
router.post('/', addMyPlant);
router.put('/:id', updateMyPlant);
router.delete('/:id', deleteMyPlant);

export default router;
