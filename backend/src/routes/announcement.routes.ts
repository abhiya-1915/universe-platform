import { Router } from 'express';
import { announcementController } from '../controllers/announcement.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', protect, announcementController.getAll);

export default router;
