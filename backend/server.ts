import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';

// Import passport and its config directly
import passport from 'passport';


// Import route handlers directly
import registerRoute from './src/routes/register';
import loginRoute from './src/routes/login';
import profileRoute from './src/routes/profile';
import messageRoute from './src/routes/message';
import friendRoute from './src/routes/friend';
import storyRoute from './src/routes/story';

// Import socket initializer directly
import { initializeSocket } from './src/util/socket';

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


app.use(passport.initialize());

// Register routes
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/profile', profileRoute);
app.use('/message', messageRoute);
app.use('/friend', friendRoute);
app.use('/story', storyRoute);

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
if (initializeSocket) {
    initializeSocket(httpServer);
}

httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});