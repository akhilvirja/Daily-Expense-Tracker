import { Router } from 'express';
import { registerUser, loginUser, getMe, updateProfile, updatePassword, forgotPassword, resetPassword } from '../../controllers/authController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { registerSchema, loginSchema, updateProfileSchema, updatePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from '../../validations/auth.validation.js';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

// Private routes
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, validate(updateProfileSchema), updateProfile);
router.put('/me/password', authenticate, validate(updatePasswordSchema), updatePassword);

export default router;
