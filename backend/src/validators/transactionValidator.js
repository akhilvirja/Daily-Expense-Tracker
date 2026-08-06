import { z } from 'zod';

const TxnTypeEnum = z.enum(['credit', 'debit']);

export const createTransactionSchema = z.object({
  accountId: z.string().uuid('Invalid account ID'),
  categoryId: z.string().uuid('Invalid category ID'),
  type: TxnTypeEnum,
  amount: z.number().positive('Amount must be greater than 0'),
  description: z.string().trim().max(500, 'Description is too long').optional().nullable(),
  occurredOn: z.string().datetime({ message: 'Invalid date format (must be ISO 8601)' }),
});

export const updateTransactionSchema = z.object({
  accountId: z.string().uuid('Invalid account ID').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  type: TxnTypeEnum.optional(),
  amount: z.number().positive('Amount must be greater than 0').optional(),
  description: z.string().trim().max(500, 'Description is too long').optional().nullable(),
  occurredOn: z.string().datetime({ message: 'Invalid date format (must be ISO 8601)' }).optional(),
});

export const transferTransactionSchema = z.object({
  fromAccountId: z.string().uuid('Invalid source account ID'),
  toAccountId: z.string().uuid('Invalid destination account ID'),
  amount: z.number().positive('Amount must be greater than 0'),
  description: z.string().trim().max(500, 'Description is too long').optional().nullable(),
  occurredOn: z.string().datetime({ message: 'Invalid date format (must be ISO 8601)' }),
}).refine(data => data.fromAccountId !== data.toAccountId, {
  message: "Source and destination accounts must be different",
  path: ["toAccountId"],
});
