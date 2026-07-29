import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import prisma from './config/db.js';

// --- Route Imports ---
import accountRoutes from './routes/v1/account.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// Global Middleware
// ========================
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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
// API Routes (v1)
// ========================
app.use('/api/v1/accounts', accountRoutes);
// app.use('/api/v1/categories', categoryRoutes);       // Phase 2
// app.use('/api/v1/transactions', transactionRoutes);   // Phase 2
// app.use('/api/v1/items', dynamicItemRoutes);           // Phase 3
// app.use('/api/v1/daily-logs', dailyLogRoutes);         // Phase 3
// app.use('/api/v1/bills', billRoutes);                  // Phase 4
// app.use('/api/v1/reports', reportRoutes);              // Phase 5

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
