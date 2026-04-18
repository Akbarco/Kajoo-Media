import { format, formatDistanceToNow, parseISO, isPast, differenceInDays } from 'date-fns';
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

export function getExpirationCountdown(date: string | null | undefined): { text: string; variant: 'default' | 'destructive' | 'warning' | 'secondary' } {
  if (!date) return { text: '-', variant: 'secondary' };
  
  const targetDate = parseISO(date);
  if (isPast(targetDate)) {
    return { text: 'Sudah Kadaluarsa', variant: 'destructive' };
  }

  const days = differenceInDays(targetDate, new Date());
  
  if (days === 0) {
    return { text: 'Akan kadaluarsa hari ini', variant: 'destructive' };
  }
  
  if (days < 3) {
    return { text: `${days} hari lagi`, variant: 'warning' };
  }

  return { text: `${days} hari lagi`, variant: 'default' };
}

