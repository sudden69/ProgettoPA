"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameHistory = exports.getGameMoves = exports.abandonGame = exports.makeMove = exports.getGameStatus = exports.createGame = exports.getLeaderboard = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const tic_tac_toe_ai_engine_1 = require("tic-tac-toe-ai-engine"); // Importa la funzione computeMove dall'AI Tic Tac Toe Engine
const pdfkit_1 = __importDefault(require("pdfkit"));
const sequelize_2 = __importDefault(require("sequelize"));
// Ottieni la classifica dei giocatori
const getLeaderboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Esplicita il tipo di order usando l'operatore di tipo asserzione (as)
        const order = req.query.order;
        // Controlla se order è una stringa prima di chiamare toLowerCase
        const sortOrder = (typeof order === 'string' && order.toLowerCase() === 'desc') ? 'DESC' : 'ASC';
        // Ottieni la classifica dei giocatori dal database
        const leaderboard = yield db_1.User.findAll({
            attributes: [
                'id',
                'username',
                [sequelize_2.default.literal(`(
          SELECT COUNT(*)
          FROM "Games"
          WHERE (CAST("Games"."winner" AS INTEGER) = "User"."id" AND "Games"."status" != 'draw')
          OR (CAST("Games"."opponentId" AS INTEGER) = "User"."id" AND "Games"."status" = 'draw')
        )`), 'wonGames'],
                [sequelize_2.default.literal(`(
          SELECT COUNT(*)
          FROM "Games"
          WHERE (CAST("Games"."opponentId" AS INTEGER) = "User"."id" AND "Games"."status" != 'draw')
          OR (CAST("Games"."winner" AS INTEGER) = "User"."id" AND "Games"."status" = 'draw')
        )`), 'lostGames'],
                [sequelize_2.default.literal(`(
          SELECT COUNT(*)
          FROM "Games"
          WHERE "Games"."status" = 'abandoned' AND CAST("Games"."winner" AS INTEGER) = "User"."id"
        )`), 'wonGamesByAbandon'],
                [sequelize_2.default.literal(`(
          SELECT COUNT(*)
          FROM "Games"
          WHERE "Games"."status" = 'abandoned' AND CAST("Games"."opponentId" AS INTEGER) = "User"."id"
        )`), 'lostGamesByAbandon'],
                [sequelize_2.default.literal(`(
          SELECT COUNT(*)
          FROM "Games"
          WHERE "Games"."opponentId" = 0 AND "Games"."status" = 'completed' AND CAST("Games"."winner" AS INTEGER) = "User"."id"
        )`), 'wonGamesAgainstAI'],
                [sequelize_2.default.literal(`(
          SELECT COUNT(*)
          FROM "Games"
          WHERE "Games"."opponentId" = 0 AND "Games"."status" = 'completed' AND CAST("Games"."opponentId" AS INTEGER) = "User"."id"
        )`), 'lostGamesAgainstAI'],
            ],
            order: [
                ['wonGames', sortOrder],
                ['lostGames', sortOrder],
                ['wonGamesByAbandon', sortOrder],
                ['lostGamesByAbandon', sortOrder],
                ['wonGamesAgainstAI', sortOrder],
                ['lostGamesAgainstAI', sortOrder],
            ],
        });
        res.json(leaderboard);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getLeaderboard = getLeaderboard;
