import { GameInstance, MoveInstance } from '../models/models'; // Importa i tipi dei modelli, non gli oggetti stessi
import {Game, Move} from '../db'
export const createGame = async (player1Id: number, player2Id: number): Promise<GameInstance> => {
  try {
    const game = await Game.create({ userId: player1Id, opponentId: player2Id, status: 'active' });
    return game;
  } catch (error) {
    throw new Error('Failed to create game');
  }
};

export const makeMove = async (gameId: number, playerId: number, position: number): Promise<MoveInstance> => {
  try {
    const move = await Move.create({ gameId, userId: playerId, position });
    return move;
  } catch (error) {
    throw new Error('Failed to make move');
  }
};

export const abandonGame = async (gameId: number): Promise<void> => {
  try {
    await Game.update({ status: 'abandoned' }, { where: { id: gameId } });
  } catch (error) {
    throw new Error('Failed to abandon game');
  }
};
