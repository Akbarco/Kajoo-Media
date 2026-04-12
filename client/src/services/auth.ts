import api from '@/lib/api';
import type { User, LoginInput, UpdateProfileInput, ApiResponse } from '@/lib/types';

export const authService = {
  login: async (data: LoginInput): Promise<User> => {
    const res = await api.post<ApiResponse<User>>('/auth/login', data);
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },

  updateProfile: async (data: UpdateProfileInput): Promise<User> => {
    const res = await api.put<ApiResponse<User>>('/auth/profile', data);
    return res.data.data;
  },
};
