import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User} from '../db';
import { validationResult, body } from 'express-validator';
import {UserCreationAttributes}  from '../models/models'
interface CustomRequest extends Request {
  user: any; 
}

// Middleware per la validazione dei dati di registrazione
export const validateRegisterData = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
  body('username').notEmpty().withMessage('Username is required'),
];

// Registrazione utente
export const registerUser = async (req: CustomRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, name, username, credit, isAdmin } = req.body;

    // Verifica se l'utente esiste già
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Crea un hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuovo utente nel database
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      username,
      credit,  // Dobbiamo specificare un valore per il campo "credit"
      isAdmin // Dobbiamo specificare un valore per il campo "isAdmin"
    } as UserCreationAttributes);

    // Genera un token JWT
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Autenticazione utente
export const authenticateUser = async (req: CustomRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Verifica se l'utente esiste
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verifica la password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Genera un token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
