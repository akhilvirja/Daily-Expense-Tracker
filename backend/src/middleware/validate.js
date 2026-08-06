import { STATUS_CODES } from '../constants/statusCodes.js';
import { STATUS_MESSAGES } from '../constants/statusMessages.js';

/**
 * Creates a validation middleware using a Zod schema.
 * Validates the request body against the provided schema.
 * If validation fails, returns a 400 Bad Request with detailed field errors.
 * If validation passes, attaches the validated (and coerced) data to `req.validatedBody`.
 *
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            }));
            console.error('Validation failed for body:', req.body);
            console.error('Validation errors:', errors);
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: STATUS_MESSAGES.ERROR.VALIDATION_ERROR,
                errors,
            });
        }

        // Attach validated data (with coerced types) to the request
        req.validatedBody = result.data;
        next();
    };
};

/**
 * Creates a validation middleware for query parameters.
 * Validates req.query against the provided Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validateQuery = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: STATUS_MESSAGES.ERROR.VALIDATION_ERROR,
                errors: result.error.issues.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            });
        }

        req.validatedQuery = result.data;
        next();
    };
};
