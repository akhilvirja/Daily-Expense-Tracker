import express from 'express';
import { getCategoryReport, getTrendReport } from '../../controllers/reportController.js';
import { authenticate as protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// All report routes require authentication
router.use(protect);

router.get('/category', getCategoryReport);
router.get('/trend', getTrendReport);

export default router;
