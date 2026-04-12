import { Router } from 'express';
import * as articleController from '../controllers/article.controller';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createArticleSchema, updateArticleSchema } from '../schemas/article.schema';

const router = Router();

// Public routes
router.get('/', articleController.list);
router.get('/featured', articleController.getFeatured);
router.get('/stats', authMiddleware, articleController.stats);
router.get('/:slug', articleController.getBySlug);
router.get('/:id/related/:categoryId', articleController.getRelated);
router.post('/:slug/view', articleController.recordView);
router.post('/:slug/like', articleController.like);

// Protected routes
router.post('/', authMiddleware, validate(createArticleSchema), articleController.create);
router.put('/:id', authMiddleware, validate(updateArticleSchema), articleController.update);
router.delete('/:id', authMiddleware, articleController.remove);

export default router;
