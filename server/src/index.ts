import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';

import authRoutes from './routes/auth.routes';
import articleRoutes from './routes/article.routes';
import categoryRoutes from './routes/category.routes';
import commentRoutes from './routes/comment.routes';
import uploadRoutes from './routes/upload.routes';
import aiRoutes from './routes/ai.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 4000;

// ── Security Middleware ──
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Terlalu banyak percobaan. Coba lagi dalam 1 menit.' } },
});

// ── Body Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Logging ──
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Static Files (uploads) ──
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── API Routes ──
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/ai', aiRoutes);

// ── Health Check ──
app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// ── Error Handler ──
app.use(errorHandler);

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`🚀 Media Kajoo API running at http://localhost:${PORT}`);
  console.log(`📚 API Base: http://localhost:${PORT}/api/v1`);
});

export default app;
