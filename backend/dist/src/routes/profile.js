"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("../middleware/auth");
var profileController_1 = require("../controller/profileController");
var express_1 = require("express");
var upload_1 = require("../middleware/upload");
var router = express_1.default.Router();
router.get('/', auth_1.authenticateAccessToken, profileController_1.getProfile);
// Update user profile
router.put('/', auth_1.authenticateAccessToken, profileController_1.updateProfile);
// Change user password
router.put('/change-password', auth_1.authenticateAccessToken, profileController_1.changePassword);
router.post('/upload-profile-picture', auth_1.authenticateAccessToken, upload_1.upload.single('image'), profileController_1.UploadProfilePicture);
// forget user password
router.post('/forget-password', profileController_1.forgetPassword);
// Reset user password
router.post('/reset-password', profileController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=profile.js.map