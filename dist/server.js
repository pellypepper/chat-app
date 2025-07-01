"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const next_1 = __importDefault(require("next"));
const express_1 = __importDefault(require("express"));
const passport = require('passport');
require('./backend/src/config/passport');
// import session from 'express-session';
const register_1 = __importDefault(require("./backend/src/routes/register"));
const login_1 = __importDefault(require("./backend/src/routes/login"));
const profile_1 = __importDefault(require("./backend/src/routes/profile"));
const story_1 = __importDefault(require("./backend/src/routes/story"));
const friend_1 = __importDefault(require("./backend/src/routes/friend"));
const message_1 = __importDefault(require("./backend/src/routes/message"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_1 = require("./backend/src/util/socket");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const PORT = process.env.PORT || 8080;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = (0, next_1.default)({ dev, dir: path_1.default.join(__dirname, './frontend') });
const handle = nextApp.getRequestHandler();
function printRouterPaths(label, router) {
    if (router?.stack) {
        try {
            const paths = router.stack
                .filter((layer) => {
                // Check for both route layers and router layers
                return (layer.route && layer.route.path) || (layer.regexp && layer.keys);
            })
                .map((layer) => {
                if (layer.route) {
                    return layer.route.path;
                }
                else if (layer.regexp) {
                    // For router layers, try to extract the path
                    return layer.regexp.source || 'unknown';
                }
                return 'unknown';
            });
            console.log(`[DEBUG] ${label} registered paths:`, paths);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[ERROR] Failed to process ${label}:`, errorMessage);
        }
    }
    else {
        console.log(`[DEBUG] ${label} has no stack or is not a router.`);
    }
}
nextApp.prepare().then(() => {
    const app = (0, express_1.default)();
    // Debug info
    console.log('🔍 Debug info:');
    console.log('Current working directory:', process.cwd());
    console.log('Frontend directory:', path_1.default.join(__dirname, './frontend'));
    console.log('Looking for .next directory at:', path_1.default.join(__dirname, './frontend/.next'));
    console.log('NODE_ENV:', process.env.NODE_ENV);
    // Check if .next directory exists
    const nextDir = path_1.default.join(__dirname, './frontend/.next');
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
    app.use(passport.initialize());
    // app.use(passport.session());
    // Register routes with error handling
    try {
        console.log('Registering routes...');
        app.use('/register', register_1.default);
        console.log('✅ Register routes loaded');
        app.use('/login', login_1.default);
        console.log('✅ Login routes loaded');
        app.use('/profile', profile_1.default);
        console.log('✅ Profile routes loaded');
        app.use('/message', message_1.default);
        console.log('✅ Message routes loaded');
        app.use('/friend', friend_1.default);
        console.log('✅ Friend routes loaded');
        app.use('/story', story_1.default);
        console.log('✅ Story routes loaded');
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Error registering routes:', errorMessage);
    }
    // Debug routes after registration (uncomment if needed)
    // printRouterPaths('registerRoutes', registerRoutes);
    // printRouterPaths('loginRoutes', loginRoutes);
    // printRouterPaths('profileRoutes', profileRoutes);
    // printRouterPaths('messageRoutes', messageRoutes);
    // printRouterPaths('friendRoutes', friendRoutes);
    // printRouterPaths('storyRoutes', storyRoutes);
    // Serve static files from Next.js build and public
    app.use('/_next/static', express_1.default.static(path_1.default.join(__dirname, './frontend/.next/static')));
    app.use(express_1.default.static(path_1.default.join(__dirname, './frontend/public')));
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });
    // All other routes handled by Next.js
    app.use((req, res) => {
        return handle(req, res);
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
});
//# sourceMappingURL=server.js.map