import { useParams, Link } from 'react-router-dom';
import { useArticle, useRelatedArticles, useRecordView, useToggleLike } from '@/hooks/useArticles';
import ArticleCard from '@/components/articles/ArticleCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, Eye, Heart, Twitter, Facebook, MessageCircle, Link2, Share2 } from 'lucide-react';
import { formatDate, getReadingTime, formatNumber } from '@/lib/helpers';
import { useState, useEffect, useRef } from 'react';
import SEO from '@/components/common/SEO';
import { toast } from 'sonner';

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useArticle(slug || '');
  const { data: related } = useRelatedArticles(
    article?.id || '',
    article?.categoryId || ''
  );

  const recordView = useRecordView();
  const toggleLike = useToggleLike();
  const viewRecorded = useRef(false);

  // Scroll & Like states
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [animateClap, setAnimateClap] = useState(false);

  // Update scroll progress
  useEffect(() => {
    const updateScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Check localStorage on article load
  useEffect(() => {
    if (article?.slug) {
      const isLiked = localStorage.getItem(`liked_${article.slug}`) === '1';
      // Defer state update to avoid synchronous warning in some environments
      const timeoutId = setTimeout(() => {
        setHasLiked(isLiked);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [article?.slug]);

  // Auto-record view (once per session per article)
  useEffect(() => {
    if (article?.slug && slug && !viewRecorded.current) {
      const key = `viewed_${slug}`;
      if (!sessionStorage.getItem(key)) {
        recordView.mutate(slug);
        sessionStorage.setItem(key, '1');
      }
      viewRecorded.current = true;
    }
  }, [article?.slug, slug, recordView]);

  const handleClap = () => {
    if (!article?.slug) return;

    setAnimateClap(true);
    setTimeout(() => setAnimateClap(false), 300);

    const articleSlug = article.slug;

    if (hasLiked) {
      toggleLike.mutate({ slug: articleSlug, delta: -1 });
      localStorage.removeItem(`liked_${articleSlug}`);
      setHasLiked(false);
    } else {
      toggleLike.mutate({ slug: articleSlug, delta: 1 });
      localStorage.setItem(`liked_${articleSlug}`, '1');
      setHasLiked(true);
    }
  };

  const shareUrl = window.location.href;
  const shareText = `Baca artikel menarik ini: ${article?.title}`;

  const handleShare = (platform: 'wa' | 'tw' | 'fb') => {
    let url = '';
    if (platform === 'wa') url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    if (platform === 'tw') url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    if (platform === 'fb') url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  const [copySuccess, setCopySuccess] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    toast.success('Link berhasil disalin!');
    setTimeout(() => setCopySuccess(false), 2000);
  };

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
      <SEO
        title={article.title}
        description={article.excerpt || undefined}
        image={article.thumbnail || undefined}
        type="article"
      />
      {/* ── Reading Progress Bar ── */}
      <div className="fixed top-0 left-0 z-[60] h-1 w-full bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

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
          <span>·</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {formatNumber(article.views)}
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

      {/* ── Floating Side Share (Desktop) ── */}
      <div className="fixed left-8 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
        <button
          onClick={() => handleShare('wa')}
          className="group flex h-10 w-10 items-center justify-center rounded-full bg-background border text-muted-foreground transition-all hover:border-green-500 hover:text-green-500 hover:shadow-md"
          title="Bagikan ke WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleShare('tw')}
          className="group flex h-10 w-10 items-center justify-center rounded-full bg-background border text-muted-foreground transition-all hover:border-sky-500 hover:text-sky-500 hover:shadow-md"
          title="Bagikan ke Twitter"
        >
          <Twitter className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleShare('fb')}
          className="group flex h-10 w-10 items-center justify-center rounded-full bg-background border text-muted-foreground transition-all hover:border-blue-600 hover:text-blue-600 hover:shadow-md"
          title="Bagikan ke Facebook"
        >
          <Facebook className="h-5 w-5" />
        </button>
        <button
          onClick={handleCopyLink}
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-background border transition-all hover:shadow-md ${copySuccess ? 'border-green-500 text-green-500' : 'text-muted-foreground hover:border-primary hover:text-primary'}`}
          title="Salin Link"
        >
          <Link2 className="h-5 w-5" />
        </button>
      </div>

      {/* Engagement Bar */}
      <div className="sticky bottom-6 z-10 mx-auto flex max-w-3xl justify-center px-4 sm:px-6">
        <div className="inline-flex items-center gap-1 rounded-full border bg-background/80 px-2 py-1.5 shadow-lg backdrop-blur-md">
          <button
            onClick={handleClap}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              hasLiked
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                : 'hover:bg-muted'
            }`}
          >
            <Heart
              className={`h-5 w-5 transition-transform ${animateClap ? 'animate-clap' : ''} ${
                hasLiked ? 'fill-current' : ''
              }`}
            />
            <span>{formatNumber(article.likes)}</span>
          </button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{formatNumber(article.views)}</span>
          </div>
          <div className="h-6 w-px bg-border lg:hidden" />
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted lg:hidden"
            title="Bagikan"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
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
