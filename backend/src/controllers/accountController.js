import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { STATUS_MESSAGES } from '../constants/statusMessages.js';

// ============================================
// Enforcing user scope via req.user.id
// ============================================

/**
 * Helper: Compute the running balance for an account.
 * Balance = openingBalance + sum(credits) - sum(debits)
 */
export const computeBalance = async (accountId) => {
    const result = await prisma.transaction.groupBy({
        by: ['type'],
        where: { accountId },
        _sum: { amount: true },
    });

    let credits = 0;
    let debits = 0;

    for (const row of result) {
        const sum = Number(row._sum.amount) || 0;
        if (row.type === 'credit') credits = sum;
        if (row.type === 'debit') debits = sum;
    }

    const account = await prisma.account.findUnique({
        where: { id: accountId },
        select: { openingBalance: true },
    });

    return Number(account.openingBalance) + credits - debits;
};

/**
 * Helper: Attach computed balance to an account object
 */
const withBalance = async (account) => {
    const balance = await computeBalance(account.id);
    return { ...account, currentBalance: balance };
};

/**
 * @desc    Get all active accounts (not soft-deleted) for the current user
 * @route   GET /api/v1/accounts
 */
export const getAllAccounts = asyncHandler(async (req, res) => {
    const accounts = await prisma.account.findMany({
        where: {
            userId: req.user.id,
            deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
    });

    // Attach computed balance to each account
    const accountsWithBalance = await Promise.all(accounts.map(withBalance));

    return sendSuccess(res, STATUS_CODES.OK, accountsWithBalance, STATUS_MESSAGES.SUCCESS.FETCHED);
});

/**
 * @desc    Get a single account by ID
 * @route   GET /api/v1/accounts/:id
 */
export const getAccountById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const account = await prisma.account.findUnique({
        where: { id, userId: req.user.id },
    });

    if (!account || account.deletedAt !== null) {
        return sendError(res, STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.ERROR.NOT_FOUND);
    }

    const accountWithBalance = await withBalance(account);
    return sendSuccess(res, STATUS_CODES.OK, accountWithBalance, STATUS_MESSAGES.SUCCESS.FETCHED);
});

/**
 * @desc    Create a new account
 * @route   POST /api/v1/accounts
 */
export const createAccount = asyncHandler(async (req, res) => {
    const data = req.validatedBody;

    const account = await prisma.account.create({
        data: {
            ...data,
            userId: req.user.id,
        },
    });

    const accountWithBalance = await withBalance(account);
    return sendSuccess(res, STATUS_CODES.CREATED, accountWithBalance, STATUS_MESSAGES.SUCCESS.CREATED);
});

/**
 * @desc    Update an existing account
 * @route   PUT /api/v1/accounts/:id
 */
export const updateAccount = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.validatedBody;

    // Check existence, ownership, and soft-delete status
    const existing = await prisma.account.findUnique({ where: { id, userId: req.user.id } });

    if (!existing || existing.deletedAt !== null) {
        return sendError(res, STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.ERROR.NOT_FOUND);
    }

    const account = await prisma.account.update({
        where: { id },
        data,
    });

    const accountWithBalance = await withBalance(account);
    return sendSuccess(res, STATUS_CODES.OK, accountWithBalance, STATUS_MESSAGES.SUCCESS.UPDATED);
});

/**
 * @desc    Soft-delete an account (set deletedAt timestamp)
 * @route   DELETE /api/v1/accounts/:id
 */
export const deleteAccount = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existing = await prisma.account.findUnique({ where: { id, userId: req.user.id } });

    if (!existing || existing.deletedAt !== null) {
        return sendError(res, STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.ERROR.NOT_FOUND);
    }

    // Check if account has linked transactions
    const txnCount = await prisma.transaction.count({ where: { accountId: id } });
    if (txnCount > 0) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            'Cannot delete account with linked transactions. Reassign or delete them first.'
        );
    }

    // Soft-delete: set deletedAt timestamp
    await prisma.account.update({
        where: { id },
        data: { deletedAt: new Date() },
    });

    return sendSuccess(res, STATUS_CODES.OK, null, STATUS_MESSAGES.SUCCESS.DELETED);
});
