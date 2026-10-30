import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

export default router;
