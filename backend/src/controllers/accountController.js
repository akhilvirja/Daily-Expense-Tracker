import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { STATUS_MESSAGES } from '../constants/statusMessages.js';

/**
 * @desc    Get all active accounts with current balances
 * @route   GET /api/v1/accounts
 * @access  Public
 */
export const getAllAccounts = asyncHandler(async (req, res) => {
    const accounts = await prisma.account.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, STATUS_CODES.OK, accounts, STATUS_MESSAGES.SUCCESS.FETCHED);
});

/**
 * @desc    Get a single account by ID
 * @route   GET /api/v1/accounts/:id
 * @access  Public
 */
export const getAccountById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const account = await prisma.account.findUnique({
        where: { id },
    });

    if (!account || !account.isActive) {
        return sendError(res, STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.ERROR.NOT_FOUND);
    }

    return sendSuccess(res, STATUS_CODES.OK, account, STATUS_MESSAGES.SUCCESS.FETCHED);
});

/**
 * @desc    Create a new account
 * @route   POST /api/v1/accounts
 * @access  Public
 */
export const createAccount = asyncHandler(async (req, res) => {
    const data = req.validatedBody;

    // Set currentBalance equal to initialBalance on creation
    const account = await prisma.account.create({
        data: {
            ...data,
            currentBalance: data.initialBalance || 0,
        },
    });

    return sendSuccess(res, STATUS_CODES.CREATED, account, STATUS_MESSAGES.SUCCESS.CREATED);
});

/**
 * @desc    Update an existing account
 * @route   PUT /api/v1/accounts/:id
 * @access  Public
 */
export const updateAccount = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.validatedBody;

    // Check if account exists
    const existingAccount = await prisma.account.findUnique({
        where: { id },
    });

    if (!existingAccount || !existingAccount.isActive) {
        return sendError(res, STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.ERROR.NOT_FOUND);
    }

    // If initialBalance is being updated, recalculate currentBalance
    const updateData = { ...data };
    if (data.initialBalance !== undefined && data.initialBalance !== existingAccount.initialBalance) {
        const balanceDifference = data.initialBalance - existingAccount.initialBalance;
        updateData.currentBalance = existingAccount.currentBalance + balanceDifference;
    }

    const account = await prisma.account.update({
        where: { id },
        data: updateData,
    });

    return sendSuccess(res, STATUS_CODES.OK, account, STATUS_MESSAGES.SUCCESS.UPDATED);
});

/**
 * @desc    Soft-delete an account (set isActive to false)
 * @route   DELETE /api/v1/accounts/:id
 * @access  Public
 */
export const deleteAccount = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if account exists
    const existingAccount = await prisma.account.findUnique({
        where: { id },
    });

    if (!existingAccount || !existingAccount.isActive) {
        return sendError(res, STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.ERROR.NOT_FOUND);
    }

    // Check if account has non-zero balance
    if (existingAccount.currentBalance !== 0) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            'Cannot delete account with non-zero balance. Please transfer or withdraw all funds first.'
        );
    }

    // Soft-delete: set isActive to false
    await prisma.account.update({
        where: { id },
        data: { isActive: false },
    });

    return sendSuccess(res, STATUS_CODES.OK, null, STATUS_MESSAGES.SUCCESS.DELETED);
});
