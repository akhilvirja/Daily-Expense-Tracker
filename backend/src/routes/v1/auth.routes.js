import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../../controllers/authController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { registerSchema, loginSchema } from '../../validations/auth.validation.js';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

// Private routes
router.get('/me', authenticate, getMe);

export default router;
