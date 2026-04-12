import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/hooks/useSearch';
import ArticleCard from '@/components/articles/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { query, setQuery, data, isLoading, debouncedQuery } = useSearch(initialQuery);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Search header */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h1 className="mb-6 text-center font-serif text-3xl">Cari Artikel</h1>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Ketik kata kunci untuk mencari artikel..."
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              className="h-12 rounded-full bg-background pl-12 pr-4 text-base shadow-sm"
              autoFocus
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {debouncedQuery.length < 2 ? (
          <div className="py-16 text-center">
            <SearchIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">Masukkan minimal 2 karakter untuk mencari</p>
          </div>
        ) : isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : data?.data?.length ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              Ditemukan {data.meta?.total || data.data.length} hasil untuk <strong>"{debouncedQuery}"</strong>
            </p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg font-medium">Tidak ada hasil</p>
            <p className="mt-2 text-muted-foreground">
              Tidak ditemukan artikel untuk "{debouncedQuery}". Coba kata kunci lain.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
