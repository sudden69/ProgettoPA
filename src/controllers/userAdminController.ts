import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../db';

// Ricarica il credito per un utente (solo per l'amministratore)
export const adminRechargeCredit = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, credit } = req.body;
    const creditToAdd = parseFloat(credit); // Converte la stringa in un valore numerico float

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.credit = user.credit + creditToAdd; // Esegue la somma numerica
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
