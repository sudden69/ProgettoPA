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
const userController_1 = require("../controllers/userController");
const authenticateToken_1 = require("../middleware/authenticateToken");
const validateRequest_1 = require("../middleware/validateRequest");
const isAdmin_1 = require("../middleware/isAdmin");
const userAdminController_1 = require("../controllers/userAdminController");
const router = express.Router();
// Ottieni il profilo dell'utente
router.get('/profile', authenticateToken_1.authenticateToken, userController_1.getUserProfile);
// Aggiorna il profilo dell'utente
router.put('/profile', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Email is not valid'),
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
], validateRequest_1.validateRequest, authenticateToken_1.authenticateToken, userController_1.updateUserProfile);
// Ricarica il credito per un utente (solo per l'amministratore)
router.post('/recharge', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Email is not valid'),
    (0, express_validator_1.body)('credit').isNumeric().withMessage('Credit must be a number'),
], validateRequest_1.validateRequest, authenticateToken_1.authenticateAdminToken, isAdmin_1.isAdmin, userAdminController_1.adminRechargeCredit);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map