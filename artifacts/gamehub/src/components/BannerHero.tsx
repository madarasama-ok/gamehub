import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "wouter";
import { Game } from "@workspace/api-client-react/src/generated/api.schemas";
import { Download, ChevronRight } from "lucide-react";
import { StarRating } from "./StarRating";
import { CategoryIcon } from "./CategoryIcon";

export function BannerHero({ games }: { games: Game[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  if (!Array.isArray(games) || games.length === 0) return null;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-border/50 group bg-card mb-12">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {games.map((game) => (
            <div key={game.id} className="relative flex-[0_0_100%] min-w-0">
              <div className="relative aspect-[21/9] md:aspect-[24/9] lg:aspect-[32/9] w-full">
                {/* Background image */}
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="absolute inset-0 w-full h-full object-cover blur-sm opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center p-6 md:p-12 lg:p-16">
                  <div className="flex flex-col md:flex-row gap-8 items-center w-full max-w-6xl mx-auto">
                    {/* Cover image (sharp) */}
                    <Link href={`/game/${game.id}`}>
                      <div className="hidden md:block w-48 lg:w-64 shrink-0 rounded-xl overflow-hidden shadow-2xl shadow-primary/20 border border-primary/30 transform transition-transform group-hover:scale-105 cursor-pointer">
                        <img src={game.imageUrl} alt={game.title} className="w-full aspect-[3/4] object-cover" />
                      </div>
                    </Link>
                    
                    <div className="flex-1 space-y-4">
                      <Link href={`/category/${encodeURIComponent(game.category)}`} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wider uppercase bg-primary/20 text-primary border border-primary/30 backdrop-blur-md rounded-full hover:bg-primary/30 transition-colors">
                        <CategoryIcon name={game.category} className="w-3 h-3" />
                        {game.category}
                      </Link>
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-xl text-glow">
                        {game.title}
                      </h2>
                      <p className="text-muted-foreground line-clamp-2 md:line-clamp-3 max-w-xl text-sm md:text-base">
                        {game.description}
                      </p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <StarRating rating={game.rating} />
                        <span className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                          <Download className="w-4 h-4" /> 
                          {game.downloadCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-4">
                        <Link href={`/game/${game.id}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_20px_-5px_hsl(var(--primary)/0.6)]">
                          Ver Juego <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {games.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              index === selectedIndex ? "bg-primary w-6 md:w-8 glow-primary" : "bg-white/30 hover:bg-white/50"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}