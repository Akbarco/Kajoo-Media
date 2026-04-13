import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';

const router = Router();

// Route for summarizing article
// POST /api/v1/ai/summarize/:id
router.post('/summarize/:id', aiController.summarizeArticle);

export default router;
