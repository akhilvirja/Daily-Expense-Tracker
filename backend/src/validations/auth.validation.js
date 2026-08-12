import { z } from 'zod';

export const registerSchema = z.object({
    fullName: z
        .string({ required_error: 'Full name is required' })
        .trim()
        .min(2, 'Full name must be at least 2 characters')
        .max(150, 'Full name must not exceed 150 characters'),
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Invalid email format')
        .max(255, 'Email must not exceed 255 characters'),
    password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must not exceed 100 characters'),
});

export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Invalid email format'),
    password: z
        .string({ required_error: 'Password is required' }),
});

export const updateProfileSchema = z.object({
    fullName: z
        .string({ required_error: 'Full name is required' })
        .trim()
        .min(2, 'Full name must be at least 2 characters')
        .max(150, 'Full name must not exceed 150 characters'),
});

export const updatePasswordSchema = z.object({
    currentPassword: z
        .string({ required_error: 'Current password is required' }),
    newPassword: z
        .string({ required_error: 'New password is required' })
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must not exceed 100 characters'),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Invalid email format'),
});

export const resetPasswordSchema = z.object({
    password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must not exceed 100 characters'),
});
