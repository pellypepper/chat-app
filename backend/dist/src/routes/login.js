"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var loginController_1 = require("../controller/loginController");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
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
//# sourceMappingURL=login.js.map