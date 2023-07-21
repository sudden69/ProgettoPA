import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Game, Move, User } from '../db';
import { WhereOptions } from 'sequelize';
import { GameInstance } from '../models/models';
import { GameCreationAttributes } from '../models/models';
import { computeMove } from 'tic-tac-toe-ai-engine'; // Importa la funzione computeMove dall'AI Tic Tac Toe Engine
import { MoveInstance } from '../models/models';
import PDFDocument from 'pdfkit';
import Sequelize from 'sequelize';
// Ottieni la classifica dei giocatori
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    // Esplicita il tipo di order usando l'operatore di tipo asserzione (as)
    const order = req.query.order as string;

    // Controlla se order è una stringa prima di chiamare toLowerCase
    const sortOrder = (typeof order === 'string' && order.toLowerCase() === 'desc') ? 'DESC' : 'ASC';

    // Ottieni la classifica dei giocatori dal database
    const leaderboard = await User.findAll({
      attributes: [
        'id',
        'username',
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Games"
          WHERE (CAST("Games"."winner" AS INTEGER) = "User"."id")
        )`), 'wonGames'],
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Games"
          WHERE ((CAST("Games"."winner" AS INTEGER) != "User"."id") AND ((CAST("Games"."opponentId" AS INTEGER) = "User"."id")
          OR (CAST("Games"."userId" AS INTEGER) = "User"."id")))
        )`), 'lostGames'],
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Games"
          WHERE (("Games"."status" = 'abandoned') AND (CAST("Games"."winner" AS INTEGER) = "User"."id"))
        )`), 'wonGamesByAbandon'],
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Games"
          WHERE "Games"."status" = 'abandoned' AND CAST("Games"."winner" AS INTEGER) != "User"."id" AND (CAST("Games"."opponentId" AS INTEGER) = "User"."id"
          OR CAST("Games"."userId" AS INTEGER) = "User"."id")
        )`), 'lostGamesByAbandon'],
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Games"
          WHERE CAST("Games"."opponentId" AS INTEGER) = 0 AND CAST("Games"."winner" AS INTEGER) = "User"."id"
        )`), 'wonGamesAgainstAI'],
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Games"
          WHERE CAST("Games"."opponentId" AS INTEGER) = 0  AND CAST("Games"."userId" AS INTEGER) = "User"."id" AND CAST("Games"."winner" AS INTEGER) != "User"."id"
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Funzione per generare il PDF della cronologia delle mosse di una partita
const generatePDF = async (moves: MoveInstance[], res: Response) => {
  try {
    const doc = new PDFDocument();
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating PDF' });
  }
};


interface CustomRequest extends Request {
  user: any;
}

const findMoveDiff = (currentGameState: string[], nextGameState: string[]): number => {
  for (let i = 0; i < currentGameState.length; i++) {
    if (currentGameState[i] !== nextGameState[i]) {
      return i;
    }
  }
  return -1; // Return -1 if no move was found
};

const playAI = async (game: GameInstance) => {
  if (game.opponentId === 0) {
    // Recupera lo stato corrente della scacchiera dal gioco
    const boardState = game.boardState;

    // Fa giocare l'AI calcolando la sua mossa con computeMove
    const AIMoveResult = computeMove(boardState, 'O');
    const AIMoveIndex = findMoveDiff(boardState, AIMoveResult.nextBestGameState);

    // Effettua la mossa dell'AI nel gioco
    const newMove = await Move.create({ gameId: game.id, userId: 0, position: AIMoveIndex });

    // Aggiorna lo stato della partita con la mossa dell'AI
    const updatedGameState = updateGameState(boardState, AIMoveIndex, 'O');
    await game.update({ boardState: updatedGameState });

    // Verifica se la partita è terminata
    const winner = checkWinner(updatedGameState);
    if (winner) {
      await game.update({ status: 'completed', winner: winner === 'X' ? game.userId.toString() : game.opponentId.toString() });
    } else if (!updatedGameState.includes('')) {
      await game.update({ status: 'draw' });
    }
  }
};

// Creazione di una nuova partita
export const createGame = async (req: CustomRequest, res: Response) => {
  const { userId } = req.user;
  const { opponent } = req.body; // Rinominato da opponentId a opponent

  try {
    // Verifica se l'utente sta giocando contro l'IA o contro un altro utente
    const isAgainstAI = opponent === 'AI';

    // Se l'utente gioca contro l'IA, impostiamo opponentId a 0, altrimenti otteniamo l'id dell'utente avversario
    const opponentId = isAgainstAI ? 0 : await getUserIdFromEmail(opponent); // Funzione per ottenere l'id dell'utente avversario dalla sua email

    // Verifica se l'utente ha già una partita in corso
    const existingGame = await Game.findOne({
      where: {
        [Op.or]: [
          { userId, status: 'in_progress' },
          { userId: opponentId, status: 'in_progress' }, // Rinominato da opponentId a opponent
        ],
      },
    });

    if (existingGame) {
      return res.status(400).json({ error: 'User already has an ongoing game' });
    }

    // Controlla il credito dell'utente
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Definisci il costo della partita in base a se è contro un utente o l'IA
    const gameCost = isAgainstAI ? 0.75 : 0.50;

    // Verifica se l'utente ha abbastanza token per creare la partita
    if (user.credit < gameCost) {
      return res.status(401).json({ error: 'Not enough tokens to create a game 401 Unauthorized' });
    }

    
    if(!isAgainstAI)
    {
      const user2 = await User.findByPk(opponentId);
    if (!user2) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const gameCost2 =  0.50;
    if (user2.credit < gameCost2) {
      return res.status(401).json({ error: 'Not enough tokens to create a game (avversario) 401 Unauthorized' });
    }

    // Scala i token dal credito dell'utente
    await user2.update({ credit: user2.credit - gameCost2 });
    }

    // Scala i token dal credito dell'utente
    await user.update({ credit: user.credit - gameCost });

    // Crea una nuova partita nel database
    const newGame = await Game.create({
      userId,
      opponentId,
      boardState: ['', '', '', '', '', '', '', '', ''],
      status: 'in_progress',
    } as GameCreationAttributes);

    res.json(newGame);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Funzione di utilità per ottenere l'id dell'utente dalla sua email
const getUserIdFromEmail = async (email: string): Promise<number | null> => {
  try {
    const user = await User.findOne({ where: { email } });
    return user?.id || null;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get user from email');
  }
};

// Ottieni lo stato della partita
export const getGameStatus = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;

    // Verifica se la partita esiste
    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    let currentPlayer;
    if (game.boardState.filter(Boolean).length % 2 === 0) {
      currentPlayer = game.userId;
    } else {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Effettua una mossa nel gioco
export const makeMove = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req.user;
    const { gameId, move } = req.body;

    // Verifica se la partita esiste
    const game = await Game.findByPk(gameId);
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
    const user = await User.findByPk(userId);
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
    await user.update({ credit: user.credit - moveCost });

    // Effettua la mossa nel gioco
    const newMove = await Move.create({ gameId, userId, position: move });

    // Aggiorna lo stato della partita con la nuova mossa
    const updatedGameState = updateGameState(game.boardState, move, userId === game.userId ? 'X' : 'O');
    await game.update({ boardState: updatedGameState });

    // Verifica se la partita è terminata
    const winner = checkWinner(updatedGameState);
    if (winner) {
      // Converto l'ID numerico del vincitore in una stringa
      await game.update({ status: 'completed', winner: winner === 'X' ? game.userId.toString() : game.opponentId.toString() });
    } else if (!updatedGameState.includes('')) {
      await game.update({ status: 'draw' });
    }

    if (game.opponentId === 0) 
    {
      
    const user2 = await User.findByPk(userId);
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
    await user2.update({ credit: user2.credit - moveCostAI });
      
    await playAI(game);

    }
    res.json(newMove);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Funzione di utilità per verificare se una mossa è valida
const validateMove = (boardState: string[], move: number): boolean => {
  return boardState[move] === '';
};

// Funzione di utilità per aggiornare lo stato del gioco con una nuova mossa
const updateGameState = (boardState: string[], move: number, symbol: string): string[] => {
  const updatedBoardState = [...boardState];
  updatedBoardState[move] = symbol;
  return updatedBoardState;
};

// Funzione di utilità per verificare se c'è un vincitore
const checkWinner = (boardState: string[]): string | null => {
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
export const abandonGame = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req.user;
    const { gameId } = req.params;
    console.log(gameId);
    // Verifica se la partita esiste
    const game = await Game.findByPk(gameId);
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
    await game.update({ status: 'completed', winner: winnerId.toString() });

    // Abbandona la partita
    await game.update({ status: 'abandoned' });

    res.json({ message: 'Game abandoned' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Ottieni le mosse di una partita
export const getGameMoves = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    console.log('Game ID:', gameId);
    // Verifica se la partita esiste
    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Ottieni le mosse della partita
    const moves = await Move.findAll({ where: { gameId } });

    res.json(moves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Ottieni la cronologia delle mosse di una partita
export const getGameHistory = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const { startDate, endDate } = req.query;

    // Verifica se la partita esiste
    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Costruisci la condizione per il periodo temporale usando le date fornite nei parametri della richiesta
    let condition: any = { gameId };
    if (startDate && endDate) {
      const startDateObj = new Date(startDate.toString());
      const endDateObj = new Date(endDate.toString());

      condition.createdAt = {
        [Op.between]: [startDateObj, endDateObj],
      };
    }

    // Ottieni la cronologia delle mosse della partita con la condizione del periodo temporale
    const moves = await Move.findAll({ where: condition, order: [['createdAt', 'ASC']] });


    const format = req.query.format as string;
    if (format && format.toLowerCase() === 'pdf') {
      // Genera il PDF della cronologia delle mosse
      generatePDF(moves, res);
    } else {
      // Restituisci la cronologia delle mosse in formato JSON
      res.json(moves);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
