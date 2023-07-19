"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const validateRequest_1 = require("../middleware/validateRequest");
const authenticateToken_1 = require("../middleware/authenticateToken");
const router = express.Router();
// Registrazione utente
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('username').notEmpty().withMessage('Username is required'),
    (0, express_validator_1.body)('credit').notEmpty().withMessage('Credit is required'),
    (0, express_validator_1.body)('isAdmin').notEmpty().withMessage('isAdmin is required'),
], validateRequest_1.validateRequest, authController_1.registerUser);
// Autenticazione utente e generazione di token JWT
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email'),
    (0, express_validator_1.body)('password').trim().notEmpty().withMessage('Password is required'),
], validateRequest_1.validateRequest, authController_1.authenticateUser);
// Rotta protetta per verificare l'autenticazione tramite token JWT
router.get('/protected', authenticateToken_1.authenticateToken, (req, res) => {
    res.json({ message: 'Authenticated' });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map