import { ArticleStatus, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { generateSlug, sanitizeHtml } from '../lib/utils';
import { CreateArticleInput, UpdateArticleInput } from '../schemas/article.schema';

interface GetArticlesParams {
  category?: string;
  search?: string;
  status?: ArticleStatus;
  page?: number;
  limit?: number;
  sort?: string;
}

export async function getArticles(params: GetArticlesParams) {
  const { category, search, status, page = 1, limit = 12, sort = 'newest' } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.ArticleWhereInput = {};

  // By default, public queries only show PUBLISHED
  if (status) {
    where.status = status;
  }

  if (category) {
    where.category = { slug: category };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ];
  }

  let orderBy: Prisma.ArticleOrderByWithRelationInput = {};
  switch (sort) {
    case 'oldest':
      orderBy = { publishedAt: 'asc' };
      break;
    case 'title':
      orderBy = { title: 'asc' };
      break;
    case 'popular':
      orderBy = { views: 'desc' };
      break;
    case 'most-liked':
      orderBy = { likes: 'desc' };
      break;
    default: // newest
      orderBy = { publishedAt: 'desc' };
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
        _count: { select: { comments: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return {
    data: articles,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getArticleBySlug(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true, color: true } },
    },
  });

  if (!article) {
    throw new AppError(404, 'NOT_FOUND', 'Artikel tidak ditemukan.');
  }

  // Fetch adjacent articles for navigation
  const [prev, next] = await Promise.all([
    prisma.article.findFirst({
      where: {
        publishedAt: { lt: article.publishedAt || article.createdAt },
        status: 'PUBLISHED',
      },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, title: true }
    }),
    prisma.article.findFirst({
      where: {
        publishedAt: { gt: article.publishedAt || article.createdAt },
        status: 'PUBLISHED',
      },
      orderBy: { publishedAt: 'asc' },
      select: { slug: true, title: true }
    }),
  ]);

  return {
    ...article,
    navigation: { prev, next }
  };
}

export async function getFeaturedArticles() {
  return prisma.article.findMany({
    where: {
      isFeatured: true,
      status: ArticleStatus.PUBLISHED,
    },
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true, color: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: 5,
  });
}

export async function getRelatedArticles(articleId: string, categoryId: string) {
  return prisma.article.findMany({
    where: {
      categoryId,
      status: ArticleStatus.PUBLISHED,
      id: { not: articleId },
    },
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true, color: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });
}

export async function createArticle(data: CreateArticleInput, authorId: string) {
  const slug = generateSlug(data.title);

  // Check for duplicate slug
  const existingSlug = await prisma.article.findUnique({ where: { slug } });
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

  const sanitizedContent = sanitizeHtml(data.content);

  return prisma.article.create({
    data: {
      title: data.title,
      slug: finalSlug,
      excerpt: data.excerpt || null,
      content: sanitizedContent,
      thumbnail: data.thumbnail || null,
      status: data.status || ArticleStatus.DRAFT,
      isFeatured: data.isFeatured || false,
      publishedAt: data.status === ArticleStatus.PUBLISHED ? new Date() : null,
      authorId,
      categoryId: data.categoryId,
    },
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true, color: true } },
    },
  });
}

export async function updateArticle(id: string, data: UpdateArticleInput) {
  const article = await prisma.article.findUnique({ where: { id } });

  if (!article) {
    throw new AppError(404, 'NOT_FOUND', 'Artikel tidak ditemukan.');
  }

  const updateData: any = { ...data };

  // Sanitize content if it's being updated
  if (data.content) {
    updateData.content = sanitizeHtml(data.content);
  }

  // Update slug if title changed
  if (data.title && data.title !== article.title) {
    const newSlug = generateSlug(data.title);
    const existingSlug = await prisma.article.findFirst({
      where: { slug: newSlug, id: { not: id } },
    });
    updateData.slug = existingSlug ? `${newSlug}-${Date.now()}` : newSlug;
  }

  // Set publishedAt when transitioning to PUBLISHED
  if (data.status === ArticleStatus.PUBLISHED && article.status === ArticleStatus.DRAFT) {
    updateData.publishedAt = new Date();
  }

  return prisma.article.update({
    where: { id },
    data: updateData,
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true, color: true } },
    },
  });
}

export async function deleteArticle(id: string) {
  const article = await prisma.article.findUnique({ where: { id } });

  if (!article) {
    throw new AppError(404, 'NOT_FOUND', 'Artikel tidak ditemukan.');
  }

  await prisma.article.delete({ where: { id } });
  return { message: 'Artikel berhasil dihapus.' };
}

export async function getArticleStats() {
  const [total, published, draft, thisMonth, aggregates, recentComments] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: ArticleStatus.PUBLISHED } }),
    prisma.article.count({ where: { status: ArticleStatus.DRAFT } }),
    prisma.article.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.article.aggregate({
      _sum: { views: true, likes: true },
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  return {
    total,
    published,
    draft,
    thisMonth,
    totalViews: aggregates._sum.views || 0,
    totalLikes: aggregates._sum.likes || 0,
    recentComments,
  };
}

export async function incrementView(slug: string) {
  return prisma.article.update({
    where: { slug },
    data: { views: { increment: 1 } },
    select: { views: true },
  });
}

export async function toggleLike(slug: string, delta: 1 | -1) {
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) {
    throw new AppError(404, 'NOT_FOUND', 'Artikel tidak ditemukan.');
  }

  const newLikes = Math.max(0, article.likes + delta);
  return prisma.article.update({
    where: { slug },
    data: { likes: newLikes },
    select: { likes: true },
  });
}
