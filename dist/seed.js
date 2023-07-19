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
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const seedData = [
    {
        username: 'admin1',
        email: 'admin1@example.com',
        password: 'adminpassword',
        credit: 100,
        isAdmin: true,
    },
    {
        username: 'user2',
        email: 'user2@example.com',
        password: 'user1password',
        credit: 50,
        isAdmin: false,
    },
    // Aggiungi altri dati di esempio se necessario
];
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const data of seedData) {
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            data.password = hashedPassword;
        }
        yield db_1.User.bulkCreate(seedData, {
            individualHooks: true,
        });
        console.log('Seed data inserted successfully.');
    }
    catch (error) {
        console.error('Error inserting seed data:', error);
    }
    finally {
        // Chiudi la connessione al database o fai altre operazioni necessarie
        process.exit();
    }
});
seedDatabase();
//# sourceMappingURL=seed.js.map