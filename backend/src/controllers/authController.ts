import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { getJwtSecret } from '../config/jwt';
import { Op } from 'sequelize';
import { AppError } from '../config/AppError';

const SALT_ROUNDS = 10;
const JWT_SECRET = getJwtSecret();

class AuthController {

  // REGISTRAZIONE NUOVO UTENTE
  async register(req: Request, res: Response): Promise<void> {
      const { username, email, password } = req.body;

      // Validazione Campi Obbligatori
      if (!username || !email || !password)
        throw new AppError('Username, email e password sono obbligatori', 400);

      // Controllo Unicità Username ed Email
      const existingUser = await User.findOne({
        where: { [Op.or]: [{ username }, { email }] }
      });

      if (existingUser) {
        throw new AppError('Username o email già in uso', 409);
      }

      // Hashing Password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Creazione Utente
      const createdUser = await User.create({
        username,
        email,
        password: hashedPassword
      });

      //Risposta al Client
      const userData = createdUser.toJSON();
      res.status(201).json({
        id: userData.id,
        username: userData.username,
        email: userData.email
      });
  }

  // LOGIN 
  async login(req: Request, res: Response): Promise<void> {
      const { username, password } = req.body;

      // Validazione Campi Obbligatori
      if (!username || !password)
        throw new AppError('Username e password sono obbligatori', 400);

      //Ricerca Utente
      const user = await User.findOne({ where: { username } });
      if (!user) throw new AppError('Credenziali non valide', 401);
      const userData = user.toJSON();

      // Verifica Password
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) throw new AppError('Credenziali non valide', 401);

      // Generazione JWT
      const token = jwt.sign(
        { id: userData.id, username: userData.username },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Risposta al Client
      res.json({
        token,
        user: {
          id: userData.id,
          username: userData.username,
          email: userData.email
        }
      });
  }
}
export default new AuthController();