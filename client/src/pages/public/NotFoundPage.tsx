import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Search } from 'lucide-react';
import SEO from '@/components/common/SEO';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center animate-fade-in">
      <SEO title="Halaman Tidak Ditemukan" />
      
      <div className="relative mb-8">
        <h1 className="font-serif text-[120px] font-bold leading-none text-muted/30 sm:text-[180px]">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
        </div>
      </div>

      <h2 className="mb-3 font-serif text-3xl sm:text-4xl">Ups! Halaman Hilang</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        Maaf, halaman yang kamu cari tidak dapat ditemukan atau sudah dipindahkan ke alamat lain.
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link to="/">
          <Button className="gap-2 px-6">
            <Home className="h-4 w-4" /> Kembali ke Beranda
          </Button>
        </Link>
        <Link to="/search">
          <Button variant="outline" className="gap-2 px-6">
            <Search className="h-4 w-4" /> Cari Artikel
          </Button>
        </Link>
      </div>

      <Link 
        to="/" 
        className="mt-12 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali eksplor Media Kajoo
      </Link>
    </div>
  );
}
