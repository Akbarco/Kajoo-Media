import { useInfiniteQuery } from '@tanstack/react-query';
import { newsService } from '@/services/news';

const PAGE_SIZE = 9;

export function useInternationalNews(category: string = 'general') {
  return useInfiniteQuery({
    queryKey: ['international-news', category],
    queryFn: ({ pageParam }) =>
      newsService.getTopHeadlines({
        page: pageParam,
        pageSize: PAGE_SIZE,
        category,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalFetched = lastPage.page * lastPage.pageSize;
      if (totalFetched >= lastPage.totalResults) return undefined;
      return lastPage.page + 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes — preserve API quota
  });
}
