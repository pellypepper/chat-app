"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.UploadProfilePicture = exports.forgetPassword = exports.changePassword = exports.updateProfile = exports.getProfile = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../model/schema");
const email_1 = require("../util/email");
const db_1 = require("../util/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const upload_1 = require("../middleware/upload");
// Get user profile
const getProfile = async (req, res) => {
    const userId = Number(req.user?.id);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const user = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        if (!user[0]) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Exclude sensitive fields like password
        const { password, ...profile } = user[0];
        res.status(200).json({ user: profile });
    }
    catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getProfile = getProfile;
// Update user profile
const updateProfile = async (req, res) => {
    const { firstname, lastname, email } = req.body;
    const userId = Number(req.user?.id);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const updateFields = {};
    if (firstname !== undefined)
        updateFields.firstname = firstname.trim();
    if (lastname !== undefined)
        updateFields.lastname = lastname.trim();
    try {
        if (email) {
            const existing = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
            if (existing.length > 0 && existing[0].id !== userId) {
                res.status(400).json({ error: "Email already in use" });
                return;
            }
        }
        const updatedProfile = await db_1.db.update(schema_1.users)
            .set(updateFields)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        if (email) {
            await (0, email_1.sendEmail)(email, "Profile Updated", "Your profile has been successfully updated.");
        }
        res.status(200).json({ message: "Profile updated successfully", updatedProfile });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateProfile = updateProfile;
// Change user password
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = Number(req.user?.id);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    if (!currentPassword || !newPassword) {
        res.status(400).json({ error: "Current and new passwords are required" });
        return;
    }
    try {
        const user = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        if (!user[0]) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(currentPassword, user[0].password);
        if (!isMatch) {
            res.status(400).json({ error: "Current password is incorrect" });
            return;
        }
        const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10);
        await db_1.db.update(schema_1.users)
            .set({ password: hashedNewPassword })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        await (0, email_1.sendEmail)(user[0].email, "Password Changed", "Your password has been successfully changed.");
        res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.changePassword = changePassword;
// Forget password
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
    }
    try {
        const user = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (!user[0]) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        await db_1.db.insert(schema_1.passwordResets).values({
            userId: user[0].id,
            token: resetToken,
            expires: expires,
        });
        const resetLink = `http://localhost:3000/public/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
        await (0, email_1.sendEmail)(email, "Password Reset", `Click the following link to reset your password (valid for 1 hour): ${resetLink}`);
        res.status(200).json({ message: "Reset email sent successfully" });
    }
    catch (error) {
        console.error("Error in forget password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.forgetPassword = forgetPassword;
// Upload profile picture
const UploadProfilePicture = async (req, res) => {
    const userId = Number(req.user?.id);
    const Image = req.file;
    // Check if the user exists
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        // Check if the image file is provided
        if (!Image) {
            res.status(400).json({ error: "Image file is required" });
            return;
        }
        // uPLOAD AND COMPRESS THE IMAGE
        const imageUrl = await (0, upload_1.compressAndUpload)(Image);
        if (!imageUrl) {
            res.status(500).json({ error: "Failed to upload image" });
            return;
        }
        // Update the user's profile picture URL in the database
        const updatedUser = await db_1.db
            .update(schema_1.users)
            .set({ profilePicture: imageUrl })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))
            .returning();
        res.status(200).json({ message: "Profile picture updated successfully", user: updatedUser[0] });
    }
    catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.UploadProfilePicture = UploadProfilePicture;
// Reset Password 
const resetPassword = async (req, res) => {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
        res.status(400).json({ error: "Email, token, and new password are required" });
        return;
    }
    try {
        const result = await db_1.db
            .select({
            reset: schema_1.passwordResets,
            user: schema_1.users
        })
            .from(schema_1.passwordResets)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.passwordResets.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.passwordResets.token, token), (0, drizzle_orm_1.eq)(schema_1.users.email, email)));
        const resetEntry = result[0];
        if (!resetEntry || new Date(resetEntry.reset.expires) < new Date()) {
            res.status(400).json({ error: "Invalid or expired reset token" });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await db_1.db
            .update(schema_1.users)
            .set({ password: hashedPassword })
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        await db_1.db
            .delete(schema_1.passwordResets)
            .where((0, drizzle_orm_1.eq)(schema_1.passwordResets.token, token));
        await (0, email_1.sendEmail)(email, "Password Reset Successful", "Your password has been reset successfully.");
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        console.error("Error in reset password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=profileController.js.map