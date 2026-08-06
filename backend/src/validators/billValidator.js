import { z } from 'zod';

// Schema for generating a new bill
export const generateBillSchema = z.object({
  itemId: z.string().uuid('Invalid item ID'),
  periodStart: z.string().min(10, 'Invalid start date format'),
  periodEnd: z.string().min(10, 'Invalid end date format'),
});

// Schema for paying a bill
export const payBillSchema = z.object({
  accountId: z.string().uuid('Invalid account ID'),
  paidOn: z.string().min(10, 'Invalid paid date format'),
  remarks: z.string().trim().max(500, 'Remarks cannot exceed 500 characters').optional().nullable(),
});
