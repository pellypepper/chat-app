"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loginController_1 = require("../controller/loginController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Login route
router.post("/", loginController_1.login);
// Google login route
router.get("/google", loginController_1.googleLogin);
router.get('/user', auth_1.authenticateAccessToken, loginController_1.getCurrentUser);
router.post('/refresh', auth_1.authenticateAccessToken, loginController_1.getCurrentUser);
// Google callback
router.get("/google/callback", loginController_1.googleLoginCallback);
// Logout route
router.post("/logout", loginController_1.logout);
exports.default = router;
