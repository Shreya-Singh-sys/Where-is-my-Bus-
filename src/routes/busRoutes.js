import express from 'express';
import busController from '../controllers/busController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', busController.getAllBuses);
router.get('/active', busController.getActiveBuses);
router.get('/number/:busNumber', busController.getBusByNumber);
router.get('/:id', busController.getBusById);

router.post('/', authMiddleware, adminMiddleware, busController.createBus);
router.put('/:id', authMiddleware, adminMiddleware, busController.updateBus);
router.delete('/:id', authMiddleware, adminMiddleware, busController.deleteBus);
router.patch('/:id/status', authMiddleware, adminMiddleware, busController.updateBusStatus);

export default router;
