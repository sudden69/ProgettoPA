import { Request, Response, NextFunction } from 'express';
import * as  jwt from 'jsonwebtoken';
import {User} from '../db'
interface CustomRequest extends Request {
    user: any; 
  }

  const authenticateAdminToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number }; // Decodifica il token e ottieni solo l'id dell'utente
      const user = await User.findByPk(decoded.userId); // Recupera l'utente dal database utilizzando l'id
  
      if (!user) {
        return res.status(401).json({ error: 'User not found authToken' });
      }
  
      req.user = user; // Aggiungi l'intero oggetto utente alla richiesta
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
  
  

interface CustomRequest extends Request {
    user: any; 
  }

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export {authenticateAdminToken, authenticateToken};
