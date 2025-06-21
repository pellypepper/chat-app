import { and, eq } from "drizzle-orm";
import { users, passwordResets } from "../model/schema";
import { sendEmail } from "../util/email";
import { Request, Response } from "express";
import { db } from "../util/db";
import bcrypt from 'bcrypt';
import crypto from "crypto";
import { compressAndUpload } from '../middleware/upload'; 
// Extend Express Request interface 
declare global {
  namespace Express {
    interface User {
      id: number;

    }
    interface Request {
      user?: User;
    }
  }
}

// Get user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.user?.id);

  if (!userId ) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (!user[0]) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Exclude sensitive fields like password
    const { password, ...profile } = user[0];
    res.status(200).json({ user: profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const { firstname, lastname,  email } = req.body;
  const userId = Number(req.user?.id);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const updateFields: Record<string, string> = {};
  if (firstname !== undefined) updateFields.firstname = firstname.trim();
  if (lastname !== undefined) updateFields.lastname = lastname.trim();
 
 

  try {
    if (email) {
      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0 && existing[0].id !== userId) {
        res.status(400).json({ error: "Email already in use" });
        return;
      }
    }

    const updatedProfile = await db.update(users)
      .set(updateFields)
      .where(eq(users.id, userId));

    if (email) {
      await sendEmail(
        email,
        "Profile Updated",
        "Your profile has been successfully updated."
      );
    }

    res.status(200).json({ message: "Profile updated successfully", updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Change user password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
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
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (!user[0]) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user[0].password);
    if (!isMatch) {
      res.status(400).json({ error: "Current password is incorrect" });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await db.update(users)
      .set({ password: hashedNewPassword })
      .where(eq(users.id, userId));

    await sendEmail(
      user[0].email,
      "Password Changed",
      "Your password has been successfully changed."
    );

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Forget password
export const forgetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    const user = await db.select().from(users).where(eq(users.email, email));
    if (!user[0]) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await db.insert(passwordResets).values({
      userId: user[0].id,
      token: resetToken,
      expires: expires,
    });

    const resetLink = `http://localhost:3000/withNavpages/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    await sendEmail(
      email,
      "Password Reset",
      `Click the following link to reset your password (valid for 1 hour): ${resetLink}`
    );

    res.status(200).json({ message: "Reset email sent successfully" });
  } catch (error) {
    console.error("Error in forget password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Upload profile picture
export const UploadProfilePicture = async (req: Request, res: Response): Promise<void> => {
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
       const imageUrl = await compressAndUpload(Image); 
      if (!imageUrl) {
        res.status(500).json({ error: "Failed to upload image" });
        return;
      }

      // Update the user's profile picture URL in the database
      const updatedUser = await db
        .update(users)
        .set({ profilePicture: imageUrl })
        .where(eq(users.id, userId))
        .returning();
      res.status(200).json({ message: "Profile picture updated successfully", user: updatedUser[0] });


    }

catch (error) {
    console.error("Error uploading profile picture:", error); 
    res.status(500).json({ error: "Internal server error" });
  }
}



// Reset Password 
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    res.status(400).json({ error: "Email, token, and new password are required" });
    return;
  }

  try {
    const result = await db
      .select({
        reset: passwordResets,
        user: users
      })
      .from(passwordResets)
      .innerJoin(users, eq(passwordResets.userId, users.id))
      .where(
        and(
          eq(passwordResets.token, token),
          eq(users.email, email)
        )
      );

    const resetEntry = result[0];

    if (!resetEntry || new Date(resetEntry.reset.expires) < new Date()) {
      res.status(400).json({ error: "Invalid or expired reset token" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email));

    await db
      .delete(passwordResets)
      .where(eq(passwordResets.token, token));

    await sendEmail(
      email,
      "Password Reset Successful",
      "Your password has been reset successfully."
    );

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}