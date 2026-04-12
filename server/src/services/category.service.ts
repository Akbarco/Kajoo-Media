import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { generateSlug } from '../lib/utils';
import { CreateCategoryInput, UpdateCategoryInput } from '../schemas/category.schema';

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: { select: { articles: true } },
    },
    orderBy: { name: 'asc' },
  });
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: { select: { articles: true } },
    },
  });

  if (!category) {
    throw new AppError(404, 'NOT_FOUND', 'Kategori tidak ditemukan.');
  }

  return category;
}

export async function createCategory(data: CreateCategoryInput) {
  const slug = data.slug || generateSlug(data.name);

  // Check for duplicate name
  const existingName = await prisma.category.findFirst({
    where: { name: { equals: data.name, mode: 'insensitive' } },
  });

  if (existingName) {
    throw new AppError(409, 'DUPLICATE', 'Kategori dengan nama tersebut sudah ada.');
  }

  return prisma.category.create({
    data: {
      name: data.name,
      slug,
      color: data.color || null,
      description: data.description || null,
    },
    include: {
      _count: { select: { articles: true } },
    },
  });
}

export async function updateCategory(id: string, data: UpdateCategoryInput) {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new AppError(404, 'NOT_FOUND', 'Kategori tidak ditemukan.');
  }

  // Check for duplicate name if name is being changed
  if (data.name && data.name !== category.name) {
    const existingName = await prisma.category.findFirst({
      where: {
        name: { equals: data.name, mode: 'insensitive' },
        id: { not: id },
      },
    });

    if (existingName) {
      throw new AppError(409, 'DUPLICATE', 'Kategori dengan nama tersebut sudah ada.');
    }
  }

  const updateData: any = { ...data };

  // Update slug if name changed and no custom slug provided
  if (data.name && data.name !== category.name && !data.slug) {
    updateData.slug = generateSlug(data.name);
  }

  return prisma.category.update({
    where: { id },
    data: updateData,
    include: {
      _count: { select: { articles: true } },
    },
  });
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { articles: true } } },
  });

  if (!category) {
    throw new AppError(404, 'NOT_FOUND', 'Kategori tidak ditemukan.');
  }

  if (category._count.articles > 0) {
    throw new AppError(400, 'HAS_ARTICLES', `Kategori "${category.name}" masih memiliki ${category._count.articles} artikel. Pindahkan atau hapus artikel terlebih dahulu.`);
  }

  await prisma.category.delete({ where: { id } });
  return { message: 'Kategori berhasil dihapus.' };
}
