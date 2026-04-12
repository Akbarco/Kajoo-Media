import { useParams, Link } from 'react-router-dom';
import { useArticle, useRelatedArticles } from '@/hooks/useArticles';
import ArticleCard from '@/components/articles/ArticleCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock } from 'lucide-react';
import { formatDate, getReadingTime } from '@/lib/helpers';

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useArticle(slug || '');
  const { data: related } = useRelatedArticles(
    article?.id || '',
    article?.categoryId || ''
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Skeleton className="mb-4 h-6 w-32" />
        <Skeleton className="mb-4 h-12 w-full" />
        <Skeleton className="mb-6 h-12 w-3/4" />
        <Skeleton className="mb-8 h-5 w-60" />
        <Skeleton className="aspect-video rounded-xl" />
        <div className="mt-10 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl">Artikel tidak ditemukan</h1>
        <p className="mt-3 text-muted-foreground">
          Artikel yang kamu cari mungkin sudah dihapus atau belum dipublikasikan.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const readingTime = getReadingTime(article.content);

  return (
    <article className="animate-fade-in">
      {/* Article Header */}
      <header className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <Link
          to={`/kategori/${article.category.slug}`}
          className="mb-6 inline-block"
        >
          <Badge
            variant="secondary"
            className="text-xs font-medium uppercase tracking-wider transition-colors hover:opacity-80"
            style={article.category.color ? { backgroundColor: `${article.category.color}15`, color: article.category.color } : undefined}
          >
            {article.category.name}
          </Badge>
        </Link>

        <h1 className="font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        )}

        <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{article.author.name}</span>
          <span>·</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {readingTime} min read
          </span>
        </div>
      </header>

      {/* Thumbnail */}
      {article.thumbnail && (
        <div className="mx-auto mt-8 max-w-4xl px-4 sm:px-6">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full rounded-xl object-cover"
          />
        </div>
      )}

      <Separator className="mx-auto mt-8 max-w-3xl" />

      {/* Article Content */}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* Related Articles */}
      {related && related.length > 0 && (
        <section className="border-t bg-muted/20">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="mb-8 font-serif text-2xl">Artikel Terkait</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
