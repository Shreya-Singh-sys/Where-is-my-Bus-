import express from 'express';
import stopController from '../controllers/stopController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', stopController.getAllStops);
router.get('/nearby', stopController.getNearbyStops);
router.get('/search', stopController.searchStops);
router.get('/:id', stopController.getStopById);

router.post('/', authMiddleware, adminMiddleware, stopController.createStop);
router.put('/:id', authMiddleware, adminMiddleware, stopController.updateStop);
router.delete('/:id', authMiddleware, adminMiddleware, stopController.deleteStop);

export default router;