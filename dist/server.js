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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const routes_1 = __importDefault(require("./routes/routes"));
// Carica le variabili d'ambiente
dotenv_1.default.config();
// Inizializza l'app Express
const app = (0, express_1.default)();
// Configura il parsing del corpo delle richieste in formato JSON
app.use(express_1.default.json());
// Configura le rotte dell'app
app.use('/api', routes_1.default);
// Avvia il server
const port = process.env.PORT || 3000;
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is running on port ${port}`);
    // Connettiti al database
    try {
        yield (0, db_1.connectDatabase)();
        console.log('Connected to database');
    }
    catch (error) {
        console.error('Failed to connect to database:', error);
    }
}));
//# sourceMappingURL=server.js.map