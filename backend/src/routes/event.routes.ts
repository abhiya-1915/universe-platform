import { Router } from 'express';
import { eventController } from '../controllers/event.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', eventController.getAllEvents);
router.get('/recommendations/for-you', protect, eventController.getRecommendations);
router.get('/enrolled', protect, eventController.getEnrolledEvents);
router.get('/:id', eventController.getEventById);

// Protected routes
router.post('/:id/register', protect, eventController.registerForEvent);

// Admin / DSA only routes
router.post('/', protect, authorize('ADMIN', 'DSA'), eventController.createEvent);

export default router;
