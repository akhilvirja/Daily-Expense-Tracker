import { Router } from 'express';

// Import all v1 route modules
import authRoutes from './auth.routes.js';
import accountRoutes from './account.routes.js';
import categoryRoutes from './category.routes.js';
import transactionRoutes from './transaction.routes.js';
import trackerRoutes from './tracker.routes.js';
import billRoutes from './bill.routes.js';

const router = Router();

/**
 * Route Mountings
 * Prefix: /api/v1
 */
router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/trackers', trackerRoutes);
router.use('/bills', billRoutes);

export default router;
