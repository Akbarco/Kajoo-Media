import { Link } from 'react-router-dom';
import { useArticles, useDeleteArticle } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Eye, Pencil, Trash2, Loader2, Heart, MessageSquare, FilterX } from 'lucide-react';
import { formatDateShort, formatNumber } from '@/lib/helpers';
import { toast } from 'sonner';
import type { ArticleStatus } from '@/lib/types';

export default function ArticleListPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [sort, setSort] = useState<string>('newest');

  const { data, isLoading } = useArticles({ 
    page, 
    limit: 15, 
    category: category === 'all' ? undefined : category,
    status: status === 'all' ? undefined : status as ArticleStatus,
    sort
  });

  const { data: categories } = useCategories();
  const deleteArticle = useDeleteArticle();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteArticle.mutateAsync(deleteId);
      toast.success('Artikel berhasil dihapus.');
      setDeleteId(null);
    } catch {
      toast.error('Gagal menghapus artikel.');
    }
  };

  const resetFilters = () => {
    setCategory('all');
    setStatus('all');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Manajemen Artikel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data?.meta?.total || 0} total artikel
          </p>
        </div>
        <Link to="/admin/artikel/baru">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Tulis Artikel
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card/30 p-4 backdrop-blur-sm">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="w-full sm:w-48">
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Kategori</label>
            <Select value={category} onValueChange={(val) => { setCategory(val); setPage(1); }}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-40">
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</label>
            <Select value={status} onValueChange={(val) => { setStatus(val); setPage(1); }}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-44">
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Urutkan</label>
            <Select value={sort} onValueChange={(val) => { setSort(val); setPage(1); }}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Terbaru" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
                <SelectItem value="popular">Terpopuler (Views)</SelectItem>
                <SelectItem value="most-liked">Paling Banyak Like</SelectItem>
                <SelectItem value="title">Judul (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-end self-end">
          <Button variant="ghost" size="sm" className="h-9 gap-2 text-xs" onClick={resetFilters}>
            <FilterX className="h-3.5 w-3.5" /> Reset
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold whitespace-nowrap">Judul</TableHead>
                  <TableHead className="font-bold whitespace-nowrap">Kategori</TableHead>
                  <TableHead className="font-bold whitespace-nowrap">Penulis</TableHead>
                  <TableHead className="font-bold whitespace-nowrap">Status</TableHead>
                  <TableHead className="font-bold whitespace-nowrap">Engagement</TableHead>
                  <TableHead className="font-bold whitespace-nowrap">Tanggal</TableHead>
                  <TableHead className="w-32 font-bold whitespace-nowrap">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      Tidak ada artikel yang ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data?.map((article) => (
                    <TableRow key={article.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-14 flex-shrink-0 overflow-hidden rounded bg-muted">
                            {article.thumbnail ? (
                              <img 
                                src={article.thumbnail} 
                                alt="" 
                                className="h-full w-full object-cover" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/1e293b/white?text=Media+Kajo';
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted-foreground/40">MK</div>
                            )}
                          </div>
                          <span className="max-w-xs truncate font-medium">{article.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="text-[10px] uppercase font-bold tracking-tighter whitespace-nowrap"
                          style={article.category.color ? { backgroundColor: `${article.category.color}15`, color: article.category.color } : undefined}
                        >
                          {article.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{article.author.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={article.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px] w-fit whitespace-nowrap">
                            {article.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                          </Badge>
                          {article.status === 'PUBLISHED' && article.expiresAt && new Date(article.expiresAt) < new Date() && (
                            <Badge variant="destructive" className="text-[10px] w-fit whitespace-nowrap">
                              Expired
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5"><Eye className="h-3 w-3" />{formatNumber(article.views)}</span>
                            <span className="flex items-center gap-1.5"><Heart className="h-3 w-3" />{formatNumber(article.likes)}</span>
                          </div>
                          <span className="flex items-center gap-1.5 text-primary/70 font-medium">
                            <MessageSquare className="h-3 w-3" />{formatNumber(article._count?.comments || 0)} Komentar
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDateShort(article.publishedAt || article.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Link to={`/artikel/${article.slug}`} target="_blank">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted hover:text-primary transition-colors">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Link to={`/admin/artikel/${article.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted hover:text-blue-500 transition-colors">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                            onClick={() => setDeleteId(article.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <div className="flex items-center gap-1 px-4">
            <span className="text-sm font-medium">{page}</span>
            <span className="text-sm text-muted-foreground">dari</span>
            <span className="text-sm font-medium">{data.meta.totalPages}</span>
          </div>
          <Button variant="outline" size="sm" disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}

      {/* Delete confirmation (Tetap di sini) */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Artikel</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus artikel ini? Tindakan ini tidak bisa dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteArticle.isPending}>
              {deleteArticle.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
