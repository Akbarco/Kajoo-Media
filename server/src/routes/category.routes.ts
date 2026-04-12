import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

const router = Router();

// Public routes
router.get('/', categoryController.list);
router.get('/:slug', categoryController.getBySlug);

// Protected routes
router.post('/', authMiddleware, validate(createCategorySchema), categoryController.create);
router.put('/:id', authMiddleware, validate(updateCategorySchema), categoryController.update);
router.delete('/:id', authMiddleware, categoryController.remove);

export default router;
