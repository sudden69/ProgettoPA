import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { getUserFromToken } from '../utils/jwtUtils';
import  dotenv from 'dotenv';
import {User} from '../db'
import  express from 'express'
import  cors from 'cors'
import routes from '../routes/routes';
interface CustomRequest extends ExpressRequest {
  user: any; 
}

dotenv.config();

// Inizializza l'app Express
const app = express();

// Middleware per il parsing del corpo delle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware per l'abilitazione delle richieste da domini diversi
app.use(cors());

// Collega le rotte all'app Express
app.use(routes);

// Gestione degli errori
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Avvia il server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  try {
    const user = getUserFromToken(req); // Metodo ausiliario per ottenere l'utente dal token JWT
    req.user = user; // Aggiungi l'utente alla richiesta per l'accesso successivo

    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default authMiddleware;
const checkTokenAvailability = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const user = getUserFromToken(req); // Metodo ausiliario per ottenere l'utente dal token JWT

  if (user.credit <= 0) {
    res.status(401).json({ error: 'Token exhausted' });
  } else {
    next();
  }
};

// Rotta per l’utente con ruolo admin per effettuare la ricarica del credito di un utente
/*app.post('/admin/recharge', authMiddleware, checkTokenAvailability, async (req: CustomRequest, res: Response) => {
  const { email, credit } = req.body;
  const adminUser = req.user;

  // Controlla se l'utente loggato ha il ruolo di admin
  if (adminUser.role !== 'admin') {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  // Effettua la ricarica del credito per l'utente specificato
  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      user.credit += credit;
      await user.save();

      res.status(200).json({ message: 'User credit recharged successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});*/
