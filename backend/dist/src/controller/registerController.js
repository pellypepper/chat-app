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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmail = exports.Register = void 0;
var bcrypt_1 = require("bcrypt");
var crypto_1 = require("crypto");
var db_1 = require("../util/db");
var drizzle_orm_1 = require("drizzle-orm");
var schema_1 = require("../model/schema");
var email_1 = require("../util/email");
var Register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstname, lastname, email, password, existingUser, hashedPassword, verificationCode, expiresAt, user, emailError_1, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, firstname = _a.firstname, lastname = _a.lastname, email = _a.email, password = _a.password;
                if (!firstname || !lastname || !email || !password) {
                    return [2 /*return*/, res.status(400).json({ error: "All fields are required" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 10, , 11]);
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.users)
                        .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))];
            case 2:
                existingUser = _b.sent();
                if (existingUser.length > 0) {
                    return [2 /*return*/, res.status(409).json({ error: "Email already registered" })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 3:
                hashedPassword = _b.sent();
                verificationCode = crypto_1.default
                    .randomBytes(3)
                    .toString("hex")
                    .toUpperCase();
                expiresAt = new Date(Date.now() + 15 * 60 * 1000);
                return [4 /*yield*/, db_1.db
                        .insert(schema_1.users)
                        .values({
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: hashedPassword,
                        verified: false,
                    })
                        .returning()];
            case 4:
                user = _b.sent();
                if (!user || user.length === 0) {
                    return [2 /*return*/, res.status(500).json({ error: "User registration failed" })];
                }
                // Insert the email verification record 
                return [4 /*yield*/, db_1.db
                        .insert(schema_1.emailVerifications)
                        .values({
                        email: email,
                        code: verificationCode,
                        expiresAt: expiresAt,
                    })
                        .onConflictDoUpdate({
                        target: schema_1.emailVerifications.email,
                        set: {
                            code: verificationCode,
                            expiresAt: expiresAt,
                        },
                    })];
            case 5:
                // Insert the email verification record 
                _b.sent();
                _b.label = 6;
            case 6:
                _b.trys.push([6, 8, , 9]);
                return [4 /*yield*/, (0, email_1.sendEmail)(email, "Email Verification", "Your verification code is: ".concat(verificationCode, ". It will expire in 15 minutes."))];
            case 7:
                _b.sent();
                return [3 /*break*/, 9];
            case 8:
                emailError_1 = _b.sent();
                console.error("Email sending failed:", emailError_1);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/, res.status(201).json({
                    message: "User registered. Verification code sent to email.",
                    user: user[0],
                })];
            case 10:
                error_1 = _b.sent();
                console.error("Registration error:", error_1);
                return [2 /*return*/, res.status(500).json({ error: "Internal server error" })];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.Register = Register;
var VerifyEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, code, records, record, updateResult, emailError_2, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, code = _a.code;
                if (!email || !code) {
                    return [2 /*return*/, res.status(400).json({ error: "Email and code are required" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 9, , 10]);
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.emailVerifications)
                        .where((0, drizzle_orm_1.eq)(schema_1.emailVerifications.email, email))];
            case 2:
                records = _b.sent();
                //Check if records array is empty, not if records is falsy
                if (records.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "Verification code not found" })];
                }
                record = records[0];
                // Check if code matches 
                if (record.code.toUpperCase() !== code.toUpperCase()) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid verification code" })];
                }
                // Check if code has expired
                if (new Date(record.expiresAt) < new Date()) {
                    return [2 /*return*/, res.status(410).json({ error: "Verification code expired" })];
                }
                return [4 /*yield*/, db_1.db
                        .update(schema_1.users)
                        .set({ verified: true })
                        .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
                        .returning()];
            case 3:
                updateResult = _b.sent();
                if (updateResult.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, (0, email_1.sendEmail)(email, "Registration Successful", "You have successfully registered on the chat app. Click on the link to login.")];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                emailError_2 = _b.sent();
                console.error("Success email sending failed:", emailError_2);
                return [3 /*break*/, 7];
            case 7: 
            // Delete the email verification record 
            return [4 /*yield*/, db_1.db
                    .delete(schema_1.emailVerifications)
                    .where((0, drizzle_orm_1.eq)(schema_1.emailVerifications.email, email))];
            case 8:
                // Delete the email verification record 
                _b.sent();
                // Return the updated user
                return [2 /*return*/, res.status(200).json({
                        message: "Email verified successfully",
                        user: updateResult[0],
                    })];
            case 9:
                error_2 = _b.sent();
                console.error("Verification error:", error_2);
                return [2 /*return*/, res.status(500).json({ error: "Internal server error" })];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.VerifyEmail = VerifyEmail;
//# sourceMappingURL=registerController.js.map