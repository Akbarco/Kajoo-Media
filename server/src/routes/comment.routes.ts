import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';

const router = Router();

// Public routes for comments
router.get('/:articleId', commentController.getComments);
router.post('/:articleId', commentController.addComment);

// Admin routes (should ideally have auth middleware)
router.get('/', commentController.getAllComments);
router.delete('/:id', commentController.deleteComment);

export default router;
