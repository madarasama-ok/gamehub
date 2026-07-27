import { Link } from "wouter";
import { Search, BarChart2, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type FilterState = {
  search: string;
  minRating?: number;
  sort?: "newest" | "popular" | "rating" | "alphabetical";
};

export function Header({ 
  onFilterChange, 
  showFilters = false 
}: { 
  onFilterChange?: (filters: FilterState) => void;
  showFilters?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<"newest" | "popular" | "rating" | undefined>(undefined);

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange?.({ search: query, minRating, sort });
    }, 300);
    return () => clearTimeout(handler);
  }, [query, minRating, sort, onFilterChange]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-2xl drop-shadow-md">👑</span>
            <span className="font-extrabold text-xl tracking-tighter text-white group-hover:text-primary transition-colors text-glow">
              LEGENDLEO
            </span>
          </Link>

          {onFilterChange && (
            <div className="flex-1 max-w-md relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar juegos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-10 bg-secondary/50 border border-border/50 rounded-full pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground backdrop-blur-md"
              />
              {showFilters && (
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isFilterOpen || minRating || sort ? 'text-primary glow-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Link href="/stats" className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary/50 border border-border/50 hover:bg-secondary hover:text-primary hover:border-primary/50 transition-all group">
              <BarChart2 className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        {onFilterChange && (
          <div className="mt-3 relative md:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar juegos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 bg-secondary/50 border border-border/50 rounded-full pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground backdrop-blur-md"
            />
            {showFilters && (
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isFilterOpen || minRating || sort ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {showFilters && (
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="py-4 pt-4 border-t border-border/30 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Puntuación Mínima</label>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setMinRating(undefined)} className={`px-3 py-1.5 text-sm rounded-md transition-all ${!minRating ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>Todos</button>
                      <button onClick={() => setMinRating(3)} className={`px-3 py-1.5 text-sm rounded-md transition-all ${minRating === 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>3★+</button>
                      <button onClick={() => setMinRating(4)} className={`px-3 py-1.5 text-sm rounded-md transition-all ${minRating === 4 ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>4★+</button>
                      <button onClick={() => setMinRating(4.5)} className={`px-3 py-1.5 text-sm rounded-md transition-all ${minRating === 4.5 ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>4.5★+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Ordenar por</label>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setSort(undefined)} className={`px-3 py-1.5 text-sm rounded-md transition-all ${!sort ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>Relevante</button>
                      <button onClick={() => setSort("popular")} className={`px-3 py-1.5 text-sm rounded-md transition-all ${sort === "popular" ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>Más descargados</button>
                      <button onClick={() => setSort("rating")} className={`px-3 py-1.5 text-sm rounded-md transition-all ${sort === "rating" ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>Mejor valorados</button>
                      <button onClick={() => setSort("newest")} className={`px-3 py-1.5 text-sm rounded-md transition-all ${sort === "newest" ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>Más recientes</button>
                      <button onClick={() => setSort("alphabetical")} className={`px-3 py-1.5 text-sm rounded-md transition-all ${sort === "alphabetical" ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>A-Z</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </header>
  );
}