import { useState, useEffect } from 'react';
import {
  MessageCircle,
  Trash2,
  ExternalLink,
  MessageSquare,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/helpers';

interface Comment {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  articleId: string;
  article: {
    title: string;
    slug: string;
  };
}

export default function CommentListPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/v1/comments');
      const result = await res.json();
      if (result.success) {
        setComments(result.data);
      }
    } catch {
      toast.error('Gagal mengambil data komentar');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return;

    try {
      const res = await fetch(`/api/v1/comments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Komentar berhasil dihapus');
        setComments(comments.filter((c) => c.id !== id));
      }
    } catch  {
      toast.error('Gagal menghapus komentar');
    }
  };

  const filteredComments = comments.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-serif text-3xl font-bold">
            <MessageCircle className="h-8 w-8 text-primary" /> Moderasi Komentar
          </h1>
          <p className="text-muted-foreground">
            Kelola dan pantau semua suara pembaca di portal Anda.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari komentar, nama, atau judul artikel..."
          className="flex-1 bg-transparent text-sm outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="p-4 font-semibold">Pengirim</th>
              <th className="p-4 font-semibold">Komentar</th>
              <th className="p-4 font-semibold">Artikel</th>
              <th className="p-4 font-semibold">Waktu</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="p-4"><Skeleton className="h-12 w-full" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="p-4 text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
                </tr>
              ))
            ) : filteredComments.length > 0 ? (
              filteredComments.map((comment) => (
                <tr key={comment.id} className="hover:bg-muted/10 transition-colors">
                  <td className="p-4">
                    <div className="font-medium">{comment.name}</div>
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="line-clamp-2 text-muted-foreground">{comment.content}</p>
                  </td>
                  <td className="p-4">
                    <a 
                      href={`/artikel/${comment.article.slug}`} 
                      target="_blank" 
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <span className="line-clamp-1">{comment.article.title}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td className="p-4 whitespace-nowrap text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p>Tidak ada komentar ditemukan.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
