import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { createAccountSchema, updateAccountSchema } from '../../validations/account.validation.js';
import {
    getAllAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
} from '../../controllers/accountController.js';

const router = Router();

/**
 * Account Routes — /api/v1/accounts
 *
 * GET    /              → List all active accounts
 * GET    /:id           → Get single account
 * POST   /              → Create new account
 * PUT    /:id           → Update account
 * DELETE /:id           → Soft-delete account
 */

import { authenticate } from '../../middleware/authMiddleware.js';

// Apply authentication to all account routes
router.use(authenticate);

router.get('/', getAllAccounts);
router.get('/:id', getAccountById);
router.post('/', validate(createAccountSchema), createAccount);
router.put('/:id', validate(updateAccountSchema), updateAccount);
router.delete('/:id', deleteAccount);

export default router;
