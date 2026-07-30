import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendSuccess, sendError } from '../utils/response.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { STATUS_MESSAGES } from '../constants/statusMessages.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/db.js';

/**
 * Generate JWT Token
 * @param {string} id User ID
 * @returns {string} JWT Token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return sendError(res, STATUS_CODES.CONFLICT, STATUS_MESSAGES.ERROR.CONFLICT, [{ field: 'email', message: 'User already exists' }]);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            passwordHash,
        },
    });

    if (user) {
        return sendSuccess(res, STATUS_CODES.CREATED, {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            token: generateToken(user.id),
        }, STATUS_MESSAGES.SUCCESS.CREATED);
    } else {
        return sendError(res, STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.ERROR.BAD_REQUEST, [{ field: 'auth', message: 'Invalid user data' }]);
    }
});

/**
 * @desc    Authenticate a user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        // Exclude password from the user object in the response (if sending full object)
        return sendSuccess(res, STATUS_CODES.OK, {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            token: generateToken(user.id),
        }, STATUS_MESSAGES.SUCCESS.LOGGED_IN);
    } else {
        return sendError(res, STATUS_CODES.UNAUTHORIZED, STATUS_MESSAGES.ERROR.UNAUTHORIZED, [{ field: 'auth', message: 'Invalid email or password' }]);
    }
});

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
    // req.user is set by authMiddleware
    return sendSuccess(res, STATUS_CODES.OK, {
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
    }, STATUS_MESSAGES.SUCCESS.FETCHED);
});
