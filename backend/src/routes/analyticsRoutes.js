import { Router } from 'express';
import {
  getAnalyticsSummary,
  getAnalyticsTrends,
  getAnalyticsCategories,
} from '../controllers/analyticsController.js';
import { optionalAuthenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/summary', optionalAuthenticate, getAnalyticsSummary);
router.get('/trends', optionalAuthenticate, getAnalyticsTrends);
router.get('/categories', optionalAuthenticate, getAnalyticsCategories);

export default router;
