import { User, Game, Move } from '../db';

// Funzione per ottenere tutti i modelli dal database e convertirli in formato JSON
export const getAllData = async () => {
  try {
    const users = await User.findAll();
    const games = await Game.findAll();
    const moves = await Move.findAll();

    const usersJSON = users.map((user) => user.toJSON());
    const gamesJSON = games.map((game) => game.toJSON());
    const movesJSON = moves.map((move) => move.toJSON());

    return {
      users: usersJSON,
      games: gamesJSON,
      moves: movesJSON,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data from the database');
  }
};
