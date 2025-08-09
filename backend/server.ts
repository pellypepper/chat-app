import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import passport from 'passport';

// Import passportConfig from compiled output for production
// In dev, use './src/config/passport'; in prod, use './config/passport'
import passportConfig from './src/config/passport';
import registerRoute from './src/routes/register';
import loginRoute from './src/routes/login';
import profileRoute from './src/routes/profile';
import messageRoute from './src/routes/message';
import friendRoute from './src/routes/friend';
import storyRoute from './src/routes/story';
import { initializeSocket } from './src/util/socket';
const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://chat-app-frontend-eybx.vercel.app'
        : ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

passportConfig();
app.use(passport.initialize());

app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/profile', profileRoute);
app.use('/message', messageRoute);
app.use('/friend', friendRoute);
app.use('/story', storyRoute);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const httpServer = createServer(app);
if (initializeSocket) {
    initializeSocket(httpServer);
}
httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});