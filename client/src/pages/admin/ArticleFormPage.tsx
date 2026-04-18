import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateArticle, useUpdateArticle } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { uploadService } from '@/services/upload';
import { articleService } from '@/services/articles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, Upload, X, ArrowLeft } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import type { CreateArticleInput } from '@/lib/types';

export default function ArticleFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: categories } = useCategories();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  const [form, setForm] = useState({
    title: '',
    content: '',
    categoryId: '',
    excerpt: '',
    thumbnail: '',
    videoUrl: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
    isFeatured: false,
    expiresAt: '' as string,
  });
  const [uploading, setUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  // Load article data for edit mode
  useEffect(() => {
    if (isEdit && id) {
      setInitialLoading(true);
      // Fetch article by ID via slug - we need to find it
      // For edit, we get the article data from the articles list API
      articleService.getArticles({ limit: 1000 })
        .then((res) => {
          const article = res.data.find((a) => a.id === id);
          if (article) {
            setForm({
              title: article.title,
              content: article.content,
              categoryId: article.categoryId,
              excerpt: article.excerpt || '',
              thumbnail: article.thumbnail || '',
              videoUrl: article.videoUrl || '',
              status: article.status,
              isFeatured: article.isFeatured,
              expiresAt: article.expiresAt ? new Date(article.expiresAt).toISOString().slice(0, 16) : '',
            });
          }
        })
        .finally(() => setInitialLoading(false));
    }
  }, [id, isEdit]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB.');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadService.uploadMedia(file);
      setForm((prev) => ({ ...prev, thumbnail: result.url }));
      toast.success('Gambar berhasil diupload.');
    } catch {
      toast.error('Gagal mengupload gambar.');
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 50MB.');
      return;
    }

    setVideoUploading(true);
    try {
      const result = await uploadService.uploadMedia(file);
      setForm((prev) => ({ ...prev, videoUrl: result.url }));
      toast.success('Video berhasil diupload.');
    } catch {
      toast.error('Gagal mengupload video.');
    } finally {
      setVideoUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: CreateArticleInput = {
        title: form.title,
        content: form.content,
        categoryId: form.categoryId,
        excerpt: form.excerpt || null,
        thumbnail: form.thumbnail || null,
        videoUrl: form.videoUrl || null,
        status: form.status,
        isFeatured: form.isFeatured,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      };

      if (isEdit && id) {
        await updateArticle.mutateAsync({ id, data });
        toast.success('Artikel berhasil diperbarui.');
      } else {
        await createArticle.mutateAsync(data);
        toast.success('Artikel berhasil dibuat.');
      }

      navigate('/admin/artikel');
    } catch (error) {
      const err = error as { response?: { data?: { error?: { message?: string } } } };
      const message = err?.response?.data?.error?.message || 'Gagal menyimpan artikel.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/artikel')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">
            {isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEdit ? 'Perbarui konten artikel' : 'Buat dan publikasikan artikel baru'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Artikel</Label>
                  <Input
                    id="title"
                    placeholder="Masukkan judul artikel..."
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="text-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt / Ringkasan</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Ringkasan singkat artikel (opsional, max 300 karakter)..."
                    value={form.excerpt}
                    onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                    maxLength={300}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">{form.excerpt.length}/300</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Konten Artikel</Label>
                  <Textarea
                    id="content"
                    placeholder="Tulis konten artikel di sini... (HTML supported)"
                    value={form.content}
                    onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                    className="min-h-[400px] font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Mendukung format HTML. Rich text editor (Tiptap) akan diintegrasikan di fase selanjutnya.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) => { if (value) setForm((prev) => ({ ...prev, status: value as 'DRAFT' | 'PUBLISHED' })); }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.isFeatured}
                    onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="featured" className="text-sm font-normal">
                    Tampilkan di Hero Section
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiresAt" className="text-sm font-medium">Tanggal Kadaluarsa (Opsional)</Label>
                  <DatePicker 
                    date={form.expiresAt ? new Date(form.expiresAt) : null}
                    setDate={(date) => setForm((prev) => ({ ...prev, expiresAt: date ? date.toISOString() : '' }))}
                  />
                  <p className="text-[10px] leading-relaxed text-muted-foreground">
                    Berita akan otomatis disembunyikan dari publik setelah tanggal ini. Biarkan kosong jika berita tidak memiliki masa aktif.
                  </p>
                </div>

                <Separator />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                  ) : isEdit ? (
                    'Simpan Perubahan'
                  ) : form.status === 'PUBLISHED' ? (
                    'Publish Artikel'
                  ) : (
                    'Simpan Draft'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={form.categoryId}
                  onValueChange={(value) => { if (value) setForm((prev) => ({ ...prev, categoryId: value })); }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Thumbnail */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Thumbnail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {form.thumbnail ? (
                  <div className="relative">
                    <img
                      src={form.thumbnail}
                      alt="Thumbnail"
                      className="w-full rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-7 w-7"
                      onClick={() => setForm((prev) => ({ ...prev, thumbnail: '' }))}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors hover:bg-muted/50">
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {uploading ? 'Mengupload...' : 'Klik untuk upload gambar'}
                    </span>
                    <span className="text-xs text-muted-foreground">JPG, PNG, WebP (max 5MB)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </CardContent>
            </Card>

            {/* Short Video */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Video Singkat (30-60s)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {form.videoUrl ? (
                  <div className="relative">
                    <video
                      src={form.videoUrl}
                      className="w-full rounded-lg"
                      controls
                      autoPlay
                      muted
                      loop
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-7 w-7"
                      onClick={() => setForm((prev) => ({ ...prev, videoUrl: '' }))}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors hover:bg-muted/50">
                    {videoUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {videoUploading ? 'Mengupload...' : 'Klik untuk upload video'}
                    </span>
                    <span className="text-xs text-muted-foreground">MP4, WebM (max 50MB)</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={handleVideoUpload}
                      className="hidden"
                      disabled={videoUploading}
                    />
                  </label>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
