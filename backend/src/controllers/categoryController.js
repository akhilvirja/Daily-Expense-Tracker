import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { STATUS_MESSAGES } from '../constants/statusMessages.js';

/**
 * @desc    Get all categories for the authenticated user
 * @route   GET /api/v1/categories
 * @access  Private
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    where: {
      userId: req.user.id,
      deletedAt: null, // Don't fetch soft-deleted categories
    },
    orderBy: {
      name: 'asc',
    },
  });

  return sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.SUCCESS, categories);
});

/**
 * @desc    Create a new category
 * @route   POST /api/v1/categories
 * @access  Private
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // Check if category with same name already exists for this user
  const existingCategory = await prisma.category.findFirst({
    where: {
      userId: req.user.id,
      name: {
        equals: name,
        mode: 'insensitive', // case-insensitive check
      },
      deletedAt: null,
    },
  });

  if (existingCategory) {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'A category with this name already exists');
  }

  // Check for soft-deleted category with the same name
  const softDeletedCategory = await prisma.category.findFirst({
    where: {
      userId: req.user.id,
      name: {
        equals: name,
        mode: 'insensitive',
      },
      deletedAt: {
        not: null,
      }
    }
  });

  let category;
  try {
    if (softDeletedCategory) {
      // Restore it
      category = await prisma.category.update({
        where: { id: softDeletedCategory.id },
        data: {
          deletedAt: null,
        }
      });
    } else {
      category = await prisma.category.create({
        data: {
          userId: req.user.id,
          name,
        },
      });
    }
    return sendSuccess(res, STATUS_CODES.CREATED, 'Category created successfully', category);
  } catch (error) {
    if (error.code === 'P2002') {
      return sendError(res, STATUS_CODES.BAD_REQUEST, 'A category with this name already exists');
    }
    throw error;
  }
});

/**
 * @desc    Get a single category by ID
 * @route   GET /api/v1/categories/:id
 * @access  Private
 */
export const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await prisma.category.findFirst({
    where: {
      id,
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!category) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Category not found');
  }

  return sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.SUCCESS, category);
});

/**
 * @desc    Update a category
 * @route   PUT /api/v1/categories/:id
 * @access  Private
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Check if category exists and belongs to user
  const existingCategory = await prisma.category.findFirst({
    where: {
      id,
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!existingCategory) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Category not found');
  }

  // If name is changing, check for duplicates
  if (name && name.toLowerCase() !== existingCategory.name.toLowerCase()) {
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        userId: req.user.id,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (duplicateCategory) {
      return sendError(res, STATUS_CODES.BAD_REQUEST, 'A category with this name already exists');
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: { name },
  });

  return sendSuccess(res, STATUS_CODES.OK, 'Category updated successfully', updatedCategory);
});

/**
 * @desc    Delete a category (Soft delete)
 * @route   DELETE /api/v1/categories/:id
 * @access  Private
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if category exists and belongs to user
  const category = await prisma.category.findFirst({
    where: {
      id,
      userId: req.user.id,
      deletedAt: null,
    },
    include: {
      _count: {
        select: { transactions: true }
      }
    }
  });

  if (!category) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Category not found');
  }

  if (category._count.transactions > 0) {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'Cannot delete category with associated transactions. Please reassign them first.');
  }

  // Soft delete
  await prisma.category.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });

  return sendSuccess(res, STATUS_CODES.OK, 'Category deleted successfully', null);
});
