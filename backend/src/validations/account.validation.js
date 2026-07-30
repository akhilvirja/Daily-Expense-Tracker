import { z } from 'zod';

/**
 * Valid account kinds — must match the Prisma AccountKind enum
 */
const ACCOUNT_KINDS = ['bank', 'cash'];

/**
 * Zod schema for creating a new account.
 * Fields: name, kind, openingBalance
 */
export const createAccountSchema = z.object({
    name: z
        .string({ required_error: 'Account name is required' })
        .trim()
        .min(2, 'Account name must be at least 2 characters')
        .max(100, 'Account name must not exceed 100 characters'),

    kind: z.enum(ACCOUNT_KINDS, {
        errorMap: () => ({ message: `Account kind must be one of: ${ACCOUNT_KINDS.join(', ')}` }),
    }),

    openingBalance: z
        .number({ invalid_type_error: 'Opening balance must be a number' })
        .finite('Opening balance must be a finite number')
        .default(0),

    isActive: z.boolean().optional(),
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

    kind: z
        .enum(ACCOUNT_KINDS, {
            errorMap: () => ({ message: `Account kind must be one of: ${ACCOUNT_KINDS.join(', ')}` }),
        })
        .optional(),

    openingBalance: z
        .number({ invalid_type_error: 'Opening balance must be a number' })
        .finite('Opening balance must be a finite number')
        .optional(),

    isActive: z.boolean().optional(),
});
