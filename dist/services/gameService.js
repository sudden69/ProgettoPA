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
exports.abandonGame = exports.makeMove = exports.createGame = void 0;
const db_1 = require("../db");
const createGame = (player1Id, player2Id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const game = yield db_1.Game.create({ userId: player1Id, opponentId: player2Id, status: 'active' });
        return game;
    }
    catch (error) {
        throw new Error('Failed to create game');
    }
});
exports.createGame = createGame;
const makeMove = (gameId, playerId, position) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const move = yield db_1.Move.create({ gameId, userId: playerId, position });
        return move;
    }
    catch (error) {
        throw new Error('Failed to make move');
    }
});
exports.makeMove = makeMove;
const abandonGame = (gameId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.Game.update({ status: 'abandoned' }, { where: { id: gameId } });
    }
    catch (error) {
        throw new Error('Failed to abandon game');
    }
});
exports.abandonGame = abandonGame;
//# sourceMappingURL=gameService.js.map