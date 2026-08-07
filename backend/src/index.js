import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import prisma from './config/db.js';

// --- Route Imports ---
import v1Routes from './routes/v1/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// Global Middleware
// ========================
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        const allowedOrigins = [
            'http://localhost:5173', 
            'http://192.168.1.18:5173',
            ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [])
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.CORS_ORIGIN === '*') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// ========================
// Health Check
// ========================
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// ========================
// API Routes
// ========================
app.use('/api/v1', v1Routes);

// ========================
// 404 Handler (must be after all routes)
// ========================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// ========================
// Global Error Handler (must be last)
// ========================
app.use(errorHandler);

// ========================
// Server Startup
// ========================
const startServer = async () => {
    try {
        // Verify database connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔄 Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
