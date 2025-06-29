"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAccessToken = authenticateAccessToken;
exports.authenticateRefreshToken = authenticateRefreshToken;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
var jsonwebtoken_1 = require("jsonwebtoken");
var ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'youraccesstokensecret';
var REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'yourrefreshtokensecret';
//  verify Access Token
function authenticateAccessToken(req, res, next) {
    var _a;
    var token = req.cookies.accessToken || ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
    if (!token) {
        res.status(401).json({ message: 'Access token missing' });
        return;
    }
    jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET, function (err, user) {
        if (err)
            res.status(403).json({ message: 'Invalid or expired access token' });
        req.user = user;
        next();
        return;
    });
}
//  verify Refresh Token
function authenticateRefreshToken(req, res, next) {
    var refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token missing' });
        return;
    }
    jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET, function (err, user) {
        if (err)
            res.status(403).json({ message: 'Invalid or expired refresh token' });
        req.user = user;
        next();
        return;
    });
}
//  generate tokens
function generateAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}
//  generate Refresh Token
function generateRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
//# sourceMappingURL=auth.js.map