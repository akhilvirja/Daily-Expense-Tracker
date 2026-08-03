import express from 'express';
import { authenticate as protect } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { trackerItemSchema, trackerLogSchema } from '../../validators/trackerValidator.js';
import {
  getTrackerItems,
  createTrackerItem,
  updateTrackerItem,
  deleteTrackerItem,
} from '../../controllers/trackerItemController.js';
import { getLogsByDate, upsertTrackerLog, getRecentLogsByItem } from '../../controllers/trackerLogController.js';

const router = express.Router();

// All tracker routes require authentication
router.use(protect);

// ============================================
// Tracker Items (Master List)
// ============================================
router
  .route('/items')
  .get(getTrackerItems)
  .post(validate(trackerItemSchema), createTrackerItem);

router
  .route('/items/:id')
  .put(validate(trackerItemSchema), updateTrackerItem)
  .delete(deleteTrackerItem);

// ============================================
// Daily Logs
// ============================================
router
  .route('/logs')
  .get(getLogsByDate)
  .post(validate(trackerLogSchema), upsertTrackerLog);

router.get('/logs/item/:itemId', getRecentLogsByItem);

export default router;
