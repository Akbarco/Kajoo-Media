import api from '@/lib/api';
import type {
  Article,
  ArticleStats,
  CreateArticleInput,
  UpdateArticleInput,
  ApiResponse,
  PaginatedResponse,
} from '@/lib/types';

interface GetArticlesParams {
  category?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const articleService = {
  getArticles: async (params: GetArticlesParams = {}): Promise<PaginatedResponse<Article>> => {
    const res = await api.get<PaginatedResponse<Article>>('/articles', { params });
    return res.data;
  },

  getArticleBySlug: async (slug: string): Promise<Article> => {
    const res = await api.get<ApiResponse<Article>>(`/articles/${slug}`);
    return res.data.data;
  },

  getFeaturedArticles: async (): Promise<Article[]> => {
    const res = await api.get<ApiResponse<Article[]>>('/articles/featured');
    return res.data.data;
  },

  getRelatedArticles: async (articleId: string, categoryId: string): Promise<Article[]> => {
    const res = await api.get<ApiResponse<Article[]>>(`/articles/${articleId}/related/${categoryId}`);
    return res.data.data;
  },

  getStats: async (): Promise<ArticleStats> => {
    const res = await api.get<ApiResponse<ArticleStats>>('/articles/stats');
    return res.data.data;
  },

  createArticle: async (data: CreateArticleInput): Promise<Article> => {
    const res = await api.post<ApiResponse<Article>>('/articles', data);
    return res.data.data;
  },

  updateArticle: async (id: string, data: UpdateArticleInput): Promise<Article> => {
    const res = await api.put<ApiResponse<Article>>(`/articles/${id}`, data);
    return res.data.data;
  },

  deleteArticle: async (id: string): Promise<void> => {
    await api.delete(`/articles/${id}`);
  },

  recordView: async (slug: string): Promise<{ views: number }> => {
    const res = await api.post<ApiResponse<{ views: number }>>(`/articles/${slug}/view`);
    return res.data.data;
  },

  toggleLike: async (slug: string, delta: 1 | -1): Promise<{ likes: number }> => {
    const res = await api.post<ApiResponse<{ likes: number }>>(`/articles/${slug}/like`, { delta });
    return res.data.data;
  },
};
