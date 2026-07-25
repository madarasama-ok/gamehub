import { Header } from "@/components/Header";
import { useGetGameStats, getGetGameStatsQueryKey } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Gamepad2, Download, Layers, Star, TrendingUp, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--destructive))', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function StatsPage() {
  const { data: stats, isLoading } = useGetGameStats({
    query: { queryKey: getGetGameStatsQueryKey() }
  });

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-20">
      <Header />
      
      <main className="container mx-auto px-4 mt-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white text-glow mb-2 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" /> Analíticas
            </h1>
            <p className="text-muted-foreground">Estadísticas en tiempo real de NovaHub</p>
          </div>
        </div>

        {isLoading || !stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-card h-32 rounded-2xl border border-border/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total Juegos" 
                value={stats.totalGames} 
                icon={<Gamepad2 className="w-6 h-6 text-primary" />} 
                color="primary"
              />
              <StatCard 
                title="Total Descargas" 
                value={stats.totalDownloads.toLocaleString()} 
                icon={<Download className="w-6 h-6 text-accent" />} 
                color="accent"
              />
              <StatCard 
                title="Categorías" 
                value={stats.totalCategories} 
                icon={<Layers className="w-6 h-6 text-[#10b981]" />} 
                color="[#10b981]"
              />
              <StatCard 
                title="Destacados" 
                value={stats.featuredCount} 
                icon={<Star className="w-6 h-6 text-[#f59e0b]" />} 
                color="[#f59e0b]"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart - Downloads by Category */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-primary" /> Descargas por Categoría
                </h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.categoryBreakdown} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => value > 999 ? `${(value/1000).toFixed(0)}k` : value}
                      />
                      <RechartsTooltip 
                        cursor={{ fill: 'hsl(var(--secondary))' }}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px', color: 'white' }}
                      />
                      <Bar dataKey="totalDownloads" name="Descargas" radius={[6, 6, 0, 0]}>
                        {stats.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart - Games Distribution */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-accent" /> Distribución de Juegos
                </h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="name"
                        stroke="none"
                      >
                        {stats.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px', color: 'white' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Games Leaderboard */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#f59e0b]" /> Top 5 Juegos Más Descargados
              </h2>
              <div className="space-y-4">
                {stats.topGames.map((game, i) => (
                  <div key={game.id} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                      i === 0 ? 'bg-[#f59e0b]/20 text-[#f59e0b] shadow-[0_0_15px_-3px_#f59e0b]' :
                      i === 1 ? 'bg-slate-300/20 text-slate-300' :
                      i === 2 ? 'bg-amber-700/20 text-amber-700' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {i + 1}
                    </div>
                    <img src={game.imageUrl} alt={game.title} className="w-16 h-16 rounded-xl object-cover shadow-md" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate text-foreground">{game.title}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {game.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-foreground">{game.downloadCount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">descargas</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 flex items-center gap-4 shadow-lg group hover:border-primary/30 transition-colors">
      <div className={`w-14 h-14 rounded-2xl bg-secondary/80 flex items-center justify-center group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-foreground drop-shadow-sm">{value}</p>
      </div>
    </div>
  );
}