import express from 'express';
import passport from 'passport';
import './src/config/passport';
import registerRoutes from './src/routes/register';
import loginRoutes from './src/routes/login';
import profileRoutes from './src/routes/profile';
import friendRoutes from './src/routes/friend';
import messageRoutes from './src/routes/message';
import cookieParser from 'cookie-parser';

import { createServer } from 'http';
import { initializeSocket } from './src/util/socket';


import { db } from './src/util/db';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/profile', profileRoutes);
app.use('/message', messageRoutes);
app.use('/friend', friendRoutes);

// Create HTTP server from Express app
const httpServer = createServer(app);



const io = initializeSocket(httpServer);

// Start the server with HTTP server (not app.listen)
httpServer.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
