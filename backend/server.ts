// Fixed TypeScript version - addresses all compilation errors
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import type { Request, Response, NextFunction } from 'express';

console.log('🚀 Starting server debug...');
console.log('📍 PORT:', process.env.PORT || 8080);
console.log('📍 NODE_ENV:', process.env.NODE_ENV);

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 8080;

const app = express();

// Basic middleware first
app.use(cors({
  origin: ['http://localhost:3000', 'https://chat-app-tk-blg.fly.dev'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check - keep this working
app.get('/health', (req, res) => {
  console.log('🏥 Health check');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    step: 'basic-server'
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Debug server is running!', step: 'basic-server' });
});

// STEP 2: Try to add passport (comment out if this breaks)
try {
  console.log('📦 Loading passport...');
  const passport = require('passport');
  require('./src/config/passport');
  app.use(passport.initialize());
  console.log('✅ Passport loaded successfully');
} catch (error) {
  console.error('❌ Passport failed:', (error as Error).message);
  console.log('⚠️  Continuing without passport...');
}

// STEP 3: Try to add routes one by one (comment out problematic ones)
const routes = [
  { path: '/api/register', module: './src/routes/register', name: 'register' },
  { path: '/api/login', module: './src/routes/login', name: 'login' },
  { path: '/api/profile', module: './src/routes/profile', name: 'profile' },
  { path: '/api/message', module: './src/routes/message', name: 'message' },
  { path: '/api/friend', module: './src/routes/friend', name: 'friend' },
  { path: '/api/story', module: './src/routes/story', name: 'story' }
];

routes.forEach(route => {
  try {
    console.log(`📦 Loading ${route.name} routes...`);
    const routeModule = require(route.module);
    app.use(route.path, routeModule.default || routeModule);
    console.log(`✅ ${route.name} routes loaded`);
  } catch (error) {
    console.error(`❌ ${route.name} routes failed:`, (error as Error).message);
    console.log(`⚠️  Continuing without ${route.name} routes...`);
  }
});

// STEP 4: Try to add socket (comment out if this breaks)
let httpServer;
try {
  console.log('📦 Loading socket...');
  const { initializeSocket } = require('./src/util/socket');
  httpServer = createServer(app);
  initializeSocket(httpServer);
  console.log('✅ Socket loaded successfully');
} catch (error) {
  console.error('❌ Socket failed:', (error as Error).message);
  console.log('⚠️  Using basic HTTP server...');
  httpServer = createServer(app);
}

// STEP 5: Try to add Next.js (comment out if this breaks)
async function setupNextJS() {
  try {
    console.log('📦 Loading Next.js...');
    const next = require('next');
    const path = require('path');
    
    const frontendPath = path.join(process.cwd(), '../frontend');
    console.log('📁 Frontend path:', frontendPath);
    
    // Check if frontend directory exists
    const fs = require('fs');
    if (!fs.existsSync(frontendPath)) {
      throw new Error(`Frontend directory does not exist: ${frontendPath}`);
    }
    
    const nextApp = next({ 
      dev, 
      dir: frontendPath,
      conf: {
        reactStrictMode: true,
        swcMinify: true,
      }
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Add Next.js handler AFTER API routes - Fixed callback signature
    app.all('*', (req: Request, res: Response) => {
      // Skip API routes
      if (req.path.startsWith('/api/') || req.path === '/health') {
        return res.status(404).json({ error: 'API route not found' });
      }
      return handle(req, res);
    });

    console.log('✅ Next.js loaded successfully');
  } catch (error) {
    console.error('❌ Next.js failed:', (error as Error).message);
    console.log('⚠️  Adding fallback routes...');
    
    // Fallback for when Next.js fails
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.json({ 
        message: 'Frontend not available', 
        path: req.path,
        note: 'Next.js failed to load'
      });
    });
  }
}

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Internal server error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

// Start the server
async function startServer() {
  try {
    // Setup Next.js if possible
    await setupNextJS();
    
    httpServer.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
      console.log(`🔧 Development mode: ${dev}`);
      console.log('✅ Server startup complete');
    });
  } catch (error) {
    console.error('❌ Error starting server:', (error as Error).message);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();