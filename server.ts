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

// Helper for route imports (dist for prod, src for dev)
function safeImportRoute(route: string) {
  try {
    // In production, routes are compiled to backend/dist/routes/
    return require(`./backend/dist/routes/${route}`).default;
  } catch (distError) {
    try {
      // Fallback to source files for development
      return require(`./backend/src/routes/${route}`).default;
    } catch (srcError) {
      // If both fail, try without .default (CommonJS exports)
      try {
        return require(`./backend/dist/routes/${route}`);
      } catch (cjsError) {
        console.error(`Failed to import route '${route}':`, {
          distError: distError instanceof Error ? distError.message : distError,
          srcError: srcError instanceof Error ? srcError.message : srcError,
          cjsError: cjsError instanceof Error ? cjsError.message : cjsError
        });
        throw new Error(`Cannot load route: ${route}`);
      }
    }
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
    
    // Check backend directories
    const backendDistDir = path.join(process.cwd(), 'backend/dist');
    const backendSrcDir = path.join(process.cwd(), 'backend/src');
    console.log('Backend dist directory exists:', fs.existsSync(backendDistDir));
    console.log('Backend src directory exists:', fs.existsSync(backendSrcDir));
    
    if (fs.existsSync(backendDistDir)) {
        const routesDir = path.join(backendDistDir, 'routes');
        console.log('Routes dist directory exists:', fs.existsSync(routesDir));
        if (fs.existsSync(routesDir)) {
            console.log('Route files in dist:', fs.readdirSync(routesDir));
        }
    }
        
    // Check if .next directory exists
    const nextDir = path.join(process.cwd(), 'frontend/.next');
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