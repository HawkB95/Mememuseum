import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Meme, Tag, MemeTag, User, Vote, Comment } from '../models';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../config/AppError';

class MemeController {

  // UPLOAD MEME (AUTH)
  async create(req: AuthRequest, res: Response): Promise<void> {
      const userId = req.user?.id;
      const { title, tags } = req.body;
      const file = req.file;

      if (!userId) throw new AppError('Utente non autenticato', 401);
      if (!title) throw new AppError('Titolo obbligatorio', 400)
      if (!file) throw new AppError('Titolo obbligatorio', 400)
      
      //Creazione Meme
      await Meme.create({
        title,
        imageUrl: '/uploads/' + file.filename,
        userId
      });

      const meme = await Meme.findOne({
        where: { imageUrl: '/uploads/' + file.filename }
      });

      if (!meme) throw new AppError('Errore durante la creazione del meme', 500)
      const memeData = meme.toJSON();
      
      // Gestione Tag & Creazione Tag
      if (tags) {
        const tagNames = tags
            .split(',')
            .map((t: string) => t.trim().toLowerCase())
            .filter((t: string) => t.length > 0);

        for (const tagName of tagNames) {
          let tag: any = await Tag.findOne({ where: { name: tagName } });

          if (!tag) {
            await Tag.create({ name: tagName });
            tag = await Tag.findOne({ where: { name: tagName } })!;
          }

          const tagData = tag.toJSON();
          await MemeTag.create({
            memeId: memeData.id,
            tagId: tagData.id
          });
        }
      }

      const completeMeme = await Meme.findByPk(memeData.id, {
        include: [
          { model: User, as: 'author', attributes: ['id', 'username'] },
          { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
        ]
      });

      // Risposta al Client
      res.status(201).json(completeMeme);
  }

  // LISTA MEME PAGINAZIONE + FILTRI
  async getAll(req: Request, res: Response): Promise<void> {

      // Paginazione
      const page = parseInt(req.query.page as string) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      // Filtri
      const tag = req.query.tag as string;
      const dateFrom = req.query.dateFrom as string;
      const dateTo = req.query.dateTo as string;
      
      // Ordinamento
      const sortBy = req.query.sortBy as string || 'date_desc';

      const where: any = {};

      // Filtro per Data
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) {
          where.createdAt[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.createdAt[Op.lte] = new Date(dateTo);
        }
      }

      // Filtro per Tag
      const tagInclude: any = {
        model: Tag, as: 'tags',
        attributes: ['id', 'name'],
        through: { attributes: [] } // Esclude campi tabella ponte
      };

      if (tag) {
        tagInclude.where = { name: tag.toLowerCase() };
      }

      // Modifica Ordinamento
      let order: [string, string][];
      if (sortBy === 'votes_desc') {
        order = [['score', 'DESC']];
      } else if (sortBy === 'votes_asc') {
        order = [['score', 'ASC']];
      } else if (sortBy === 'date_asc') {
        order = [['createdAt', 'ASC']];
      } else {
        order = [['createdAt', 'DESC']]; // default
      }

      // Paginazione
      const { count, rows } = await Meme.findAndCountAll({
        where,
        include: [
          { model: User, as: 'author', attributes: ['id', 'username']},
          tagInclude
        ],
        order,
        limit,
        offset,
        distinct: true
      });

      // Risposta al Client
      res.json({
        memes: rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      });
  }

  // DETTAGLIO SINGOLO MEME 
  async getById(req: Request, res: Response): Promise<void> {
      const id = parseInt(req.params.id as string);
      
      if (isNaN(id)) throw new AppError('ID non valido', 400)
      
      // Recupero Meme + Info
      const meme = await Meme.findByPk(id, {
        include: [
          { model: User, as: 'author', attributes: ['id', 'username'] },
          { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } },
          { model: Vote, as: 'votes', attributes: ['id', 'value', 'userId'] },
          { model: Comment, as: 'comments',
            attributes: ['id', 'text', 'createdAt'],
            include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
            order : [['createdAt' , 'DESC']],
            separate : true
          },
        ]
      });

      if (!meme) throw new AppError('Meme non trovato', 404)
      const memeData = meme.toJSON() as any;

      // Calcolo Upvotes e Downvotes
      const upvotes = memeData.votes ? memeData.votes.filter((v: any) => v.value === 1).length : 0;
      const downvotes = memeData.votes ? memeData.votes.filter((v: any) => v.value === -1).length : 0;

      res.json({
        ...memeData,
        upvotes,
        downvotes
      });
  }

  // MEME DEL GIORNO 
  async memeOfTheDay(_req: Request, res: Response): Promise<void> {
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const x = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
      
      const totalMemes = await Meme.count({
        where: { createdAt: {[Op.lt]: today}}
      })
      
      if (totalMemes === 0) throw new AppError('Nessun meme presente', 404)
        
      const memeIndex = x % totalMemes;

      // Recupera meme del giorno
      const meme = await Meme.findOne({
        order: [['id', 'ASC']],
        offset: memeIndex
      });

      if (!meme) throw new AppError('Meme del giorno non disponibile', 404)

      const memeData = meme.toJSON() as any;

      res.json({
        id: memeData.id
      });
  }
}
export default new MemeController();