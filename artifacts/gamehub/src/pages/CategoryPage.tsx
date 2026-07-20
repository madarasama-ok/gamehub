import { useState } from "react";
import { motion } from "framer-motion";
import { Header, FilterState } from "@/components/Header";
import { GameCard } from "@/components/GameCard";
import { GameCardSkeleton } from "@/components/GameCardSkeleton";
import { useListGames, getListGamesQueryKey, useListCategories, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage() {
  const params = useParams<{ name: string }>();
  const categoryName = decodeURIComponent(params.name || "");
  const [filters, setFilters] = useState<FilterState>({ search: "" });

  const { data: categories } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() }
  });

  const categoryInfo = categories?.find(c => c.name.toLowerCase() === categoryName.toLowerCase());

  const searchParams = {
    category: categoryName,
    ...filters
  };

  const { data: games, isLoading } = useListGames(
    searchParams,
    { query: { queryKey: getListGamesQueryKey(searchParams) } }
  );

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-20">
      <Header onFilterChange={setFilters} showFilters={true} />
      
      <main className="container mx-auto px-4 mt-8 space-y-8">
        <div className="flex flex-col gap-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          
          <div className="flex items-center gap-4 border-b border-border/50 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 glow-primary">
              <CategoryIcon name={categoryName} className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white capitalize text-glow">
                {categoryName}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <span className="font-bold text-foreground">{categoryInfo?.count || games?.length || 0}</span> juegos disponibles
              </p>
            </div>
          </div>
        </div>

        {/* Categories Pills for quick nav */}
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {categories?.map(cat => (
            <Link
              key={cat.name}
              href={`/category/${encodeURIComponent(cat.name)}`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border group ${
                cat.name.toLowerCase() === categoryName.toLowerCase()
                  ? "bg-primary text-primary-foreground border-primary glow-primary"
                  : "bg-secondary/50 text-secondary-foreground border-border/50 hover:bg-secondary hover:border-primary/50 hover:text-primary"
              }`}
            >
              <CategoryIcon name={cat.name} className={`w-4 h-4 ${cat.name.toLowerCase() === categoryName.toLowerCase() ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"} transition-colors`} />
              {cat.name}
            </Link>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => <GameCardSkeleton key={i} />)
          ) : games?.length ? (
            games.map(game => <GameCard key={game.id} game={game} />)
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-muted-foreground bg-secondary/10 rounded-2xl border border-border/50 dashed">
              <span className="text-4xl mb-4 opacity-50">🎮</span>
              <p className="text-lg">No encontramos juegos en esta categoría con los filtros actuales.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}