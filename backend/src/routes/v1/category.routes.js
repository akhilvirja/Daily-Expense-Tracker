import express from 'express';
import {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from '../../controllers/categoryController.js';
import { authenticate as protect } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from '../../validators/categoryValidator.js';

const router = express.Router();

// All category routes require authentication
router.use(protect);

router
  .route('/')
  .get(getCategories)
  .post(validate(createCategorySchema), createCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(validate(updateCategorySchema), updateCategory)
  .patch(validate(updateCategorySchema), updateCategory)
  .delete(deleteCategory);

export default router;