// Funzione per generare il PDF della cronologia delle mosse di una partita
const generatePDF = (moves, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = new pdfkit_1.default();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="game_history.pdf"');
        doc.pipe(res);
        // Aggiungiamo i dati al PDF
        doc.text('Game History', { align: 'center', underline: true });
        doc.moveDown();
        for (const move of moves) {
            doc.text(`Move ${move.id}: Player ${move.userId}, Position ${move.position}`, { align: 'left' });
            doc.moveDown();
        }
        doc.end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating PDF' });
    }
});
const findMoveDiff = (currentGameState, nextGameState) => {
    for (let i = 0; i < currentGameState.length; i++) {
        if (currentGameState[i] !== nextGameState[i]) {
            return i;
        }
    }
    return -1; // Return -1 if no move was found
};
const playAI = (game) => __awaiter(void 0, void 0, void 0, function* () {
    if (game.opponentId === 0) {
        // Recupera lo stato corrente della scacchiera dal gioco
        const boardState = game.boardState;
        // Fa giocare l'AI calcolando la sua mossa con computeMove
        const AIMoveResult = (0, tic_tac_toe_ai_engine_1.computeMove)(boardState, 'O');
        const AIMoveIndex = findMoveDiff(boardState, AIMoveResult.nextBestGameState);
        // Effettua la mossa dell'AI nel gioco
        const newMove = yield db_1.Move.create({ gameId: game.id, userId: 0, position: AIMoveIndex });
        // Aggiorna lo stato della partita con la mossa dell'AI
        const updatedGameState = updateGameState(boardState, AIMoveIndex, 'O');
        yield game.update({ boardState: updatedGameState });
        // Verifica se la partita è terminata
        const winner = checkWinner(updatedGameState);
        if (winner) {
            yield game.update({ status: 'completed', winner: winner === 'X' ? game.userId.toString() : game.opponentId.toString() });
        }
        else if (!updatedGameState.includes('')) {
            yield game.update({ status: 'draw' });
        }
    }
});
// Creazione di una nuova partita
const createGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { opponent } = req.body; // Rinominato da opponentId a opponent
    try {
        // Verifica se l'utente sta giocando contro l'IA o contro un altro utente
        const isAgainstAI = opponent === 'AI';
        // Se l'utente gioca contro l'IA, impostiamo opponentId a 0, altrimenti otteniamo l'id dell'utente avversario
        const opponentId = isAgainstAI ? 0 : yield getUserIdFromEmail(opponent); // Funzione per ottenere l'id dell'utente avversario dalla sua email
        // Verifica se l'utente ha già una partita in corso
        const existingGame = yield db_1.Game.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { userId, status: 'in_progress' },
                    { userId: opponentId, status: 'in_progress' }, // Rinominato da opponentId a opponent
                ],
            },
        });
        if (existingGame) {
            return res.status(400).json({ error: 'User already has an ongoing game' });
        }
        // Controlla il credito dell'utente
        const user = yield db_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Definisci il costo della partita in base a se è contro un utente o l'IA
        const gameCost = isAgainstAI ? 0.75 : 0.50;
        // Verifica se l'utente ha abbastanza token per creare la partita
        if (user.credit < gameCost) {
            return res.status(401).json({ error: 'Not enough tokens to create a game 401 Unauthorized' });
        }
        if (!isAgainstAI) {
            const user2 = yield db_1.User.findByPk(opponentId);
            if (!user2) {
                return res.status(404).json({ error: 'User not found' });
            }
            const gameCost2 = 0.50;
            if (user2.credit < gameCost2) {
                return res.status(401).json({ error: 'Not enough tokens to create a game (avversario) 401 Unauthorized' });
            }
            // Scala i token dal credito dell'utente
            yield user2.update({ credit: user2.credit - gameCost2 });
        }
        // Scala i token dal credito dell'utente
        yield user.update({ credit: user.credit - gameCost });
        // Crea una nuova partita nel database
        const newGame = yield db_1.Game.create({
            userId,
            opponentId,
            boardState: ['', '', '', '', '', '', '', '', ''],
            status: 'in_progress',
        });
        res.json(newGame);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createGame = createGame;
// Funzione di utilità per ottenere l'id dell'utente dalla sua email
const getUserIdFromEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.User.findOne({ where: { email } });
        return (user === null || user === void 0 ? void 0 : user.id) || null;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to get user from email');
    }
});
// Ottieni lo stato della partita
const getGameStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gameId } = req.params;
        // Verifica se la partita esiste
        const game = yield db_1.Game.findByPk(gameId);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        let currentPlayer;
        if (game.boardState.filter(Boolean).length % 2 === 0) {
            currentPlayer = game.userId;
        }
        else {
            currentPlayer = game.opponentId === 0 ? 'AI' : game.opponentId;
        }
        const winner = game.winner;
        const boardState = game.boardState;
        const gameStatus = {
            gameId: game.id,
            status: game.status,
            currentPlayer,
            isCompleted: game.status === 'completed',
            boardState,
            winner,
        };
        res.json(gameStatus);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getGameStatus = getGameStatus;
