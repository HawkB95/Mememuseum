import { Router } from 'express';
import commentController from '../controllers/commentController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// POST /api/memes/:memeId/comments
router.post('/:memeId/comments', authenticateToken, commentController.create);

// GET /api/memes/:memeId/comments
router.get('/:memeId/comments', commentController.getByMemeId);

export default router;