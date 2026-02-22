import { Router } from 'express';
import memeController from '../controllers/memeController';
import { authenticateToken } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = Router();

// GET /api/memes/meme-of-the-day
router.get('/meme-of-the-day', memeController.memeOfTheDay);

// GET /api/memes
router.get('/', memeController.getAll);

// GET /api/memes/:id
router.get('/:id', memeController.getById);

// POST /api/memes
router.post('/', authenticateToken, upload.single('image'), memeController.create);

export default router;