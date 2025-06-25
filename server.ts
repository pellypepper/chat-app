import express from 'express';
import passport from 'passport';
import './src/config/passport';
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


import { db } from './backend/src/util/db';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/profile', profileRoutes);
app.use('/message', messageRoutes);
app.use('/friend', friendRoutes);
app.use('/story', storyRoutes);

// Create HTTP server from Express app
const httpServer = createServer(app);



const io = initializeSocket(httpServer);

// Start the server with HTTP server (not app.listen)
httpServer.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
