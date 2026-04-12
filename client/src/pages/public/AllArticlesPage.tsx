import { useArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { useState } from 'react';
import ArticleCard from '@/components/articles/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import SEO from '@/components/common/SEO';

export default function AllArticlesPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>('all');
  
  const { data, isLoading } = useArticles({ 
    page, 
    limit: 12, 
    status: 'PUBLISHED',
    category: category === 'all' ? undefined : category 
  });
  
  const { data: categories } = useCategories();

  return (
    <div className="animate-fade-in min-h-screen pb-20">
      <SEO title="Eksplorasi Artikel" description="Lihat semua artikel terbaru dari Media Kajoo" />
      
      {/* Header */}
      <section className="bg-muted/30 border-b">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h1 className="font-serif text-3xl sm:text-4xl text-center mb-8">Eksplorasi Artikel</h1>
          
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => { setCategory('all'); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === 'all' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-background border hover:bg-muted'}`}
            >
              Semua
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setCategory(cat.slug); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === cat.slug ? 'bg-primary text-primary-foreground shadow-md' : 'bg-background border hover:bg-muted'}`}
                style={category === cat.slug ? { backgroundColor: cat.color || undefined } : undefined}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
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
        ) : data?.data?.length ? (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {data.meta && data.meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  disabled={page <= 1} 
                  onClick={() => setPage(p => p - 1)}
                >
                  Sebelumnya
                </Button>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{page}</span>
                  <span className="text-muted-foreground">/</span>
                  <span>{data.meta.totalPages}</span>
                </div>
                <Button 
                  variant="outline" 
                  disabled={page >= data.meta.totalPages} 
                  onClick={() => setPage(p => p + 1)}
                >
                  Selanjutnya
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center text-muted-foreground italic">
            Belum ada artikel di kategori ini.
          </div>
        )}
      </section>
    </div>
  );
}
