import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ChevronDown, ChevronUp, Bot } from "lucide-react";
import { toast } from "sonner";

interface AISummaryProps {
  articleId: string;
}

export default function AISummary({ articleId }: AISummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSummarize = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/v1/ai/summarize/${articleId}`, {
        method: "POST",
      });
      const result = await res.json();

      if (result.success) {
        setSummary(result.data.summary);
        setIsExpanded(true);
        toast.success("Rangkuman berhasil dibuat!");
      } else {
        toast.error(result.error?.message || "Gagal membuat rangkuman.");
      }
    } catch (error) {
      console.error("AI Summary error:", error);
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!summary && !isLoading) {
    return (
      <div className="my-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center transition-all hover:bg-primary/10">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="mb-2 font-serif text-lg font-bold">
          Terlalu Panjang untuk Dibaca?
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Gunakan kecerdasan buatan untuk merangkum poin-poin penting artikel
          ini dalam hitungan detik.
        </p>
        <Button
          onClick={handleSummarize}
          variant="default"
          className="gap-2 rounded-full shadow-lg shadow-primary/20"
        >
          <Sparkles className="h-4 w-4" /> Ringkas dengan AI
        </Button>
      </div>
    );
  }

  return (
    <div className="my-8 overflow-hidden rounded-2xl border bg-gradient-to-br from-background to-muted/30 shadow-sm transition-all duration-300">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center justify-between border-b bg-muted/20 px-6 py-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 text-primary">
          <Bot className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Ringkasan AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-muted-foreground italic">
            Gemini AI
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="animate-pulse text-sm text-muted-foreground">
                    AI sedang membaca dan menganalisis...
                  </p>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {summary?.split("\n").map((line, i) => (
                    <p
                      key={i}
                      className="mb-2 leading-relaxed text-foreground/90"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {!isLoading && (
              <div className="bg-muted/10 px-6 py-2 text-right border-t">
                <button
                  onClick={handleSummarize}
                  className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center justify-end gap-1 ml-auto"
                >
                  <Sparkles className="h-3 w-3" /> Regenerasi Rangkuman
                </button>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
