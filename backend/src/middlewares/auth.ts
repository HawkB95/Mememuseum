import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/jwt';
import { AppError } from '../config/AppError';

const JWT_SECRET = getJwtSecret();

export interface AuthRequest extends Request {
  user?: { id: number, username: string};
}

export function authenticateToken(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return next(new AppError('Token di autenticazione mancante', 401));

  // Validazione Token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next(new AppError('Token non valido o scaduto', 401));
    req.user = decoded as { id: number; username: string };
    next();
  });
}