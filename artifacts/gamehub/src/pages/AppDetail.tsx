import { useParams, Link } from "wouter";
import { ArrowLeft, Download, Heart, Server, Box, GitMerge, ChevronDown, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useGetApp, getGetAppQueryKey, useTrackAppDownload } from "@workspace/api-client-react";
import { useFavorites } from "@/hooks/use-favorites";
import { StarRating } from "@/components/StarRating";
import { useToast } from "@/hooks/use-toast";

export default function AppDetail() {
  const { id } = useParams();
  const appId = Number(id);

  const { data: app, isLoading, error } = useGetApp(appId, {
    query: { enabled: !!appId, queryKey: getGetAppQueryKey(appId) }
  });

  const trackDownload = useTrackAppDownload();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin glow-primary" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-destructive mb-4 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]">App no encontrada</h1>
        <Link href="/apps" className="text-primary hover:underline hover:text-glow">Volver a Apps</Link>
      </div>
    );
  }

  const isFav = isFavorite(app.id);

  const handleDownload = () => {
    setIsDownloading(true);
    trackDownload.mutate(
      { id: app.id },
      {
        onSettled: () => {
          setIsDownloading(false);
          window.open(app.downloadUrl, "_blank", "noopener,noreferrer");
        }
      }
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: app.title,
          text: `Mirá ${app.title} en NovaHub!`,
          url: window.location.href,
        });
        toast({ title: "¡Compartido!", description: "Gracias por compartir" });
      } catch (err) {
        // cancelado
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "¡Link copiado!", description: "URL copiada al portapapeles" });
      } catch (err) {
        toast({ title: "Error", description: "No se pudo copiar el link", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground relative overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <img
          src={app.imageUrl}
          alt=""
          className="w-full h-full object-cover opacity-20 blur-2xl scale-110 saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/90 to-background" />
      </div>

      <div className="relative z-10">
        <header className="p-4 container mx-auto pt-6">
          <Link href="/apps" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 hover:border-primary/50">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Volver</span>
          </Link>
        </header>

        <main className="container mx-auto px-4 pb-24 pt-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full lg:w-[400px] aspect-[4/5] rounded-3xl overflow-hidden border border-border/30 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] relative group shrink-0"
            >
              <img src={app.imageUrl} alt={app.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="flex-1 w-full"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1.5 text-xs font-black tracking-wider uppercase bg-primary/20 text-primary border border-primary/30 backdrop-blur-md rounded-full shadow-[0_0_15px_-3px_hsl(var(--primary)/0.4)]">
                  {app.category}
                </span>
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-border/30">
                  <StarRating rating={app.rating} />
                  <span className="text-sm font-bold text-white ml-1">{app.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-2 leading-[1.1] text-glow drop-shadow-2xl">
                  {app.title}
                </h1>
                <div className="flex items-center gap-2">
                  <button onClick={handleShare} className="p-4 rounded-full border border-border/30 bg-black/40 text-muted-foreground hover:bg-black/60 hover:text-white transition-all group">
                    <Share2 className="w-7 h-7 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(app.id)}
                    className={`p-4 rounded-full border transition-all ${
                      isFav
                        ? 'bg-destructive/20 border-destructive/50 text-destructive shadow-[0_0_20px_-5px_hsl(var(--destructive)/0.6)]'
                        : 'border-border/30 bg-black/40 text-muted-foreground hover:bg-black/60 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-7 h-7 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <p className="text-muted-foreground text-sm font-semibold mb-6">{app.developer}</p>

              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-8">
                <span className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-md">
                  <Download className="w-4 h-4" />
                  {app.downloadCount.toLocaleString()}
                </span>
              </div>

              <p className="text-lg md:text-xl text-muted-foreground/90 leading-relaxed mb-10 max-w-3xl font-medium">
                {app.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                <div className="bg-black/40 border border-border/30 rounded-2xl p-4 flex flex-col gap-1 hover:bg-black/60 transition-colors">
                  <Server className="w-5 h-5 text-primary mb-1" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Plataforma</span>
                  <span className="font-bold text-white">{app.platform}</span>
                </div>
                <div className="bg-black/40 border border-border/30 rounded-2xl p-4 flex flex-col gap-1 hover:bg-black/60 transition-colors">
                  <Box className="w-5 h-5 text-accent mb-1" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tamaño</span>
                  <span className="font-bold text-white">{app.size}</span>
                </div>
                <div className="bg-black/40 border border-border/30 rounded-2xl p-4 flex flex-col gap-1 hover:bg-black/60 transition-colors">
                  <GitMerge className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Versión</span>
                  <span className="font-bold text-white">{app.version}</span>
                </div>
                <div className="bg-black/40 border border-border/30 rounded-2xl p-4 flex flex-col gap-1 hover:bg-black/60 transition-colors">
                  <Download className="w-5 h-5 text-blue-400 mb-1" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Descargas</span>
                  <span className="font-bold text-white">{app.downloadCount > 999 ? `${(app.downloadCount/1000).toFixed(1)}k` : app.downloadCount}</span>
                </div>
              </div>

              {app.features && app.features.length > 0 && (
                <div className="mb-10 bg-gradient-to-br from-black/60 to-black/30 border border-border/30 rounded-3xl overflow-hidden backdrop-blur-xl">
                  <button
                    onClick={() => setFeaturesOpen(!featuresOpen)}
                    className="w-full p-6 flex items-center justify-between bg-black/20 hover:bg-black/40 transition-colors"
                  >
                    <span className="font-black flex items-center gap-3 text-lg tracking-tight">
                      <span className="text-accent text-xl">✨</span> CARACTERÍSTICAS
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${featuresOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {featuresOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ul className="p-6 space-y-3 bg-black/20">
                          {app.features.map((feature, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-start gap-3 text-base"
                            >
                              <span className="text-primary font-black mt-1 text-lg leading-none">•</span>
                              <span className="text-muted-foreground font-medium">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full lg:w-auto mt-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-black py-5 px-12 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_40px_-5px_hsl(var(--primary)/0.6)] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <Download className={`w-7 h-7 ${isDownloading ? 'animate-bounce' : ''}`} />
                {isDownloading ? 'PREPARANDO...' : '📥 DESCARGAR'}
              </button>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
