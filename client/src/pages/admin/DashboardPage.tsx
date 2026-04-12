import { Link } from 'react-router-dom';
import { useArticleStats, useArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Tags, Calendar, FilePenLine, ArrowRight, Eye, Pencil } from 'lucide-react';
import { formatDateShort } from '@/lib/helpers';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useArticleStats();
  const { data: categories } = useCategories();
  const { data: recentArticles, isLoading: articlesLoading } = useArticles({ limit: 5 });

  const metrics = [
    { label: 'Total Artikel', value: stats?.total || 0, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Kategori', value: categories?.length || 0, icon: Tags, color: 'text-green-600 bg-green-50' },
    { label: 'Artikel Bulan Ini', value: stats?.thisMonth || 0, icon: Calendar, color: 'text-amber-600 bg-amber-50' },
    { label: 'Artikel Draft', value: stats?.draft || 0, icon: FilePenLine, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Selamat datang di Media Kajoo CMS</p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${metric.color}`}>
                <metric.icon className="h-5 w-5" />
              </div>
              <div>
                {statsLoading ? (
                  <Skeleton className="h-7 w-12" />
                ) : (
                  <p className="text-2xl font-bold">{metric.value}</p>
                )}
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Artikel Terbaru</CardTitle>
          <Link to="/admin/artikel">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {articlesLoading ? (
            <div className="space-y-3 p-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="w-24">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentArticles?.data?.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="max-w-xs truncate font-medium">{article.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="text-[10px]"
                        style={article.category.color ? { backgroundColor: `${article.category.color}15`, color: article.category.color } : undefined}
                      >
                        {article.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={article.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px]">
                        {article.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateShort(article.publishedAt || article.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link to={`/artikel/${article.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Link to={`/admin/artikel/${article.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
