import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  // Prevent scrolling when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[101] rounded-full bg-muted/50 p-2 text-foreground transition-colors hover:bg-muted"
      >
        <X className="h-6 w-6" />
      </button>
      
      <div 
        className="relative max-h-[90vh] max-w-[95vw] overflow-hidden rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={src} 
          alt={alt} 
          className="h-auto w-auto max-h-[90vh] object-contain animate-in zoom-in-95 duration-300"
        />
        {alt && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-12">
            <p className="text-center text-sm text-white/90">{alt}</p>
          </div>
        )}
      </div>
    </div>
  );
}
