import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createComment(data: { articleId: string; name: string; content: string }) {
  return prisma.comment.create({
    data: {
      articleId: data.articleId,
      name: data.name,
      content: data.content,
    },
  });
}

export async function getCommentsByArticleId(articleId: string) {
  return prisma.comment .findMany({
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllComments() {
  return prisma.comment.findMany({
    include: {
      article: {
        select: { title: true, slug: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteComment(id: string) {
  return prisma.comment.delete({
    where: { id },
  });
}
