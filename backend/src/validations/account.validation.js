import { z } from 'zod';

/**
 * Valid account types
 */
const ACCOUNT_TYPES = ['bank', 'cash', 'wallet'];

/**
 * Zod schema for creating a new account.
 * Validates and coerces input data.
 */
export const createAccountSchema = z.object({
    name: z
        .string({ required_error: 'Account name is required' })
        .trim()
        .min(2, 'Account name must be at least 2 characters')
        .max(100, 'Account name must not exceed 100 characters'),

    type: z
        .enum(ACCOUNT_TYPES, {
            errorMap: () => ({ message: `Account type must be one of: ${ACCOUNT_TYPES.join(', ')}` }),
        })
        .default('bank'),

    bankName: z
        .string()
        .trim()
        .max(50, 'Bank name must not exceed 50 characters')
        .optional()
        .nullable(),

    holderName: z
        .string()
        .trim()
        .max(100, 'Holder name must not exceed 100 characters')
        .optional()
        .nullable(),

    initialBalance: z
        .number({ invalid_type_error: 'Initial balance must be a number' })
        .finite('Initial balance must be a finite number')
        .default(0),

    description: z
        .string()
        .trim()
        .max(500, 'Description must not exceed 500 characters')
        .optional()
        .nullable(),
});

/**
 * Zod schema for updating an account.
 * All fields are optional (partial update support).
 */
export const updateAccountSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Account name must be at least 2 characters')
        .max(100, 'Account name must not exceed 100 characters')
        .optional(),

    type: z
        .enum(ACCOUNT_TYPES, {
            errorMap: () => ({ message: `Account type must be one of: ${ACCOUNT_TYPES.join(', ')}` }),
        })
        .optional(),

    bankName: z
        .string()
        .trim()
        .max(50, 'Bank name must not exceed 50 characters')
        .optional()
        .nullable(),

    holderName: z
        .string()
        .trim()
        .max(100, 'Holder name must not exceed 100 characters')
        .optional()
        .nullable(),

    initialBalance: z
        .number({ invalid_type_error: 'Initial balance must be a number' })
        .finite('Initial balance must be a finite number')
        .optional(),

    description: z
        .string()
        .trim()
        .max(500, 'Description must not exceed 500 characters')
        .optional()
        .nullable(),
});
