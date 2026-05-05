import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as newsController from '../controllers/news.controller';

const router = Router();

// Rate limit to preserve NewsAPI quota (free tier: 100 req/day)
const newsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Terlalu banyak permintaan berita. Coba lagi dalam 1 menit.',
    },
  },
});

router.get('/', newsLimiter, newsController.getTopHeadlines);

export default router;
