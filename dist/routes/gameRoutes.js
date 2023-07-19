"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const gameController_1 = require("../controllers/gameController");
const authenticateToken_1 = require("../middleware/authenticateToken");
const router = express.Router();
// Creazione di una nuova partita
router.post('/games', authenticateToken_1.authenticateToken, gameController_1.createGame);
// Effettua una mossa nel gioco
router.post('/games/:id/moves', authenticateToken_1.authenticateToken, gameController_1.makeMove);
// Abbandona una partita
router.post('/games/:gameId/abandon', authenticateToken_1.authenticateToken, gameController_1.abandonGame);
// Ottieni le mosse di una partita
router.get('/games/:gameId/moves', authenticateToken_1.authenticateToken, gameController_1.getGameMoves);
// Ottieni la cronologia delle mosse di una partita
router.get('/games/:gameId/history', gameController_1.getGameHistory);
//stato della partita
router.get('/games/:gameId/status', authenticateToken_1.authenticateToken, gameController_1.getGameStatus);
// Ottieni la classifica dei giocatori
router.get('/games/leaderboard', gameController_1.getLeaderboard);
exports.default = router;
//# sourceMappingURL=gameRoutes.js.map