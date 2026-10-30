import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import footprintRoutes from './footprintRoutes.js';
import recommendationRoutes from './recommendationRoutes.js';
import chatRoutes from './chatRoutes.js';
import activityRoutes from './activityRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'carbon-coach-backend',
  });
});

// Mount module routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/footprints', footprintRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/chat', chatRoutes);
router.use('/activities', activityRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
