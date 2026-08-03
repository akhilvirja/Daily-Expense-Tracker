import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

/**
 * @desc    Get all active tracker items with their log entries for a specific date
 * @route   GET /api/v1/trackers/logs?date=YYYY-MM-DD
 * @access  Private
 */
export const getLogsByDate = asyncHandler(async (req, res) => {
  const dateStr = req.query.date;

  if (!dateStr || isNaN(Date.parse(dateStr))) {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'Valid date query parameter is required (YYYY-MM-DD)');
  }

  // Parse date and reset time to midnight UTC for precise matching
  const targetDate = new Date(dateStr);
  targetDate.setUTCHours(0, 0, 0, 0);

  // Fetch all active items, and include the log for this specific date if it exists
  const itemsWithLogs = await prisma.trackerItem.findMany({
    where: {
      userId: req.user.id,
      deletedAt: null, // Only fetch non-deleted items
      isActive: true,  // Only fetch active items for daily logging
    },
    include: {
      logs: {
        where: {
          logDate: targetDate,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Map the results to make it easier for the frontend
  const formattedData = itemsWithLogs.map(item => {
    const log = item.logs.length > 0 ? item.logs[0] : null;
    return {
      itemId: item.id,
      name: item.name,
      unit: item.unit,
      price: item.price,
      log: log ? {
        id: log.id,
        quantity: log.quantity,
        amount: log.amount,
        note: log.note,
      } : null,
    };
  });

  return sendSuccess(res, STATUS_CODES.OK, formattedData, 'Daily logs fetched successfully');
});

/**
 * @desc    Upsert (Create or Update) a daily log for a tracker item
 * @route   POST /api/v1/trackers/logs
 * @access  Private
 */
export const upsertTrackerLog = asyncHandler(async (req, res) => {
  const { itemId, logDate, quantity, amount, note } = req.body;

  // Validate the item belongs to the user
  const item = await prisma.trackerItem.findUnique({
    where: { id: itemId },
  });

  if (!item || item.userId !== req.user.id) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Tracker item not found');
  }

  // Parse date and reset time to midnight UTC
  const targetDate = new Date(logDate);
  targetDate.setUTCHours(0, 0, 0, 0);

  // Upsert the log
  // Prisma doesn't support complex unique where clauses directly for upsert without a unique index on (itemId, logDate)
  // We added @@unique([itemId, logDate]) to TrackerLog in schema.prisma!
  
  // Wait, Prisma requires the unique identifier in the `where` clause.
  // Since we have a compound unique constraint @@unique([itemId, logDate]), we can use it!
  const upsertedLog = await prisma.trackerLog.upsert({
    where: {
      itemId_logDate: {
        itemId: itemId,
        logDate: targetDate,
      },
    },
    update: {
      quantity,
      amount,
      note,
    },
    create: {
      userId: req.user.id,
      itemId,
      logDate: targetDate,
      quantity,
      amount,
      note,
    },
  });

  return sendSuccess(res, STATUS_CODES.OK, upsertedLog, 'Tracker log saved successfully');
});

/**
 * @desc    Get recent logs for a specific tracker item
 * @route   GET /api/v1/trackers/logs/item/:itemId
 * @access  Private
 */
export const getRecentLogsByItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  // Validate the item belongs to the user
  const item = await prisma.trackerItem.findUnique({
    where: { id: itemId },
  });

  if (!item || item.userId !== req.user.id) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Tracker item not found');
  }

  // Fetch the last 10 logs for this item
  const recentLogs = await prisma.trackerLog.findMany({
    where: {
      itemId,
    },
    orderBy: {
      logDate: 'desc',
    },
    take: 10,
  });

  return sendSuccess(res, STATUS_CODES.OK, recentLogs, 'Recent logs fetched successfully');
});
