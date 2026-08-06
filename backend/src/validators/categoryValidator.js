import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
});
