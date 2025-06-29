"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.UploadProfilePicture = exports.forgetPassword = exports.changePassword = exports.updateProfile = exports.getProfile = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var schema_1 = require("../model/schema");
var email_1 = require("../util/email");
var db_1 = require("../util/db");
var bcrypt_1 = require("bcrypt");
var crypto_1 = require("crypto");
var upload_1 = require("../middleware/upload");
// Get user profile
var getProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, _a, password, profile, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = Number((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
                if (!userId) {
                    res.status(401).json({ error: "Unauthorized" });
                    return [2 /*return*/];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))];
            case 2:
                user = _c.sent();
                if (!user[0]) {
                    res.status(404).json({ error: "User not found" });
                    return [2 /*return*/];
                }
                _a = user[0], password = _a.password, profile = __rest(_a, ["password"]);
                res.status(200).json({ user: profile });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                console.error("Error fetching profile:", error_1);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getProfile = getProfile;
// Update user profile
var updateProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstname, lastname, email, userId, updateFields, existing, updatedProfile, error_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, firstname = _a.firstname, lastname = _a.lastname, email = _a.email;
                userId = Number((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
                if (!userId) {
                    res.status(401).json({ error: "Unauthorized" });
                    return [2 /*return*/];
                }
                updateFields = {};
                if (firstname !== undefined)
                    updateFields.firstname = firstname.trim();
                if (lastname !== undefined)
                    updateFields.lastname = lastname.trim();
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                if (!email) return [3 /*break*/, 3];
                return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email))];
            case 2:
                existing = _c.sent();
                if (existing.length > 0 && existing[0].id !== userId) {
                    res.status(400).json({ error: "Email already in use" });
                    return [2 /*return*/];
                }
                _c.label = 3;
            case 3: return [4 /*yield*/, db_1.db.update(schema_1.users)
                    .set(updateFields)
                    .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))];
            case 4:
                updatedProfile = _c.sent();
                if (!email) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, email_1.sendEmail)(email, "Profile Updated", "Your profile has been successfully updated.")];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6:
                res.status(200).json({ message: "Profile updated successfully", updatedProfile: updatedProfile });
                return [3 /*break*/, 8];
            case 7:
                error_2 = _c.sent();
                console.error("Error updating profile:", error_2);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.updateProfile = updateProfile;
// Change user password
var changePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, currentPassword, newPassword, userId, user, isMatch, hashedNewPassword, error_3;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                userId = Number((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
                if (!userId) {
                    res.status(401).json({ error: "Unauthorized" });
                    return [2 /*return*/];
                }
                if (!currentPassword || !newPassword) {
                    res.status(400).json({ error: "Current and new passwords are required" });
                    return [2 /*return*/];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))];
            case 2:
                user = _c.sent();
                if (!user[0]) {
                    res.status(404).json({ error: "User not found" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(currentPassword, user[0].password)];
            case 3:
                isMatch = _c.sent();
                if (!isMatch) {
                    res.status(400).json({ error: "Current password is incorrect" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
            case 4:
                hashedNewPassword = _c.sent();
                return [4 /*yield*/, db_1.db.update(schema_1.users)
                        .set({ password: hashedNewPassword })
                        .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, email_1.sendEmail)(user[0].email, "Password Changed", "Your password has been successfully changed.")];
            case 6:
                _c.sent();
                res.status(200).json({ message: "Password changed successfully" });
                return [3 /*break*/, 8];
            case 7:
                error_3 = _c.sent();
                console.error("Error changing password:", error_3);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.changePassword = changePassword;
// Forget password
var forgetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, resetToken, expires, resetLink, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                if (!email) {
                    res.status(400).json({ error: "Email is required" });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email))];
            case 2:
                user = _a.sent();
                if (!user[0]) {
                    res.status(404).json({ error: "User not found" });
                    return [2 /*return*/];
                }
                resetToken = crypto_1.default.randomBytes(32).toString("hex");
                expires = new Date(Date.now() + 60 * 60 * 1000);
                return [4 /*yield*/, db_1.db.insert(schema_1.passwordResets).values({
                        userId: user[0].id,
                        token: resetToken,
                        expires: expires,
                    })];
            case 3:
                _a.sent();
                resetLink = "http://localhost:3000/public/reset-password?token=".concat(resetToken, "&email=").concat(encodeURIComponent(email));
                return [4 /*yield*/, (0, email_1.sendEmail)(email, "Password Reset", "Click the following link to reset your password (valid for 1 hour): ".concat(resetLink))];
            case 4:
                _a.sent();
                res.status(200).json({ message: "Reset email sent successfully" });
                return [3 /*break*/, 6];
            case 5:
                error_4 = _a.sent();
                console.error("Error in forget password:", error_4);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.forgetPassword = forgetPassword;
// Upload profile picture
var UploadProfilePicture = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, Image, imageUrl, updatedUser, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                Image = req.file;
                // Check if the user exists
                if (!userId) {
                    res.status(401).json({ error: "Unauthorized" });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                // Check if the image file is provided
                if (!Image) {
                    res.status(400).json({ error: "Image file is required" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, upload_1.compressAndUpload)(Image)];
            case 2:
                imageUrl = _b.sent();
                if (!imageUrl) {
                    res.status(500).json({ error: "Failed to upload image" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.db
                        .update(schema_1.users)
                        .set({ profilePicture: imageUrl })
                        .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))
                        .returning()];
            case 3:
                updatedUser = _b.sent();
                res.status(200).json({ message: "Profile picture updated successfully", user: updatedUser[0] });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _b.sent();
                console.error("Error uploading profile picture:", error_5);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.UploadProfilePicture = UploadProfilePicture;
// Reset Password 
var resetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, token, newPassword, result, resetEntry, hashedPassword, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, token = _a.token, newPassword = _a.newPassword;
                if (!email || !token || !newPassword) {
                    res.status(400).json({ error: "Email, token, and new password are required" });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                return [4 /*yield*/, db_1.db
                        .select({
                        reset: schema_1.passwordResets,
                        user: schema_1.users
                    })
                        .from(schema_1.passwordResets)
                        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.passwordResets.userId, schema_1.users.id))
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.passwordResets.token, token), (0, drizzle_orm_1.eq)(schema_1.users.email, email)))];
            case 2:
                result = _b.sent();
                resetEntry = result[0];
                if (!resetEntry || new Date(resetEntry.reset.expires) < new Date()) {
                    res.status(400).json({ error: "Invalid or expired reset token" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
            case 3:
                hashedPassword = _b.sent();
                return [4 /*yield*/, db_1.db
                        .update(schema_1.users)
                        .set({ password: hashedPassword })
                        .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))];
            case 4:
                _b.sent();
                return [4 /*yield*/, db_1.db
                        .delete(schema_1.passwordResets)
                        .where((0, drizzle_orm_1.eq)(schema_1.passwordResets.token, token))];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, email_1.sendEmail)(email, "Password Reset Successful", "Your password has been reset successfully.")];
            case 6:
                _b.sent();
                res.status(200).json({ message: "Password reset successful" });
                return [3 /*break*/, 8];
            case 7:
                error_6 = _b.sent();
                console.error("Error in reset password:", error_6);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
//# sourceMappingURL=profileController.js.map