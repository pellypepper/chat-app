import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import passport from 'passport';
require('./src/config/passport');
// import session from 'express-session';
import registerRoutes from './src/routes/register';
import loginRoutes from './src/routes/login';
import profileRoutes from './src/routes/profile';
import storyRoutes from './src/routes/story';
import friendRoutes from './src/routes/friend';
import messageRoutes from './src/routes/message';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import { initializeSocket } from './src/util/socket';
import next from 'next';
import path from 'path';
import fs from 'fs';
import type { Request, Response, NextFunction } from 'express';

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 8080;

const frontendDir = path.join(process.cwd(), 'frontend');
const nextDir = path.join(frontendDir, '.next');

console.log('🔍 Debug info:');
console.log('Current working directory:', process.cwd());
console.log('Frontend directory:', frontendDir);
console.log('Looking for .next directory at:', nextDir);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check if .next directory exists
if (!fs.existsSync(nextDir)) {
    console.error('❌ .next directory not found at:', nextDir);
    console.error('Available directories in frontend:');
    try {
        const frontendContents = fs.readdirSync(frontendDir);
        console.error(frontendContents);
    } catch (err) {
        console.error('Cannot read frontend directory:', err);
    }
    process.exit(1);
}

// Initialize Next.js app
const nextApp = next({
    dev: false, // Always false in production Docker container
    dir: frontendDir, // Point to frontend directory
});

const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const app = express();
    
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
    app.use('/api/register', registerRoutes);
    app.use('/api/login', loginRoutes);
    app.use('/api/profile', profileRoutes);
    app.use('/api/message', messageRoutes);
    app.use('/api/friend', friendRoutes);
    app.use('/api/story', storyRoutes);
    
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            cwd: process.cwd(),
            nodeEnv: process.env.NODE_ENV,
            nextDirExists: fs.existsSync(nextDir)
        });
    });
    
    // Serve Next.js frontend
    app.all('*', (req, res) => {
        return handle(req, res);
    });
    
    // Error handler middleware - must be last
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error('Internal server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    });
    
    const httpServer = createServer(app);
    initializeSocket(httpServer);
    
    httpServer.listen(Number(PORT), '0.0.0.0', () => {
        console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
        console.log(`📁 Serving from directory: ${process.cwd()}`);
        console.log(`🔧 Development mode: ${dev}`);
        console.log(`✅ .next directory found at: ${nextDir}`);
    });
    
}).catch((err) => {
    console.error('❌ Error starting server:', err);
    console.error('Make sure .next directory exists in:', nextDir);
    process.exit(1);
});