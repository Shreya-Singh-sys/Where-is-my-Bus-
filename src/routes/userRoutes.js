import express from 'express';
import userController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);

router.get('/favorites', userController.getUserFavorites);
router.post('/favorites', userController.addFavorite);
router.delete('/favorites', userController.removeFavorite);

router.get('/notifications', userController.getUserNotifications);
router.patch('/notifications/:notificationId/read', userController.markNotificationAsRead);

export default router;