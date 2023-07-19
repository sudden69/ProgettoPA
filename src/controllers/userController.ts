import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../db';

interface CustomRequest extends Request {
  user: any; 
}
// Ottieni il profilo dell'utente
export const getUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req.user;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Aggiorna il profilo dell'utente
export const updateUserProfile = async (req: CustomRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.user;
    const { email, name } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.email = email;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
