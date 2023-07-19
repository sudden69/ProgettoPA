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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllData = void 0;
const db_1 = require("../db");
// Funzione per ottenere tutti i modelli dal database e convertirli in formato JSON
const getAllData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.User.findAll();
        const games = yield db_1.Game.findAll();
        const moves = yield db_1.Move.findAll();
        const usersJSON = users.map((user) => user.toJSON());
        const gamesJSON = games.map((game) => game.toJSON());
        const movesJSON = moves.map((move) => move.toJSON());
        return {
            users: usersJSON,
            games: gamesJSON,
            moves: movesJSON,
        };
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to fetch data from the database');
    }
});
exports.getAllData = getAllData;
//# sourceMappingURL=dataService.js.map