import { useQuery } from '@tanstack/react-query';
import { articleService } from '@/services/articles';
import { useState, useEffect } from 'react';

export function useSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const searchResults = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () =>
      articleService.getArticles({
        search: debouncedQuery,
        status: 'PUBLISHED',
        limit: 20,
      }),
    enabled: debouncedQuery.length >= 2,
  });

  return {
    query,
    setQuery,
    debouncedQuery,
    ...searchResults,
  };
}
