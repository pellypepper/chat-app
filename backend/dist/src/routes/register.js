"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var registerController_1 = require("../controller/registerController");
var router = express_1.default.Router();
// Register a new user 
router.post('/', registerController_1.Register);
// Verify email with code
router.post('/verify', registerController_1.VerifyEmail);
exports.default = router;
//# sourceMappingURL=register.js.map