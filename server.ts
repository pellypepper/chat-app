import dotenv from 'dotenv';
dotenv.config();
import next from 'next';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
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

// Import passport config with better error handling
function importPassportConfig() {
    const possiblePaths = [
        // Production paths
        path.join(process.cwd(), 'backend', 'dist', 'config', 'passport.js'),
        path.join(process.cwd(), 'backend', 'dist', 'config', 'passport', 'index.js'),
        path.join(process.cwd(), 'dist', 'backend', 'src', 'config', 'passport.js'),
        // Development paths
        path.join(process.cwd(), 'backend', 'src', 'config', 'passport.ts'),
        path.join(process.cwd(), 'backend', 'src', 'config', 'passport.js'),
    ];

    console.log('🔍 Looking for passport config in:');
    for (const configPath of possiblePaths) {
        console.log(`  - ${configPath}`);
        if (fs.existsSync(configPath)) {
            try {
                require(configPath);
                console.log(`✅ Loaded passport config from: ${configPath}`);
                return;
            } catch (error) {
                console.error(`❌ Error loading passport config from ${configPath}:`, error);
            }
        }
    }
    
    throw new Error('passport config not found in any expected location');
}

// Safe route import with multiple fallback paths
function safeImportRoute(route: string) {
    const possiblePaths = [
        // Production paths
        path.join(process.cwd(), 'backend', 'dist', 'routes', route + '.js'),
        path.join(process.cwd(), 'dist', 'backend', 'src', 'routes', route + '.js'),
        // Development paths
        path.join(process.cwd(), 'backend', 'src', 'routes', route + '.ts'),
        path.join(process.cwd(), 'backend', 'src', 'routes', route + '.js'),
    ];

    console.log(`🔍 Looking for route ${route} in:`);
    for (const routePath of possiblePaths) {
        console.log(`  - ${routePath}`);
        if (fs.existsSync(routePath)) {
            try {
                const routeModule = require(routePath);
                return routeModule.default || routeModule;
            } catch (error) {
                console.error(`❌ Error loading route from ${routePath}:`, error);
            }
        }
    }
    
    throw new Error(`Route not found: ${route}`);
}

// Safe socket import
function safeImportSocket() {
    const possiblePaths = [
        // Production paths
        path.join(process.cwd(), 'backend', 'dist', 'util', 'socket.js'),
        path.join(process.cwd(), 'dist', 'backend', 'src', 'util', 'socket.js'),
        // Development paths
        path.join(process.cwd(), 'backend', 'src', 'util', 'socket.ts'),
        path.join(process.cwd(), 'backend', 'src', 'util', 'socket.js'),
    ];

    console.log('🔍 Looking for socket util in:');
    for (const socketPath of possiblePaths) {
        console.log(`  - ${socketPath}`);
        if (fs.existsSync(socketPath)) {
            try {
                const socketModule = require(socketPath);
                return socketModule.initializeSocket || socketModule.default?.initializeSocket;
            } catch (error) {
                console.error(`❌ Error loading socket from ${socketPath}:`, error);
            }
        }
    }
    
    console.warn('⚠️ Socket initialization not found, continuing without socket support');
    return null;
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
    console.log('NODE_ENV:', process.env.NODE_ENV);

    // Print file tree for debugging
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

    // CORS configuration
    app.use(cors({
        origin: process.env.NODE_ENV === 'production' 
            ? 'https://chat-app-tk-blg.fly.dev'
            : ['http://localhost:3000', 'http://localhost:8080'],
        credentials: true,
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Initialize passport
    try {
        importPassportConfig();
        app.use(passport.initialize());
        console.log('✅ Passport initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize passport:', error);
        // Continue without passport for now
    }

    // Register routes with better error handling
    const routes = ['register', 'login', 'profile', 'message', 'friend', 'story'];
    routes.forEach(route => {
        try {
            const routeHandler = safeImportRoute(route);
            app.use(`/${route}`, routeHandler);
            console.log(`✅ Loaded route: /${route}`);
        } catch (e) {
            console.error(`❌ Failed to load route /${route}:`, e instanceof Error ? e.message : String(e));
        }
    });

    // Static file serving
    app.use('/_next/static', express.static(path.join(process.cwd(), 'frontend/.next/static')));
    app.use(express.static(path.join(process.cwd(), 'frontend/public')));
    
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV 
        });
    });

    // Next.js handler for all other routes
    app.use((req, res) => handle(req, res));

    // Error handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error('❌ Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    });

    const httpServer = createServer(app);
    
    // Initialize socket if available
    const initializeSocket = safeImportSocket();
    if (initializeSocket) {
        initializeSocket(httpServer);
        console.log('✅ Socket initialized');
    }

    httpServer.listen(Number(PORT), '0.0.0.0', () => {
        console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
        console.log(`📁 Serving from directory: ${process.cwd()}`);
    }).on('error', (err) => {
        console.error('❌ Error starting server:', err);
    });
}).catch(err => {
    console.error('❌ Error preparing Next.js app:', err);
    process.exit(1);
});