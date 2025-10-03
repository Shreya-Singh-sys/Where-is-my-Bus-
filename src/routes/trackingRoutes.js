import express from 'express';
import trackingController from '../controllers/trackingController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/active', trackingController.getAllActiveTracking);
router.get('/:busId/location', trackingController.getBusLocation);
router.get('/:busId/location/history', trackingController.getBusLocationHistory);
router.get('/:busId', trackingController.getCurrentTracking);

router.post('/location', trackingController.updateBusLocation);
router.post('/tracking', trackingController.updateTracking);
router.patch('/:busId/status', authMiddleware, adminMiddleware, trackingController.updateTrackingStatus);

export default router;
