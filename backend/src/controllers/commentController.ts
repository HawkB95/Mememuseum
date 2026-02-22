import { Response } from 'express';
import { Comment, User } from '../models';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../config/AppError';

class CommentController {

  // AGGIUNGI COMMENTO (AUTH)
  async create(req: AuthRequest, res: Response): Promise<void> {
      const userId = req.user?.id;
      const memeId = parseInt(req.params.memeId as string);
      const { text } = req.body;

      if (!userId) throw new AppError('Utente non autenticato', 401);
      if (isNaN(memeId)) throw new AppError('ID meme non valido', 400);
      if (!text || text.trim().length === 0) 
        throw new AppError('Il testo del commento è obbligatorio', 400);

      // Creazione Commento
      await Comment.create({
        text: text.trim(),
        userId,
        memeId
      });

      //Recupero Commento+Autore
      const createdComment = await Comment.findOne({
        where: { userId, memeId, text: text.trim() },
        include: [ { model: User, as: 'author', attributes: ['id', 'username'] }],
      });

      // Risposta al Client
      res.status(201).json(createdComment);
  }

  // RECUPERO COMMENTI DI UN MEME
  async getByMemeId(req: AuthRequest, res: Response): Promise<void> {
      const memeId = parseInt(req.params.memeId as string);

      if (isNaN(memeId)) throw new AppError('ID meme non valido', 400);

      // Recupero Commenti + Autori
      const comments = await Comment.findAll({
        where: { memeId },
        include: [ { model: User, as: 'author', attributes: ['id', 'username'] }],
      });

      // Risposta al Client
      res.json(comments);
  }
}
export default new CommentController();