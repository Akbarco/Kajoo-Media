import { useBookmarks } from "@/hooks/useBookmarks";
import ArticleCard from "@/components/articles/ArticleCard";
import { Bookmark, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function SavedArticlesPage() {
  const { bookmarks } = useBookmarks();

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-fade-in">
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Bookmark className="h-6 w-6 fill-current" />
            </div>
            <h1 className="text-3xl font-serif">Simpanan Saya</h1>
          </div>
          <p className="text-muted-foreground">Kumpulan artikel menarik yang sudah Anda simpan untuk dibaca nanti.</p>
        </div>
        
        {bookmarks.length > 0 && (
          <p className="text-sm font-medium bg-muted px-4 py-2 rounded-full">
            {bookmarks.length} Artikel tersimpan
          </p>
        )}
      </header>

      {bookmarks.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl bg-muted/20">
          <div className="h-20 w-20 flex items-center justify-center rounded-full bg-muted mb-6">
            <Inbox className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h2 className="text-xl font-medium mb-2">Belum ada artikel tersimpan</h2>
          <p className="text-muted-foreground max-w-sm mb-8">
            Jelajahi portal kami dan temukan berbagai artikel menarik untuk Anda simpan.
          </p>
          <Link to="/artikel">
            <Button className="rounded-full px-8">Mulai Membaca</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
