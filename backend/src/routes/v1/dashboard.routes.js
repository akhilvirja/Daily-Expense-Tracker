import express from 'express';
import { getDashboard } from '../../controllers/dashboardController.js';
import { authenticate as protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

router.get('/', getDashboard);

export default router;
