import { Router } from 'express';
import { registerUser, loginUser, getMe, updateProfile, updatePassword } from '../../controllers/authController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { registerSchema, loginSchema, updateProfileSchema, updatePasswordSchema } from '../../validations/auth.validation.js';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

// Private routes
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, validate(updateProfileSchema), updateProfile);
router.put('/me/password', authenticate, validate(updatePasswordSchema), updatePassword);

export default router;
