import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { formatDateShort, getReadingTime, formatNumber } from '@/lib/helpers';
import type { Article } from '@/lib/types';
import { Eye } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'horizontal' | 'featured';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const readingTime = getReadingTime(article.content);

  if (variant === 'horizontal') {
    return (
      <Link to={`/artikel/${article.slug}`} className="group flex gap-5">
        {/* Thumbnail */}
        {article.thumbnail && (
          <div className="h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-1.5 flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-[10px] font-medium uppercase tracking-wider"
              style={article.category.color ? { backgroundColor: `${article.category.color}15`, color: article.category.color } : undefined}
            >
              {article.category.name}
            </Badge>
          </div>
          <h3 className="line-clamp-2 font-serif text-lg leading-snug transition-colors group-hover:text-primary/80">
            {article.title}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{article.author.name}</span>
            <span>·</span>
            <span>{formatDateShort(article.publishedAt)}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatNumber(article.views)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/artikel/${article.slug}`} className="group relative block overflow-hidden rounded-2xl">
        <div className="aspect-video w-full overflow-hidden bg-muted">
          {article.thumbnail ? (
            <img
              src={article.thumbnail}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <span className="font-serif text-4xl text-muted-foreground/30">MK</span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 text-white sm:p-8">
          <Badge
            variant="secondary"
            className="mb-3 w-fit text-[10px] font-medium uppercase tracking-wider"
            style={article.category.color ? { backgroundColor: article.category.color, color: '#fff' } : undefined}
          >
            {article.category.name}
          </Badge>
          <h2 className="font-serif text-2xl leading-tight sm:text-3xl lg:text-4xl">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm text-white/80 sm:text-base">{article.excerpt}</p>
          )}
          <div className="mt-3 flex items-center gap-2 text-xs text-white/60 sm:text-sm">
            <span>{article.author.name}</span>
            <span>·</span>
            <span>{formatDateShort(article.publishedAt)}</span>
            <span>·</span>
            <span>{readingTime} min read</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatNumber(article.views)}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link to={`/artikel/${article.slug}`} className="group animate-fade-in">
      {/* Thumbnail */}
      <div className="aspect-video overflow-hidden rounded-xl bg-muted">
        {article.thumbnail ? (
          <img
            src={article.thumbnail}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="font-serif text-3xl text-muted-foreground/30">MK</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px] font-medium uppercase tracking-wider"
            style={article.category.color ? { backgroundColor: `${article.category.color}15`, color: article.category.color } : undefined}
          >
            {article.category.name}
          </Badge>
          <span className="text-xs text-muted-foreground">{readingTime} min read</span>
        </div>

        <h3 className="line-clamp-2 font-serif text-xl leading-snug transition-colors group-hover:text-primary/80">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">{article.author.name}</span>
          <span>·</span>
          <span>{formatDateShort(article.publishedAt)}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatNumber(article.views)}</span>
        </div>
      </div>
    </Link>
  );
}
