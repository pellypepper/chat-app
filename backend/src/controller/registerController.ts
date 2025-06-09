import bcrypt from "bcrypt";
import crypto from "crypto";
import { db } from "../util/db";
import { eq } from "drizzle-orm";
import { users, emailVerifications } from "../model/schema";
import { sendEmail } from "../util/email";
import { Request, Response } from "express";

export const Register = async (req: Request, res: Response): Promise<any> => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification code and expiration time
    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase(); // 6-char code
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Insert the new user into the database
    const user = await db
      .insert(users)
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
    await db
      .insert(emailVerifications)
      .values({
        email,
        code: verificationCode,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: emailVerifications.email,
        set: {
          code: verificationCode,
          expiresAt,
        },
      });

    // Send verification email
    try {
      await sendEmail(
        email,
        "Email Verification",
        `Your verification code is: ${verificationCode}. It will expire in 15 minutes.`
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
     
    }

    return res.status(201).json({
      message: "User registered. Verification code sent to email.",
      user: user[0],
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const VerifyEmail = async (req: Request, res: Response): Promise<any> => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  try {
    // Check if the email verification record exists
    const records = await db
      .select()
      .from(emailVerifications)
      .where(eq(emailVerifications.email, email));

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
    const updateResult = await db
      .update(users)
      .set({ verified: true })
      .where(eq(users.email, email))
      .returning();

    if (updateResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send success email
    try {
      await sendEmail(
        email,
        "Registration Successful",
        `You have successfully registered on the chat app. Click on the link to login.`
      );
    } catch (emailError) {
      console.error("Success email sending failed:", emailError);
 
    }

    // Delete the email verification record 
    await db
      .delete(emailVerifications)
      .where(eq(emailVerifications.email, email));

    // Return the updated user
    return res.status(200).json({
      message: "Email verified successfully",
      user: updateResult[0],
    });

  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};