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

// Utility to recursively print directory tree
function printDirectoryTree(dir: string, indent: string = '') {
    if (!fs.existsSync(dir)) {
        console.log(indent + '❌ Directory not found:', dir);
        return;
    }
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        try {
            if (fs.statSync(fullPath).isDirectory()) {
                console.log(indent + `📁 ${file}/`);
                printDirectoryTree(fullPath, indent + '  ');
            } else {
                console.log(indent + `📄 ${file}`);
            }
        } catch (e) {
            console.log(indent + `❌ Cannot stat ${file}:`, e instanceof Error ? e.message : String(e));
        }
    });
}

// Import passport config (dist for prod, src for dev)
function importPassportConfig() {
    // Only ever import from dist in production
    const distPath = path.join(process.cwd(), 'backend', 'dist', 'config', 'passport');
    if (fs.existsSync(distPath + '.js')) {
        require(distPath + '.js');
        console.log('✅ Loaded passport config from', distPath + '.js');
    } else {
        throw new Error('passport config not found in dist');
    }
}
importPassportConfig();

function safeImportRoute(route: string) {
    const distRoute = path.join(process.cwd(), 'backend', 'dist', 'routes', route);
    const srcRoute = path.join(process.cwd(), 'backend', 'src', 'routes', route);
    try {
        if (fs.existsSync(distRoute + '.js')) {
            return require(distRoute).default;
        } else if (fs.existsSync(srcRoute + '.ts') || fs.existsSync(srcRoute + '.js')) {
            return require(srcRoute).default;
        } else {
            throw new Error(`Route not found: ${route}`);
        }
    } catch (e) {
        console.error(`❌ Error importing route ${route}:`, e instanceof Error ? e.message : String(e));
        throw e;
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

    // Print file tree for /app, /app/dist, /app/backend, /app/backend/dist, /app/frontend, /app/frontend/.next
    const dirsToCheck = [
        process.cwd(),
        path.join(process.cwd(), 'dist'),
        path.join(process.cwd(), 'backend'),
        path.join(process.cwd(), 'backend/dist'),
        path.join(process.cwd(), 'frontend'),
        path.join(process.cwd(), 'frontend/.next'),
    ];
    dirsToCheck.forEach(dir => {
        console.log(`\n📂 File tree for: ${dir}`);
        printDirectoryTree(dir, '  ');
    });

    // Check if .next directory exists
    const nextDir = path.join(process.cwd(), 'frontend/.next');
    if (fs.existsSync(nextDir)) {
        console.log('✅ .next directory found');
    } else {
        console.log('❌ .next directory NOT found');
        console.log('Make sure .next directory exists in:', nextDir);
    }

    app.use(cors({
        origin: 'https://chat-app-tk-blg.fly.dev',
        credentials: true,
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(passport.initialize());

    // Register routes with better error reporting
    const routes = ['register', 'login', 'profile', 'message', 'friend', 'story'];
    routes.forEach(route => {
        try {
            app.use(`/${route}`, safeImportRoute(route));
            console.log(`✅ Loaded route: /${route}`);
        } catch (e) {
            console.error(`❌ Failed to load route /${route}:`, e instanceof Error ? e.message : String(e));
        }
    });

    app.use('/_next/static', express.static(path.join(process.cwd(), 'frontend/.next/static')));
    app.use(express.static(path.join(process.cwd(), 'frontend/public')));
    
    app.get('/health', (req, res) => {
        res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    app.use((req, res) => handle(req, res));
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