import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models';
import authRoutes from './routes/auth';
import memeRoutes from './routes/memes';
import voteRoutes from './routes/votes';
import commentRoutes from './routes/comments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/memes', memeRoutes);
app.use('/api/memes', voteRoutes);     
app.use('/api/memes', commentRoutes);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.log(err.stack);
  res.status(err.status || 500).json({
    code: err.status || 500,
    description: err.message || 'Errore'
  });
});

// Avvio del server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connessione al database stabilita con successo');

    await sequelize.sync();
    console.log('Modelli sincronizzati con il database');

    app.listen(PORT, () => {
      console.log(`Server MEMEMUSEUM in esecuzione su http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Errore durante l\'avvio del server:', error);
    process.exit(1);
  }
}
startServer();