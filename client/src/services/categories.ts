import api from '@/lib/api';
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  ApiResponse,
} from '@/lib/types';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get<ApiResponse<Category[]>>('/categories');
    return res.data.data;
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const res = await api.get<ApiResponse<Category>>(`/categories/${slug}`);
    return res.data.data;
  },

  createCategory: async (data: CreateCategoryInput): Promise<Category> => {
    const res = await api.post<ApiResponse<Category>>('/categories', data);
    return res.data.data;
  },

  updateCategory: async (id: string, data: UpdateCategoryInput): Promise<Category> => {
    const res = await api.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return res.data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
