import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, Sun, Moon } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/brand/Logo';
import WeatherWidget from "../common/WeatherWidget";

export default function Navbar() {
  const location = useLocation();
  const { data: categories } = useCategories();
  const { theme, setTheme } = useThemeStore();

  const navCategories = categories?.slice(0, 6) || [];
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* ── Top Bar (Informational) ── */}
      <div className="hidden border-b py-1 sm:block bg-background/50">
        <div className="container mx-auto flex max-w-7xl justify-between px-4 sm:px-6 lg:px-8">
          <WeatherWidget />
          <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            <span>Kajoo Media Network</span>
            <span className="h-1 w-1 rounded-full bg-primary/40" />
            <span>Berita Terkini</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <span className="font-serif text-2xl tracking-tight">Media Kajoo</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/kategori/${cat.slug}`}
              className={`rounded-full px-3.5 py-1.5 text-sm transition-colors hover:bg-muted ${
                location.pathname === `/kategori/${cat.slug}`
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-4.5 w-4.5 transition-transform" />
            ) : (
              <Moon className="h-4.5 w-4.5 transition-transform" />
            )}
          </Button>

          {/* Search button */}
          <Link to="/search">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-4.5 w-4.5" />
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                <Link
                  to="/"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Beranda
                </Link>
                {navCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/kategori/${cat.slug}`}
                    className="rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    {cat.name}
                  </Link>
                ))}
                <div className="my-2 border-t" />
                <Link
                  to="/search"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                >
                  <Search className="h-4 w-4" /> Cari Artikel
                </Link>
                <button
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
