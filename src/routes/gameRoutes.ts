import * as express from 'express';
import { createGame, makeMove, abandonGame, getGameMoves, getGameHistory, getGameStatus, getLeaderboard } from '../controllers/gameController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

// Creazione di una nuova partita
router.post('/games', authenticateToken, createGame);

// Effettua una mossa nel gioco
router.post('/games/:id/moves', authenticateToken, makeMove);

// Abbandona una partita
router.post('/games/:gameId/abandon', authenticateToken, abandonGame);

// Ottieni le mosse di una partita
router.get('/games/:gameId/moves', authenticateToken, getGameMoves);

// Ottieni la cronologia delle mosse di una partita
router.get('/games/:gameId/history', getGameHistory);

//stato della partita
router.get('/games/:gameId/status', authenticateToken, getGameStatus);

// Ottieni la classifica dei giocatori
router.get('/games/leaderboard', getLeaderboard);
export default router;
