import { Request, Response, NextFunction } from 'express';
import * as articleService from '../services/article.service';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await articleService.getArticles({
      category: req.query.category as string | undefined,
      search: req.query.search as string | undefined,
      status: req.query.status as any,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      sort: req.query.sort as string | undefined,
    });

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await articleService.getArticleBySlug(req.params.slug as string);
    res.json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
}

export async function getFeatured(_req: Request, res: Response, next: NextFunction) {
  try {
    const articles = await articleService.getFeaturedArticles();
    res.json({ success: true, data: articles });
  } catch (error) {
    next(error);
  }
}

export async function getRelated(req: Request, res: Response, next: NextFunction) {
  try {
    const articles = await articleService.getRelatedArticles(req.params.id as string, req.params.categoryId as string);
    res.json({ success: true, data: articles });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await articleService.createArticle(req.body, req.user!.id);
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await articleService.updateArticle(req.params.id as string, req.body);
    res.json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await articleService.deleteArticle(req.params.id as string);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function stats(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await articleService.getArticleStats();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function recordView(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await articleService.incrementView(req.params.slug as string);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function like(req: Request, res: Response, next: NextFunction) {
  try {
    const delta = req.body.delta === -1 ? -1 : 1;
    const result = await articleService.toggleLike(req.params.slug as string, delta as 1 | -1);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
