import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleService } from '@/services/articles';
import type { CreateArticleInput, UpdateArticleInput } from '@/lib/types';

interface UseArticlesParams {
  category?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
  enabled?: boolean;
}

export function useArticles(params: UseArticlesParams = {}) {
  const { enabled = true, ...queryParams } = params;
  return useQuery({
    queryKey: ['articles', queryParams],
    queryFn: () => articleService.getArticles(queryParams),
    enabled,
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => articleService.getArticleBySlug(slug),
    enabled: !!slug,
  });
}

export function useFeaturedArticles() {
  return useQuery({
    queryKey: ['articles', 'featured'],
    queryFn: () => articleService.getFeaturedArticles(),
  });
}

export function useRelatedArticles(articleId: string, categoryId: string) {
  return useQuery({
    queryKey: ['articles', 'related', articleId],
    queryFn: () => articleService.getRelatedArticles(articleId, categoryId),
    enabled: !!articleId && !!categoryId,
  });
}

export function useArticleStats() {
  return useQuery({
    queryKey: ['articles', 'stats'],
    queryFn: () => articleService.getStats(),
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateArticleInput) => articleService.createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleInput }) =>
      articleService.updateArticle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articleService.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}
