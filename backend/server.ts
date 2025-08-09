import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import path from 'path';
import fs from 'fs';

const passport = require('passport');

// Utility: Import passport config from possible locations
function importPassportConfig() {
    const possiblePaths = [
        path.join(__dirname, 'config', 'passport.js'),
        path.join(__dirname, 'config', 'passport', 'index.js'),
    ];
    for (const configPath of possiblePaths) {
        if (fs.existsSync(configPath)) {
            try {
                require(configPath);
                return;
            } catch (error) {
                console.error(`Error loading passport config from ${configPath}:`, error);
            }
        }
    }
    throw new Error('passport config not found in any expected location');
}

// Utility: Import route handler from possible locations
function safeImportRoute(route: string) {
    const possiblePaths = [
        path.join(__dirname, 'routes', route + '.js'),
    ];
    for (const routePath of possiblePaths) {
        if (fs.existsSync(routePath)) {
            try {
                const routeModule = require(routePath);
                return routeModule.default || routeModule;
            } catch (error) {
                console.error(`Error loading route from ${routePath}:`, error);
            }
        }
    }
    throw new Error(`Route not found: ${route}`);
}

// Utility: Import socket initializer from possible locations
function safeImportSocket() {
    const possiblePaths = [
        path.join(__dirname, 'util', 'socket.js'),
    ];
    for (const socketPath of possiblePaths) {
        if (fs.existsSync(socketPath)) {
            try {
                const socketModule = require(socketPath);
                return socketModule.initializeSocket || socketModule.default?.initializeSocket;
            } catch (error) {
                console.error(`Error loading socket from ${socketPath}:`, error);
            }
        }
    }
    return null;
}

const PORT = process.env.PORT || 8080;
const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://chat-app-frontend-eybx.vercel.app'
        : ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize passport if config is found
try {
    importPassportConfig();
    app.use(passport.initialize());
} catch (error) {
    console.error('Failed to initialize passport:', error);
}

// Register routes
const routes = ['register', 'login', 'profile', 'message', 'friend', 'story'];
routes.forEach(route => {
    try {
        const routeHandler = safeImportRoute(route);
        app.use(`/${route}`, routeHandler);
    } catch (e) {
        console.error(`Failed to load route /${route}:`, e instanceof Error ? e.message : String(e));
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV 
    });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const httpServer = createServer(app);

// Initialize socket if available
const initializeSocket = safeImportSocket();
if (initializeSocket) {
    initializeSocket(httpServer);
}

httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});