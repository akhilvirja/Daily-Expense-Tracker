import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { STATUS_MESSAGES } from '../constants/statusMessages.js';

/**
 * @desc    Get all active tracker items for the authenticated user
 * @route   GET /api/v1/trackers/items
 * @access  Private
 */
export const getTrackerItems = asyncHandler(async (req, res) => {
  const items = await prisma.trackerItem.findMany({
    where: {
      userId: req.user.id,
      deletedAt: null, // Only fetch non-deleted items
    },
    orderBy: {
      name: 'asc',
    },
  });

  return sendSuccess(res, STATUS_CODES.OK, items, STATUS_MESSAGES.SUCCESS.FETCHED);
});

/**
 * @desc    Create a new tracker item
 * @route   POST /api/v1/trackers/items
 * @access  Private
 */
export const createTrackerItem = asyncHandler(async (req, res) => {
  const { name, unit, price } = req.body;

  // Check if an active item with the same name exists
  const existingItem = await prisma.trackerItem.findFirst({
    where: {
      userId: req.user.id,
      name: { equals: name, mode: 'insensitive' },
      deletedAt: null,
    },
  });

  if (existingItem) {
    return sendError(res, STATUS_CODES.CONFLICT, 'An active tracker item with this name already exists');
  }

  // Create the item
  const item = await prisma.trackerItem.create({
    data: {
      userId: req.user.id,
      name,
      unit,
      price,
    },
  });

  return sendSuccess(res, STATUS_CODES.CREATED, item, 'Tracker item created successfully');
});

/**
 * @desc    Update a tracker item
 * @route   PUT /api/v1/trackers/items/:id
 * @access  Private
 */
export const updateTrackerItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, unit, price, isActive } = req.body;

  const item = await prisma.trackerItem.findUnique({
    where: { id },
  });

  if (!item || item.userId !== req.user.id || item.deletedAt) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Tracker item not found');
  }

  // If changing name, ensure no other active item has the same name
  if (name && name.toLowerCase() !== item.name.toLowerCase()) {
    const existingItem = await prisma.trackerItem.findFirst({
      where: {
        userId: req.user.id,
        name: { equals: name, mode: 'insensitive' },
        deletedAt: null,
        id: { not: id },
      },
    });

    if (existingItem) {
      return sendError(res, STATUS_CODES.CONFLICT, 'Another active tracker item with this name already exists');
    }
  }

  const updatedItem = await prisma.trackerItem.update({
    where: { id },
    data: {
      name: name !== undefined ? name : undefined,
      unit: unit !== undefined ? unit : undefined,
      price: price !== undefined ? price : undefined,
      isActive: isActive !== undefined ? isActive : undefined,
    },
  });

  return sendSuccess(res, STATUS_CODES.OK, updatedItem, 'Tracker item updated successfully');
});

/**
 * @desc    Soft delete a tracker item
 * @route   DELETE /api/v1/trackers/items/:id
 * @access  Private
 */
export const deleteTrackerItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await prisma.trackerItem.findUnique({
    where: { id },
  });

  if (!item || item.userId !== req.user.id || item.deletedAt) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Tracker item not found');
  }

  // Soft delete instead of hard delete to preserve historical logs and bills
  await prisma.trackerItem.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });

  return sendSuccess(res, STATUS_CODES.OK, null, 'Tracker item deleted successfully');
});
