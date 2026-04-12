import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/comment.service';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

export async function addComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { articleId } = req.params as { articleId: string };
    const { name, content } = req.body;

    if (!name || !content) {
      throw new AppError(400, 'BAD_REQUEST', 'Nama dan isi komentar wajib diisi.');
    }

    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) {
      throw new AppError(404, 'NOT_FOUND', 'Artikel tidak ditemukan.');
    }

    const comment = await commentService.createComment({ articleId, name, content });

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
}

export async function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const { articleId } = req.params as { articleId: string };
    const comments = await commentService.getCommentsByArticleId(articleId);

    res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllComments(req: Request, res: Response, next: NextFunction) {
  try {
    const comments = await commentService.getAllComments();
    res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    await commentService.deleteComment(id);
    res.json({
      success: true,
      message: 'Komentar berhasil dihapus.',
    });
  } catch (error) {
    next(error);
  }
}
