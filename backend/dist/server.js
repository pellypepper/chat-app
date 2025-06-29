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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
// Debug info
console.log('🔍 Debug info:');
console.log('Current working directory:', process.cwd());
console.log('Frontend directory:', path_1.default.join(__dirname, '../../frontend'));
console.log('Looking for .next directory at:', path_1.default.join(__dirname, '../../frontend/.next'));
console.log('NODE_ENV:', process.env.NODE_ENV);
// Check if .next directory exists
const nextDir = path_1.default.join(__dirname, '../../frontend/.next');
if (fs_1.default.existsSync(nextDir)) {
    console.log('✅ .next directory found');
}
else {
    console.log('❌ .next directory NOT found');
    console.log('Make sure .next directory exists in:', nextDir);
}
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
// Serve static files from Next.js build
app.use('/_next/static', express_1.default.static(path_1.default.join(__dirname, '../../frontend/.next/static')));
app.use('/static', express_1.default.static(path_1.default.join(__dirname, '../../frontend/.next/static')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../../frontend/public')));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Serve Next.js built files for the frontend
app.use('/_next', express_1.default.static(path_1.default.join(__dirname, '../../frontend/.next')));
// Serve the main Next.js HTML file for frontend routes
const serveFrontend = (req, res) => {
    const indexPath = path_1.default.join(__dirname, '../../frontend/.next/server/pages/index.html');
    if (fs_1.default.existsSync(indexPath)) {
        res.sendFile(indexPath);
    }
    else {
        // Try alternative paths for Next.js build output
        const altPaths = [
            path_1.default.join(__dirname, '../../frontend/out/index.html'),
            path_1.default.join(__dirname, '../../frontend/dist/index.html'),
            path_1.default.join(__dirname, '../../frontend/.next/static/index.html')
        ];
        let served = false;
        for (const altPath of altPaths) {
            if (fs_1.default.existsSync(altPath)) {
                res.sendFile(altPath);
                served = true;
                break;
            }
        }
        if (!served) {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Chat App</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body>
                    <div id="__next">
                        <h1>Chat App</h1>
                        <p>Frontend build not found. Please check the build process.</p>
                    </div>
                </body>
                </html>
            `);
        }
    }
};
// Define specific frontend routes
const frontendRoutes = ['/', '/profile', '/chat', '/login', '/register', '/dashboard'];
frontendRoutes.forEach(route => {
    app.get(route, serveFrontend);
});
// Handle all other non-API routes (catch-all for SPA routing)
app.get(/^(?!\/api).*/, serveFrontend);
// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});
// Error handler middleware - must be last
app.use((err, req, res, next) => {
    console.error('❌ Error starting server:', err);
    res.status(500).json({ error: 'Internal server error' });
});
const httpServer = (0, http_1.createServer)(app);
(0, socket_1.initializeSocket)(httpServer);
httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📁 Serving from directory: ${process.cwd()}`);
    console.log(`✅ .next directory found at: ${nextDir}`);
}).on('error', (err) => {
    console.error('❌ Error starting server:', err);
});
//# sourceMappingURL=server.js.map