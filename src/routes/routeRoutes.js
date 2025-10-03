import express from 'express';
import routeController from '../controllers/routeController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', routeController.getAllRoutes);
router.get('/active', routeController.getActiveRoutes);
router.get('/search', routeController.searchRoutes);
router.get('/:id', routeController.getRouteById);
router.get('/:id/stops', routeController.getRouteWithStops);

router.post('/', authMiddleware, adminMiddleware, routeController.createRoute);
router.put('/:id', authMiddleware, adminMiddleware, routeController.updateRoute);
router.delete('/:id', authMiddleware, adminMiddleware, routeController.deleteRoute);

export default router;
