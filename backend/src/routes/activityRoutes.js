import { Router } from 'express';
import { getActivities, getActivityById } from '../controllers/activityController.js';
import { optionalAuthenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthenticate, getActivities);
router.get('/:id', optionalAuthenticate, getActivityById);

export default router;
