import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { AppError } from '../middlewares/errorHandler';

const NEWSAPI_BASE = 'https://newsapi.org/v2';

const VALID_CATEGORIES = ['general', 'technology', 'business', 'sports', 'science', 'health', 'entertainment'];

export async function getTopHeadlines(req: Request, res: Response, next: NextFunction) {
  try {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      throw new AppError(500, 'CONFIG_ERROR', 'NewsAPI key belum dikonfigurasi.');
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string) || 9));
    const category = VALID_CATEGORIES.includes(req.query.category as string)
      ? (req.query.category as string)
      : 'general';
    const country = (req.query.country as string) || 'us';

    const response = await axios.get(`${NEWSAPI_BASE}/top-headlines`, {
      params: {
        apiKey,
        country,
        category,
        page,
        pageSize,
      },
      timeout: 10000,
    });

    const { status, totalResults, articles } = response.data;

    if (status !== 'ok') {
      throw new AppError(502, 'NEWSAPI_ERROR', 'Gagal mengambil berita dari NewsAPI.');
    }

    // Filter out removed/invalid articles
    const filtered = (articles || []).filter(
      (article: any) =>
        article.title &&
        article.title !== '[Removed]' &&
        article.url
    );

    res.json({
      success: true,
      data: {
        articles: filtered,
        totalResults,
        page,
        pageSize,
      },
    });
  } catch (error: any) {
    // Handle axios errors from NewsAPI
    if (error.isAxiosError && error.response) {
      const { status, data } = error.response;
      const message = data?.message || 'Gagal mengambil berita internasional.';
      return next(new AppError(status >= 500 ? 502 : status, 'NEWSAPI_ERROR', message));
    }

    next(error);
  }
}
