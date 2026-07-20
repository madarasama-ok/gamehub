import { useState } from "react";
import { motion } from "framer-motion";
import { Header, FilterState } from "@/components/Header";
import { GameCard } from "@/components/GameCard";
import { GameCardSkeleton } from "@/components/GameCardSkeleton";
import { useListGames, getListGamesQueryKey, useListCategories, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { useFavorites } from "@/hooks/use-favorites";
import { BannerHero } from "@/components/BannerHero";
import { Link } from "wouter";
import { CategoryIcon } from "@/components/CategoryIcon";

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({ search: "" });
  const { favorites } = useFavorites();

  const { data: featuredGames, isLoading: isLoadingFeatured } = useListGames(
    { featured: true },
    { query: { queryKey: getListGamesQueryKey({ featured: true }) } }
  );

  const { data: newestGames, isLoading: isLoadingNewest } = useListGames(
    { sort: "newest" },
    { query: { queryKey: getListGamesQueryKey({ sort: "newest" }) } }
  );
  
  const { data: popularGames, isLoading: isLoadingPopular } = useListGames(
    { popular: true },
    { query: { queryKey: getListGamesQueryKey({ popular: true }) } }
  );

  const { data: categories } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() }
  });

  const { data: searchResults, isLoading: isLoadingSearch } = useListGames(
    filters,
    { query: { queryKey: getListGamesQueryKey(filters) } }
  );

  const isSearching = filters.search.length > 0 || filters.minRating || filters.sort;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-20">
      <Header onFilterChange={setFilters} showFilters={true} />
      
      <main className="container mx-auto px-4 mt-8 space-y-12">
        {/* Banner Hero */}
        {!isSearching && featuredGames && featuredGames.length > 0 && (
          <BannerHero games={featuredGames} />
        )}

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {categories?.map(cat => (
            <Link
              key={cat.name}
              href={`/category/${encodeURIComponent(cat.name)}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border bg-secondary/50 text-secondary-foreground border-border/50 hover:bg-secondary hover:border-primary/50 hover:text-primary group"
            >
              <CategoryIcon name={cat.name} className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              {cat.name}
              <span className="bg-background px-2 py-0.5 rounded-full text-xs font-medium text-muted-foreground group-hover:text-primary group-hover:glow-primary border border-border/50">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>

        {isSearching ? (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-primary text-glow">🔍</span> Resultados de búsqueda
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {isLoadingSearch ? (
                Array.from({ length: 10 }).map((_, i) => <GameCardSkeleton key={i} />)
              ) : searchResults?.length ? (
                searchResults.map(game => <GameCard key={game.id} game={game} />)
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-muted-foreground bg-secondary/10 rounded-2xl border border-border/50 dashed">
                  <span className="text-4xl mb-4 opacity-50">🎮</span>
                  <p className="text-lg">No encontramos juegos con esos filtros.</p>
                </div>
              )}
            </div>
          </motion.section>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-12"
          >
            {/* Novedades Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-primary text-glow">🆕</span> Novedades
              </h2>
              <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 snap-x">
                {isLoadingNewest ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-[280px] shrink-0 snap-start">
                      <GameCardSkeleton />
                    </div>
                  ))
                ) : (
                  newestGames?.map(game => (
                    <div key={game.id} className="w-[280px] shrink-0 snap-start relative">
                      <div className="absolute -top-3 -left-3 z-20 bg-accent text-accent-foreground text-xs font-black px-3 py-1 rounded-full shadow-lg transform -rotate-12 border-2 border-background">
                        ¡NUEVO!
                      </div>
                      <GameCard game={game} />
                    </div>
                  ))
                )}
              </div>
            </section>

            {favorites.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-destructive text-glow">❤️</span> Mis Favoritos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {favorites.map(game => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-accent text-glow">🔥</span> Más Populares
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {isLoadingPopular ? (
                  Array.from({ length: 5 }).map((_, i) => <GameCardSkeleton key={i} />)
                ) : (
                  popularGames?.map(game => <GameCard key={game.id} game={game} />)
                )}
              </div>
            </section>
          </motion.div>
        )}
      </main>
    </div>
  );
}