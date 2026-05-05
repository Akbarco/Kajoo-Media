import { useState } from 'react';
import { useInternationalNews } from '@/hooks/useNews';
import type { NewsArticle } from '@/services/news';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, ExternalLink, RefreshCw } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { AxiosError } from 'axios';

const CATEGORIES = [
  { key: 'general', label: 'Umum' },
  { key: 'technology', label: 'Teknologi' },
  { key: 'business', label: 'Bisnis' },
  { key: 'sports', label: 'Olahraga' },
  { key: 'science', label: 'Sains' },
  { key: 'health', label: 'Kesehatan' },
  { key: 'entertainment', label: 'Hiburan' },
];

const CATEGORY_COLORS: Record<string, string> = {
  general: '#6366f1',
  technology: '#06b6d4',
  business: '#f59e0b',
  sports: '#22c55e',
  science: '#a855f7',
  health: '#ef4444',
  entertainment: '#ec4899',
};

function formatNewsDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'd MMM yyyy', { locale: localeId });
  } catch {
    return '-';
  }
}

function NewsCard({ article, category }: { article: NewsArticle; category: string }) {
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.general;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group animate-fade-in block"
    >
      {/* Thumbnail */}
      <div className="aspect-video overflow-hidden rounded-xl bg-muted">
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/800x450/1e293b/white?text=No+Image';
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Globe className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
            style={{
              backgroundColor: `${color}15`,
              color,
            }}
          >
            {CATEGORIES.find((c) => c.key === category)?.label || 'Umum'}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            Eksternal
          </span>
        </div>

        <h3 className="line-clamp-2 font-serif text-xl leading-snug transition-colors group-hover:text-primary/80">
          {article.title}
        </h3>

        {article.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">
            {article.source.name}
          </span>
          <span>·</span>
          <span>{formatNewsDate(article.publishedAt)}</span>
        </div>
      </div>
    </a>
  );
}

function SkeletonGrid() {
  return (
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
  );
}

export default function InternationalNews() {
  const [category, setCategory] = useState('general');

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInternationalNews(category);

  const articles = data?.pages.flatMap((page) => page.articles) ?? [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* ── Header ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl">Berita Internasional</h2>
        </div>
      </div>

      {/* ── Category Filter ── */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`flex-shrink-0 rounded-full border px-4 py-1.5 text-sm transition-all duration-200 ${
              category === cat.key
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border hover:bg-muted'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Loading State ── */}
      {isLoading && <SkeletonGrid />}

      {/* ── Error State ── */}
      {isError && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <Globe className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="mb-2 text-lg font-medium">Gagal memuat berita</p>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            {(error as AxiosError<{ error: { message: string } }>)?.response?.data?.error?.message ||
              'Terjadi kesalahan saat mengambil berita internasional. Silakan coba lagi.'}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </button>
        </div>
      )}

      {/* ── Articles Grid ── */}
      {!isLoading && !isError && articles.length > 0 && (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <NewsCard
                key={`${article.url}-${index}`}
                article={article}
                category={category}
              />
            ))}
          </div>

          {/* ── Load More ── */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              className={`inline-flex items-center gap-2 rounded-full border px-8 py-3 text-sm font-medium transition-all duration-200 ${
                hasNextPage
                  ? 'border-primary/20 bg-primary/5 text-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-md'
                  : 'cursor-default border-border text-muted-foreground'
              }`}
            >
              {isFetchingNextPage ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Memuat...
                </>
              ) : hasNextPage ? (
                'Muat Lebih Banyak'
              ) : (
                'Semua berita telah ditampilkan'
              )}
            </button>
          </div>
        </>
      )}

      {/* ── Empty State ── */}
      {!isLoading && !isError && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <Globe className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium">Tidak ada berita</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Belum ada berita internasional untuk kategori ini.
          </p>
        </div>
      )}
    </section>
  );
}
