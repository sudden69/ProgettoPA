"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    // Verifica se l'utente è un amministratore
    //console.log(req.user);
    if (req.user && req.user.isAdmin) {
        next(); // Passa al middleware successivo
    }
    else {
        res.status(403).json({ message: 'Access denied' }); // Utente non autorizzato
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=isAdmin.js.map