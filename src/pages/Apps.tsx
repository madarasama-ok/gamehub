import { useState } from "react";
import { motion } from "framer-motion";
import { Header, FilterState } from "@/components/Header";
import { AppCard } from "@/components/AppCard";
import { GameCardSkeleton } from "@/components/GameCardSkeleton";
import { useListApps, getListAppsQueryKey } from "@workspace/api-client-react";

function toArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.apps)) return obj.apps as T[];
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
  }
  return [];
}

export default function Apps() {
  const [filters, setFilters] = useState<FilterState>({ search: "" });

  const { data: appsRaw, isLoading } = useListApps(
    filters,
    { query: { queryKey: getListAppsQueryKey(filters) } }
  );

  const apps = toArray<any>(appsRaw);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-20">
      <Header onFilterChange={setFilters} showFilters={true} />

      <main className="container mx-auto px-4 mt-8 space-y-8">
        <h1 className="text-3xl font-black text-white text-glow">
          🛠️ Apps
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => <GameCardSkeleton key={i} />)
          ) : apps.length ? (
            apps.map((app) => <AppCard key={app.id} app={app} />)
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-muted-foreground bg-secondary/10 rounded-2xl border border-border/50">
              <span className="text-4xl mb-4 opacity-50">🛠️</span>
              <p className="text-lg">No hay apps disponibles todavía.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
