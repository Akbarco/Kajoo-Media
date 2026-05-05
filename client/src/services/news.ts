import api from '@/lib/api';

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsApiResponse {
  success: boolean;
  data: {
    articles: NewsArticle[];
    totalResults: number;
    page: number;
    pageSize: number;
  };
}

interface GetNewsParams {
  page?: number;
  pageSize?: number;
  category?: string;
}

export const newsService = {
  getTopHeadlines: async (params: GetNewsParams = {}): Promise<NewsApiResponse['data']> => {
    const res = await api.get<NewsApiResponse>('/news', { params });
    return res.data.data;
  },
};
