import dotenv from 'dotenv';
dotenv.config();
import next from 'next';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import { initializeSocket } from './backend/src/util/socket';
import path from 'path';
import fs from 'fs';

const passport = require('passport');

// Import passport config (dist for prod, src for dev)
try {
  require("../backend/dist/config/passport");
} catch {
  require("./backend/src/config/passport");
}



function safeImportRoute(route: string) {
  const routePath = path.join(process.cwd(), 'backend/src/routes', route);
  
  try {
    const module = require(routePath);
    console.log(`✅ Successfully imported route '${route}' from: ${routePath}`);
    return module.default || module;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Failed to import route '${route}' from ${routePath}:`, error.message);
    } else {
      console.error(`❌ Failed to import route '${route}' from ${routePath}:`, error);
    }
    throw new Error(`Cannot find route module '${route}' at ${routePath}`);
  }
}

const PORT = process.env.PORT || 8080;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: path.join(process.cwd(), 'frontend') });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const app = express();

    // Debug info
    console.log('🔍 Debug info:');
    console.log('Current working directory:', process.cwd());
    console.log('Frontend directory:', path.join(process.cwd(), 'frontend'));
    console.log('Looking for .next directory at:', path.join(process.cwd(), 'frontend/.next'));
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Check if .next directory exists
    const nextDir = path.join(process.cwd(), 'frontend/.next');
    if (fs.existsSync(nextDir)) {
        console.log('✅ .next directory found');
    } else {
        console.log('❌ .next directory NOT found');
        console.log('Make sure .next directory exists in:', nextDir);
    }

    app.use(cors({
        origin: [ 'https://chat-app-tk-blg.fly.dev'],
        credentials: true,
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // app.use(session({ ... })); // Uncomment and configure if using sessions
    app.use(passport.initialize());
    // app.use(passport.session());

    // Register routes
    try {
        app.use('/register', safeImportRoute('register'));
        app.use('/login', safeImportRoute('login'));
        app.use('/profile', safeImportRoute('profile'));
        app.use('/message', safeImportRoute('message'));
        app.use('/friend', safeImportRoute('friend'));
        app.use('/story', safeImportRoute('story'));
        console.log('✅ All routes loaded');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Error registering routes:', errorMessage);
    }

    // Serve static files from Next.js build and public
    app.use('/_next/static', express.static(path.join(process.cwd(), 'frontend/.next/static')));
    app.use(express.static(path.join(process.cwd(), 'frontend/public')));
    
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // All other routes handled by Next.js
    app.use((req, res) => handle(req, res));

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