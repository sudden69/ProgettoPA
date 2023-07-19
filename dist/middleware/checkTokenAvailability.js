"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtUtils_1 = require("../utils/jwtUtils");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("../routes/routes"));
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
const authMiddleware = (req, res, next) => {
    try {
        const user = (0, jwtUtils_1.getUserFromToken)(req); // Metodo ausiliario per ottenere l'utente dal token JWT
        req.user = user; // Aggiungi l'utente alla richiesta per l'accesso successivo
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
exports.default = authMiddleware;
const checkTokenAvailability = (req, res, next) => {
    const user = (0, jwtUtils_1.getUserFromToken)(req); // Metodo ausiliario per ottenere l'utente dal token JWT
    if (user.credit <= 0) {
        res.status(401).json({ error: 'Token exhausted' });
    }
    else {
        next();
    }
};
// Rotta per l’utente con ruolo admin per effettuare la ricarica del credito di un utente
/*app.post('/admin/recharge', authMiddleware, checkTokenAvailability, async (req: CustomRequest, res: Response) => {
  const { email, credit } = req.body;
  const adminUser = req.user;

  // Controlla se l'utente loggato ha il ruolo di admin
  if (adminUser.role !== 'admin') {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  // Effettua la ricarica del credito per l'utente specificato
  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      user.credit += credit;
      await user.save();

      res.status(200).json({ message: 'User credit recharged successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});*/
//# sourceMappingURL=checkTokenAvailability.js.map