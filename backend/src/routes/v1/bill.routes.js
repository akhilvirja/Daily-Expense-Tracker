import express from 'express';
import { authenticate as protect } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { generateBillSchema, payBillSchema } from '../../validators/billValidator.js';
import { getBills, generateBill, payBill, undoPayment } from '../../controllers/billController.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getBills);

router
  .route('/generate')
  .post(validate(generateBillSchema), generateBill);

router
  .route('/:id/pay')
  .put(validate(payBillSchema), payBill);

router
  .route('/:id/undo')
  .put(undoPayment);

export default router;
