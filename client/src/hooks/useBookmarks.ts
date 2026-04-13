import { useState,  } from 'react';
import type { Article } from '@/lib/types';
import { toast } from 'sonner';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Article[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('kajoo_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse bookmarks', e);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever bookmarks change
  const saveBookmarks = (newList: Article[]) => {
    setBookmarks(newList);
    localStorage.setItem('kajoo_bookmarks', JSON.stringify(newList));
  };

  const toggleBookmark = (article: Article) => {
    const isExist = bookmarks.some((b) => b.id === article.id);
    
    if (isExist) {
      const newList = bookmarks.filter((b) => b.id !== article.id);
      saveBookmarks(newList);
      toast.success('Artikel dihapus dari simpanan');
    } else {
      const newList = [article, ...bookmarks];
      saveBookmarks(newList);
      toast.success('Artikel berhasil disimpan');
    }
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some((b) => b.id === id);
  };

  return { bookmarks, toggleBookmark, isBookmarked };
}
