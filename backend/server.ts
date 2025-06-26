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

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: './frontend' });
const handle = nextApp.getRequestHandler();

const PORT = process.env.PORT || 8080;

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
  app.use('/register', registerRoutes);
  app.use('/login', loginRoutes);
  app.use('/profile', profileRoutes);
  app.use('/message', messageRoutes);
  app.use('/friend', friendRoutes);
  app.use('/story', storyRoutes);

  // Serve frontend for all other routes
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  const httpServer = createServer(app);
  initializeSocket(httpServer);

httpServer.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
});
