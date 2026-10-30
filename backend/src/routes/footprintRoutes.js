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

// Calculator endpoints (support optional authentication for both guests & logged in users)
router.post('/calculate', optionalAuthenticate, calculateFootprint);
router.post('/save-batch', optionalAuthenticate, saveBatchFootprints);

// Protected telemetry endpoints
router.use(authenticate);
router.post('/activity', logEmissionActivity);
router.get('/history', getFootprintHistory);
router.get('/summary', getFootprintSummary);

export default router;
