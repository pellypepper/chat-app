"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmail = exports.Register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../util/db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../model/schema");
const email_1 = require("../util/email");
const Register = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        // Check if the email already exists
        const existingUser = await db_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (existingUser.length > 0) {
            return res.status(409).json({ error: "Email already registered" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Generate a verification code and expiration time
        const verificationCode = crypto_1.default
            .randomBytes(3)
            .toString("hex")
            .toUpperCase(); // 6-char code
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        // Insert the new user into the database
        const user = await db_1.db
            .insert(schema_1.users)
            .values({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            verified: false,
        })
            .returning();
        if (!user || user.length === 0) {
            return res.status(500).json({ error: "User registration failed" });
        }
        // Insert the email verification record 
        await db_1.db
            .insert(schema_1.emailVerifications)
            .values({
            email,
            code: verificationCode,
            expiresAt,
        })
            .onConflictDoUpdate({
            target: schema_1.emailVerifications.email,
            set: {
                code: verificationCode,
                expiresAt,
            },
        });
        // Send verification email
        try {
            await (0, email_1.sendEmail)(email, "Email Verification", `Your verification code is: ${verificationCode}. It will expire in 15 minutes.`);
        }
        catch (emailError) {
            console.error("Email sending failed:", emailError);
        }
        return res.status(201).json({
            message: "User registered. Verification code sent to email.",
            user: user[0],
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.Register = Register;
const VerifyEmail = async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        return res.status(400).json({ error: "Email and code are required" });
    }
    try {
        // Check if the email verification record exists
        const records = await db_1.db
            .select()
            .from(schema_1.emailVerifications)
            .where((0, drizzle_orm_1.eq)(schema_1.emailVerifications.email, email));
        //Check if records array is empty, not if records is falsy
        if (records.length === 0) {
            return res.status(404).json({ error: "Verification code not found" });
        }
        const record = records[0];
        // Check if code matches 
        if (record.code.toUpperCase() !== code.toUpperCase()) {
            return res.status(400).json({ error: "Invalid verification code" });
        }
        // Check if code has expired
        if (new Date(record.expiresAt) < new Date()) {
            return res.status(410).json({ error: "Verification code expired" });
        }
        // Update the user's verified status
        const updateResult = await db_1.db
            .update(schema_1.users)
            .set({ verified: true })
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
            .returning();
        if (updateResult.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        // Send success email
        try {
            await (0, email_1.sendEmail)(email, "Registration Successful", `You have successfully registered on the chat app. Click on the link to login.`);
        }
        catch (emailError) {
            console.error("Success email sending failed:", emailError);
        }
        // Delete the email verification record 
        await db_1.db
            .delete(schema_1.emailVerifications)
            .where((0, drizzle_orm_1.eq)(schema_1.emailVerifications.email, email));
        // Return the updated user
        return res.status(200).json({
            message: "Email verified successfully",
            user: updateResult[0],
        });
    }
    catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.VerifyEmail = VerifyEmail;
