import express from 'express';
import passport from 'passport';
import './src/config/passport';
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
import { db } from './src/util/db';
import next from 'next';
import path from 'path';

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 8080;

// Fix the Next.js configuration
const nextApp = next({ 
  dev, 
  dir: path.join(process.cwd(), '../frontend'), // Correct path to frontend
  conf: {
    // Provide inline config if next.config.js is not found
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone'
  }
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
  app.use(passport.initialize());
  app.use(cookieParser());
  
  // API routes
  app.use('/api/register', registerRoutes);
  app.use('/api/login', loginRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/message', messageRoutes);
  app.use('/api/friend', friendRoutes);
  app.use('/api/story', storyRoutes);
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });
  
  // Serve frontend for all other routes
  app.all('*', (req, res) => {
    return handle(req, res);
  });
  
  const httpServer = createServer(app);
  initializeSocket(httpServer);
  
  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📁 Frontend directory: ${path.join(process.cwd(), '../frontend')}`);
    console.log(`🔧 Development mode: ${dev}`);
  });
}).catch((err) => {
  console.error('❌ Error starting server:', err);
  process.exit(1);
});