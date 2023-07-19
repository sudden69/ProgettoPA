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
exports.Move = exports.Game = exports.User = exports.connectDatabase = exports.Sequelize = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Sequelize", { enumerable: true, get: function () { return sequelize_1.Sequelize; } });
const models_1 = require("./models/models");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
exports.sequelize = sequelize;
// Definizione dei modelli
const User = (0, models_1.userModelFactory)(sequelize);
exports.User = User;
const Game = (0, models_1.gameModelFactory)(sequelize);
exports.Game = Game;
const Move = (0, models_1.moveModelFactory)(sequelize);
exports.Move = Move;
// Definizione delle associazioni tra modelli, se necessario
// Esempio: User.hasMany(Game);
// Connettiti al database e sincronizza i modelli
function connectDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sequelize.authenticate();
            console.log('Connection to the database has been established successfully.');
            // Sincronizza i modelli con il database
            yield sequelize.sync();
            console.log('Database synchronized.');
            // Restituisci i modelli per essere utilizzati altrove
            return { User, Game, Move };
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
            throw error;
        }
    });
}
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=db.js.map