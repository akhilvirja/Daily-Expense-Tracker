import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { STATUS_MESSAGES } from '../constants/statusMessages.js';

/**
 * @desc    Get all transactions for the authenticated user
 * @route   GET /api/v1/transactions
 * @access  Private
 */
export const getTransactions = asyncHandler(async (req, res) => {
  const { accountId, categoryId, type, startDate, endDate } = req.query;

  // Build filter object
  const filter = { userId: req.user.id };

  if (accountId) filter.accountId = accountId;
  if (categoryId) filter.categoryId = categoryId;
  if (type) filter.type = type;

  if (startDate || endDate) {
    filter.occurredOn = {};
    if (startDate) filter.occurredOn.gte = new Date(startDate);
    if (endDate) filter.occurredOn.lte = new Date(endDate);
  }

  const transactions = await prisma.transaction.findMany({
    where: filter,
    orderBy: {
      occurredOn: 'desc',
    },
    include: {
      account: { select: { id: true, name: true, kind: true } },
      category: { select: { id: true, name: true, isSystem: true } },
      bill: { 
        select: { 
          id: true, 
          periodStart: true,
          item: { select: { id: true, name: true } } 
        } 
      }
    }
  });

  return sendSuccess(res, STATUS_CODES.OK, transactions, STATUS_MESSAGES.SUCCESS.FETCHED);
});

/**
 * @desc    Create a new transaction
 * @route   POST /api/v1/transactions
 * @access  Private
 */
export const createTransaction = asyncHandler(async (req, res) => {
  const { accountId, categoryId, type, amount, description, occurredOn } = req.body;

  // Verify account belongs to user
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId: req.user.id, deletedAt: null }
  });

  if (!account) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Account not found');
  }

  // Verify category belongs to user if provided
  if (categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.user.id, deletedAt: null }
    });
    if (!category) {
      return sendError(res, STATUS_CODES.NOT_FOUND, 'Category not found');
    }
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: req.user.id,
      accountId,
      categoryId,
      type,
      amount,
      description,
      occurredOn: new Date(occurredOn),
    },
    include: {
      account: { select: { id: true, name: true, kind: true } },
      category: { select: { id: true, name: true } },
    }
  });

  return sendSuccess(res, STATUS_CODES.CREATED, transaction, 'Transaction created successfully');
});

/**
 * @desc    Get a single transaction by ID
 * @route   GET /api/v1/transactions/:id
 * @access  Private
 */
export const getTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
    include: {
      account: { select: { id: true, name: true, kind: true } },
      category: { select: { id: true, name: true } },
    }
  });

  if (!transaction) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Transaction not found');
  }

  return sendSuccess(res, STATUS_CODES.OK, transaction, STATUS_MESSAGES.SUCCESS.FETCHED);
});

/**
 * @desc    Update a transaction
 * @route   PUT /api/v1/transactions/:id
 * @access  Private
 */
export const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { accountId, categoryId, type, amount, description, occurredOn } = req.body;

  // Check if transaction exists and belongs to user
  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });

  if (!existingTransaction) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Transaction not found');
  }

  // Verify account belongs to user if changing accountId
  if (accountId && accountId !== existingTransaction.accountId) {
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId: req.user.id, deletedAt: null }
    });
    if (!account) {
      return sendError(res, STATUS_CODES.NOT_FOUND, 'Account not found');
    }
  }

  // Verify category belongs to user if changing categoryId
  if (categoryId && categoryId !== existingTransaction.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.user.id, deletedAt: null }
    });
    if (!category) {
      return sendError(res, STATUS_CODES.NOT_FOUND, 'Category not found');
    }
  }

  const updatedData = {};
  if (accountId !== undefined) updatedData.accountId = accountId;
  if (categoryId !== undefined) updatedData.categoryId = categoryId;
  if (type !== undefined) updatedData.type = type;
  if (amount !== undefined) updatedData.amount = amount;
  if (description !== undefined) updatedData.description = description;
  if (occurredOn !== undefined) updatedData.occurredOn = new Date(occurredOn);

  const updatedTransaction = await prisma.transaction.update({
    where: { id },
    data: updatedData,
    include: {
      account: { select: { id: true, name: true, kind: true } },
      category: { select: { id: true, name: true } },
    }
  });

  return sendSuccess(res, STATUS_CODES.OK, updatedTransaction, 'Transaction updated successfully');
});

/**
 * @desc    Delete a transaction (Hard delete)
 * @route   DELETE /api/v1/transactions/:id
 * @access  Private
 */
export const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if transaction exists and belongs to user
  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });

  if (!transaction) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Transaction not found');
  }

  await prisma.transaction.delete({
    where: { id },
  });

  return sendSuccess(res, STATUS_CODES.OK, null, 'Transaction deleted successfully');
});
