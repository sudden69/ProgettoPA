import * as express from 'express';
import { body } from 'express-validator';
import { getUserProfile, updateUserProfile } from '../controllers/userController';
import { authenticateToken, authenticateAdminToken} from '../middleware/authenticateToken';
import { validateRequest } from '../middleware/validateRequest';
import { isAdmin } from '../middleware/isAdmin';
import {  adminRechargeCredit } from '../controllers/userAdminController';
const router = express.Router();

// Ottieni il profilo dell'utente
router.get('/profile', authenticateToken, getUserProfile);

// Aggiorna il profilo dell'utente
router.put(
  '/profile',
  [
    body('email').isEmail().withMessage('Email is not valid'),
    body('name').trim().notEmpty().withMessage('Name is required'),
  ],
  validateRequest,
  authenticateToken,
  updateUserProfile
);

// Ricarica il credito per un utente (solo per l'amministratore)
router.post(
  '/recharge',
  [
    body('email').isEmail().withMessage('Email is not valid'),
    body('credit').isNumeric().withMessage('Credit must be a number'),
  ],
  validateRequest,
  authenticateAdminToken,
  isAdmin,
  adminRechargeCredit
);

export default router;
