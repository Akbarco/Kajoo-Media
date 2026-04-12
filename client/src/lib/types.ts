// ── Types for Media Kajoo ──

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  description: string | null;
  createdAt?: string;
  _count?: {
    articles: number;
  };
}

export type ArticleStatus = 'DRAFT' | 'PUBLISHED';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnail: string | null;
  status: ArticleStatus;
  isFeatured: boolean;
  views: number;
  likes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: Pick<User, 'id' | 'name'>;
  categoryId: string;
  category: Pick<Category, 'id' | 'name' | 'slug' | 'color'>;
  navigation?: {
    prev: { slug: string; title: string } | null;
    next: { slug: string; title: string } | null;
  };
  _count?: {
    comments: number;
  };
}

export interface Comment {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  articleId: string;
}

export interface ArticleStats {
  total: number;
  published: number;
  draft: number;
  thisMonth: number;
  totalViews: number;
  totalLikes: number;
  recentComments?: Comment[];
}

// ── API Response Types ──

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

// ── Input Types ──

export interface CreateArticleInput {
  title: string;
  content: string;
  categoryId: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  status?: ArticleStatus;
  isFeatured?: boolean;
}

export type UpdateArticleInput = Partial<CreateArticleInput>;

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  color?: string | null;
  description?: string | null;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}
