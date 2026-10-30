import { Router } from 'express';
import {
  calculateFootprint,
  saveBatchFootprints,
  logEmissionActivity,
  getFootprintHistory,
  getFootprintSummary,
} from '../controllers/footprintController.js';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Calculator and Dashboard endpoints (support optional authentication for both guests & logged in users)
router.post('/calculate', optionalAuthenticate, calculateFootprint);
router.post('/save-batch', optionalAuthenticate, saveBatchFootprints);
router.get('/summary', optionalAuthenticate, getFootprintSummary);

// Protected telemetry endpoints
router.use(authenticate);
router.post('/activity', logEmissionActivity);
router.get('/history', getFootprintHistory);

export default router;
