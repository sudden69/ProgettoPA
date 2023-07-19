import * as express from 'express';
import { body } from 'express-validator';
import { authenticateUser, registerUser } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

// Registrazione utente
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('credit').notEmpty().withMessage('Credit is required'),
    body('isAdmin').notEmpty().withMessage('isAdmin is required'),
  ],
  validateRequest,
  registerUser
);

// Autenticazione utente e generazione di token JWT
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  authenticateUser
);

// Rotta protetta per verificare l'autenticazione tramite token JWT
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Authenticated' });
});

export default router;
