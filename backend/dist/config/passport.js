"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Option 1: CommonJS require style (works everywhere in Node)
const passport = require('passport');
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../util/db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../model/schema");
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
// local strategy 
passport.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (!user[0]) {
            return done(null, false, { message: 'Email not found.' });
        }
        const isMatch = await bcrypt_1.default.compare(password, user[0].password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        if (!user[0].verified) {
            return done(null, false, { message: 'Email not verified.' });
        }
        return done(null, user[0]);
    }
    catch (error) {
        return done(error);
    }
}));
// Google OAuth strategy 
passport.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '565670844158-3icfobcp29hpj9i5tof5s6ncg2v36s0o.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
    callbackURL: '/login/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(null, false, { message: 'No email found from Google.' });
        }
        // Check if user already exists
        let user = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (!user[0]) {
            // If user does not exist, create a new user
            const newUser = await db_1.db.insert(schema_1.users).values({
                firstname: profile.name?.givenName || '',
                lastname: profile.name?.familyName || '',
                email: email,
                password: '',
                verified: true,
            }).returning();
            user = newUser;
        }
        return done(null, user[0]);
    }
    catch (error) {
        return done(error, false);
    }
}));
//# sourceMappingURL=passport.js.map