import { useState } from "react";
import { motion } from "framer-motion";
import { Header, FilterState } from "@/components/Header";
import { GameCard } from "@/components/GameCard";
import { GameCardSkeleton } from "@/components/GameCardSkeleton";
import {
  useListGames,
  getListGamesQueryKey,
  useListCategories,
  getListCategoriesQueryKey,
} from "@workspace/api-client-react";
import { useFavorites } from "@/hooks/use-favorites";
import { BannerHero } from "@/components/BannerHero";
import { Link } from "wouter";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Categories } from "@/components/Categories";
import { BottomNav } from "@/components/BottomNav";
function toArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.games)) return obj.games as T[];
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.results)) return obj.results as T[];
  }
  return [];
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({ search: "" });
  const { favorites } = useFavorites();

  const { data: featuredGamesRaw, isLoading: isLoadingFeatured } = useListGames(
    { featured: true },
    { query: { queryKey: getListGamesQueryKey({ featured: true }) } }
  );

  const { data: newestGamesRaw, isLoading: isLoadingNewest } = useListGames(
    { sort: "newest" },
    { query: { queryKey: getListGamesQueryKey({ sort: "newest" }) } }
  );

  const { data: popularGamesRaw, isLoading: isLoadingPopular } = useListGames(
    { popular: true },
    { query: { queryKey: getListGamesQueryKey({ popular: true }) } }
  );

  const { data: categoriesRaw } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() },
  });

  const { data: allGamesRaw } = useListGames(
    {},
    { query: { queryKey: getListGamesQueryKey({}) } }
  );

  const { data: searchResultsRaw, isLoading: isLoadingSearch } = useListGames(
    filters,
    { query: { queryKey: getListGamesQueryKey(filters) } }
  );

  const featuredGames = toArray<any>(featuredGamesRaw);
  const newestGames = toArray<any>(newestGamesRaw);
  const popularGames = toArray<any>(popularGamesRaw);
  const categories = toArray<any>(categoriesRaw);
  const allGames = toArray<any>(allGamesRaw);
  const searchResults = toArray<any>(searchResultsRaw);

  const favoriteGames = allGames.filter((g) => favorites.includes(g.id));

  const isSearching =
    filters.search.length > 0 || filters.minRating || filters.sort;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-20">
      <Header onFilterChange={setFilters} showFilters={true} />

      <main className="container mx-auto px-4 mt-8 space-y-12">

        {!isSearching && featuredGames.length > 0 && (
            <>
              <BannerHero games={featuredGames} />
              <Categories />
            </>
        )}

        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/category/${encodeURIComponent(cat.name)}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
            >
              <CategoryIcon name={cat.name} className="w-4 h-4" />
              {cat.name}
              <span>{cat.count}</span>
            </Link>
          ))}
        </div>

        {isSearching ? (
          <section>
            <h2 className="text-2xl font-bold mb-6">
              🔍 Resultados de búsqueda
            </h2>

            <div className="grid gap-6">
              {isLoadingSearch ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <GameCardSkeleton key={i} />
                ))
              ) : searchResults.length ? (
                searchResults.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))
              ) : (
                <p>No encontramos juegos.</p>
              )}
            </div>
          </section>
        ) : (
          <motion.div className="space-y-12">

            <section>
              <h2 className="text-2xl font-bold mb-6">
                🆕 Novedades
              </h2>

              <div className="flex gap-6 overflow-x-auto">
                {isLoadingNewest ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <GameCardSkeleton key={i} />
                  ))
                ) : (
                  newestGames.map((game) => (
                    <div key={game.id} className="w-[280px] shrink-0">
                      <GameCard game={game} />
                    </div>
                  ))
                )}
              </div>
            </section>


            {favoriteGames.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">
                  ❤️ Mis Favoritos
                </h2>

                <div className="grid gap-6">
                  {favoriteGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </section>
            )}


            <section>
              <h2 className="text-2xl font-bold mb-6">
                🔥 Más Populares
              </h2>

              <div className="grid gap-6">
                {isLoadingPopular ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <GameCardSkeleton key={i} />
                  ))
                ) : (
                  popularGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))
                )}
              </div>
            </section>

          </motion.div>
        )}
      </main>

     <BottomNav />
    </div>
  );
}
