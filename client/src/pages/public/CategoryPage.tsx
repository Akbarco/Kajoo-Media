import { useParams, useSearchParams } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import { useCategory } from '@/hooks/useCategories';
import ArticleCard from '@/components/articles/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '@/components/common/SEO';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');

  const { data: category, isLoading: catLoading } = useCategory(slug || '');
  const { data: articles, isLoading } = useArticles({
    category: slug,
    status: 'PUBLISHED',
    page,
    limit: 12,
  });

  return (
    <div className="animate-fade-in">
      <SEO 
        title={category?.name} 
        description={category?.description || undefined} 
      />
      {/* Category Header */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          {catLoading ? (
            <>
              <Skeleton className="mb-2 h-8 w-40" />
              <Skeleton className="h-5 w-80" />
            </>
          ) : category ? (
            <>
              <div
                className="mb-3 inline-block h-1 w-12 rounded-full"
                style={{ backgroundColor: category.color || 'hsl(var(--primary))' }}
              />
              <h1 className="font-serif text-3xl sm:text-4xl">{category.name}</h1>
              {category.description && (
                <p className="mt-2 max-w-lg text-muted-foreground">{category.description}</p>
              )}
              <p className="mt-3 text-sm text-muted-foreground">
                {category._count?.articles || 0} artikel
              </p>
            </>
          ) : (
            <h1 className="font-serif text-3xl">Kategori tidak ditemukan</h1>
          )}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {isLoading ? (
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
        ) : articles?.data?.length ? (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {articles.meta && articles.meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setSearchParams({ page: String(page - 1) })}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Prev
                </Button>
                <span className="mx-4 text-sm text-muted-foreground">
                  Halaman {page} dari {articles.meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= articles.meta.totalPages}
                  onClick={() => setSearchParams({ page: String(page + 1) })}
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">Belum ada artikel di kategori ini.</p>
          </div>
        )}
      </section>
    </div>
  );
}
