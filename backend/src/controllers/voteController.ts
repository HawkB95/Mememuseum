import { Response } from 'express';
import { Meme, Vote } from '../models';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../config/AppError';

class VoteController {

  // VOTO MEME (AUTH)
  async vote(req: AuthRequest, res: Response): Promise<void> {
      const userId = req.user?.id;
      const memeId = parseInt(req.params.memeId as string);
      const { value } = req.body;

      if (!userId) throw new AppError('Utente non autenticato', 401);
      if (isNaN(memeId)) throw new AppError('ID non valido', 400)
      if (value !== 1 && value !== -1) throw new AppError('Voto non valido', 400)

      // Gestione Voti
      const existingVote = await Vote.findOne({ where: { userId, memeId } });
      if (existingVote) {
        const oldValue = existingVote.getDataValue('value') as number

        // Stesso Voto => Rimozione
        if (oldValue === value) {
          await existingVote.destroy();
          await Meme.decrement('score', { by: oldValue, where: { id: memeId } });
          res.json({ message: 'Voto rimosso', vote: null });
        
        // Voto Diverso => Cambio
        } else {
          await existingVote.update({ value });
          await Meme.increment('score', { by: value - oldValue, where: { id: memeId } });
          res.json({ message: 'Voto aggiornato', vote: existingVote });
        }

      } else {
        const newVote = await Vote.create({ value, userId, memeId });
        await Meme.increment('score', { by: value, where: { id: memeId } });
        res.status(201).json({ message: 'Voto registrato', vote: newVote });
      }
  }

  // OTTIENE VOTO DELL'UTENTE (AUTH)
  async getUserVote(req: AuthRequest, res: Response): Promise<void> {
      const userId = req.user?.id;
      const memeId = parseInt(req.params.memeId as string);

      if (!userId) throw new AppError('Utente non autenticato', 401);
      if (isNaN(memeId)) throw new AppError('ID non valido', 400)

      const vote = await Vote.findOne({ where: { userId, memeId } });
      if (vote) res.json({ vote: vote.toJSON() });
        else res.json({ vote: null });
      
  }
}
export default new VoteController();