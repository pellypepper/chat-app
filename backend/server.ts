import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
require('./src/config/passport');
// import session from 'express-session';

import registerRoutes from './src/routes/register';
console.log('registerRoutes import:', typeof registerRoutes, registerRoutes?.constructor?.name);

import loginRoutes from './src/routes/login';
console.log('loginRoutes import:', typeof loginRoutes, loginRoutes?.constructor?.name);

import profileRoutes from './src/routes/profile';
console.log('profileRoutes import:', typeof profileRoutes, profileRoutes?.constructor?.name);

import storyRoutes from './src/routes/story';
console.log('storyRoutes import:', typeof storyRoutes, storyRoutes?.constructor?.name);

import friendRoutes from './src/routes/friend';
console.log('friendRoutes import:', typeof friendRoutes, friendRoutes?.constructor?.name);

import messageRoutes from './src/routes/message';
console.log('messageRoutes import:', typeof messageRoutes, messageRoutes?.constructor?.name);

import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import { initializeSocket } from './src/util/socket';
import path from 'path';
import fs from 'fs';

const PORT = process.env.PORT || 8080;

const app = express();

// Debug info
console.log('🔍 Debug info:');
console.log('Current working directory:', process.cwd());
console.log('Frontend directory:', path.join(__dirname, '../../frontend'));
console.log('Looking for .next directory at:', path.join(__dirname, '../../frontend/.next'));
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check if .next directory exists
const nextDir = path.join(__dirname, '../../frontend/.next');
if (fs.existsSync(nextDir)) {
    console.log('✅ .next directory found');
} else {
    console.log('❌ .next directory NOT found');
    console.log('Make sure .next directory exists in:', nextDir);
}

app.use(cors({
    origin: ['http://localhost:3000', 'https://chat-app-tk-blg.fly.dev'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// // Session configuration
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: 24 * 60 * 60 * 1000 // 24 hours
//     }
// }));

app.use(passport.initialize());
// app.use(passport.session());

// API routes
console.log('Registering /register route...');
if (!registerRoutes || typeof registerRoutes !== 'function' && typeof registerRoutes !== 'object') {
    console.error('‼️ registerRoutes is not a valid router:', registerRoutes);
}
app.use('/register', registerRoutes);

console.log('Registering /login route...');
if (!loginRoutes || typeof loginRoutes !== 'function' && typeof loginRoutes !== 'object') {
    console.error('‼️ loginRoutes is not a valid router:', loginRoutes);
}
app.use('/login', loginRoutes);

console.log('Registering /profile route...');
if (!profileRoutes || typeof profileRoutes !== 'function' && typeof profileRoutes !== 'object') {
    console.error('‼️ profileRoutes is not a valid router:', profileRoutes);
}
app.use('/profile', profileRoutes);

console.log('Registering /message route...');
if (!messageRoutes || typeof messageRoutes !== 'function' && typeof messageRoutes !== 'object') {
    console.error('‼️ messageRoutes is not a valid router:', messageRoutes);
}
app.use('/message', messageRoutes);

console.log('Registering /friend route...');
if (!friendRoutes || typeof friendRoutes !== 'function' && typeof friendRoutes !== 'object') {
    console.error('‼️ friendRoutes is not a valid router:', friendRoutes);
}
app.use('/friend', friendRoutes);

console.log('Registering /story route...');
if (!storyRoutes || typeof storyRoutes !== 'function' && typeof storyRoutes !== 'object') {
    console.error('‼️ storyRoutes is not a valid router:', storyRoutes);
}
app.use('/story', storyRoutes);

// Serve static files from Next.js build
console.log('Registering static file serving...');
app.use('/_next/static', express.static(path.join(__dirname, '../../frontend/.next/static')));
app.use('/static', express.static(path.join(__dirname, '../../frontend/.next/static')));
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve Next.js built files for the frontend
app.use('/_next', express.static(path.join(__dirname, '../../frontend/.next')));

// Serve the main Next.js HTML file for frontend routes
const serveFrontend = (req: Request, res: Response) => {
    const indexPath = path.join(__dirname, '../../frontend/.next/server/pages/index.html');

    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        // Try alternative paths for Next.js build output
        const altPaths = [
            path.join(__dirname, '../../frontend/out/index.html'),
            path.join(__dirname, '../../frontend/dist/index.html'),
            path.join(__dirname, '../../frontend/.next/static/index.html')
        ];

        let served = false;
        for (const altPath of altPaths) {
            if (fs.existsSync(altPath)) {
                res.sendFile(altPath);
                served = true;
                break;
            }
        }

        if (!served) {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Chat App</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body>
                    <div id="__next">
                        <h1>Chat App</h1>
                        <p>Frontend build not found. Please check the build process.</p>
                    </div>
                </body>
                </html>
            `);
        }
    }
};

const frontendRoutes = ['/public', '/dashboard', '/change-password', '/public/forget-password', '/public/register', '/public/reset-password', "/public/signin", "/public/verify-email"];
frontendRoutes.forEach(route => {
    console.log('Registering frontend route:', route);
    app.get(route, serveFrontend);
});

// Handle 404 for API routes first
console.log('Registering API 404 handler...');


// Handle all other routes (catch-all for SPA routing) - SIMPLIFIED
console.log('Registering catch-all frontend route...');
// app.get('*', (req, res, next) => {
//     // Skip API routes
//     if (req.path.startsWith('/api/')) {
//         return next();
//     }
//     serveFrontend(req, res);
// });

// Error handler middleware - must be last
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('❌ Error starting server:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const httpServer = createServer(app);
initializeSocket(httpServer);

httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📁 Serving from directory: ${process.cwd()}`);
    console.log(`✅ .next directory found at: ${nextDir}`);
}).on('error', (err) => {
    console.error('❌ Error starting server:', err);
});