import passport from 'passport';
import bcrypt from 'bcrypt'
import { db } from "../util/db";
import { eq } from 'drizzle-orm';
import { users } from "../model/schema";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


// local strategy 
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
        const user = await db.select().from(users).where(eq(users.email, email));
        if (!user[0]) {
            return done(null, false, { message: 'Email not found.' });
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        if (!user[0].verified) {
            return done(null, false, { message: 'Email not verified.' });
        }
        return done(null, user[0]);
    } catch (error) {
        return done(error);
    }
  }
));

// Google OAuth strategy 
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || 'deffd',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'fggdfgd',
    callbackURL: '/login/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      
      if (!email) {
        return done(null, false, { message: 'No email found from Google.' });
      }
    
      // Check if user already exists
      let user = await db.select().from(users).where(eq(users.email, email));

      if (!user[0]) {

        // If user does not exist, create a new user
        const newUser = await db.insert(users).values({
          firstname: profile.name?.givenName || '',
          lastname: profile.name?.familyName || '',
          email: email,
          password: '', 
          verified: true,
        }).returning();
        user = newUser;
      }
      return done(null, user[0]);
    } catch (error) {
      return done(error, false);
    }
  }
));
