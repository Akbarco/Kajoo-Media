import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/brand/Logo';

export default function Footer() {
  const { data: categories } = useCategories();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Description (Kiri) */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="font-serif text-2xl tracking-tight">
              Media Kajoo
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Portal berita digital yang menyajikan informasi terkini seputar teknologi, bisnis,
              olahraga, dan gaya hidup.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Kategori
            </h4>
            <ul className="space-y-2">
              {categories?.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/kategori/${cat.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Navigasi
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Cari Artikel
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  CMS Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Big Decorative Logo (Kanan) */}
          <div className="flex items-center justify-end opacity-[0.07] lg:opacity-[0.15]">
            <Logo className="h-28 w-28 lg:h-36 lg:w-36 grayscale" />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Media Kajoo. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Dibangun dengan ❤️ di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
