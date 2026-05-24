import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', protect, notificationController.getNotifications);
router.post('/read', protect, notificationController.markAsRead);

export default router;
