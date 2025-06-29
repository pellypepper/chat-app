"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = require("../controller/registerController");
const router = express_1.default.Router();
// Register a new user 
router.post('/', registerController_1.Register);
// Verify email with code
router.post('/verify', registerController_1.VerifyEmail);
exports.default = router;
