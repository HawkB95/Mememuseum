import { Router } from 'express';
import voteController from '../controllers/voteController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// POST /api/memes/:memeId/votes
router.post('/:memeId/votes', authenticateToken, voteController.vote);

// GET /api/memes/:memeId/votes/me
router.get('/:memeId/votes/me', authenticateToken, voteController.getUserVote);

export default router;