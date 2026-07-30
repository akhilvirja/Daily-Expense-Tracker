import { Router } from 'express';

// Import all v1 route modules
import authRoutes from './auth.routes.js';
import accountRoutes from './account.routes.js';
// Add future routes here, e.g. categoryRoutes, transactionRoutes

const router = Router();

/**
 * Route Mountings
 * Prefix: /api/v1
 */
router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/transactions', transactionRoutes);

export default router;
