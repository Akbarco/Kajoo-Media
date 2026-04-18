import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').max(200, 'Judul maksimal 200 karakter'),
  content: z.string().min(10, 'Konten minimal 10 karakter'),
  categoryId: z.string().uuid('Category ID tidak valid'),
  excerpt: z.string().max(300, 'Excerpt maksimal 300 karakter').optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  isFeatured: z.boolean().optional(),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const updateArticleSchema = createArticleSchema.partial();

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
