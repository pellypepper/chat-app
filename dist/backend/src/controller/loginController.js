"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshAccessToken = exports.getCurrentUser = exports.googleLoginCallback = exports.googleLogin = exports.login = void 0;
const email_1 = require("../util/email");
const geoip_lite_1 = __importDefault(require("geoip-lite"));
// Option 1: CommonJS require style (works everywhere in Node)
const passport = require('passport');
const auth_1 = require("../middleware/auth");
const userModel_1 = require("../model/userModel");
// Local login 
const login = (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'An error occurred during login', error: err });
        }
        if (!user) {
            return res.status(401).json({ message: info?.message || 'Login failed' });
        }
        // Get user's IP address & location
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const geo = geoip_lite_1.default.lookup(ip);
        const location = geo ? `${geo.city}, ${geo.region}, ${geo.country}` : 'Unknown location';
        // Send sign-in email notification
        try {
            await (0, email_1.sendEmail)(user.email, 'New Sign-in Notification', `You have signed in from: ${location}, IP: ${ip}. If this was not you, please contact support.`);
        }
        catch (emailError) {
            return res.status(500).json({ message: 'Email notification error', error: emailError });
        }
        // Generate tokens
        const accessToken = (0, auth_1.generateAccessToken)({ id: user.id, email: user.email });
        const refreshToken = (0, auth_1.generateRefreshToken)({ id: user.id, email: user.email });
        // Send cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        // Remove sensitive info from user
        const { password, ...userSafe } = user;
        res.status(200).json({
            message: 'Login successful',
            user: userSafe
        });
    })(req, res, next);
};
exports.login = login;
// Google login start
exports.googleLogin = passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
});
// Google login callback 
const googleLoginCallback = (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err)
            return res.status(500).json({ message: 'Google login error', error: err });
        if (!user)
            return res.status(401).json({ message: info?.message || 'Google login failed' });
        // Generate tokens
        const accessToken = (0, auth_1.generateAccessToken)({ id: user.id, email: user.email });
        const refreshToken = (0, auth_1.generateRefreshToken)({ id: user.id, email: user.email });
        // Send cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        // Remove sensitive info from user object
        const { password, ...userSafe } = user;
        res.redirect('http://localhost:3000/dashboard');
    })(req, res, next);
};
exports.googleLoginCallback = googleLoginCallback;
// GET current user 
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Invalid user in request' });
            return;
        }
        const user = await (0, userModel_1.findUserById)(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const { password, ...userSafe } = user;
        res.status(200).json({ user: userSafe });
    }
    catch (err) {
        console.error("Failed to fetch user:", err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCurrentUser = getCurrentUser;
const refreshAccessToken = (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const accessToken = (0, auth_1.generateAccessToken)({ id: user.id, email: user.email });
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
    });
    return res.status(200).json({ accessToken });
};
exports.refreshAccessToken = refreshAccessToken;
// Logout 
const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logout = logout;
//# sourceMappingURL=loginController.js.map