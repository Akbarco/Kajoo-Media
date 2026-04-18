import { useState } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, AlertCircle, CheckCircle, Pencil, Eye, FilterX, MousePointerClick } from 'lucide-react';
import { getExpirationCountdown, formatDate } from '@/lib/helpers';
import { Link } from 'react-router-dom';

export default function ExpiredTrackingPage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<string>('expires-soon');

  // Fetch only articles that HAVE expiration date
  const { data, isLoading } = useArticles({
    page,
    limit: 10,
    sort,
    hasExpiration: true,
  });

  // Calculate some simple stats from the data meta or local analysis
  // For demo/simplicity, we'll use the total from meta
  const totalArticles = data?.meta?.total || 0;

  const resetFilters = () => {
    setSort('expires-soon');
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header section with Stats Cards */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Pelacakan Masa Aktif</h1>
        <p className="text-muted-foreground italic">Pantau dan kelola masa tayang artikel portal berita Anda secara real-time.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="group">
          <Card className="relative overflow-hidden border-primary/20 bg-primary/[0.03] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/70">Total Terjadwal</CardTitle>
              <div className="rounded-full bg-primary/20 p-2 text-primary">
                <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-foreground">{totalArticles}</div>
              <p className="mt-1 text-xs text-muted-foreground font-medium">Berita dengan masa aktif aktif</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="group">
          <Card className="relative overflow-hidden border-orange-500/20 bg-orange-500/[0.03] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-orange-500/70">Segera Berakhir</CardTitle>
              <div className="rounded-full bg-orange-500/20 p-2 text-orange-500">
                <AlertCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-foreground">
                {data?.data?.filter(a => {
                  const diff = (new Date(a.expiresAt!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
                  return diff > 0 && diff < 3;
                }).length || 0}
              </div>
              <p className="mt-1 text-xs text-muted-foreground font-medium">Kurang dari 3 hari lagi</p>
            </CardContent>
          </Card>
        </div>

        <div className="group">
          <Card className="relative overflow-hidden border-emerald-500/20 bg-emerald-500/[0.03] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-500/70">Sudah Selesai</CardTitle>
              <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-500">
                <CheckCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-foreground">
                {data?.data?.filter(a => new Date(a.expiresAt!) < new Date()).length || 0}
              </div>
              <p className="mt-1 text-xs text-muted-foreground font-medium">Berita yang sudah tidak tayang</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter and Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-64">
              <Select value={sort} onValueChange={(val) => { setSort(val); setPage(1); }}>
                <SelectTrigger className="bg-background border-primary/20 text-foreground font-medium">
                  <SelectValue>
                    {sort === 'expires-soon' ? 'Paling Cepat Kadaluarsa' : 'Paling Lama Kadaluarsa'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expires-soon">Paling Cepat Kadaluarsa</SelectItem>
                  <SelectItem value="expires-late">Paling Lama Kadaluarsa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {sort !== 'expires-soon' && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-2">
                <FilterX className="h-4 w-4" /> Reset Filter
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-primary/10 bg-card overflow-hidden shadow-lg">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-primary/5">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[450px] font-bold uppercase tracking-tight text-xs text-foreground">Judul Artikel</TableHead>
                <TableHead className="font-bold uppercase tracking-tight text-xs text-foreground">Status Masa Aktif</TableHead>
                <TableHead className="font-bold uppercase tracking-tight text-xs text-foreground">Estimasi Berakhir</TableHead>
                <TableHead className="text-center font-bold uppercase tracking-tight text-xs text-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 mx-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : data?.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                          <Clock className="h-12 w-12 opacity-10" />
                          <p>Tidak ada artikel dengan masa aktif ditemukan.</p>
                          <Link to="/admin/artikel/baru">
                            <Button variant="outline" size="sm">Mulai Tulis Artikel</Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data.map((article) => {
                      const countdown = getExpirationCountdown(article.expiresAt);
                      return (
                        <TableRow 
                          key={article.id}
                          className="group hover:bg-muted/50 transition-colors border-b border-primary/5 last:border-0"
                        >
                          <TableCell className="font-medium align-middle">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{article.title}</span>
                              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                                
                                {article.category.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="align-middle">
                            <Badge variant={countdown.variant as BadgeProps['variant']} className="px-2 py-0.5 text-[10px] font-bold uppercase">
                              {countdown.text}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-foreground/80 font-medium align-middle">
                            {formatDate(article.expiresAt)}
                          </TableCell>
                          <TableCell className="text-center align-middle">
                            <div className="flex items-center justify-center gap-2">
                              <Link to={`/admin/artikel/${article.id}/edit`}>
                                <Button variant="ghost" size="icon" title="Edit Masa Aktif" className="h-8 w-8 hover:bg-primary/20 hover:text-primary">
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                              <Link to={`/artikel/${article.slug}`} target="_blank">
                                <Button variant="ghost" size="icon" title="Lihat di Portal" className="h-8 w-8 hover:bg-foreground/10">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
          </Table>
        </div>

        {/* Pagination logic could go here similarly to ArticleListPage */}
        {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Sebelumnya
            </Button>
            <div className="flex items-center gap-1 px-4 text-xs font-serif">
                <span className="font-bold">{page}</span>
                <span className="text-muted-foreground">/</span>
                <span className="font-bold">{data.meta.totalPages}</span>
            </div>
            <Button variant="outline" size="sm" disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)}>
                Selanjutnya
            </Button>
            </div>
        )}
      </div>

      {/* Floating Action Tip */}
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/30 w-fit px-3 py-1.5 rounded-full border">
        <MousePointerClick className="h-3 w-3" />
        <span>Tips: Gunakan menu Edit untuk memperpanjang atau menghapus masa aktif berita.</span>
      </div>
    </div>
  );
}
