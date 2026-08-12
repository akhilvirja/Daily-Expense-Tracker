import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';
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
        return sendError(res, STATUS_CODES.UNAUTHORIZED, 'Invalid email or password');
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

/**
 * @desc    Update current user profile
 * @route   PUT /api/v1/auth/me
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const { fullName } = req.body;
    
    // req.user is set by authMiddleware
    const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { fullName },
    });

    return sendSuccess(res, STATUS_CODES.OK, {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
    }, STATUS_MESSAGES.SUCCESS.UPDATED);
});

/**
 * @desc    Update current user password
 * @route   PUT /api/v1/auth/me/password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    // Find user to get current password hash
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
    });

    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
        return sendError(res, STATUS_CODES.UNAUTHORIZED, 'Invalid current password', [{ field: 'currentPassword', message: 'Current password is incorrect' }]);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    await prisma.user.update({
        where: { id: req.user.id },
        data: { passwordHash: newPasswordHash },
    });

    return sendSuccess(res, STATUS_CODES.OK, null, 'Password updated successfully');
});

/**
 * @desc    Forgot Password
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return sendError(res, STATUS_CODES.NOT_FOUND, 'This email is not registered');
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to DB
    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetPasswordToken: resetToken,
            resetPasswordExpires,
        }
    });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    // Log for local development
    console.log(`\n\n---------------------------------`);
    console.log(`PASSWORD RESET URL:`);
    console.log(`${resetUrl}`);
    console.log(`---------------------------------\n\n`);

    // Send email
    const message = `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Please go to this link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
    `;

    try {
        await sendEmail({
            to: user.email,
            subject: 'Ledgerly Password Reset',
            html: message,
        });

        return sendSuccess(res, STATUS_CODES.OK, null, 'Please check your email for the password reset link');
    } catch (error) {
        console.error('Email could not be sent', error);
        
        // Clear reset token if email fails
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: null,
                resetPasswordExpires: null,
            }
        });

        return sendError(res, STATUS_CODES.SERVER_ERROR, 'Email could not be sent');
    }
});

/**
 * @desc    Reset Password
 * @route   POST /api/v1/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await prisma.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: {
                gt: new Date(),
            },
        },
    });

    if (!user) {
        return sendError(res, STATUS_CODES.BAD_REQUEST, 'Invalid or expired password reset token');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Update password and clear token
    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        },
    });

    return sendSuccess(res, STATUS_CODES.OK, null, 'Password reset successful');
});
