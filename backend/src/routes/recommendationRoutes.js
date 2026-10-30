import { Router } from 'express';
import { getRecommendations, updateRecommendationStatus } from '../controllers/recommendationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getRecommendations);
router.patch('/:id/status', updateRecommendationStatus);

export default router;
