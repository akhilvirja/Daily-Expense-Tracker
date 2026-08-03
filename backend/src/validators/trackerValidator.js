import { z } from 'zod';

// Schema for creating/updating a TrackerItem
export const trackerItemSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(150, 'Name must not exceed 150 characters'),
  unit: z.string().trim().min(1, 'Unit is required').max(30, 'Unit must not exceed 30 characters'),
  price: z.number().positive('Price must be greater than 0'),
});

// Schema for upserting a TrackerLog
export const trackerLogSchema = z.object({
  itemId: z.string().uuid('Invalid item ID'),
  logDate: z.string().min(10, 'Invalid date format'),
  quantity: z.number().nonnegative('Quantity must be 0 or greater'),
  amount: z.number().nonnegative('Amount must be 0 or greater'),
  note: z.string().trim().max(500, 'Note is too long').optional().nullable(),
});
