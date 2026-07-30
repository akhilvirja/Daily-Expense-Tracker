import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { STATUS_MESSAGES } from '../constants/statusMessages.js';
import prisma from '../config/db.js';

/**
 * Middleware to verify JWT token and attach user to req.user
 */
export const authenticate = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from db
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });

            if (!user) {
                return sendError(res, STATUS_CODES.UNAUTHORIZED, STATUS_MESSAGES.ERROR.UNAUTHORIZED, [{ field: 'auth', message: 'User not found' }]);
            }

            // Optional: check if user is active
            if (user.isActive === false) {
                return sendError(res, STATUS_CODES.FORBIDDEN, STATUS_MESSAGES.ERROR.FORBIDDEN, [{ field: 'auth', message: 'User account is deactivated' }]);
            }

            // Attach user to request object
            req.user = user;
            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error);
            return sendError(res, STATUS_CODES.UNAUTHORIZED, STATUS_MESSAGES.ERROR.UNAUTHORIZED, [{ field: 'auth', message: 'Not authorized, token failed' }]);
        }
    }

    if (!token) {
        return sendError(res, STATUS_CODES.UNAUTHORIZED, STATUS_MESSAGES.ERROR.UNAUTHORIZED, [{ field: 'auth', message: 'Not authorized, no token' }]);
    }
};
