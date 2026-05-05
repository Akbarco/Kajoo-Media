import { Link } from 'react-router-dom';
import { useFeaturedArticles, useArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import ArticleCard from '@/components/articles/ArticleCard';
import InternationalNews from '@/components/articles/InternationalNews';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import SEO from '@/components/common/SEO';

export default function HomePage() {
  const { data: featured, isLoading: featuredLoading } = useFeaturedArticles();
  const { data: latest, isLoading: latestLoading } = useArticles({ status: 'PUBLISHED', limit: 9 });
  const { data: categories } = useCategories();

  const mainFeatured = featured?.[0];
  const sideFeatured = featured?.slice(1, 3);

  return (
    <div className="animate-fade-in">
      <SEO />
      {/* ── Hero Section ── */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {featuredLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="aspect-video rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="aspect-video rounded-xl" />
              <Skeleton className="aspect-video rounded-xl" />
            </div>
          </div>
        ) : mainFeatured ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Main featured */}
            <ArticleCard article={mainFeatured} variant="featured" />
            {/* Side featured */}
            {sideFeatured && sideFeatured.length > 0 && (
              <div className="flex flex-col gap-4">
                {sideFeatured.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="featured" />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </section>

      {/* ── Category Nav ── */}
      {categories && categories.length > 0 && (
        <section className="border-b">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-4 sm:px-6">
            <Link
              to="/artikel"
              className="flex-shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Semua
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/kategori/${cat.slug}`}
                className="flex-shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors hover:bg-muted"
                style={cat.color ? { borderColor: `${cat.color}30` } : undefined}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Latest Articles ── */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-2xl sm:text-3xl">Artikel Terbaru</h2>
          <Link
            to="/artikel"
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {latestLoading ? (
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
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {latest?.data?.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* ── International News (NewsAPI) ── */}
      <div className="border-t">
        <InternationalNews />
      </div>
    </div>
  );
}
