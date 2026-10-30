import { Router } from 'express';
import { handleChatMessage } from '../controllers/chatController.js';
import { optionalAuthenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', optionalAuthenticate, handleChatMessage);

export default router;
