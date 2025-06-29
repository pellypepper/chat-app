import dotenv from 'dotenv';
dotenv.config();
import next from 'next';
import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
require('./backend/src/config/passport');
// import session from 'express-session';

import registerRoutes from './backend/src/routes/register';
import loginRoutes from './backend/src/routes/login';
import profileRoutes from './backend/src/routes/profile';
import storyRoutes from './backend/src/routes/story';
import friendRoutes from './backend/src/routes/friend';
import messageRoutes from './backend/src/routes/message';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import { initializeSocket } from './backend/src/util/socket';
import path from 'path';
import fs from 'fs';

const PORT = process.env.PORT || 8080;


const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: path.join(__dirname, './frontend') });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
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
    app.use('/register', registerRoutes);
    app.use('/login', loginRoutes);
    app.use('/profile', profileRoutes);
    app.use('/message', messageRoutes);
    app.use('/friend', friendRoutes);
    app.use('/story', storyRoutes);

    // Serve static files from Next.js build and public
    app.use('/_next/static', express.static(path.join(__dirname, '../../frontend/.next/static')));
    app.use(express.static(path.join(__dirname, '../../frontend/public')));

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // All other routes handled by Next.js
    app.all('*', (req, res) => {
        return handle(req, res);
    });

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
});