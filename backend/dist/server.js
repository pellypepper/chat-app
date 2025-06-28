"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
require('./src/config/passport');
// import session from 'express-session';
const register_1 = __importDefault(require("./src/routes/register"));
const login_1 = __importDefault(require("./src/routes/login"));
const profile_1 = __importDefault(require("./src/routes/profile"));
const story_1 = __importDefault(require("./src/routes/story"));
const friend_1 = __importDefault(require("./src/routes/friend"));
const message_1 = __importDefault(require("./src/routes/message"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_1 = require("./src/util/socket");
const next_1 = __importDefault(require("next"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 8080;
const frontendDir = path_1.default.join(process.cwd(), 'frontend');
const nextDir = path_1.default.join(frontendDir, '.next');
console.log('🔍 Debug info:');
console.log('Current working directory:', process.cwd());
console.log('Frontend directory:', frontendDir);
console.log('Looking for .next directory at:', nextDir);
console.log('NODE_ENV:', process.env.NODE_ENV);
// Check if .next directory exists
if (!fs_1.default.existsSync(nextDir)) {
    console.error('❌ .next directory not found at:', nextDir);
    console.error('Available directories in frontend:');
    try {
        const frontendContents = fs_1.default.readdirSync(frontendDir);
        console.error(frontendContents);
    }
    catch (err) {
        console.error('Cannot read frontend directory:', err);
    }
    process.exit(1);
}
// Initialize Next.js app
const nextApp = (0, next_1.default)({
    dev: false, // Always false in production Docker container
    dir: frontendDir, // Point to frontend directory
});
const handle = nextApp.getRequestHandler();
nextApp.prepare().then(() => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: ['http://localhost:3000', 'https://chat-app-tk-blg.fly.dev'],
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    // // Session configuration
    // app.use(session({
    //     secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
    //     resave: false,
    //     saveUninitialized: false,
    //     cookie: {
    //         secure: process.env.NODE_ENV === 'production',
    //         maxAge: 24 * 60 * 60 * 1000 // 24 hours
    //     }
    // }));
    app.use(passport_1.default.initialize());
    // app.use(passport.session());
    // API routes
    app.use('/api/register', register_1.default);
    app.use('/api/login', login_1.default);
    app.use('/api/profile', profile_1.default);
    app.use('/api/message', message_1.default);
    app.use('/api/friend', friend_1.default);
    app.use('/api/story', story_1.default);
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            cwd: process.cwd(),
            nodeEnv: process.env.NODE_ENV,
            nextDirExists: fs_1.default.existsSync(nextDir)
        });
    });
    // Serve Next.js frontend
    app.all('*', (req, res) => {
        return handle(req, res);
    });
    // Error handler middleware - must be last
    app.use((err, req, res, next) => {
        console.error('Internal server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    });
    const httpServer = (0, http_1.createServer)(app);
    (0, socket_1.initializeSocket)(httpServer);
    httpServer.listen(Number(PORT), '0.0.0.0', () => {
        console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
        console.log(`📁 Serving from directory: ${process.cwd()}`);
        console.log(`🔧 Development mode: ${dev}`);
        console.log(`✅ .next directory found at: ${nextDir}`);
    });
}).catch((err) => {
    console.error('❌ Error starting server:', err);
    console.error('Make sure .next directory exists in:', nextDir);
    process.exit(1);
});
//# sourceMappingURL=server.js.map