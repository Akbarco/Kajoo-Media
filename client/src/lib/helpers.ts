import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatDate(date: string | null | undefined): string {
  if (!date) return '-';
  return format(parseISO(date), 'd MMMM yyyy', { locale: id });
}

export function formatDateShort(date: string | null | undefined): string {
  if (!date) return '-';
  return format(parseISO(date), 'd MMM yyyy', { locale: id });
}

export function formatRelativeTime(date: string | null | undefined): string {
  if (!date) return '-';
  return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: id });
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, ''); // strip HTML
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
