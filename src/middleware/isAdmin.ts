import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
    user: any; 
  }

export const isAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
  // Verifica se l'utente è un amministratore
  //console.log(req.user);
  
  if (req.user && req.user.isAdmin) {
    next(); // Passa al middleware successivo
  } else {
    res.status(403).json({ message: 'Access denied' }); // Utente non autorizzato
  }
};