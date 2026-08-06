import express from 'express';
import {
  getTransactions,
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  transferTransaction
} from '../../controllers/transactionController.js';
import { authenticate as protect } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { createTransactionSchema, updateTransactionSchema, transferTransactionSchema } from '../../validators/transactionValidator.js';

const router = express.Router();

// All transaction routes require authentication
router.use(protect);

router
  .route('/')
  .get(getTransactions)
  .post(validate(createTransactionSchema), createTransaction);

router.post('/transfer', validate(transferTransactionSchema), transferTransaction);

router
  .route('/:id')
  .get(getTransaction)
  .put(validate(updateTransactionSchema), updateTransaction)
  .delete(deleteTransaction);

export default router;
