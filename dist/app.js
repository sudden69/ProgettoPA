"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
// Carica le variabili di ambiente da .env
dotenv_1.default.config();
// Inizializza l'app Express
const app = (0, express_1.default)();
// Middleware per il parsing del corpo delle richieste
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Middleware per l'abilitazione delle richieste da domini diversi
app.use((0, cors_1.default)());
// Collega le rotte all'app Express
app.use(routes_1.default);
// Gestione degli errori
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});
// Avvia il server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=app.js.map