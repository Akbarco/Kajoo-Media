import { useParams, Link, Navigate } from "react-router-dom";
import {
  useArticle,
  useRelatedArticles,
  useRecordView,
  useToggleLike,
} from "@/hooks/useArticles";
import type { Comment } from "@/lib/types";
import ArticleCard from "@/components/articles/ArticleCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AISummary from "@/components/articles/AISummary";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Eye,
  Heart,
  X,
  Link2,
  Share2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { formatDate, getReadingTime, formatNumber } from "@/lib/helpers";
import { useState, useEffect, useRef } from "react";
import SEO from "@/components/common/SEO";
import { toast } from "sonner";
import ImageLightbox from "@/components/common/ImageLightbox";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Bookmark } from "lucide-react";

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useArticle(slug || "");
  const { data: related } = useRelatedArticles(
    article?.id || "",
    article?.categoryId || "",
  );

  const recordView = useRecordView();
  const toggleLike = useToggleLike();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const viewRecorded = useRef(false);

  // States
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [animateClap, setAnimateClap] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsIsLoading, setCommentsIsLoading] = useState(true);
  const [refreshComments, setRefreshComments] = useState(0);

  // Fetch comments
  useEffect(() => {
    if (!article?.id) return;

    const fetchComments = async () => {
      try {
        setCommentsIsLoading(true);
        const res = await fetch(`/api/v1/comments/${article.id}`);
        const result = await res.json();
        if (result.success) {
          setComments(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch comments", err);
      } finally {
        setCommentsIsLoading(false);
      }
    };

    fetchComments();
  }, [article?.id, refreshComments]);

  // Handle lightbox for images in content
  useEffect(() => {
    if (!article?.content) return;

    // Timeout to ensure content is rendered
    const timer = setTimeout(() => {
      const articleContent = document.querySelector(".prose");
      if (!articleContent) return;

      const images = articleContent.querySelectorAll("img");
      const handlers: (() => void)[] = [];

      images.forEach((img) => {
        const handler = () => {
          setSelectedImage({ src: img.src, alt: img.alt });
        };
        img.addEventListener("click", handler);
        img.style.cursor = "zoom-in";
        handlers.push(handler);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [article?.content]);

  // Update scroll progress
  useEffect(() => {
    const updateScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Check localStorage on article load
  useEffect(() => {
    if (article?.slug) {
      const isLiked = localStorage.getItem(`liked_${article.slug}`) === "1";
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
        sessionStorage.setItem(key, "1");
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
      localStorage.setItem(`liked_${articleSlug}`, "1");
      setHasLiked(true);
    }
  };

  const shareUrl = window.location.href;
  const shareText = `Baca artikel menarik ini: ${article?.title}`;

  const handleShare = (platform: "wa" | "tw" | "fb") => {
    let url = "";
    if (platform === "wa")
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    if (platform === "tw")
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    if (platform === "fb")
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

    window.open(url, "_blank", "width=600,height=400");
  };

  const [copySuccess, setCopySuccess] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    toast.success("Link berhasil disalin!");
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
    return <Navigate to="/404" replace />;
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
            style={
              article.category.color
                ? {
                    backgroundColor: `${article.category.color}15`,
                    color: article.category.color,
                  }
                : undefined
            }
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
          <span className="font-medium text-foreground">
            {article.author.name}
          </span>
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
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/1200x630/1e293b/white?text=Media+Kajo';
            }}
          />
        </div>
      )}

      <Separator className="mx-auto mt-8 max-w-3xl" />
      
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <AISummary articleId={article.id} />
      </div>

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
          onClick={() => handleShare("wa")}
          className="group flex h-10 w-10 items-center justify-center rounded-full bg-background border text-muted-foreground transition-all hover:border-green-500 hover:text-green-500 hover:shadow-md"
          title="Bagikan ke WhatsApp"
        >
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </button>
        <button
          onClick={() => handleShare("tw")}
          className="group flex h-10 w-10 items-center justify-center rounded-full bg-background border text-muted-foreground transition-all hover:border-foreground hover:text-foreground hover:shadow-md"
          title="Bagikan ke X (Twitter)"
        >
          <X className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleShare("fb")}
          className="group flex h-10 w-10 items-center justify-center rounded-full bg-background border text-muted-foreground transition-all hover:border-blue-600 hover:text-blue-600 hover:shadow-md"
          title="Bagikan ke Facebook"
        >
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={handleCopyLink}
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-background border transition-all hover:shadow-md ${copySuccess ? "border-green-500 text-green-500" : "text-muted-foreground hover:border-primary hover:text-primary"}`}
          title="Salin Link"
        >
          <Link2 className="h-5 w-5" />
        </button>
      </div>

      {/* Engagement Bar */}
      <div className="sticky bottom-6 z-10 mx-auto flex max-w-3xl justify-center px-4 sm:px-6">
        <div className="inline-flex items-center gap-1 rounded-full border bg-background/80 px-2 py-1.5 shadow-lg backdrop-blur-md">
          <button
            onClick={() => toggleBookmark(article)}
            className={`flex items-center justify-center rounded-full p-2.5 transition-all ${
              isBookmarked(article.id)
                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                : "hover:bg-muted text-muted-foreground"
            }`}
            title={isBookmarked(article.id) ? "Hapus dari simpanan" : "Simpan artikel"}
          >
            <Bookmark
              className={`h-5 w-5 ${isBookmarked(article.id) ? "fill-current" : ""}`}
            />
          </button>
          <div className="h-6 w-px bg-border" />
          <button
            onClick={handleClap}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              hasLiked
                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                : "hover:bg-muted"
            }`}
          >
            <Heart
              className={`h-5 w-5 transition-transform ${animateClap ? "animate-clap" : ""} ${
                hasLiked ? "fill-current" : ""
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

      {/* ── Next/Prev Navigation ── */}
      {article?.navigation &&
        (article.navigation.prev || article.navigation.next) && (
          <section className="mx-auto max-w-3xl px-4 py-8 border-t sm:px-6">
            <div className="grid grid-cols-2 gap-4">
              {article.navigation.prev ? (
                <Link
                  to={`/artikel/${article.navigation.prev.slug}`}
                  className="group flex flex-col gap-2 p-4 rounded-xl border bg-muted/30 hover:border-primary hover:bg-background transition-all"
                >
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <ChevronLeft className="h-3 w-3" /> Sebelumnya
                  </span>
                  <span className="font-medium line-clamp-2 text-sm group-hover:text-primary transition-colors">
                    {article.navigation.prev.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {article.navigation.next ? (
                <Link
                  to={`/artikel/${article.navigation.next.slug}`}
                  className="group flex flex-col gap-2 p-4 text-right rounded-xl border bg-muted/30 hover:border-primary hover:bg-background transition-all"
                >
                  <span className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Berikutnya <ChevronRight className="h-3 w-3" />
                  </span>
                  <span className="font-medium line-clamp-2 text-sm group-hover:text-primary transition-colors">
                    {article.navigation.next.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </section>
        )}

      {/* ── Comments Section ── */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="mb-8 flex items-center gap-3 font-serif text-2xl">
          <MessageCircle className="h-6 w-6" /> Suara Pembaca
        </h2>

        {/* Comment Form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;
            const content = formData.get("content") as string;

            if (!name || !content) {
              toast.error("Nama dan isi komentar wajib diisi!");
              return;
            }

            try {
              const res = await fetch(`/api/v1/comments/${article.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, content }),
              });

              if (res.ok) {
                toast.success("Komentar berhasil dikirim!");
                (e.target as HTMLFormElement).reset();
                // Refresh comments
                setRefreshComments((prev) => prev + 1);
              }
            } catch {
              toast.error("Gagal mengirim komentar.");
            }
          }}
          className="mb-12 space-y-4 rounded-2xl border bg-muted/20 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Nama Lengkap
              </label>
              <input
                name="name"
                placeholder="Masukkan namamu..."
                className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pesan / Opini
            </label>
            <textarea
              name="content"
              placeholder="Tulis pendapatmu di sini..."
              rows={4}
              className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto px-8">
            Kirim Komentar
          </Button>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {commentsIsLoading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="group relative space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-serif font-bold text-primary uppercase">
                    {comment.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{comment.name}</h4>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl rounded-tl-none border bg-background p-4 text-sm leading-relaxed shadow-sm transition-shadow group-hover:shadow-md">
                  {comment.content}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground italic border-t border-dashed">
              Belum ada komentar. Jadi yang pertama berdiskusi!
            </div>
          )}
        </div>
      </section>

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

      {/* ── Image Lightbox Overlay ── */}
      {selectedImage && (
        <ImageLightbox
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </article>
  );
}
