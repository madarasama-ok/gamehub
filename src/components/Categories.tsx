import { Link } from "wouter";

const CATEGORIES = [
  { name: "Arcade", emoji: "🎮", gradient: "from-orange-500/30 to-orange-500/5 border-orange-500/40" },
  { name: "Acción", emoji: "⚔️", gradient: "from-red-500/30 to-red-500/5 border-red-500/40" },
  { name: "Carreras", emoji: "🚗", gradient: "from-yellow-500/30 to-yellow-500/5 border-yellow-500/40" },
  { name: "Shooter", emoji: "🔫", gradient: "from-zinc-400/30 to-zinc-400/5 border-zinc-400/40" },
  { name: "Terror", emoji: "👻", gradient: "from-violet-700/30 to-violet-700/5 border-violet-700/40" },
  { name: "RPG", emoji: "✨", gradient: "from-purple-500/30 to-purple-500/5 border-purple-500/40" },
  { name: "Mundo abierto", emoji: "🌎", gradient: "from-emerald-500/30 to-emerald-500/5 border-emerald-500/40" },
  { name: "Deportes", emoji: "🏆", gradient: "from-amber-500/30 to-amber-500/5 border-amber-500/40" },
  { name: "Puzzle", emoji: "🧩", gradient: "from-cyan-500/30 to-cyan-500/5 border-cyan-500/40" },
  { name: "Supervivencia", emoji: "🧟", gradient: "from-lime-600/30 to-lime-600/5 border-lime-600/40" },
  { name: "Anime", emoji: "🧙", gradient: "from-pink-500/30 to-pink-500/5 border-pink-500/40" },
  { name: "Mods Android", emoji: "📱", gradient: "from-sky-500/30 to-sky-500/5 border-sky-500/40" },
];

export function Categories() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar -mx-4 px-4">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.name}
          href={`/category/${encodeURIComponent(cat.name)}`}
          className={`shrink-0 flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-2xl bg-gradient-to-b border ${cat.gradient} hover:scale-105 transition-transform`}
        >
          <span className="text-3xl">{cat.emoji}</span>
          <span className="text-xs font-bold text-center leading-tight px-1">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