// Effettua una mossa nel gioco
const makeMove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { gameId, move } = req.body;
        // Verifica se la partita esiste
        const game = yield db_1.Game.findByPk(gameId);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        // Verifica se l'utente è autorizzato a fare la mossa
        if (![game.userId, game.opponentId].includes(userId)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        // Verifica se la partita è in corso
        if (game.status !== 'in_progress') {
            return res.status(400).json({ error: 'Game is not in progress' });
        }
        // Verifica se è il turno dell'avversario
        if (game.boardState.filter(Boolean).length % 2 === 0 && userId !== game.userId) {
            return res.status(400).json({ error: "It's not your turn" });
        }
        if (userId === game.userId && game.boardState.filter((val) => val !== '').length % 2 === 1) {
            return res.status(400).json({ error: "It's opponent's turn, wait for opponent's move" });
        }
        // Verifica se la mossa è valida
        const isValidMove = validateMove(game.boardState, move);
        if (!isValidMove) {
            return res.status(400).json({ error: 'Invalid move' });
        }
        // Controlla il credito dell'utente
        const user = yield db_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Definisci il costo della mossa
        const moveCost = 0.015;
        // Verifica se l'utente ha abbastanza token per effettuare la mossa
        //if (user.credit < moveCost) {
        //  return res.status(400).json({ error: 'Not enough tokens to make a move' });
        //}
        // Scala i token dal credito dell'utente
        yield user.update({ credit: user.credit - moveCost });
        // Effettua la mossa nel gioco
        const newMove = yield db_1.Move.create({ gameId, userId, position: move });
        // Aggiorna lo stato della partita con la nuova mossa
        const updatedGameState = updateGameState(game.boardState, move, userId === game.userId ? 'X' : 'O');
        yield game.update({ boardState: updatedGameState });
        // Verifica se la partita è terminata
        const winner = checkWinner(updatedGameState);
        if (winner) {
            // Converto l'ID numerico del vincitore in una stringa
            yield game.update({ status: 'completed', winner: winner === 'X' ? game.userId.toString() : game.opponentId.toString() });
        }
        else if (!updatedGameState.includes('')) {
            yield game.update({ status: 'draw' });
        }
        if (game.opponentId === 0) {
            const user2 = yield db_1.User.findByPk(userId);
            if (!user2) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Definisci il costo della mossa
            const moveCostAI = 0.015;
            // Verifica se l'utente ha abbastanza token per effettuare la mossa
            //if (user2.credit < moveCostAI) {
            //return res.status(400).json({ error: 'Not enough tokens to make a move' });
            //}
            // Scala i token dal credito dell'utente
            yield user2.update({ credit: user2.credit - moveCostAI });
            yield playAI(game);
        }
        res.json(newMove);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.makeMove = makeMove;
// Funzione di utilità per verificare se una mossa è valida
const validateMove = (boardState, move) => {
    return boardState[move] === '';
};
// Funzione di utilità per aggiornare lo stato del gioco con una nuova mossa
const updateGameState = (boardState, move, symbol) => {
    const updatedBoardState = [...boardState];
    updatedBoardState[move] = symbol;
    return updatedBoardState;
};
// Funzione di utilità per verificare se c'è un vincitore
const checkWinner = (boardState) => {
    const winningCombinations = [
        // Righe
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Colonne
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonali
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    return null;
};
// Abbandona una partita
const abandonGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { gameId } = req.params;
        console.log(gameId);
        // Verifica se la partita esiste
        const game = yield db_1.Game.findByPk(gameId);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        // Verifica se l'utente è autorizzato a abbandonare la partita
        if (![game.userId, game.opponentId].includes(userId)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        // Verifica quale giocatore ha abbandonato e assegna la vittoria all'altro giocatore
        const winnerId = userId === game.userId ? game.opponentId : game.userId;
        // Assegna la vittoria all'utente non abbandonante
        yield game.update({ status: 'completed', winner: winnerId.toString() });
        // Abbandona la partita
        yield game.update({ status: 'abandoned' });
        res.json({ message: 'Game abandoned' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.abandonGame = abandonGame;
// Ottieni le mosse di una partita
const getGameMoves = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gameId } = req.params;
        console.log('Game ID:', gameId);
        // Verifica se la partita esiste
        const game = yield db_1.Game.findByPk(gameId);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        // Ottieni le mosse della partita
        const moves = yield db_1.Move.findAll({ where: { gameId } });
        res.json(moves);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getGameMoves = getGameMoves;
// Ottieni la cronologia delle mosse di una partita
const getGameHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gameId } = req.params;
        const { startDate, endDate } = req.query;
        // Verifica se la partita esiste
        const game = yield db_1.Game.findByPk(gameId);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        // Costruisci la condizione per il periodo temporale usando le date fornite nei parametri della richiesta
        let condition = { gameId };
        if (startDate && endDate) {
            const startDateObj = new Date(startDate.toString());
            const endDateObj = new Date(endDate.toString());
            condition.createdAt = {
                [sequelize_1.Op.between]: [startDateObj, endDateObj],
            };
        }
        // Ottieni la cronologia delle mosse della partita con la condizione del periodo temporale
        const moves = yield db_1.Move.findAll({ where: condition, order: [['createdAt', 'ASC']] });
        const format = req.query.format;
        if (format && format.toLowerCase() === 'pdf') {
            // Genera il PDF della cronologia delle mosse
            generatePDF(moves, res);
        }
        else {
            // Restituisci la cronologia delle mosse in formato JSON
            res.json(moves);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getGameHistory = getGameHistory;
//# sourceMappingURL=gameController.js.map