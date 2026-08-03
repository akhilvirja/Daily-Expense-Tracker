import { STATUS_CODES } from '../constants/statusCodes.js';
import { STATUS_MESSAGES } from '../constants/statusMessages.js';

/**
 * Send a standardized success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {any} data - Data to send in the response
 * @param {string} message - Success message
 */
export const sendSuccess = (res, statusCode = STATUS_CODES.OK, data = null, message = STATUS_MESSAGES.SUCCESS.PROCESSED) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Send a standardized paginated success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {Array} items - List of items for current page
 * @param {Object} pagination - Pagination metadata
 * @param {string} message - Success message
 */
export const sendPaginatedSuccess = (
    res,
    statusCode = STATUS_CODES.OK,
    items = [],
    pagination = {},
    message = STATUS_MESSAGES.SUCCESS.PROCESSED
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data: items,
        pagination: {
            page: pagination.page || 1,
            limit: pagination.limit || 10,
            total: pagination.total || 0,
            totalPages: pagination.totalPages || 1,
            hasPrevPage: Boolean(pagination.hasPrevPage),
            hasNextPage: Boolean(pagination.hasNextPage),
        }
    });
};

/**
 * Send a standardized error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {string} message - Error message
 * @param {any} errors - Detailed error information (optional)
 */
export const sendError = (res, statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message = STATUS_MESSAGES.ERROR.SERVER_ERROR, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};
