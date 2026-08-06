import { STATUS_CODES } from '../constants/statusCodes.js';
import { STATUS_MESSAGES } from '../constants/statusMessages.js';

/**
 * Global Error Handler Middleware
 * Catches all unhandled errors and sends a standardized error response.
 * Must be registered AFTER all routes in Express.
 *
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
    // Log the full error in development for debugging
    if (process.env.NODE_ENV === 'development') {
        console.error('🔴 Error:', err);
    }

    // Prisma known request error (e.g., unique constraint violation)
    if (err.code === 'P2002') {
        return res.status(STATUS_CODES.CONFLICT).json({
            success: false,
            message: STATUS_MESSAGES.ERROR.CONFLICT,
            errors: `Unique constraint failed on: ${err.meta?.target?.join(', ')}`,
        });
    }

    // Prisma record not found
    if (err.code === 'P2025') {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: STATUS_MESSAGES.ERROR.NOT_FOUND,
        });
    }

    // Zod validation error
    if (err.name === 'ZodError') {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: STATUS_MESSAGES.ERROR.VALIDATION_ERROR,
            errors: err.issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }

    // Default to 500 Internal Server Error
    const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = err.message || STATUS_MESSAGES.ERROR.SERVER_ERROR;

    return res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
